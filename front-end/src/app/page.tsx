import { Metadata } from "next";
import HomeClient from "./home-client";
import { getFullMarketSnapshot } from "@/lib/api";
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function generateMetadata(): Promise<Metadata> {
    const data = await getFullMarketSnapshot();
    const price21 = data?.gold_egypt?.prices?.["21"]?.sell || data?.gold_egypt?.prices?.["عيار 21"]?.sell || "---";
    const dollarPrice = data?.currencies?.rates?.["USD"]?.sell || "---";
    const date = new Date().toLocaleDateString("ar-EG", { month: 'long', day: 'numeric', year: 'numeric' });

    return {
        title: `سعر الذهب اليوم في مصر | عيار 21 يسجل ${price21} ج.م - أسعار العملات والدولار ${date}`,
        description: `تحديث لحظي لأسعار الذهب الآن: عيار 21 سجل ${price21} ج.م. تابع سعر جرام الذهب، سعر الدولار اليوم في البنوك والسوق السوداء، أسعار الفضة، وتوقعات وتحليل الذهب اليوم في مصر والسعودية والإمارات.`,
        keywords: [
            "سعر الذهب اليوم", "سعر جرام الذهب", "سعر الذهب عيار 21", "سعر الذهب الآن", "أسعار الذهب مباشر",
            "بورصة الذهب", "سعر الدولار اليوم", "سعر الدولار في السوق السوداء", "سعر الذهب في مصر", "توقعات أسعار الذهب"
        ],
        alternates: {
            canonical: "/",
        },
        openGraph: {
            title: `سعر الذهب مباشر | عيار 21: ${price21} ج.م | سعر الدولار: ${dollarPrice} ج.م`,
            description: `تحديث لحظي لأسعار الذهب والعملات في مصر بتاريخ ${date}. بورصة الذهب وشراء وبيع السبائك والعملات.`,
        }
    };
}

export default async function HomePage() {
    const snapshot = await getFullMarketSnapshot();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "سعر الذهب في مصر",
        "description": "أسعار الذهب اللحظية لعيار 21، 24، 18 والسبائك",
        "brand": {
            "@type": "Brand",
            "name": "جولد مول"
        },
        "offers": {
            "@type": "Offer",
            "price": snapshot?.gold_egypt?.prices?.["21"]?.sell || snapshot?.gold_egypt?.prices?.["عيار 21"]?.sell || "0",
            "priceCurrency": "EGP"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeClient initialSnapshot={snapshot} />
        </>
    );
}
