import { Metadata } from "next";
import CurrenciesClient from "./currencies-client";
import { getCurrencyPrices } from "@/lib/api";

export const metadata: Metadata = {
    title: "سعر الدولار اليوم في مصر | أسعار العملات الآن مباشر",
    description: "تابع سعر الدولار اليوم، سعر اليورو، الريال السعودي، والدرهم الإماراتي في مصر. أسعار العملات مقابل الجنيه في البنوك والسوق السوداء لحظة بلحظة وتوقعات سعر الصرف.",
    keywords: "جولد مول, سعر الدولار اليوم, سعر اليورو اليوم, سعر الريال السعودي, سعر الدرهم الإماراتي, أسعار العملات اليوم, أسعار العملات مقابل الجنيه, سعر الدولار في البنوك, سعر الدولار في السوق السوداء, تحويل عملات, سعر الصرف اليوم, أسعار العملات مباشر, سعر الدولار لحظة بلحظة, توقعات الدولار",
    alternates: {
        canonical: "/currencies",
    }
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CurrenciesPage() {
    return <CurrenciesClient />;
}
