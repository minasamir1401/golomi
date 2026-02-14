import { Metadata } from "next";
import CalculatorClient from "./calculator-client";

export const metadata: Metadata = {
    title: "حاسبة الذهب والمصنعية | احسب قيمة ذهبك بدقة",
    description: "أفضل حاسبة لسعر الذهب في مصر. احسب سعر الذهب عيار 21، 18 بالمصنعية والضريبة بناءً على أسعار السوق اللحظية. استخرج عرض سعر PDF مجاناً.",
    keywords: ["حاسبة الذهب", "حساب المصنعية", "سعر الذهب عيار 21 بالمصنعية", "حساب الضرائب على الذهب"],
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "حاسبة جولد سيرفيس الذكية",
        "description": "أداة ذكية لحساب قيمة الذهب والسبائك بالمصنعية والضريبة",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CalculatorClient />
        </>
    );
}
