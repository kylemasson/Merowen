import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/hanken-grotesk/300.css";
import "@fontsource/hanken-grotesk/400.css";
import "@fontsource/hanken-grotesk/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { readCart } from "@/lib/cart";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://merowen.com"),
  title: {
    default: "Merowen — Composed in the wild. Worn in the dark.",
    template: "%s — Merowen",
  },
  description:
    "Four Eaux de Parfum from Park City, Utah. Each names one place, one hour and one material, and can be traced to them.",
  openGraph: {
    type: "website",
    siteName: "Merowen",
    images: ["/media/merowen_brand_hero_v05.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cart = await readCart();
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header cart={cart} />
        <main id="main">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
