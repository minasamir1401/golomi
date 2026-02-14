import SilverClient from "./silver-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "أسعار الفضة اليوم في مصر | Silver Prices Egypt",
    description: "تابع أسعار الفضة لحظة بلحظة في مصر - سعر الجرام، الأونصة، عيار 999 و 925. تحديثات مباشرة كل 3 دقائق.",
    keywords: "أسعار الفضة, سعر الفضة اليوم, silver price egypt, فضة 925, فضة 999, سعر جرام الفضة",
    openGraph: {
        title: "أسعار الفضة اليوم في مصر",
        description: "تحديثات مباشرة لأسعار الفضة - جرام، أونصة، عيار 999 و 925",
        type: "website",
    },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SilverPage() {
    return <SilverClient />;
}
