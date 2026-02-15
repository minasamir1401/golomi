"use client";

import { Navbar } from "@/components/navbar";
import { PriceCard } from "@/components/price-card";
import { LiveGoldTable } from "@/components/live-gold-table";
import { Coins, Scale, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getGoldPrices } from "@/lib/api";

import { TradingViewChart } from "@/components/trading-view-chart";
import { CountriesGrid } from "@/components/countries-grid";
import { GoldLiveHistory } from "@/components/gold-live-history";
import { GoldLiveDetails } from "@/components/gold-live-details";
import { HistoricalPriceChart } from "@/components/historical-price-chart";
import { useLanguage } from "@/components/language-provider";
import { useMarketData } from "@/components/market-data-provider";
import { cn } from "@/lib/utils";
import GoldCalculator from "@/components/gold-calculator";
import { QASection } from "@/components/qa-section";

export interface GoldClientProps {
    initialData: any;
}

export default function GoldClient({ initialData }: GoldClientProps) {
    const { snapshot } = useMarketData();
    const { t, locale, isRTL } = useLanguage();

    const livePrices = snapshot ? snapshot.gold_egypt?.prices : (initialData?.prices || initialData);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* GROUNDED HERO SECTION */}
            <section className="hero-section pt-24 min-[350px]:pt-32 sm:pt-40 mb-12">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-white dark:bg-[#1E293B] px-4 py-1.5 rounded-full mb-6 border border-[#BBE0EF]/30 dark:border-[#33415C] shadow-sm dark:shadow-black/20"
                    >
                        <div className="h-2 w-2 rounded-full bg-[#F16D34] animate-pulse" />
                        <span className="text-[10px] font-black text-[#161E54]/60 dark:text-[#E6EDF3] uppercase tracking-widest pt-0.5">
                            {locale === 'ar' ? 'تقرير أسعار الذهب اليومي' : 'Daily Gold Market Report'}
                        </span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-6xl font-heavy text-[#161E54] dark:text-[#E6EDF3] mb-4 tracking-tighter">
                        <span className="text-gradient-gold lowercase">{t.gold_page.title}</span>
                    </h1>
                    <p className="max-w-xl text-[#161E54]/40 dark:text-[#979DAC] font-bold text-sm sm:text-base leading-relaxed">
                        {t.gold_page.subtitle}
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-8">
                            <h2 className="section-title">{locale === 'ar' ? 'الأسعار في مصر' : 'Prices in Egypt'}</h2>
                            <LiveGoldTable />
                        </div>

                        <div className="space-y-8">
                            <h2 className="section-title">{locale === 'ar' ? 'السعر العالمي' : 'Global Price'}</h2>
                            <div className="glass-card p-4 sm:p-8">
                                <TradingViewChart />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="section-title">{locale === 'ar' ? 'مخطط الأسعار' : 'Price Chart'}</h2>
                            <div className="glass-card p-4 sm:p-8">
                                <HistoricalPriceChart />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Summary Info Card - Navy Palette */}
                        <div className="bg-[#161E54] dark:bg-[#0B1121] rounded-3xl p-8 text-white relative overflow-hidden border border-white/10 dark:border-[#1E293B] shadow-xl dark:shadow-black/40">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F16D34]/10 blur-3xl" />
                            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[#F16D34]" />
                                {locale === 'ar' ? 'ملخص السوق' : 'Market Summary'}
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 dark:bg-[#1E293B] rounded-2xl border border-white/5 dark:border-[#33415C] flex justify-between items-center">
                                    <span className="text-xs font-bold text-[#BBE0EF]/60 dark:text-[#94A3B8]">{t.gold_page["21k_buy"]}</span>
                                    <span className="text-xl font-heavy text-gold-500 dark:text-[#FFB800]">{livePrices?.["عيار 21"]?.buy || livePrices?.["21"]?.buy || "---"}</span>
                                </div>
                                <div className="p-4 bg-white/5 dark:bg-[#1E293B] rounded-2xl border border-white/5 dark:border-[#33415C] flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 dark:text-[#94A3B8]">{t.gold_page.ounce}</span>
                                    <span className="text-xl font-heavy text-[#E6EDF3] dark:text-white">{livePrices?.["gold_ounce"]?.sell?.toLocaleString() || livePrices?.["أوقية الذهب"]?.sell?.toLocaleString() || "---"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cashback Info */}
                        <div className="bg-slate-50 dark:bg-[#151D2E] rounded-3xl p-8 border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-black/20">
                            <h3 className="text-lg font-black mb-4 text-slate-900 dark:text-white">{t.gold_page.cashback_title}</h3>
                            <p className="mb-6 text-sm text-slate-500 dark:text-[#94A3B8] font-bold leading-relaxed">
                                {t.gold_page.cashback_desc}
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#33415C]">
                                    <span className="text-xs font-bold text-slate-700 dark:text-white">{t.gold_page.intact_cover}</span>
                                    <span className="font-heavy text-peach-gold">~24-28 {t.price_cards.unit}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#33415C]">
                                    <span className="text-xs font-bold text-slate-700 dark:text-white">{t.gold_page.opened_cover}</span>
                                    <span className="font-heavy text-peach-gold">~11 {t.price_cards.unit}</span>
                                </div>
                            </div>
                        </div>

                        {/* Gold Calculator */}
                        <GoldCalculator prices={livePrices || {}} />

                        {/* Units Widget */}
                        <div className="bg-white dark:bg-[#151D2E] rounded-3xl p-8 border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-black/40">
                            <div className="flex items-center gap-3 mb-6">
                                <Scale className="h-5 w-5 text-gold-600 dark:text-[#FFB800]" />
                                <h3 className="font-black text-lg text-slate-900 dark:text-white">{t.gold_page.major_units}</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: t.gold_page.ounce, price: livePrices?.["gold_ounce"]?.sell || livePrices?.["أوقية الذهب"]?.sell },
                                    { label: t.gold_page.pound, price: livePrices?.["gold_pound"]?.sell || livePrices?.["جنيه الذهب"]?.sell },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-[#0B1121] border border-slate-100 dark:border-[#1E293B]">
                                        <span className="text-xs font-bold text-slate-500 dark:text-[#FFFFFF]">{item.label}</span>
                                        <span className="font-heavy text-slate-900 dark:text-white">{item.price ? new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(item.price) : "..."}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <h2 className="section-title">{locale === 'ar' ? 'أسعار الذهب عالمياً' : 'Global Gold Prices'}</h2>
                    <CountriesGrid />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
                    <div className="bg-white dark:bg-[#0B1121] rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-[#1E293B] shadow-xl dark:shadow-black/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-[80px]" />
                        <h3 className="text-2xl font-heavy mb-8 border-r-8 border-gold-500 dark:border-[#F16D34] pr-4 text-slate-900 dark:text-[#FFFFFF] leading-none uppercase tracking-tight">
                            {locale === 'ar' ? 'تفاصيل السوق المباشرة' : 'Live Market Details'}
                        </h3>
                        <GoldLiveDetails />
                    </div>
                    <div className="bg-white dark:bg-[#0B1121] rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-[#1E293B] shadow-xl dark:shadow-black/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-[80px]" />
                        <h3 className="text-2xl font-heavy mb-8 border-r-8 border-gold-500 dark:border-[#F16D34] pr-4 text-slate-900 dark:text-[#FFFFFF] leading-none uppercase tracking-tight">
                            {locale === 'ar' ? 'السجل التاريخي للأسعار' : 'Price Historical Record'}
                        </h3>
                        <GoldLiveHistory />
                    </div>
                </div>

                <div className="mt-16">
                    <QASection pageKey="gold" />
                </div>
            </main>
        </div>
    );
}
