// Creates the Merowen content model in Shopify (idempotent: "already taken" errors are skipped).
//   SHOPIFY_STORE_DOMAIN=xxx.myshopify.com SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/setup-shopify.mjs [--dossier-codes=500]
// Scopes: write_products, write_metaobject_definitions, write_metaobjects, write_discounts.
// Verify mutation input shapes against the Admin API docs for your API version before first run.

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || "2026-07";
if (!domain || !token) {
  console.error("Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN.");
  process.exit(1);
}
const codesArg = process.argv.find((a) => a.startsWith("--dossier-codes="));
const dossierCodes = codesArg ? Number(codesArg.split("=")[1]) : 0;

async function admin(query, variables = {}) {
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const report = (label, errs) => {
  const real = (errs || []).filter((e) => !/taken|already exists/i.test(e.message));
  console.log(real.length ? `✗ ${label}: ${real.map((e) => e.message).join("; ")}` : `✓ ${label}`);
};

const text = "single_line_text_field";
const video = { type: "file_reference", validations: [{ name: "file_type_options", value: '["Video"]' }] };
const image = { type: "file_reference", validations: [{ name: "file_type_options", value: '["Image"]' }] };

const productFields = [
  ["posting_number", "Posting number", { type: text }],
  ["coordinates", "Coordinates", { type: text }],
  ["hour", "Hour", { type: text }],
  ["hero_material", "Hero material", { type: text }],
  ["line", "Line", { type: text }],
  ["family", "Family", { type: text }],
  ["notes_top", "Top notes", { type: text }],
  ["notes_heart", "Heart notes", { type: text }],
  ["notes_base", "Base notes", { type: text }],
  ["liquid_color", "Liquid colour", { type: "color" }],
  ["perfumer", "Perfumer", { type: text }],
  ["source", "Source (material, place, process)", { type: text }],
  ["producer", "Producer / co-operative", { type: text }],
  ["composed_in", "Composed in", { type: text }],
  ["bottled_in", "Bottled in", { type: text }],
  ["batch", "Batch", { type: text }],
  ["film", "Film (4:5 loop)", video],
  ["film_poster", "Film poster", image],
];

for (const [key, name, t] of productFields) {
  const data = await admin(
    `mutation($d: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $d) { userErrors { message } } }`,
    { d: { namespace: "merowen", key, name, ownerType: "PRODUCT", type: t.type, validations: t.validations, access: { storefront: "PUBLIC_READ" } } },
  );
  report(`metafield merowen.${key}`, data.metafieldDefinitionCreate.userErrors);
}

const home = await admin(
  `mutation($d: MetaobjectDefinitionCreateInput!) { metaobjectDefinitionCreate(definition: $d) { userErrors { message } } }`,
  {
    d: {
      type: "home_page",
      name: "Home page",
      access: { storefront: "PUBLIC_READ" },
      fieldDefinitions: [
        { key: "hero_film_desktop", name: "Hero film, desktop (16:9)", ...video },
        { key: "hero_film_mobile", name: "Hero film, mobile (9:16)", ...video },
        { key: "hero_poster", name: "Hero poster", ...image },
        { key: "hero_audio", name: "Hero soundtrack (MP3)", type: "file_reference" },
        { key: "hero_caption", name: "Hero caption", type: text },
      ],
    },
  },
);
report("metaobject home_page", home.metaobjectDefinitionCreate.userErrors);

const entry = await admin(
  `mutation { metaobjectCreate(metaobject: { type: "home_page", handle: "home", fields: [{ key: "hero_caption", value: "A Merowen Film · Chapter I" }] }) { userErrors { message } } }`,
);
report("home_page entry 'home'", entry.metaobjectCreate.userErrors);

if (dossierCodes > 0) {
  const col = await admin(`query { collectionByHandle(handle: "postings") { id } }`);
  const collectionId = col.collectionByHandle?.id;
  if (!collectionId) {
    console.log("✗ Dossier credit: create the 'postings' collection first.");
  } else {
    const gen = () => "DSR-" + Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
    const created = await admin(
      `mutation($d: DiscountCodeBasicInput!) { discountCodeBasicCreate(basicCodeDiscount: $d) { codeDiscountNode { id } userErrors { message } } }`,
      {
        d: {
          title: "Dossier credit",
          code: gen(),
          startsAt: new Date().toISOString(),
          context: { all: "ALL" },
          customerGets: { value: { discountAmount: { amount: 38, appliesOnEachItem: false } }, items: { collections: { add: [collectionId] } } },
          appliesOncePerCustomer: true,
          usageLimit: 1,
        },
      },
    );
    report("discount 'Dossier credit'", created.discountCodeBasicCreate.userErrors);
    const id = created.discountCodeBasicCreate.codeDiscountNode?.id;
    if (id) {
      const codes = Array.from({ length: dossierCodes - 1 }, () => ({ code: gen() }));
      for (let i = 0; i < codes.length; i += 250) {
        const r = await admin(
          `mutation($id: ID!, $codes: [DiscountRedeemCodeInput!]!) { discountRedeemCodeBulkAdd(discountId: $id, codes: $codes) { userErrors { message } } }`,
          { id, codes: codes.slice(i, i + 250) },
        );
        report(`dossier codes ${i + 1}–${Math.min(i + 250, codes.length)}`, r.discountRedeemCodeBulkAdd.userErrors);
      }
      console.log("Export the codes from Shopify admin → Discounts → Dossier credit for card printing.");
    }
  }
}
