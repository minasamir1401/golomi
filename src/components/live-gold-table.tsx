"use client";

import { motion } from "framer-motion";
import { Coins, TrendingUp, Clock, ArrowRightLeft, Zap, Landmark, BarChart3, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getGoldPricesMap } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { useMarketData } from "./market-data-provider";

export function LiveGoldTable() {
    const { snapshot, loading, refresh } = useMarketData();
    const { t, locale, isRTL } = useLanguage();

    // Transform snapshot data to match the table's expected format
    const data = snapshot ? {
        prices: getGoldPricesMap(snapshot.gold_egypt?.prices),
        timestamp: snapshot.gold_egypt?.last_update,
        source: snapshot.gold_egypt?.source
    } : null;

    if (loading && !snapshot) return (
        <div className="glass-card overflow-hidden border-gold-500/20 animate-pulse">
            <div className="premium-header h-20 bg-slate-50/50 dark:bg-[#0B1121]" />
            <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center h-12 bg-slate-100 dark:bg-[#1E293B] rounded-xl" />
                ))}
            </div>
        </div>
    );

    if (!snapshot) return (
        <div className="glass-card p-8 border-red-500/20 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">فشل تحميل الأسعار</h3>
            <p className="text-sm text-slate-500 mt-2">يرجى المحاولة مرة أخرى لاحقاً</p>
            <button
                onClick={() => { refresh(); }}
                className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors"
            >
                إعادة المحاولة
            </button>
        </div>
    );

    // Helper function to extract karat number from name
    const getKaratValue = (name: string): number => {
        if (name.includes('24')) return 24;
        if (name.includes('21')) return 21;
        if (name.includes('18')) return 18;
        if (name.includes('14')) return 14;
        if (name.includes('12')) return 12;
        if (name.includes('9')) return 9;
        return 0; // For pounds/ounces
    };

    // Sort keys based on numeric value or special types
    const sortedKeys = data?.prices ? Object.keys(data.prices).sort((a, b) => {
        // Handle special items first
        if (a.includes('جنيه') || a.includes('pound')) return 1; // Pounds at bottom
        if (b.includes('جنيه') || b.includes('pound')) return -1;

        if (a.includes('أونصة') || a.includes('ounce')) return 1; // Ounces at very bottom
        if (b.includes('أونصة') || b.includes('ounce')) return -1;

        // Sort karats descending
        const valA = getKaratValue(a);
        const valB = getKaratValue(b);
        return valB - valA;
    }) : [];

    // Filter duplicates (English vs Arabic keys in new API structure)
    // We prefer Arabic keys for the UI if locale is Arabic, else English
    // Also filter out invalid/uncommon karats
    const displayKeys = sortedKeys.filter(key => {
        // Only show Arabic keys to avoid duplication since getGoldPricesMap adds English ones
        if (!key.includes('عيار') && !key.includes('جنيه') && !key.includes('أونصة')) {
            return false;
        }

        // Only show standard karats: 24, 21, 18, 14, 12
        // Plus gold pound (جنيه) and ounce (أونصة)
        const standardKarats = ['24', '21', '18', '14', '12'];

        if (key.includes('جنيه') || key.includes('أونصة')) {
            return true; // Always show gold pound and ounce
        }

        // Check if this is a standard karat
        return standardKarats.some(karat => key.includes(karat));
    });

    const formatPrice = (val: number | undefined) => {
        if (val === undefined || val === null) return "---";
        return new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(val);
    };

    return (
        <div className="glass-card overflow-hidden border-gold-500/20 shadow-2xl shadow-gold-500/5 transition-all duration-500">
            <div className="premium-header flex flex-col sm:flex-row items-center justify-between gap-4 p-4 min-[350px]:p-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center shadow-lg dark:shadow-black/20">
                        <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-[#161E54] dark:text-[#FFB800]" />
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-gradient-gold">
                            {t?.table?.title || "أسعار الذهب اليوم"}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
                            {t?.table?.subtitle || "تحديث لحظي من السوق المحلي"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2DD4BF]/20">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-[#2DD4BF]">
                        مباشر
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className={cn("w-full border-collapse", isRTL ? "text-right" : "text-left")}>
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-[#0B1121] whitespace-nowrap border-y border-slate-100 dark:border-[#1E293B]">
                            <th className="px-2 min-[400px]:px-4 sm:px-6 py-4 text-[9px] sm:text-xs font-black text-slate-500 dark:text-white uppercase tracking-widest text-right">
                                {t?.table?.carat || "العيار"}
                            </th>
                            <th className="px-2 min-[400px]:px-4 sm:px-6 py-4 text-[9px] sm:text-xs font-black text-slate-500 dark:text-white uppercase tracking-widest text-center">
                                {t?.table?.buy || "شراء"}
                            </th>
                            <th className="px-2 min-[400px]:px-4 sm:px-6 py-4 text-[9px] sm:text-xs font-black text-slate-500 dark:text-white uppercase tracking-widest text-center">
                                {t?.table?.sell || "بيع"}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                        {displayKeys.map((key, i) => {
                            const item = (data?.prices as any)?.[key];
                            // Skip if no sell price
                            if (!item || !item.sell) return null;

                            return (
                                <motion.tr
                                    key={key}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group hover:bg-slate-50 dark:hover:bg-[#151D2E] transition-all cursor-pointer"
                                >
                                    <td className="px-2 min-[400px]:px-4 sm:px-6 py-4">
                                        <div className="flex items-center gap-1.5 min-[350px]:gap-3">
                                            <div className="h-6 w-6 min-[350px]:h-8 min-[350px]:w-8 rounded-lg bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center group-hover:bg-gold-500/20 dark:group-hover:bg-[#FFB800]/20 transition-colors shrink-0">
                                                {key.includes('جنيه') ? <Landmark className="h-3 w-3 min-[350px]:h-4 min-[350px]:w-4 text-gold-600 dark:text-[#FFB800]" /> :
                                                    key.includes('أونصة') ? <Zap className="h-3 w-3 min-[350px]:h-4 min-[350px]:w-4 text-gold-600 dark:text-[#FFB800]" /> :
                                                        <span className="text-[10px] min-[350px]:text-xs font-black text-gold-600 dark:text-[#FFB800]">{getKaratValue(key)}</span>}
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white text-xs min-[350px]:text-base whitespace-nowrap lg:whitespace-normal">
                                                {key}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 min-[400px]:px-4 sm:px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs min-[350px]:text-lg font-black text-emerald-600 dark:text-[#2DD4BF] tabular-nums tracking-tight">
                                                {formatPrice(item.buy)}
                                            </span>
                                            <span className="text-[8px] min-[350px]:text-[9px] text-slate-400 dark:text-[#94A3B8] font-medium">EGP</span>
                                        </div>
                                    </td>
                                    <td className="px-2 min-[400px]:px-4 sm:px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs min-[350px]:text-lg font-black text-peach-gold tabular-nums tracking-tight">
                                                {formatPrice(item.sell)}
                                            </span>
                                            <span className="text-[8px] min-[350px]:text-[9px] text-slate-400 dark:text-[#94A3B8] font-medium">EGP</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="premium-footer flex flex-col sm:flex-row items-center justify-center gap-4 py-6 bg-slate-50/50 dark:bg-[#151D2E] border-t border-slate-100 dark:border-[#1E293B] text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-[#FFFFFF]">
                    <Clock className="h-3 w-3" />
                    {/* Show time of first item as reference */}
                    <span dir="ltr">{displayKeys[0] && (data?.prices as any)?.[displayKeys[0]]?.timestamp ? new Date((data?.prices as any)[displayKeys[0]].timestamp).toLocaleTimeString("ar-EG") : "--:--"}</span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-[#1E293B]">•</span>
                <span className="text-slate-400 dark:text-[#FFFFFF]">الأسعار لا تشمل المصنعية</span>
            </div>
        </div>
    );
}
