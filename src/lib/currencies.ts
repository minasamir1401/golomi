// Currency metadata with Arabic names and countries
export const CURRENCY_METADATA: Record<string, { nameAr: string; nameEn: string; country: string; flag: string }> = {
    "USD": { nameAr: "الدولار الأمريكي", nameEn: "US Dollar", country: "الولايات المتحدة", flag: "🇺🇸" },
    "EUR": { nameAr: "اليورو", nameEn: "Euro", country: "الاتحاد الأوروبي", flag: "🇪🇺" },
    "GBP": { nameAr: "الجنيه الإسترليني", nameEn: "British Pound", country: "المملكة المتحدة", flag: "🇬🇧" },
    "SAR": { nameAr: "الريال السعودي", nameEn: "Saudi Riyal", country: "السعودية", flag: "🇸🇦" },
    "AED": { nameAr: "الدرهم الإماراتي", nameEn: "UAE Dirham", country: "الإمارات", flag: "🇦🇪" },
    "KWD": { nameAr: "الدينار الكويتي", nameEn: "Kuwaiti Dinar", country: "الكويت", flag: "🇰🇼" },
    "QAR": { nameAr: "الريال القطري", nameEn: "Qatari Riyal", country: "قطر", flag: "🇶🇦" },
    "BHD": { nameAr: "الدينار البحريني", nameEn: "Bahraini Dinar", country: "البحرين", flag: "🇧🇭" },
    "OMR": { nameAr: "الريال العماني", nameEn: "Omani Rial", country: "عمان", flag: "🇴🇲" },
    "JOD": { nameAr: "الدينار الأردني", nameEn: "Jordanian Dinar", country: "الأردن", flag: "🇯🇴" },
    "AUD": { nameAr: "الدولار الأسترالي", nameEn: "Australian Dollar", country: "أستراليا", flag: "🇦🇺" },
    "CAD": { nameAr: "الدولار الكندي", nameEn: "Canadian Dollar", country: "كندا", flag: "🇨🇦" },
    "CHF": { nameAr: "الفرنك السويسري", nameEn: "Swiss Franc", country: "سويسرا", flag: "🇨🇭" },
    "JPY": { nameAr: "الين الياباني", nameEn: "Japanese Yen", country: "اليابان", flag: "🇯🇵" },
};

export function getCurrencyDisplayName(code: string, lang: 'ar' | 'en' = 'ar'): string {
    const metadata = CURRENCY_METADATA[code];
    if (!metadata) return code;
    return lang === 'ar' ? metadata.nameAr : metadata.nameEn;
}

export function getCurrencyWithCountry(code: string): string {
    const metadata = CURRENCY_METADATA[code];
    if (!metadata) return code;
    return `${metadata.nameAr} (${metadata.country})`;
}
