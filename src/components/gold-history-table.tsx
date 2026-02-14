"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, TrendingUp, TrendingDown, Clock, Loader2 } from "lucide-react";
import { getGoldHistory } from "@/lib/api";
import { useLanguage } from "./language-provider";
import { cn } from "@/lib/utils";

const PERIODS = [
    { id: "7d", label: "7 أيام" },
    { id: "30d", label: "30 يوم" },
    { id: "1y", label: "سنة" }
];

const KARATS = [
    { id: "24", label: "عيار 24" },
    { id: "21", label: "عيار 21" },
    { id: "18", label: "عيار 18" }
];

export function GoldHistoryTable() {
    const [period, setPeriod] = useState("7d");
    const [karat, setKarat] = useState("21");
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { isRTL, locale } = useLanguage();

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const data = await getGoldHistory(karat, period);
                setHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setHistory([]);
            }
            setLoading(false);
        };
        fetchHistory();
    }, [karat, period]);

    const formatPrice = (val: number) => {
        return new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(val);
    };

    return (
        <div className="glass-card overflow-hidden border-gold-500/10 shadow-xl">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                            <History className="h-5 w-5 text-gold-600" />
                        </div>
                        <h3 className="text-xl font-black">سجل تغيرات الأسعار</h3>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex bg-slate-100 dark:bg-[#0B1121] p-1 rounded-xl border dark:border-[#1E293B]">
                        {KARATS.map((k) => (
                            <button
                                key={k.id}
                                onClick={() => setKarat(k.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                    karat === k.id
                                        ? "bg-white dark:bg-[#1E293B] shadow-sm text-gold-600 dark:text-[#FFB800]"
                                        : "text-slate-500 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#FFFFFF]"
                                )}
                            >
                                {k.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-slate-100 dark:bg-[#0B1121] p-1 rounded-xl border dark:border-[#1E293B]">
                        {PERIODS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                    period === p.id
                                        ? "bg-white dark:bg-[#1E293B] shadow-sm text-gold-600 dark:text-[#FFB800]"
                                        : "text-slate-500 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#FFFFFF]"
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-[#0B1121]/80 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
                    </div>
                )}

                <table className={cn("w-full", isRTL ? "text-right" : "text-left")}>
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-[#0B1121] text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#94A3B8] border-b border-slate-100 dark:border-[#1E293B]">
                            <th className="px-6 py-4">التاريخ</th>
                            <th className="px-6 py-4 text-center">سعر البيع</th>
                            <th className="px-6 py-4 text-center">سعر الشراء</th>
                            <th className="px-6 py-4 text-center">التغيير</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        <AnimatePresence mode="popLayout">
                            {history.map((row, i) => (
                                <motion.tr
                                    key={row.timestamp || row.date}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-all"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-slate-900 dark:text-white">{row.date}</span>
                                            <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-medium flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {row.timestamp ? new Date(row.timestamp).toLocaleTimeString() : '--'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-black text-peach-gold">{formatPrice(row.sell)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500 dark:text-[#94A3B8] text-sm">
                                        {formatPrice(row.buy)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.change !== 0 ? (
                                            <div className={cn(
                                                "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
                                                row.change > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                                            )}>
                                                {row.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                {Math.abs(row.change)} ({row.change_percent}%)
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-300">--</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {!loading && history.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-slate-400 font-bold">لا يوجد بيانات تاريخية متاحة لهذا العيار حالياً.</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-[#0B1121] text-center border-t border-slate-100 dark:border-[#1E293B]">
                <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-bold uppercase tracking-tight">
                    يتم استخراج البيانات من أرشيف قاعدة البيانات المحلي
                </p>
            </div>
        </div>
    );
}
