"use client";

import { useEffect, useState } from "react";
import { getPriceHistory } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

export function HistoricalPriceChart() {
    const [data, setData] = useState<any[]>([]);
    const [range, setRange] = useState(7); // default 7 days
    const [loading, setLoading] = useState(true);
    const { t, isRTL, locale } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const raw = await getPriceHistory(range);
            if (raw && Array.isArray(raw)) {
                // Reverse because backend returns newest first, chart needs oldest first
                const formatted = [...raw].reverse().map((snap: any) => {
                    return {
                        time: range === 1
                            ? snap.time
                            : snap.date,
                        fullDate: `${snap.date} ${snap.time}`,
                        price: Number(snap.sell)
                    };
                });
                setData(formatted);
            }
            setLoading(false);
        };
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [range, locale]);

    return (
        <div className="glass-card p-8 bg-white dark:bg-[#151D2E] border-slate-200 dark:border-[#1E293B] mt-12 overflow-hidden relative shadow-sm dark:shadow-black/40">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 ${isRTL ? "text-right" : "text-left"}`}>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-[#FFB800] order-2">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="order-1">
                        <h3 className="text-xl font-black text-gradient-gold">{t.historical_chart.title}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-black uppercase tracking-widest">{t.historical_chart.subtitle}</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 dark:bg-[#0B1121] p-1 rounded-2xl border border-slate-200 dark:border-[#1E293B]">
                    {[
                        { l: t.historical_chart.ranges.today, v: 1 },
                        { l: t.historical_chart.ranges["7d"], v: 7 },
                        { l: t.historical_chart.ranges["30d"], v: 30 },
                        { l: t.historical_chart.ranges["1y"], v: 365 }
                    ].map((btn) => (
                        <button
                            key={btn.v}
                            onClick={() => setRange(btn.v)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                                range === btn.v
                                    ? "bg-white dark:bg-[#1E293B] text-gold-600 dark:text-[#FFB800] shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:text-[#94A3B8] dark:hover:text-[#FFFFFF]"
                            )}
                        >
                            {btn.l}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[350px] w-full">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                        <div className="h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest">{t.historical_chart.loading}</span>
                    </div>
                ) : data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                                minTickGap={30}
                                padding={{ left: 10, right: 10 }}
                                reversed={isRTL}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                                tickFormatter={(val) => Number(val).toLocaleString()}
                                orientation={isRTL ? "right" : "left"}
                                width={60}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="glass-card p-4 border-none shadow-2xl relative overflow-hidden min-w-[140px]">
                                                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
                                                <div className={`relative z-10 ${isRTL ? "text-right" : "text-left"}`}>
                                                    <p className="text-white text-[10px] font-black opacity-60 mb-1">{label}</p>
                                                    <p className="text-[#d4af37] text-lg font-black">
                                                        {payload[0].value?.toLocaleString()}
                                                        <span className="text-[10px] ml-1 text-white/50">{t.price_cards.unit}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#d4af37"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                isAnimationActive={data.length < 50} // Smoother updates for live data
                                animationDuration={1000}
                                dot={range !== 1 ? { r: 4, fill: "#d4af37", strokeWidth: 2, stroke: "#fff" } : false}
                                activeDot={{ r: 6, fill: "#d4af37", strokeWidth: 2, stroke: "#fff" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Filter className="h-8 w-8 opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest">{t.historical_chart.empty}</span>
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#0B1121] border border-slate-100 dark:border-[#1E293B] flex items-center justify-center gap-4 text-[10px] font-black text-slate-400 dark:text-[#94A3B8] uppercase tracking-widest">
                <Calendar className="h-3 w-3" />
                <span>{t.historical_chart.source_archive}</span>
            </div>
        </div>
    );
}
