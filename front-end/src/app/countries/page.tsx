"use client";

import { Navbar } from "@/components/navbar";
import { Globe, ArrowRight, Coins, TrendingUp, Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { getAllCountriesPrices } from "@/lib/api";

export default function CountriesPage() {
    const { t, isRTL, locale } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [prices, setPrices] = useState<any>(null);

    useEffect(() => {
        const fetchAll = async () => {
            const data = await getAllCountriesPrices();
            setPrices(data);
        };
        fetchAll();
        const interval = setInterval(fetchAll, 60000);
        return () => clearInterval(interval);
    }, []);

    const countries = [
        { name: (t.countries.names as any)["egypt"] || "مصر", slug: "egypt", flag: "🇪🇬", currency: "EGP" },
        { name: (t.countries.names as any)["saudi-arabia"] || "السعودية", slug: "saudi-arabia", flag: "🇸🇦", currency: "SAR" },
        { name: (t.countries.names as any)["united-arab-emirates"] || "الإمارات", slug: "united-arab-emirates", flag: "🇦🇪", currency: "AED" },
        { name: (t.countries.names as any)["kuwait"] || "الكويت", slug: "kuwait", flag: "🇰🇼", currency: "KWD" },
        { name: (t.countries.names as any)["qatar"] || "قطر", slug: "qatar", flag: "🇶🇦", currency: "QAR" },
        { name: (t.countries.names as any)["bahrain"] || "البحرين", slug: "bahrain", flag: "🇧🇭", currency: "BHD" },
        { name: (t.countries.names as any)["oman"] || "عمان", slug: "oman", flag: "🇴🇲", currency: "OMR" },
        { name: (t.countries.names as any)["jordan"] || "الأردن", slug: "jordan", flag: "🇯🇴", currency: "JOD" },
        { name: (t.countries.names as any)["lebanon"] || "لبنان", slug: "lebanon", flag: "🇱🇧", currency: "LBP" },
        { name: (t.countries.names as any)["iraq"] || "العراق", slug: "iraq", flag: "🇮🇶", currency: "IQD" },
        { name: (t.countries.names as any)["yemen"] || "اليمن", slug: "yemen", flag: "🇾🇪", currency: "YER" },
        { name: (t.countries.names as any)["palestine"] || "فلسطين", slug: "palestine", flag: "🇵🇸", currency: "ILS" },
        { name: (t.countries.names as any)["algeria"] || "الجزائر", slug: "algeria", flag: "🇩🇿", currency: "DZD" },
        { name: (t.countries.names as any)["morocco"] || "المغرب", slug: "morocco", flag: "🇲🇦", currency: "MAD" },
    ];

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* GROUNDED HERO */}
            <section className="hero-section pt-24 min-[350px]:pt-32 sm:pt-40 mb-8 min-[350px]:mb-12">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 min-[350px]:gap-3 px-4 min-[350px]:px-6 py-1.5 min-[350px]:py-2 rounded-xl min-[350px]:rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-4 min-[350px]:mb-6"
                    >
                        <Globe className="h-3.5 min-[350px]:h-4 w-3.5 min-[350px]:w-4" />
                        <span className="text-[10px] min-[350px]:text-xs font-black uppercase tracking-widest pt-0.5">{t.countries_page.badge}</span>
                    </motion.div>
                    <h1 className="text-2xl min-[350px]:text-4xl md:text-6xl font-heavy text-slate-900 dark:text-white mb-3 min-[350px]:mb-4 tracking-tighter leading-tight">
                        {t.countries_page.title1} <span className="text-gradient-gold lowercase">{t.countries_page.title2}.</span>
                    </h1>
                    <p className="max-w-xl text-slate-400 font-bold text-xs min-[350px]:text-base leading-relaxed px-4">
                        {t.countries_page.subtitle}
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
                {/* Search Bar - Defined Style */}
                <div className="mb-10 min-[350px]:mb-16 max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t.countries_page.search_placeholder}
                            className={cn(
                                "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 rounded-xl min-[350px]:rounded-2xl p-4 min-[350px]:p-5 font-bold text-sm min-[350px]:text-base text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-all shadow-sm focus:shadow-xl focus:shadow-gold-500/5",
                                isRTL ? "pr-12 min-[350px]:pr-14" : "pl-12 min-[350px]:pl-14"
                            )}
                        />
                        <Search className={cn("absolute top-1/2 -translate-y-1/2 h-5 min-[350px]:h-6 w-5 min-[350px]:w-6 text-slate-300", isRTL ? "right-4 min-[350px]:right-5" : "left-4 min-[350px]:left-5")} />
                    </div>
                </div>

                {/* Countries Grid - Defined Borders */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCountries.map((country, index) => (
                        <motion.div
                            key={country.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/countries/${country.slug}`} className="group block h-full">
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 min-[350px]:p-8 border border-slate-200 dark:border-white/10 group-hover:border-gold-500 transition-all shadow-sm hover:shadow-xl flex flex-col min-h-[220px] min-[350px]:min-h-[300px]">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4 min-[350px]:mb-8">
                                        <div className="flex items-center gap-2 min-[350px]:gap-4">
                                            <span className="text-3xl min-[350px]:text-5xl group-hover:scale-110 transition-transform">{country.flag}</span>
                                            <div>
                                                <h3 className="font-heavy text-base min-[350px]:text-xl text-slate-900 dark:text-white group-hover:text-gold-600 transition-colors uppercase tracking-tight">{country.name}</h3>
                                                <p className="text-[8px] min-[350px]:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 min-[350px]:mt-1">{country.currency}</p>
                                            </div>
                                        </div>
                                        <div className="h-7 w-7 min-[350px]:h-10 min-[350px]:w-10 rounded-lg min-[350px]:rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                            <ArrowRight className={cn("h-4 min-[350px]:h-5 w-4 min-[350px]:w-5 text-gold-500", isRTL && "rotate-180")} />
                                        </div>
                                    </div>

                                    {/* Price Display */}
                                    {prices?.[country.slug]?.current_prices ? (
                                        <div className="space-y-4 mb-8">
                                            {/* 21K Price */}
                                            {prices[country.slug].current_prices["21"] && (
                                                <div className="bg-slate-50 dark:bg-slate-950 p-3 min-[350px]:p-4 rounded-xl min-[350px]:rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 min-[350px]:gap-3">
                                                        <div className="h-8 w-8 min-[350px]:h-10 min-[350px]:w-10 rounded-lg min-[350px]:rounded-xl bg-gold-500/10 flex items-center justify-center">
                                                            <TrendingUp className="h-4 w-4 min-[350px]:h-5 min-[350px]:w-5 text-gold-600" />
                                                        </div>
                                                        <span className="text-[10px] min-[350px]:text-xs font-black text-slate-500 uppercase tracking-widest">عيار 21</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-base min-[350px]:text-xl font-heavy text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                                            {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(prices[country.slug].current_prices["21"].sell)}
                                                        </div>
                                                        <span className="text-[8px] min-[350px]:text-[10px] font-black text-slate-400">{country.currency}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 24K Price */}
                                            {prices[country.slug].current_prices["24"] && (
                                                <div className="bg-slate-50 dark:bg-slate-950 p-3 min-[350px]:p-4 rounded-xl min-[350px]:rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 min-[350px]:gap-3">
                                                        <div className="h-8 w-8 min-[350px]:h-10 min-[350px]:w-10 rounded-lg min-[350px]:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                            <Coins className="h-4 w-4 min-[350px]:h-5 min-[350px]:w-5 text-emerald-600" />
                                                        </div>
                                                        <span className="text-[10px] min-[350px]:text-xs font-black text-slate-500 uppercase tracking-widest">عيار 24</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-base min-[350px]:text-xl font-heavy text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                                            {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(prices[country.slug].current_prices["24"].sell)}
                                                        </div>
                                                        <span className="text-[8px] min-[350px]:text-[10px] font-black text-slate-400">{country.currency}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 text-center mb-8">
                                            <span className="text-xs font-bold text-slate-400">حاول مرة أخرى</span>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-auto flex items-center gap-2 text-xs font-heavy text-slate-400 group-hover:text-gold-600 transition-colors">
                                        <Coins className="h-4 w-4" />
                                        <span className="uppercase tracking-widest">
                                            {t.countries_page.view_live}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {filteredCountries.length === 0 && (
                    <div className="text-center py-32 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-white/10">
                        <Globe className="h-20 w-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                        <p className="text-slate-500 font-bold text-xl">{t.countries_page.no_results}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
