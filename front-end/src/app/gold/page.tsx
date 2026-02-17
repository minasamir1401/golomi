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
        title: `سعر الذهب الآن مباشر | عيار 21 يسجل ${price21} ج.م - بورصة الذهب`,
        description: `بث مباشر لأسعار الذهب في مصر اليوم. سعر الذهب عيار 21، عيار 24، عيار 18، وسعر جنيه الذهب والسبائك بالمصنعية. تغطية شاملة لسعر الذهب في محلات الصاغة لحظة بلحظة.`,
        keywords: "جولد مول, سعر الذهب اليوم, سعر جرام الذهب, سعر الذهب عيار 24, سعر الذهب عيار 21, سعر الذهب عيار 18, سعر الذهب الآن, أسعار الذهب مباشر, بورصة الذهب, سعر أوقية الذهب, سعر الذهب بالجنيه المصري, سبائك ذهب, جنيه ذهب, مصنعية الذهب, سعر الذهب في محلات الصاغة",
        alternates: {
            canonical: "/gold",
        },
        openGraph: {
            title: `سعر الذهب مباشر | عيار 21: ${price21} ج.م | تحديث ${date}`,
            description: `تحديث مباشر لأسعار الذهب والسبائك في مصر بتاريخ ${date}. بورصة الذهب ومحلات الصاغة.`,
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
