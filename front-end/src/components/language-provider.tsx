"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
const ar = {
    "nav": {
        "gold": "أسعار الذهب",
        "calc": "الحاسبة",
        "convert": "المحول",
        "countries": "الدول",
        "currencies": "العملات",
        "contact": "اتصل بنا"
    },
    "hero": {
        "live": "بث مباشر للأسعار 2026",
        "title1": "استثمر بذكاء",
        "title2": "في",
        "title3": "ذهبك.",
        "desc": "المنصة المتكاملة لمتابعة أسعار الذهب والسبائك من قلب السوق المصري. بيانات دقيقة، لحظية، وموثوقة 100%.",
        "now": "أسعار الذهب الآن",
        "workmanship": "المصنعية والدمغة"
    },
    "market": {
        "pulse": "نبض السوق المصري",
        "live_now": "مباشر الآن",
        "all_prices": "كل الأسعار",
        "last_updated": "لحظي",
        "loading": "تحميل..",
        "source_disclaimer": "جميع الأسعار يتم سحبها لحظياً"
    },
    "price_cards": {
        "24k_sell": "ذهب عيار 24 (بيع)",
        "21k_sell": "ذهب عيار 21 (بيع)",
        "usd": "الدولار الأمريكي",
        "sar": "الريال السعودي",
        "unit": "ج.م"
    },
    "table": {
        "title": "جدول الأسعار المباشر",
        "subtitle": "تحديث لحظي من السوق المصري",
        "loading": "تحميل آخر تحديث للأسعار...",
        "carat": "العيار",
        "buy": "سعر الشراء",
        "sell": "سعر البيع",
        "trend": "الاتجاه",
        "last_update": "آخر تحديث للقائمة كان منذ لحظات",
        "source": "تحديث لحظي"
    },
    "countries": {
        "title": "الذهب في الوطن العربي",
        "badge": "أسعار الذهب عربياً",
        "subtitle": "تعرف على متوسط أسعار الذهب عيار 21 في مختلف الدول العربية",
        "all": "عرض كل الدول",
        "names": {
            "egypt": "مصر",
            "saudi-arabia": "السعودية",
            "united-arab-emirates": "الإمارات",
            "kuwait": "الكويت",
            "qatar": "قطر",
            "bahrain": "البحرين",
            "oman": "عمان",
            "jordan": "الأردن",
            "lebanon": "لبنان",
            "iraq": "العراق",
            "yemen": "اليمن",
            "palestine": "فلسطين",
            "algeria": "الجزائر",
            "morocco": "المغرب"
        }
    },
    "converter": {
        "title": "المحول الذكي",
        "amount_label": "المبلغ المراد تحويله",
        "result_label": "القيمة التقريبية الآن",
        "update_notice": "تحديث مباشر للسعر",
        "egp": "جنيه مصري",
        "usd": "دولار أمريكي",
        "eur": "يورو",
        "sar": "ريال سعودي"
    },
    "footer": {
        "desc": "بوابتك الموثوقة لعالم المال والاستثمار. نقدم أدق البيانات لحظة بلحظة لنمو ثروتك.",
        "platform": "المنصة",
        "about": "عن المنصة",
        "security": "الأمان",
        "app": "تطبيق الهاتف",
        "support": "الدعم",
        "help": "مركز المساعدة",
        "contact": "تواصل معنا",
        "rights": "جميع الحقوق محفوظة.",
        "terms": "اتفاقية الاستخدام"
    },
    "chart": {
        "title": "تحليل سعر الذهب العالمي (XAU/USD)",
        "credit": "رسوم بيانية بواسطة TradingView"
    },
    "gold_page": {
        "title": "سعر الذهب الآن",
        "subtitle": "بيانات حية ومباشرة",
        "21k_buy": "عيار 21 (شراء)",
        "unit_gram": "ج.م / جرام",
        "now": "الآن",
        "loading": "تحميل...",
        "cashback_title": "كاش باك (Cashback)",
        "cashback_desc": "استرجاع جزء من المصنعية عند البيع في حالة الحفاظ على التغليف الأصلي (الغلاف السليم).",
        "intact_cover": "الغلاف سليم",
        "opened_cover": "الغلاف مفتوح",
        "major_units": "العملات الكبرى",
        "ounce": "الأوقية (31.1 جرام)",
        "pound": "الجنيه الذهب (8 جرام)"
    },
    "countries_page": {
        "title1": "أسعار الذهب في",
        "title2": "الدول العربية",
        "badge": "أسعار الذهب العالمية",
        "subtitle": "تابع أسعار الذهب اللحظية في جميع الدول العربية بعملاتها المحلية",
        "search_placeholder": "ابحث عن دولة...",
        "view_live": "عرض الأسعار المباشرة",
        "no_results": "لا توجد نتائج للبحث"
    },
    "country_details": {
        "back": "العودة إلى قائمة الدول",
        "title": "أسعار الذهب في",
        "currency_label": "الأسعار بعملة",
        "last_update": "آخر تحديث",
        "buy": "شراء",
        "sell": "بيع",
        "no_data": "لا توجد بيانات متاحة حالياً. يرجى المحاولة لاحضاً",
        "important_info": "معلومات مهمة",
        "info1": "يتم تحديث أسعار الذهب بشكل دوري على مدار اليوم",
        "info2": "الأسعار المعروضة هي أسعار السوق المحلي في",
        "info3": "قد تختلف الأسعار الفعلية قليلاً من محل لآخر",
        "info4": "ننصح دائماً بالتحقق من السعر النهائي قبل الشراء",
        "not_found": "الدولة غير موجودة"
    },
    "currencies": {
        "title": "أسعار العملات",
        "parallel_market": "أسعار العملات (السوق الموازي)",
        "official_market": "أسعار العملات الرسمية",
        "update_instant": "تحديث لحظي للسوق",
        "update_live": "تحديث لحظي",
        "table_currency": "العملة",
        "table_code": "الكود",
        "table_buy": "شراء",
        "table_sell": "بيع",
        "auto_update": "تحديث تلقائي",
        "source": "الحالة",
        "loading": "جاري تحميل أسعار العملات..."
    },
    "currencies_client": {
        "subtitle": "تابع أسعار صرف العملات والذهب في البنوك المصرية بتحديث لحظي مباشر ومقارنة شاملة"
    },
    "calculator": {
        "title": "حاسبة سعر الذهب",
        "subtitle": "احسب قيمة الذهب بناءً على أسعار السوق الحالية ومصنعية الجرام",
        "weight_label": "وزن الذهب (جرام)",
        "weight_placeholder": "مثال: 10",
        "carat_label": "عيار الذهب",
        "carat_hint": "اختر العيار الصحيح لذهبك",
        "workmanship_label": "المصنعية للجرام الواحد (اختياري)",
        "workmanship_placeholder": "مثال: 150",
        "calculate_btn": "احسب القيمة",
        "result_title": "نتائج الحساب",
        "total_gold": "قيمة الذهب",
        "total_workmanship": "إجمالي المصنعية",
        "grand_total": "الإجمالي الكلي",
        "disclaimer": "الأسعار تقريبية بناءً على بيانات السوق الحالية وتتضمن متوسطاً للمصنعية. القيم الفعلية قد تختلف."
    },
    "historical_chart": {
        "title": "تحليل تذبذب الأسعار",
        "subtitle": "تطور سعر عيار 21 في السوق المصري",
        "ranges": {
            "today": "اليوم",
            "7d": "7 أيام",
            "30d": "30 يوم",
            "1y": "سنة"
        },
        "loading": "جاري تحليل البيانات التاريخية...",
        "empty": "لا توجد بيانات كافية لعرض الرسم البياني لهذا النطاق",
        "source_archive": "البيانات مستخرجة من أرشيف قاعدة البيانات المحلي"
    },
    "gold_details": {
        "loading": "جاري جلب أحدث الأسعار...",
        "live_prices_title": "أسعار الذهب الآن",
        "products_title": "سبائك وجنيهات",
        "col_karat": "العيار",
        "col_buy": "شراء",
        "col_sell": "بيع",
        "col_item": "الصنف",
        "col_weight": "الوزن",
        "col_price": "السعر"
    },
    "gold_history_table": {
        "title": "جدول العيارات بالأسعار خلال آخر 30 يوم",
        "subtitle": "تطور الأسعار اليومي",
        "loading": "جاري تحميل سجل الأسعار التاريخي...",
        "col_day": "اليوم",
        "col_24k": "عيار 24",
        "col_22k": "عيار 22",
        "col_21k": "عيار 21",
        "col_18k": "عيار 18",
        "col_14k": "عيار 14",
        "col_ounce": "أوقية الذهب",
        "col_pound": "جنيه الذهب"
    },
    "calculator_client": {
        "title": "حاسبة الذهب الذكية",
        "title_span": "استثمارك.",
        "subtitle": "أداة دقيقة لحساب قيمة الذهب بناءً على أسعار السوق اللحظية والمصنعية والضرائب.",
        "source_label": "اختر مصدر السعر",
        "karat_label": "اختر العيار",
        "weight_label": "الوزن (جرام)",
        "gram": "جرام",
        "workmanship_label": "المصنعية",
        "tax_label": "الضريبة والدمغة",
        "fixed": "ثابت",
        "efficiency_title": "دقة الحسابات",
        "efficiency_desc": "هذه الحاسبة تعطيك سعراً تقريبياً جداً بناءً على بيانات السوق اللحظية. ننصح دائماً بالتأكد من السعر النهائي عند الشراء.",
        "summary_title": "ملخص التكلفة",
        "price_per_gram": "سعر جرام الذهب (خام)",
        "total_workmanship": "إجمالي المصنعية",
        "total_tax": "الضريبة والدمغة",
        "total_weight": "الوزن الكلي",
        "total_estimated": "القيمة الإجمالية المقدّرة",
        "download_pdf": "تنزيل عرض السعر (PDF)",
        "isagha_comparison": "أسعار الفضة والذهب",
        "isagha_subtitle": "مقارنة مباشرة مع أسعار السوق",
        "silver_prices": "أسعار الفضة",
        "silver_karat": "فضة عيار",
        "gold_prices_isagha": "أسعار الذهب اليومية",
        "gold_karat": "ذهب عيار",
        "unit": "ج.م"
    },
    "currency_names": {
        "الدولار الأمريكي": "الدولار الأمريكي",
        "اليورو": "اليورو",
        "الجنيه الإسترليني": "الجنيه الإسترليني",
        "الريال السعودي": "الريال السعودي",
        "الدرهم الإماراتي": "الدرهم الإماراتي",
        "الدينار الكويتي": "الدينار الكويتي",
        "الريال القطري": "الريال القطري",
        "الدينار البحريني": "الدينار البحريني",
        "الريال العماني": "الريال العماني",
        "الدينار الأردني": "الدينار الأردني",
        "الليرة اللبنانية": "الليرة اللبنانية",
        "الدينار العراقي": "الدينار العراقي",
        "الريال اليمني": "الريال اليمني",
        "الدينار الجزائري": "الدينار الجزائري",
        "الدرهم المغربي": "الدرهم المغربي",
        "الجنيه المصري": "الجنيه المصري",
        "كرونة سويدية": "كرونة سويدية",
        "كرونة نرويجية": "كرونة نرويجية",
        "كرونة دنماركية": "كرونة دنماركية",
        "دولار كندي": "دولار كندي",
        "دولار أسترالي": "دولار أسترالي",
        "الين اليابانى": "الين اليابانى"
    }
};

const en = {
    "nav": {
        "gold": "Gold Prices",
        "calc": "Calculator",
        "convert": "Converter",
        "countries": "Countries",
        "currencies": "Currencies",
        "contact": "Contact"
    },
    "hero": {
        "live": "Live Prices 2026",
        "title1": "Invest Smartly",
        "title2": "In your",
        "title3": "Gold.",
        "desc": "The integrated platform for tracking gold and bullion prices from the heart of the Egyptian market. Accurate, real-time, and 100% reliable data.",
        "now": "Gold Prices Now",
        "workmanship": "Workmanship & Tax"
    },
    "market": {
        "pulse": "Egyptian Market Pulse",
        "live_now": "Live Now",
        "all_prices": "All Prices",
        "last_updated": "Just now",
        "loading": "Loading...",
        "source_disclaimer": "All prices are pulled in real-time"
    },
    "price_cards": {
        "24k_sell": "Gold 24K (Sell)",
        "21k_sell": "Gold 21K (Sell)",
        "usd": "US Dollar",
        "sar": "Saudi Riyal",
        "unit": "EGP"
    },
    "table": {
        "title": "Live Price Table",
        "subtitle": "Real-time updates from the Egyptian market",
        "loading": "Loading latest prices...",
        "carat": "Carat",
        "buy": "Buy",
        "sell": "Sell",
        "trend": "Trend",
        "last_update": "Last update was moments ago",
        "source": "Real-time Update"
    },
    "countries": {
        "title": "Gold in Arab Nations",
        "badge": "Gold Prices Regionally",
        "subtitle": "Average gold price (21k) in various Arab countries",
        "all": "View All Countries",
        "names": {
            "egypt": "Egypt",
            "saudi-arabia": "Saudi Arabia",
            "united-arab-emirates": "UAE",
            "kuwait": "Kuwait",
            "qatar": "Qatar",
            "bahrain": "Bahrain",
            "oman": "Oman",
            "jordan": "Jordan",
            "lebanon": "Lebanon",
            "iraq": "Iraq",
            "yemen": "Yemen",
            "palestine": "Palestine",
            "algeria": "Algeria",
            "morocco": "Morocco"
        }
    },
    "converter": {
        "title": "Smart Converter",
        "amount_label": "Amount to convert",
        "result_label": "Approximate value now",
        "update_notice": "Live price update",
        "egp": "Egyptian Pound",
        "usd": "US Dollar",
        "eur": "Euro",
        "sar": "Saudi Riyal"
    },
    "footer": {
        "desc": "Your trusted portal for finance and investment. Accurate real-time data for your wealth growth.",
        "platform": "Platform",
        "about": "About the Platform",
        "security": "Security",
        "app": "Mobile App",
        "support": "Support",
        "help": "Help Center",
        "contact": "Contact Us",
        "terms": "Terms of Use",
        "rights": "ALL RIGHTS RESERVED."
    },
    "chart": {
        "title": "Global Gold Analysis (XAU/USD)",
        "credit": "Charts by TradingView"
    },
    "gold_page": {
        "title": "Gold Price Now",
        "subtitle": "Live and direct data",
        "21k_buy": "21K Gold (Buy)",
        "unit_gram": "EGP / Gram",
        "now": "Now",
        "loading": "Loading...",
        "cashback_title": "Cashback",
        "cashback_desc": "Recover part of the workmanship fee when selling, provided original packaging is intact.",
        "intact_cover": "Intact Cover",
        "opened_cover": "Opened Cover",
        "major_units": "Major Units",
        "ounce": "Gold Ounce (31.1g)",
        "pound": "Gold Pound (8g)"
    },
    "countries_page": {
        "title1": "Gold Prices in",
        "title2": "Arab Nations",
        "badge": "Global Gold Prices",
        "subtitle": "Track real-time gold prices in all Arab countries in their local currencies",
        "search_placeholder": "Search for a country...",
        "view_live": "View Live Prices",
        "no_results": "No results found"
    },
    "country_details": {
        "back": "Back to Countries",
        "title": "Gold Prices in",
        "currency_label": "Prices in",
        "last_update": "Last Update",
        "buy": "Buy",
        "sell": "Sell",
        "no_data": "Data not available at the moment. Please try again later.",
        "important_info": "Important Information",
        "info1": "Gold prices are updated periodically throughout the day",
        "info2": "Prices shown are local market prices in",
        "info3": "Actual prices may vary slightly from store to store",
        "info4": "We recommend checking the final price before purchase",
        "not_found": "Country not found"
    },
    "currencies": {
        "title": "Currency Exchange Rates",
        "parallel_market": "Currency Rates (Parallel Market)",
        "official_market": "Official Currency Rates",
        "update_instant": "Instant market updates",
        "update_live": "Real-time updates",
        "table_currency": "Currency",
        "table_code": "Code",
        "table_buy": "Buy",
        "table_sell": "Sell",
        "auto_update": "Auto Update",
        "source": "Status",
        "loading": "Loading currency rates..."
    },
    "currencies_client": {
        "subtitle": "Track exchange rates and gold prices in Egyptian banks with live updates and comprehensive comparison"
    },
    "calculator": {
        "title": "Gold Price Calculator",
        "subtitle": "Calculate gold value based on current market rates and workmanship fees",
        "weight_label": "Gold Weight (Gram)",
        "weight_placeholder": "Example: 10",
        "carat_label": "Gold Carat",
        "carat_hint": "Select the correct carat for your gold",
        "workmanship_label": "Workmanship per gram (Optional)",
        "workmanship_placeholder": "Example: 150",
        "calculate_btn": "Calculate Value",
        "result_title": "Calculation Results",
        "total_gold": "Gold Value",
        "total_workmanship": "Total Workmanship",
        "grand_total": "Grand Total",
        "disclaimer": "Prices are approximate based on current market data and include a sanitized average of workmanship fees. Actual values may vary."
    },
    "historical_chart": {
        "title": "Price Volatility Analysis",
        "subtitle": "Evolution of 21K gold price in the Egyptian market",
        "ranges": {
            "today": "Today",
            "7d": "7 Days",
            "30d": "30 Days",
            "1y": "1 Year"
        },
        "loading": "Analyzing historical data...",
        "empty": "Insufficient data for this range",
        "source_archive": "Data extracted from local database archive"
    },
    "gold_details": {
        "loading": "Fetching latest prices...",
        "live_prices_title": "Gold Prices Now",
        "products_title": "Bars & Coins",
        "col_karat": "Karat",
        "col_buy": "Buy",
        "col_sell": "Sell",
        "col_item": "Item",
        "col_weight": "Weight",
        "col_price": "Price"
    },
    "gold_history_table": {
        "title": "Karat Price Table (Last 30 Days)",
        "subtitle": "Daily price evolution",
        "loading": "Loading historical price record...",
        "col_day": "Day",
        "col_24k": "24K",
        "col_22k": "22K",
        "col_21k": "21K",
        "col_18k": "18K",
        "col_14k": "14K",
        "col_ounce": "Gold Ounce",
        "col_pound": "Gold Pound"
    },
    "calculator_client": {
        "title": "Smart Gold Calculator",
        "title_span": "Investment.",
        "subtitle": "Accurate tool to calculate gold value based on live market prices, workmanship, and taxes.",
        "source_label": "Select Price Source",
        "karat_label": "Select Karat",
        "weight_label": "Weight (Gram)",
        "gram": "Gram",
        "workmanship_label": "Workmanship",
        "tax_label": "Tax & Stamp",
        "fixed": "Fixed",
        "efficiency_title": "Calculation Accuracy",
        "efficiency_desc": "This calculator provides a very close approximate price based on live market data. We always recommend confirming the final price upon purchase.",
        "summary_title": "Cost Summary",
        "price_per_gram": "Gold price per gram (Raw)",
        "total_workmanship": "Total Workmanship",
        "total_tax": "Tax & Stamp",
        "total_weight": "Total Weight",
        "total_estimated": "Total Estimated Value",
        "download_pdf": "Download Quote (PDF)",
        "isagha_comparison": "Silver & Gold Prices Today",
        "isagha_subtitle": "Direct market comparison",
        "silver_prices": "Silver Prices",
        "silver_karat": "Silver Karat",
        "gold_prices_isagha": "Gold Prices Today",
        "gold_karat": "Gold Karat",
        "unit": "EGP"
    },
    "currency_names": {
        "الدولار الأمريكي": "US Dollar",
        "اليورو": "Euro",
        "الجنيه الإسترليني": "British Pound",
        "الريال السعودي": "Saudi Riyal",
        "الدرهم الإماراتي": "UAE Dirham",
        "الدينار الكويتي": "Kuwaiti Dinar",
        "الريال القطري": "Qatari Riyal",
        "الدينار البحريني": "Bahraini Dinar",
        "الريال العماني": "Omani Rial",
        "الدينار الأردني": "Jordanian Dinar",
        "الليرة اللبنانية": "Lebanese Pound",
        "الدينار العراقي": "Iraqi Dinar",
        "الريال اليمني": "Yemeni Rial",
        "الدينار الجزائري": "Algerian Dinar",
        "الدرهم المغربي": "Moroccan Dirham",
        "الجنيه المصري": "Egyptian Pound",
        "كرونة سويدية": "Swedish Krona",
        "كرونة نرويجية": "Norwegian Krone",
        "كرونة دنماركية": "Danish Krone",
        "دولار كندي": "Canadian Dollar",
        "دولار أسترالي": "Australian Dollar",
        "الين اليابانى": "Japanese Yen"
    }
};

type Locale = 'ar' | 'en';
type Dictionary = typeof ar;

interface LanguageContextType {
    locale: Locale;
    t: Dictionary;
    setLocale: (locale: Locale) => void;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [locale, setLocaleState] = useState<Locale>('ar');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
            setLocaleState(savedLocale);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLocale;
    };

    useEffect(() => {
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [locale]);

    const t = locale === 'ar' ? ar : en;
    const isRTL = locale === 'ar';

    return (
        <LanguageContext.Provider value={{ locale, t, setLocale, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
