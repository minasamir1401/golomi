"use client";

import { useEffect, useState } from "react";
import { getGoldLiveHistory } from "@/lib/api";
import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";

export function GoldLiveHistory() {
    const { t, isRTL, locale } = useLanguage();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getGoldLiveHistory();
            if (Array.isArray(data)) setHistory(data);
            setLoading(false);
        };
        fetch();
        const interval = setInterval(fetch, 300000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !history.length) {
        return (
            <div className="w-full py-12 text-center text-slate-400 font-bold animate-pulse">
                {t.gold_history_table.loading}
            </div>
        );
    }

    if (!history.length) return null;

    return (
        <div className="overflow-hidden">
            <div className={`premium-header flex flex-col sm:flex-row items-center justify-between gap-6 ${isRTL ? "text-right" : "text-left"}`}>
                <div>
                    <h3 className="text-xl font-black text-gradient-gold">
                        {locale === 'ar' ? 'جدول العيارات بالأسعار خلال آخر 30 يوم' : 'Karat Prices Over Last 30 Days'}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-black uppercase tracking-widest">
                        {locale === 'ar' ? 'تطور الأسعار اليومي' : 'Daily Price Evolution'}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className={`w-full ${isRTL ? "text-right" : "text-left"} border-collapse text-sm`}>
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-[#0B1121] border-b border-slate-100 dark:border-[#1E293B]">
                            <th className="px-4 py-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs dark:bg-[#0B1121] dark:border-[#1E293B]">{t.gold_history_table.col_day}</th>
                            <th className="px-4 py-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs dark:bg-[#0B1121] dark:border-[#1E293B]">{t.gold_history_table.col_24k}</th>
                            <th className="px-4 py-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs dark:bg-[#0B1121] dark:border-[#1E293B]">{t.gold_history_table.col_22k}</th>
                            <th className="px-4 py-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs dark:bg-[#0B1121] dark:border-[#1E293B]">{t.gold_history_table.col_21k}</th>
                            <th className="px-4 py-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs dark:bg-[#0B1121] dark:border-[#1E293B]">{t.gold_history_table.col_18k}</th>
                            <th className="px-4 py-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs dark:bg-[#0B1121] dark:border-[#1E293B]">{t.gold_history_table.col_14k}</th>
                            <th className="px-4 py-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs dark:bg-[#0B1121] dark:border-[#1E293B]">{t.gold_history_table.col_ounce}</th>
                            <th className="px-4 py-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs dark:bg-[#0B1121] dark:border-[#1E293B]">{t.gold_history_table.col_pound}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                        {history.map((row, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02 }}
                                className="group hover:bg-gold-500/5 dark:hover:bg-[#151D2E] transition-colors"
                            >
                                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                                    {new Date(row.date).toLocaleDateString(locale === 'ar' ? "ar-EG" : "en-US", { month: 'short', day: 'numeric' })}
                                </td>
                                <td className="px-4 py-3 text-emerald-600 dark:text-[#2DD4BF] font-bold whitespace-nowrap">
                                    {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(row.karat_24) || 0)}
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-white font-bold whitespace-nowrap">
                                    {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(row.karat_22) || 0)}
                                </td>
                                <td className="px-4 py-3 text-gold-600 dark:text-[#FFB800] font-black whitespace-nowrap">
                                    {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(row.karat_21) || 0)}
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-white font-bold whitespace-nowrap">
                                    {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(row.karat_18) || 0)}
                                </td>
                                <td className="px-4 py-3 text-slate-400 dark:text-[#94A3B8] font-bold whitespace-nowrap">
                                    {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(row.karat_14) || 0)}
                                </td>
                                <td className="px-4 py-3 text-red-500 dark:text-red-400 font-bold whitespace-nowrap">
                                    {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(row.ounce) || 0)}
                                </td>
                                <td className="px-4 py-3 text-purple-600 font-bold whitespace-nowrap">
                                    {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(row.pound) || 0)}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
