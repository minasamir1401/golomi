"use client";

import { useEffect, useState } from "react";
import { getAllCountriesPrices } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { useLanguage } from "./language-provider";

const countriesConfig: Record<string, { flag: string; currency: string; symbol: string }> = {
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

export function CountriesGrid() {
    const [pricesData, setPricesData] = useState<any>(null);
    const { t, isRTL, locale } = useLanguage();

    useEffect(() => {
        const fetchPrices = async () => {
            const data = await getAllCountriesPrices();
            if (data) setPricesData(data);
        };
        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    const get21kPrice = (countrySlug: string) => {
        if (!pricesData || !pricesData[countrySlug]) return "---";
        const current = pricesData[countrySlug].current_prices;
        if (!current) return "---";
        const key21 = Object.keys(current).find(k => k.includes("21"));
        if (key21) return current[key21].sell;
        return "---";
    };

    return (
        <section className="py-20">
            <div className={cn("flex flex-col md:flex-row items-center justify-between gap-6 mb-12", isRTL ? "md:text-right" : "md:text-left")}>
                <div className="text-center md:text-inherit">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-4"
                    >
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-black uppercase tracking-widest">{t.countries.badge}</span>
                    </motion.div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
                        {locale === 'ar' ? (
                            <>الذهب في <span className="text-gradient-gold">الوطن العربي</span></>
                        ) : (
                            <>Gold in <span className="text-gradient-gold">Arab Nations</span></>
                        )}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-500 font-bold max-w-2xl">
                        {t.countries.subtitle}
                    </p>
                </div>

                <Link
                    href="/countries"
                    className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-[#151D2E] border-2 border-slate-100 dark:border-[#1E293B] text-slate-600 dark:text-white hover:text-gold-600 hover:border-gold-500/30 transition-all font-black"
                >
                    {t.countries.all}
                    <ArrowRight className={cn("h-4 w-4 transition-transform", isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1 rotate-0", !isRTL && "rotate-0")} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {Object.entries(countriesConfig).map(([slug, info], index) => {
                    const countryName = (t.countries.names as any)[slug] || slug;
                    return (
                        <Link href={`/countries/${slug}`} key={slug}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-card p-4 hover:border-gold-500/30 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl">{info.flag}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase">{info.currency}</span>
                                </div>
                                <h3 className="font-bold text-slate-700 dark:text-white mb-1 text-sm sm:text-base">{countryName}</h3>
                                <div className={cn("flex items-end gap-1", !isRTL && "flex-row-reverse justify-end")}>
                                    <span className="text-base sm:text-lg font-black text-gold-600 dark:text-[#FFB800] group-hover:scale-105 transition-transform">
                                        {get21kPrice(slug)}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-[#94A3B8] font-bold mb-1">21k</span>
                                </div>
                            </motion.div>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}

import { cn } from "@/lib/utils";
