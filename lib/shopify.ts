import "server-only";

// Thin Shopify Storefront API client. Every call returns null when no token is configured,
// and callers fall back to the demo catalogue in lib/catalog.ts.

const env = (key: string) => process.env[key]?.trim() || undefined;

export const shopifyConfigured = () =>
  Boolean(env("SHOPIFY_STORE_DOMAIN") && env("SHOPIFY_STOREFRONT_ACCESS_TOKEN"));

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const domain = env("SHOPIFY_STORE_DOMAIN");
  const token = env("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  if (!domain || !token) return null;
  const version = env("SHOPIFY_API_VERSION") ?? "2026-07";
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify Storefront API ${res.status}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data ?? null;
}

export type Money = { amount: string; currencyCode: string };

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
};

export type ShopifyProduct = {
  handle: string;
  variants: { nodes: ShopifyVariant[] };
  film: { reference: { sources: { url: string; mimeType: string }[] } | null } | null;
};

export async function getShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefront<{ product: ShopifyProduct | null }>(
    `query Product($handle: String!) {
      product(handle: $handle) {
        handle
        variants(first: 20) { nodes { id title availableForSale price { amount currencyCode } } }
        film: metafield(namespace: "merowen", key: "film") {
          reference { ... on Video { sources { url mimeType } } }
        }
      }
    }`,
    { handle },
  );
  return data?.product ?? null;
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  discountCodes { code applicable }
  discountAllocations { discountedAmount { amount } }
  lines(first: 50) {
    nodes {
      id
      quantity
      cost { totalAmount { amount currencyCode } }
      discountAllocations { discountedAmount { amount } }
      merchandise {
        ... on ProductVariant {
          id
          title
          image { url }
          product { handle title }
        }
      }
    }
  }
`;

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  discountCodes: { code: string; applicable: boolean }[];
  discountAllocations: { discountedAmount: { amount: string } }[];
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Money };
      discountAllocations: { discountedAmount: { amount: string } }[];
      merchandise: {
        id: string;
        title: string;
        image: { url: string } | null;
        product: { handle: string; title: string };
      };
    }[];
  };
};

type CartPayload = { cart: ShopifyCart | null; userErrors: { message: string }[] };

function unwrap(payload: CartPayload | undefined): ShopifyCart {
  if (!payload) throw new Error("Shopify returned no cart");
  if (payload.userErrors?.length) throw new Error(payload.userErrors.map((e) => e.message).join("; "));
  if (!payload.cart) throw new Error("Shopify returned no cart");
  return payload.cart;
}

export async function fetchCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await storefront<{ cart: ShopifyCart | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id: cartId },
  );
  return data?.cart ?? null;
}

export async function createCart(variantId: string, quantity: number) {
  const data = await storefront<{ cartCreate: CartPayload }>(
    `mutation Create($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { lines: [{ merchandiseId: variantId, quantity }] },
  );
  return unwrap(data?.cartCreate);
}

export async function addCartLine(cartId: string, variantId: string, quantity: number) {
  const data = await storefront<{ cartLinesAdd: CartPayload }>(
    `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  );
  return unwrap(data?.cartLinesAdd);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  if (quantity <= 0) {
    const data = await storefront<{ cartLinesRemove: CartPayload }>(
      `mutation Remove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } }
      }`,
      { cartId, lineIds: [lineId] },
    );
    return unwrap(data?.cartLinesRemove);
  }
  const data = await storefront<{ cartLinesUpdate: CartPayload }>(
    `mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  return unwrap(data?.cartLinesUpdate);
}

export async function updateDiscountCodes(cartId: string, codes: string[]) {
  const data = await storefront<{ cartDiscountCodesUpdate: CartPayload }>(
    `mutation Codes($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, discountCodes: codes },
  );
  return unwrap(data?.cartDiscountCodesUpdate);
}
