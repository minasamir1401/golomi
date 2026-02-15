import { Metadata } from "next";
import GoldClient from "./gold-client";
import { getGoldPrices } from "@/lib/api";
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function generateMetadata(): Promise<Metadata> {
    const data = await getGoldPrices();
    const price21 = data?.prices?.["عيار 21"]?.sell || "---";
    const date = new Date().toLocaleDateString("ar-EG", { month: 'long', day: 'numeric', year: 'numeric' });

    return {
        title: `أسعار الذهب مباشر | عيار 21 يسجل ${price21} ج.م - تحديث لحظي`,
        description: `بث مباشر لأسعار الذهب في مصر. عيار 21 اليوم ${price21} ج.م. تابع تغيرات السوق والأسعار لحظة بلحظة مع جولد سيرفيس.`,
        alternates: {
            canonical: "/gold",
        },
        openGraph: {
            title: `سعر الذهب الآن | عيار 21: ${price21} ج.م`,
            description: `تحديث مباشر لأسعار الذهب والسبائك في مصر بتاريخ ${date}.`,
        }
    };
}

export default async function GoldPage() {
    const initialPrices = await getGoldPrices();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "أسعار الذهب مباشر",
        "description": "تغطية شاملة لأسعار الذهب والسبائك في مصر",
        "offers": {
            "@type": "Offer",
            "price": initialPrices?.["عيار 21"]?.sell || "0",
            "priceCurrency": "EGP"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GoldClient initialData={initialPrices} />
        </>
    );
}
