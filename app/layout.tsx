import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-300.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-300-italic.css";
import "@fontsource/hanken-grotesk/latin-300.css";
import "@fontsource/hanken-grotesk/latin-400.css";
import "@fontsource/hanken-grotesk/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
import { BagProvider } from "@/components/BagContext";
import { BagDrawer } from "@/components/BagDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getBag } from "@/lib/bag";
import { DOSSIER, money } from "@/lib/catalog";
import { getOffer } from "@/lib/offers";
import { SITE_VERSION, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const description =
  "Four Eaux de Parfum from Merowen, composed in Park City, Utah. Two mountains, two streets: one place, one hour, one material each.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Merowen · Composed in the mountains. Worn in the city.", template: "%s · Merowen" },
  description,
  openGraph: { siteName: "Merowen", type: "website", description, images: ["/media/merowen_brand_hero_v08.jpg"] },
  other: { "merowen-site-version": SITE_VERSION },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [bag, dossier] = await Promise.all([getBag(), getOffer(DOSSIER.handle)]);
  const dossierOption = dossier?.options[0];
  return (
    <html lang="en" data-site-version={SITE_VERSION}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <BagProvider bag={bag}>
          <Header />
          <div id="main">{children}</div>
          <Footer version={SITE_VERSION} />
          <BagDrawer
            dossierVariantId={dossierOption?.available ? dossierOption.variantId : null}
            dossierPrice={money(dossierOption?.price ?? DOSSIER.price)}
          />
        </BagProvider>
      </body>
    </html>
  );
}
