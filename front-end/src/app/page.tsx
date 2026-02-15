import { Metadata } from "next";
import HomeClient from "./home-client";
import { getFullMarketSnapshot } from "@/lib/api";
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function generateMetadata(): Promise<Metadata> {
    const data = await getFullMarketSnapshot();
    const price21 = data?.gold_egypt?.prices?.["21"]?.sell || data?.gold_egypt?.prices?.["عيار 21"]?.sell || "---";
    const date = new Date().toLocaleDateString("ar-EG", { month: 'long', day: 'numeric', year: 'numeric' });

    return {
        title: `سعر الذهب اليوم في مصر | عيار 21 يسجل ${price21} ج.م - تحديث ${date}`,
        description: `تابع سعر الذهب عيار 21 اليوم في مصر لحظة بلحظة. السعر الحالي ${price21} ج.م. تغطية شاملة لأسعار الذهب، الفضة، والعملات في السوق المصري والسوداء.`,
        alternates: {
            canonical: "/",
        },
        openGraph: {
            title: `سعر الذهب مباشر | عيار 21: ${price21} ج.م`,
            description: `تحديث لحظي لأسعار الذهب والعملات في مصر بتاريخ ${date}.`,
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
            "name": "جولد سيرفيس"
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
