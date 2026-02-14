"use client";

import { useEffect, useState } from "react";
import { getSarfCurrencies } from "@/lib/api";
import { Globe, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";

export function CurrencyTable() {
    const { t, isRTL } = useLanguage();
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getSarfCurrencies();
            if (Array.isArray(data)) setCurrencies(data);
            setLoading(false);
        };
        fetch();
        const interval = setInterval(fetch, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="glass-card p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="h-10 w-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
            <span className="font-black text-sm uppercase tracking-widest">{t.currencies.loading}</span>
        </div>
    );

    return (
        <div className="glass-card overflow-hidden border-gold-500/20 shadow-2xl shadow-gold-500/5 transition-all duration-500">
            <div className="premium-header flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 dark:bg-[#1E293B] flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Globe className="h-5 w-5 text-blue-600 dark:text-[#2DD4BF]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gradient-gold">{t.currencies.parallel_market}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-black uppercase tracking-widest">{t.currencies.update_instant}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className={`w-full ${isRTL ? "text-right" : "text-left"} border-collapse`}>
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-[#0B1121] border-y border-slate-100 dark:border-[#1E293B]">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-900 dark:text-[#FFFFFF] uppercase tracking-widest">{t.currencies.table_currency}</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-900 dark:text-[#FFFFFF] uppercase tracking-widest">{t.currencies.table_code}</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-900 dark:text-[#FFFFFF] uppercase tracking-widest">{t.currencies.table_buy}</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-900 dark:text-[#FFFFFF] uppercase tracking-widest">{t.currencies.table_sell}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                        {currencies.map((curr, i) => (
                            <motion.tr
                                key={curr.code}
                                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-gold-500/5 dark:hover:bg-[#2DD4BF]/5 transition-colors"
                            >
                                <td className="px-6 py-5 font-black text-foreground dark:text-[#F8FAFC]">
                                    {(t.currency_names as any)[curr.name] || curr.name}
                                </td>
                                <td className="px-6 py-5 font-bold text-slate-400 dark:text-[#94A3B8]">{curr.code}</td>
                                <td className="px-6 py-5 text-lg font-black text-emerald-600 dark:text-[#2DD4BF]">{curr.buy}</td>
                                <td className="px-6 py-5 text-lg font-black text-slate-500 dark:text-[#F8FAFC]/70">{curr.sell}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="premium-footer flex items-center justify-center gap-4 py-4 bg-slate-50/50 dark:bg-[#0B1121] border-t border-slate-100 dark:border-[#1E293B] text-[10px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase tracking-widest">
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="dark:text-[#FFFFFF]">{t.currencies.auto_update}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="dark:text-[#FFFFFF]">{t.currencies.source}: {t.currencies.update_live}</span>
            </div>
        </div>
    );
}
