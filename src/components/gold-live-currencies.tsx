"use client";

import { useEffect, useState } from "react";
import { getGoldLiveCurrencies } from "@/lib/api";
import { BadgeDollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";

export function GoldLiveCurrencies() {
    const { t, isRTL } = useLanguage();
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getGoldLiveCurrencies();
            if (Array.isArray(data)) setCurrencies(data);
            setLoading(false);
        };
        fetch();
        const interval = setInterval(fetch, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;
    if (!currencies.length) return null;

    return (
        <div className="glass-card overflow-hidden border-gold-500/20 shadow-2xl shadow-gold-500/5 mt-10">
            <div className="premium-header flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center shadow-lg shadow-green-500/20">
                        <BadgeDollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">{t.currencies.official_market}</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.currencies.update_live}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className={`w-full ${isRTL ? "text-right" : "text-left"} border-collapse`}>
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900/30">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.currencies.table_currency}</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.currencies.table_buy}</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.currencies.table_sell}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {currencies.map((curr, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-green-500/5 transition-colors"
                            >
                                <td className="px-6 py-5 font-black text-foreground">
                                    {(t.currency_names as any)[curr.name] || curr.name}
                                </td>
                                <td className="px-6 py-5 text-lg font-black text-emerald-600">{curr.buy}</td>
                                <td className="px-6 py-5 text-lg font-black text-slate-500 dark:text-slate-400">{curr.sell}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
