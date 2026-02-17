import { Metadata } from "next";
import GoldCountryClient from "./gold-country-client";
import { getCountryPrices } from "@/lib/api";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


const countryData: Record<string, { name: string; flag: string; currency: string; symbol: string }> = {
    "egypt": { name: "مصر", flag: "🇪🇬", currency: "EGP", symbol: "ج.م" },
    "saudi-arabia": { name: "السعودية", flag: "🇸🇦", currency: "SAR", symbol: "ر.س" },
    "united-arab-emirates": { name: "الإمارات", flag: "🇦🇪", currency: "AED", symbol: "د.إ" },
    "kuwait": { name: "الكويت", flag: "🇰🇼", currency: "KWD", symbol: "د.ك" },
    "qatar": { name: "قطر", flag: "🇶🇦", currency: "QAR", symbol: "ر.ق" },
    "bahrain": { name: "البحرين", flag: "🇧🇭", currency: "BHD", symbol: "د.ب" },
    "oman": { name: "عمان", flag: "🇴🇲", currency: "OMR", symbol: "ر.ع" },
    "jordan": { name: "الأردن", flag: "🇯🇴", currency: "JOD", symbol: "د.أ" },
    "lebanon": { name: "لبنان", flag: "🇱🇧", currency: "LBP", symbol: "ل.ل" },
    "iraq": { name: "العراق", flag: "🇮🇶", currency: "IQD", symbol: "د.ع" },
    "yemen": { name: "اليمن", flag: "🇾🇪", currency: "YER", symbol: "ر.ي" },
    "palestine": { name: "فلسطين", flag: "🇵🇸", currency: "ILS", symbol: "₪" },
    "algeria": { name: "الجزائر", flag: "🇩🇿", currency: "DZD", symbol: "د.ج" },
    "morocco": { name: "المغرب", flag: "🇲🇦", currency: "MAD", symbol: "د.م" },
};

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
    const { country: countrySlug } = await params;
    const country = countryData[countrySlug];
    if (!country) return { title: "دولة غير موجودة" };

    const pricesData = await getCountryPrices(countrySlug);
    const price21 = pricesData?.current_prices?.["عيار 21"]?.sell || pricesData?.current_prices?.["21K"]?.sell || "---";

    return {
        title: `سعر الذهب اليوم في ${country.name} | عيار 21 يسجل ${price21} ${country.symbol}`,
        description: `تابع أسعار الذهب في ${country.name} اليوم لحظة بلحظة. تعرف على سعر جرام الذهب عيار 21، 24، 18 وأسعار السبائك في ${country.name} تحديث مباشر.`,
        alternates: {
            canonical: `/countries/${countrySlug}`,
        }
    };
}

export async function generateStaticParams() {
    return Object.keys(countryData).map((country) => ({
        country: country,
    }));
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
    const { country: countrySlug } = await params;
    const initialData = await getCountryPrices(countrySlug);

    const country = countryData[countrySlug];
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": `سعر الذهب في ${country?.name}`,
        "description": `أسعار الذهب اللحظية في ${country?.name} تحديث مباشر`,
        "offers": {
            "@type": "Offer",
            "price": initialData?.current_prices?.["عيار 21"]?.sell || initialData?.current_prices?.["21K"]?.sell || "0",
            "priceCurrency": country?.currency
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GoldCountryClient initialPrices={initialData} />
        </>
    );
}
