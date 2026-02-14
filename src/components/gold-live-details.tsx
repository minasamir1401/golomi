"use client";

import { useEffect, useState } from "react";
import { getGoldLivePrices, getGoldLiveProducts } from "@/lib/api";
import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";

export function GoldLiveDetails() {
    const { t, isRTL, locale } = useLanguage();
    const [prices, setPrices] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, prod] = await Promise.all([getGoldLivePrices(), getGoldLiveProducts()]);
                if (Array.isArray(p)) setPrices(p);
                if (Array.isArray(prod)) setProducts(prod);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatCarat = (name: string) => {
        if (locale === 'en') return name.replace('عيار ', 'Carat ');
        return name;
    };

    if (loading && !prices.length && !products.length) {
        return (
            <div className="w-full py-12 text-center text-slate-400 font-bold animate-pulse">
                {t.gold_details.loading}
            </div>
        );
    }

    if (!prices.length && !products.length) return null;

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Live Prices */}
            {prices.length > 0 && (
                <div className="glass-card p-6 border-gold-500/20 shadow-lg shadow-gold-500/5">
                    <h3 className={`text-xl font-black mb-6 flex items-center gap-2 ${!isRTL && "flex-row-reverse justify-end"}`}>
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        {locale === 'ar' ? 'أسعار الذهب الآن' : 'Gold Prices Now'}
                    </h3>
                    <div className="overflow-x-auto">
                        <table className={`w-full ${isRTL ? "text-right" : "text-left"} border-collapse`}>
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-[#0B1121] border-b border-slate-100 dark:border-[#1E293B] whitespace-nowrap">
                                    <th className="p-2 sm:p-4 text-[10px] sm:text-xs font-black text-slate-400 dark:text-white uppercase tracking-widest">{t.gold_details.col_karat}</th>
                                    <th className="p-2 sm:p-4 text-[10px] sm:text-xs font-black text-emerald-500 dark:text-[#2DD4BF] uppercase tracking-widest">{t.gold_details.col_buy}</th>
                                    <th className="p-2 sm:p-4 text-[10px] sm:text-xs font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest">{t.gold_details.col_sell}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {prices.map((item, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-gold-500/5 transition-colors"
                                    >
                                        <td className="p-2 sm:p-4 font-black text-xs sm:text-base text-slate-900 dark:text-white">{formatCarat(item.name)}</td>
                                        <td className="p-2 sm:p-4 font-bold text-emerald-500 dark:text-[#2DD4BF] bg-emerald-500/5 rounded-lg text-xs sm:text-base whitespace-nowrap">
                                            {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(item.buy) || 0)}
                                        </td>
                                        <td className="p-2 sm:p-4 font-bold text-rose-500 dark:text-rose-400 bg-rose-500/5 rounded-lg text-xs sm:text-base whitespace-nowrap">
                                            {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(item.sell) || 0)}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Products */}
            {products.length > 0 && (
                <div className="glass-card p-6 border-gold-500/20 shadow-lg shadow-gold-500/5">
                    <h3 className={`text-xl font-black mb-6 ${isRTL ? "text-right" : "text-left"}`}>
                        {locale === 'ar' ? 'سبائك وجنيهات' : 'Bars & Coins'}
                    </h3>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table className={`w-full ${isRTL ? "text-right" : "text-left"} border-collapse`}>
                            <thead className="sticky top-0 bg-white dark:bg-[#0B1121] z-10 shadow-sm">
                                <tr className="bg-slate-50/50 dark:bg-[#0B1121] border-b border-slate-100 dark:border-[#1E293B]">
                                    <th className="p-4 text-xs font-black text-slate-400 dark:text-white uppercase tracking-widest">{t.gold_details.col_item}</th>
                                    <th className="p-4 text-xs font-black text-slate-400 dark:text-[#94A3B8] uppercase tracking-widest">{t.gold_details.col_weight}</th>
                                    <th className="p-4 text-xs font-black text-gold-500 dark:text-[#FFB800] uppercase tracking-widest">{t.gold_details.col_price}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {products.map((item, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="group hover:bg-gold-500/5 transition-colors"
                                    >
                                        <td className="p-2 sm:p-4 font-medium text-[10px] sm:text-sm text-slate-900 dark:text-white">{item.name}</td>
                                        <td className="p-2 sm:p-4 text-[10px] text-slate-500 dark:text-[#94A3B8] font-bold whitespace-nowrap">{item.weight}</td>
                                        <td className="p-2 sm:p-4 font-black text-gold-500 dark:text-[#FFB800] text-xs sm:text-base whitespace-nowrap">
                                            {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(item.price) || 0)}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
