import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import { Background } from "@/components/ui/Background";
import { site } from "@/content/es/site";
import { heroInitScript } from "@/lib/hero";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s · ${site.title}`,
  },
  description: site.description,
  applicationName: site.title,
  openGraph: { type: "website", siteName: site.title, locale: "es_CL" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de <head> agrega data-hero-played antes de hidratar.
    <html
      lang={site.lang}
      suppressHydrationWarning
      className={`${oswald.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Antes del primer pintado: decide si el hero se muestra directo en su estado final. */}
        <script dangerouslySetInnerHTML={{ __html: heroInitScript }} />
        <noscript>
          <style>
            {"[data-hero-part],[data-reveal]{visibility:visible!important;opacity:1!important;transform:none!important}[data-hero-name]{color:var(--fg)!important}"}
          </style>
        </noscript>
      </head>
      <body className="relative flex min-h-full flex-col">
        <Background />
        {children}
      </body>
    </html>
  );
}
