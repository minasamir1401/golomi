import SilverClient from "./silver-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "سعر الفضة اليوم في مصر | أسعار الفضة الآن مباشر",
    description: "تابع سعر جرام الفضة اليوم، سعر أوقية الفضة، وأسعار الفضة الآن في مصر. تغطية شاملة لبورصة الفضة، سبائك فضة، وتوقعات أسعار الفضة لحظة بلحظة.",
    keywords: "سعر الفضة اليوم, سعر جرام الفضة, سعر أوقية الفضة, سعر الفضة مباشر, أسعار الفضة الآن, بورصة الفضة, الاستثمار في الفضة, شراء فضة, بيع فضة, سبائك فضة, توقعات أسعار الفضة, تحليل الفضة, سعر الفضة بالدولار, سعر الفضة في مصر, فضة 925, سعر كيلو الفضة",
    openGraph: {
        title: "أسعار الفضة اليوم في مصر | سعر جرام الفضة مباشر",
        description: "تحديثات مباشرة لأسعار الفضة - جرام، أونصة، سبائك، عيار 999 و 925 في السوق المصري.",
        type: "website",
    },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SilverPage() {
    return <SilverClient />;
}
