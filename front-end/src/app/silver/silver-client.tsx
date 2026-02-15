"use client";

import { Navbar } from "@/components/navbar";
import { Sparkles, TrendingUp, TrendingDown, Clock, Zap, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getLatestSilverPrice, getSilverPriceStats, type SilverPrice, type SilverStatsResponse } from "@/lib/api";
import { SilverTable } from "./silver-table";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import SilverCalculator from "@/components/silver-calculator";
import { QASection } from "@/components/qa-section";

export default function SilverClient() {
    const { t, locale, isRTL } = useLanguage();
    const [silverData, setSilverData] = useState<SilverPrice | null>(null);
    const [stats, setStats] = useState<SilverStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [latest, statsData] = await Promise.all([
                getLatestSilverPrice(),
                getSilverPriceStats(7)
            ]);

            if (latest) setSilverData(latest);
            if (statsData) setStats(statsData);
            setLoading(false);
        };

        fetchData();

        // Refresh every 1 minute
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatPrice = (val: number | null) => {
        if (!val) return "---";
        return new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    };

    const formatChange = (val: number | null) => {
        if (!val) return null;
        const formatted = Math.abs(val).toFixed(2);
        return val >= 0 ? `+${formatted}%` : `-${formatted}%`;
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <Navbar />

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-500/5 to-transparent pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-400/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-slate-500/5 blur-[100px] rounded-full pointer-events-none" />

            <main className="mx-auto max-w-7xl px-2 min-[350px]:px-6 lg:px-8 py-12 relative z-10">
                {/* Hero Section */}
                <div className="mb-8 min-[350px]:mb-12 text-center pt-24 min-[350px]:pt-32 sm:pt-40 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 min-[350px]:gap-3 px-4 min-[350px]:px-6 py-1.5 min-[350px]:py-2 rounded-xl min-[350px]:rounded-2xl bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 mb-4 min-[350px]:mb-6"
                    >
                        <Sparkles className="h-4 min-[350px]:h-5 w-4 min-[350px]:w-5" />
                        <span className="text-[10px] min-[350px]:text-xs font-black uppercase tracking-widest pt-0.5">
                            {locale === 'ar' ? 'أسعار الفضة' : 'Silver Prices'}
                        </span>
                    </motion.div>

                    <h1 className="text-2xl min-[350px]:text-4xl md:text-6xl font-heavy text-slate-900 dark:text-white mb-3 min-[350px]:mb-4 tracking-tighter leading-tight">
                        {locale === 'ar' ? (
                            <>أسعار <span className="text-gradient-silver">الفضة</span> اليوم</>
                        ) : (
                            <>Today's <span className="text-gradient-silver">Silver</span> Prices</>
                        )}
                    </h1>
                    <p className="text-slate-600 dark:text-[#94A3B8] font-bold max-w-2xl mx-auto text-xs min-[350px]:text-base mb-6 px-4">
                        {locale === 'ar'
                            ? 'تحديثات مباشرة لأسعار الفضة في مصر - جرام، أونصة، عيار 999 و 925'
                            : 'Live silver price updates in Egypt - Gram, Ounce, 999 & 925 Purity'}
                    </p>

                    {silverData && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 min-[350px]:px-4 min-[350px]:py-2 rounded-lg min-[350px]:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] min-[350px]:text-xs font-bold">
                            <div className="h-1.5 w-1.5 min-[350px]:h-2 min-[350px]:w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <Clock className="h-3 w-3" />
                            <span>
                                {locale === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
                                {new Date(silverData.created_at).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div>
                    </div>
                ) : (
                    <>
                        {/* Detailed Silver Table */}
                        <div className="mb-16">
                            <SilverTable data={silverData} />
                        </div>

                        {/* Silver Calculator */}
                        <div className="mb-16">
                            <SilverCalculator prices={{
                                silver_999: silverData?.prices?.silver_999_sell ? { buy: silverData.prices.silver_999_buy || 0, sell: silverData.prices.silver_999_sell } : undefined,
                                silver_925: silverData?.prices?.silver_925_sell ? { buy: silverData.prices.silver_925_buy || 0, sell: silverData.prices.silver_925_sell } : undefined,
                                silver_900: silverData?.prices?.silver_900_sell ? { buy: silverData.prices.silver_900_buy || 0, sell: silverData.prices.silver_900_sell } : undefined,
                                silver_800: silverData?.prices?.silver_800_sell ? { buy: silverData.prices.silver_800_buy || 0, sell: silverData.prices.silver_800_sell } : undefined,
                            }} />
                        </div>

                        {/* Statistics Section */}
                        {stats && (
                            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[1.5rem] min-[350px]:rounded-[2rem] border border-slate-200/50 dark:border-white/5 p-5 min-[350px]:p-8">
                                <h2 className="text-xl min-[350px]:text-2xl font-heavy text-slate-900 dark:text-white mb-6">
                                    {locale === 'ar' ? 'إحصائيات آخر 7 أيام' : '7-Day Statistics'}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <StatBlock
                                        title={locale === 'ar' ? 'سعر الجرام' : 'Gram Price'}
                                        current={stats.gram_price.current}
                                        min={stats.gram_price.min}
                                        max={stats.gram_price.max}
                                        avg={stats.gram_price.avg}
                                        locale={locale}
                                    />
                                    <StatBlock
                                        title={locale === 'ar' ? 'سعر الأونصة' : 'Ounce Price'}
                                        current={stats.ounce_price.current}
                                        min={stats.ounce_price.min}
                                        max={stats.ounce_price.max}
                                        avg={stats.ounce_price.avg}
                                        locale={locale}
                                    />
                                </div>


                            </div>
                        )}

                        <div className="mt-16">
                            <QASection pageKey="silver" />
                        </div>
                    </>
                )}
            </main>

            <style jsx global>{`
                .text-gradient-silver {
                    background: linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>
        </div>
    );
}

function PriceCard({ title, value, change, currency, icon, locale }: any) {
    const formatPrice = (val: number | null) => {
        if (!val) return "---";
        return new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-slate-200/50 dark:border-white/5 p-6 shadow-xl hover:shadow-2xl transition-all"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    {icon}
                </div>
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {title}
                </h3>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-heavy text-slate-900 dark:text-white tabular-nums tracking-tighter">
                    {formatPrice(value)}
                </span>
                <span className="text-xs font-bold text-slate-400">ج.م</span>
            </div>

            {change !== null && change !== undefined && (
                <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black",
                    change >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                )}>
                    {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                </div>
            )}
        </motion.div>
    );
}

function BuySellCard({ title, value, type, locale }: any) {
    const formatPrice = (val: number | null) => {
        if (!val) return "---";
        return new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "p-8 rounded-[2rem] border-2",
                type === 'buy'
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-blue-500/5 border-blue-500/20"
            )}
        >
            <h3 className={cn(
                "text-sm font-black uppercase tracking-widest mb-4",
                type === 'buy' ? "text-emerald-600" : "text-blue-600"
            )}>
                {title}
            </h3>
            <div className="text-4xl font-heavy text-slate-900 dark:text-white tabular-nums">
                {formatPrice(value)} <span className="text-lg text-slate-400">ج.م</span>
            </div>
        </motion.div>
    );
}

function StatBlock({ title, current, min, max, avg, locale }: any) {
    const formatPrice = (val: number | null) => {
        if (!val) return "---";
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    };

    return (
        <div>
            <h3 className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase mb-4">{title}</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{locale === 'ar' ? 'الحالي' : 'Current'}</span>
                    <span className="text-lg font-heavy text-slate-900 dark:text-white tabular-nums">{formatPrice(current)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{locale === 'ar' ? 'الأدنى' : 'Min'}</span>
                    <span className="text-sm font-bold text-rose-600 tabular-nums">{formatPrice(min)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{locale === 'ar' ? 'الأعلى' : 'Max'}</span>
                    <span className="text-sm font-bold text-emerald-600 tabular-nums">{formatPrice(max)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{locale === 'ar' ? 'المتوسط' : 'Average'}</span>
                    <span className="text-sm font-bold text-blue-600 tabular-nums">{formatPrice(avg)}</span>
                </div>
            </div>
        </div>
    );
}
