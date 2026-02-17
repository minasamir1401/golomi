"use client";

import { Navbar } from "@/components/navbar";
import { ArrowLeft, Clock, Globe, Coins } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCountryPrices } from "@/lib/api";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export default function CountryPage({ initialPrices }: { initialPrices: any }) {
    const { t, locale, isRTL } = useLanguage();
    const params = useParams();
    const countrySlug = params?.country as string;

    const countryData: Record<string, { flag: string; currency: string; symbol: string }> = {
        "egypt": { flag: "🇪🇬", currency: "EGP", symbol: "ج.م" },
        "saudi-arabia": { flag: "🇸🇦", currency: "SAR", symbol: "ر.س" },
        "united-arab-emirates": { flag: "🇦🇪", currency: "AED", symbol: "د.إ" },
        "kuwait": { flag: "🇰🇼", currency: "KWD", symbol: "د.ك" },
        "qatar": { flag: "🇶🇦", currency: "QAR", symbol: "ر.ق" },
        "bahrain": { flag: "🇧🇭", currency: "BHD", symbol: "د.ب" },
        "oman": { flag: "🇴🇲", currency: "OMR", symbol: "ر.ع" },
        "jordan": { flag: "🇯🇴", currency: "JOD", symbol: "د.أ" },
        "lebanon": { flag: "🇱🇧", currency: "LBP", symbol: "ل.ل" },
        "iraq": { flag: "🇮🇶", currency: "IQD", symbol: "د.ع" },
        "yemen": { flag: "🇾🇪", currency: "YER", symbol: "ر.ي" },
        "palestine": { flag: "🇵🇸", currency: "ILS", symbol: "₪" },
        "algeria": { flag: "🇩🇿", currency: "DZD", symbol: "د.ج" },
        "morocco": { flag: "🇲🇦", currency: "MAD", symbol: "د.م" },
    };

    const country = countryData[countrySlug];
    const countryName = (t.countries.names as any)[countrySlug] || countrySlug;

    const [pricesData, setPricesData] = useState<any>(initialPrices);
    const [loading, setLoading] = useState(!initialPrices);

    useEffect(() => {
        const fetchPrices = async () => {
            if (countrySlug) {
                const data = await getCountryPrices(countrySlug);
                setPricesData(data);
                setLoading(false);
            }
        };

        if (countrySlug && country) {
            // Always refetch if data is empty or missing current_prices
            if (!initialPrices || !initialPrices.current_prices || Object.keys(initialPrices.current_prices).length === 0) {
                fetchPrices();
            } else {
                setLoading(false);
            }
            const interval = setInterval(fetchPrices, 30000);
            return () => clearInterval(interval);
        }
    }, [countrySlug, country, initialPrices]);

    if (!country) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Globe className="h-20 w-20 text-slate-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-black mb-2">{t.country_details.not_found}</h1>
                    <Link href="/countries" className="text-gold-600 font-bold hover:underline">
                        {t.country_details.back}
                    </Link>
                </div>
            </div>
        );
    }

    const hasData = pricesData && pricesData.current_prices && Object.keys(pricesData.current_prices).length > 0;

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/countries" className="inline-flex items-center gap-2 text-slate-500 hover:text-gold-600 font-bold mb-6 transition-colors font-black uppercase tracking-tight text-xs">
                        <ArrowLeft className={cn("h-4 w-4 transition-transform", isRTL ? "rotate-0" : "rotate-180")} />
                        {t.country_details.back}
                    </Link>

                    <div className={cn("flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-right", !isRTL && "sm:flex-row-reverse sm:text-left")}>
                        <div className="text-6xl sm:text-7xl">{country.flag}</div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-2">
                                {t.country_details.title} <span className="text-gradient-gold">{countryName}</span>
                            </h1>
                            <div className={cn("flex items-center justify-center sm:justify-start gap-4 text-slate-500 font-black uppercase text-xs tracking-widest", !isRTL && "flex-row-reverse")}>
                                <span>{t.country_details.currency_label} {country.currency} ({country.symbol})</span>
                                {pricesData?.last_update && (
                                    <>
                                        <span className="opacity-20">|</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {pricesData.last_update}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Price Cards Preview */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="h-12 w-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                        <span className="text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">{t.gold_page.loading}</span>
                    </div>
                ) : hasData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.entries(pricesData.current_prices).map(([key, val]: [string, any], index) => {
                            const formattedKey = locale === 'en' ? key.replace('عيار ', 'Carat ') : key;
                            return (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card p-6 group hover:border-gold-500/30 transition-all cursor-default"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                            {formattedKey}
                                        </span>
                                        <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                                            <Coins className="h-4 w-4 text-gold-600" />
                                        </div>
                                    </div>
                                    <div className="text-4xl font-black text-gradient-gold mb-2 tracking-tighter">
                                        {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(val.sell) || 0)}
                                    </div>
                                    <div className={cn("flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest", !isRTL && "flex-row-reverse")}>
                                        <div className="flex items-center gap-2">
                                            <span className="opacity-60">{t.country_details.buy}:</span>
                                            <span className="text-emerald-600 dark:text-emerald-400">{new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(val.buy) || 0)}</span>
                                        </div>
                                        <span className="text-gold-600">{country.symbol}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 glass-card bg-slate-50/50 dark:bg-slate-900/50">
                        <Globe className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-6" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-center max-w-xs">{t.country_details.no_data}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 px-6 py-3 bg-gold-500 text-white font-black rounded-2xl hover:bg-gold-600 transition-all text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20"
                        >
                            Retry Loading
                        </button>
                    </div>
                )}

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 glass-card p-10 bg-slate-50/30 dark:bg-slate-950/30"
                >
                    <div className={cn("flex items-center gap-4 mb-8", !isRTL && "flex-row-reverse")}>
                        <div className="h-12 w-12 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-gold-600" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">{t.country_details.important_info}</h2>
                    </div>
                    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-bold text-slate-500", isRTL ? "text-right" : "text-left")}>
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">• {t.country_details.info1}</div>
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">• {t.country_details.info2} {countryName}</div>
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">• {t.country_details.info3}</div>
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">• {t.country_details.info4}</div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
