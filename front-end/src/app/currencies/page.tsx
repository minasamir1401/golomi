import { Metadata } from "next";
import CurrenciesClient from "./currencies-client";
import { getCurrencyPrices } from "@/lib/api";

export const metadata: Metadata = {
    title: "أسعار العملات اليوم في مصر | تحديث لحظي | جولد سيرفيس",
    description: "تابع أسعار صرف العملات العربية والأجنبية في مصر لحظة بلحظة. أسعار الدولار، اليورو، الريال السعودي والدرهم الإماراتي تحديث مباشر من البنوك.",
    alternates: {
        canonical: "/currencies",
    }
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CurrenciesPage() {
    return <CurrenciesClient />;
}
