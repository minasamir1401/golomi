import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getAdminSettings } from "@/lib/api";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffd700",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings().catch(() => null);

  // Transform settings array to object if needed, or use defaults
  // Assuming settings is array of { key, value }
  const settingMap: Record<string, string> = {};
  if (Array.isArray(settings)) {
    settings.forEach((s: any) => {
      settingMap[s.key] = s.value;
    });
  }

  const siteTitle = settingMap["site_title"] || "جولد سيرفيس | أسعار الذهب والعملات اليوم في مصر";
  const siteDescription = settingMap["site_description"] || "اخر تحديثات وأسعار الذهب والعملات في مصر والعالم. بث مباشر لأسعار عيار 21، 24، 18، وأسعار السبائك والدولار في السوق الموازي والبنك.";
  const siteKeywords = settingMap["site_keywords"] || "سعر الذهب اليوم, سعر الذهب عيار 21, سعر الذهب في مصر, سعر الفضة, سعر الدولار اليوم, حاسبة الذهب, السوق السوداء";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://goldservice-egypt.com"),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle.split('|')[0].trim()}`
    },
    description: siteDescription,
    keywords: siteKeywords.split(',').map(k => k.trim()),
    authors: [{ name: "جولد سيرفيس" }],
    creator: "Gold Service Team",
    publisher: "Gold Service",
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: "https://goldservice-egypt.com",
      siteName: "جولد سيرفيس",
      locale: "ar_EG",
      type: "website",
      images: [
        {
          url: "https://goldservice-egypt.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: siteTitle,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: ["https://goldservice-egypt.com/twitter-image.jpg"],
    },
    verification: {
      google: "google-site-verification-id", // Should be moved to env or settings
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

import { LanguageProvider } from "@/components/language-provider";
import { MarketDataProvider } from "@/components/market-data-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className="overflow-x-hidden" lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-cairo antialiased bg-background text-foreground transition-colors duration-300 overflow-x-hidden max-w-[100vw]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <MarketDataProvider>
              {children}
            </MarketDataProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
