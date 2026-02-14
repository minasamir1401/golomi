"use client";

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Funnel, Calendar } from 'lucide-react';
import { getGoldHistoryRange } from '@/lib/api';
import { useLanguage } from './language-provider';
import { cn } from '@/lib/utils';

export function GoldAnalysisChart() {
    const [days, setDays] = useState(7);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, locale } = useLanguage();

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            const res = await getGoldHistoryRange("21", days);
            // Recharts expects array of objects with name/value
            const formatted = res.chart_labels.map((label: string, i: number) => ({
                name: label,
                price: res.chart_data[i]
            }));
            setData(formatted);
            setLoading(false);
        };
        fetchChartData();
    }, [days]);

    const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

    return (
        <div className="glass-card p-8 bg-white dark:bg-[#151D2E] border-slate-200 dark:border-[#1E293B] mt-12 overflow-hidden relative shadow-sm dark:shadow-black/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 text-right">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-[#FFB800] order-2">
                        <TrendingUp className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="order-1">
                        <h3 className="text-xl font-black text-gradient-gold">{t.historical_chart.title}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-black uppercase tracking-widest">{t.historical_chart.subtitle}</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 dark:bg-[#0B1121] p-1 rounded-2xl border border-slate-200 dark:border-[#1E293B]">
                    {[
                        { label: t.historical_chart.ranges.today, val: 1 },
                        { label: t.historical_chart.ranges["7d"], val: 7 },
                        { label: t.historical_chart.ranges["30d"], val: 30 },
                        { label: t.historical_chart.ranges["1y"], val: 365 }
                    ].map((btn) => (
                        <button
                            key={btn.val}
                            onClick={() => setDays(btn.val)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                                days === btn.val
                                    ? "bg-white dark:bg-[#1E293B] text-gold-600 dark:text-[#FFB800] shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:text-[#94A3B8] dark:hover:text-[#FFFFFF]"
                            )}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[350px] w-full">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
                    </div>
                ) : data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FFB800" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#FFB800" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1E293B" : "#f1f5f9"} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 900, fill: isDarkMode ? "#94A3B8" : "#64748b" }}
                            />
                            <YAxis
                                hide
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#0B1121' : '#ffffff',
                                    borderColor: '#FFB800',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#FFB800"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Funnel className="h-8 w-8 opacity-20" aria-hidden="true" />
                        <span className="text-xs font-black uppercase tracking-widest">{t.historical_chart.empty}</span>
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#0B1121] border border-slate-100 dark:border-[#1E293B] flex items-center justify-center gap-4 text-[10px] font-black text-slate-400 dark:text-[#94A3B8] uppercase tracking-widest">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>{t.historical_chart.source_archive}</span>
            </div>
        </div>
    );
}
