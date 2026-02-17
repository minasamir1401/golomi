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

  const settingMap: Record<string, string> = {};
  if (Array.isArray(settings)) {
    settings.forEach((s: any) => {
      settingMap[s.key] = s.value;
    });
  }

  const siteTitle = (settingMap["site_title"] || "جولد مول | أسعار الذهب والعملات اليوم في مصر").replace("سيرفيس", "مول").replace("لايف", "مول");

  // Expanded keywords from user request
  const defaultKeywords = [
    "جولد مول", "gold mall", "سعر الذهب اليوم", "سعر جرام الذهب", "سعر الذهب عيار 24", "سعر الذهب عيار 21", "سعر الذهب عيار 18",
    "سعر الذهب الآن", "أسعار الذهب مباشر", "بورصة الذهب", "سعر أوقية الذهب", "سعر الذهب عالميًا",
    "سعر الذهب بالدولار", "سعر الذهب بالجنيه المصري", "توقعات أسعار الذهب", "تحليل الذهب اليوم",
    "شراء الذهب", "بيع الذهب", "الاستثمار في الذهب", "سبائك ذهب", "جنيه ذهب", "مصنعية الذهب",
    "أفضل وقت لشراء الذهب", "سعر الذهب في مصر", "سعر الذهب في السعودية", "سعر الذهب في الإمارات",
    "سعر الذهب لحظة بلحثة", "سعر الفضة اليوم", "سعر جرام الفضة", "سعر أوقية الفضة", "سعر الفضة مباشر",
    "أسعار الفضة الآن", "بورصة الفضة", "الاستثمار في الفضة", "شراء فضة", "بيع فضة", "سبائك فضة",
    "توقعات أسعار الفضة", "تحليل الفضة", "سعر الفضة بالدولار", "سعر الفضة بالجنيه", "سعر الفضة في مصر",
    "سعر الفضة عالميًا", "فضة 925", "سعر كيلو الفضة", "الفضة مقابل الذهب", "حركة الفضة اليوم",
    "سعر الدولار اليوم", "سعر اليورو اليوم", "سعر الريال السعودي", "سعر الدرهم الإماراتي",
    "أسعار العملات اليوم", "أسعار العملات مقابل الجنيه", "سعر الدولار في البنوك", "سعر الدولار في السوق السوداء",
    "تحويل عملات", "سعر الصرف اليوم", "سعر الجنيه المصري", "أسعار العملات مباشر", "سعر الدولار لحظة بلحظة",
    "أسعار العملات الأجنبية", "سعر الدولار الآن", "سعر الدولار في مصر", "سعر اليورو في مصر",
    "أسعار العملات العالمية", "سعر صرف الدولار", "توقعات الدولار"
  ];

  const siteDescription = settingMap["site_description"] || "اخر تحديثات وأسعار الذهب والعملات في مصر والعالم. منصة جولد مول تقدم لك بث مباشر لأسعار عيار 21، 24، 18، وأسعار السبائك والدولار في السوق الموازي والبنك. تحليل السوق اليومي وتوقعات الأسعار.";
  const siteKeywords = settingMap["site_keywords"] || defaultKeywords.join(", ");

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://goldservice-egypt.com"),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle.split('|')[0].trim()}`
    },
    description: siteDescription,
    keywords: siteKeywords.split(',').map(k => k.trim()),
    authors: [{ name: "جولد مول" }],
    creator: "Gold Mall Team",
    publisher: "Gold Mall",
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
      siteName: "جولد مول",
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
      google: "google2af4c13cbba55876",
    },
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
  };
}

import { LanguageProvider } from "@/components/language-provider";
import { MarketDataProvider } from "@/components/market-data-provider";
import AdBanner from "@/components/ads/ad-banner";

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
              <div className="flex flex-col min-h-screen pt-14 min-[320px]:pt-16 uppercase">
                <div className="w-full flex justify-center py-2 bg-slate-50 dark:bg-[#0B1121] no-print">
                  <AdBanner type="horizontal" />
                </div>

                <div className="flex flex-1 relative w-full max-w-[100vw] overflow-x-hidden">
                  {/* Left Sidebar Ad */}
                  <aside className="hidden xl:flex flex-col sticky top-20 h-fit ml-4 shrink-0 no-print space-y-4">
                    <AdBanner type="sidebar" />
                    <AdBanner type="sidebar" />
                    <AdBanner type="sidebar" />
                    <AdBanner type="sidebar" />
                    <AdBanner type="sidebar" />
                  </aside>

                  <div className="flex-1 min-w-0 max-w-full lg:max-w-7xl mx-auto">
                    {children}
                  </div>

                  {/* Right Sidebar Ad */}
                  <aside className="hidden xl:flex flex-col sticky top-20 h-fit mr-4 shrink-0 no-print space-y-4">
                    <AdBanner type="sidebar" />
                    <AdBanner type="sidebar" />
                    <AdBanner type="sidebar" />
                    <AdBanner type="sidebar" />
                    <AdBanner type="sidebar" />
                  </aside>
                </div>

                <div className="w-full flex flex-col items-center gap-6 py-12 bg-slate-50 dark:bg-[#0B1121] border-t border-slate-200 dark:border-white/5 no-print">
                  <AdBanner type="horizontal" />
                  <AdBanner type="horizontal" />
                </div>
              </div>
            </MarketDataProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
