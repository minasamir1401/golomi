"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

interface PriceCardProps {
    title: string;
    price: number;
    change: number;
    unit: string;
    icon: React.ElementType;
    lastUpdated: string;
    trend: "up" | "down";
    variant?: "gold" | "blue" | "default";
}

export function PriceCard({
    title,
    price,
    change,
    unit,
    icon: Icon,
    lastUpdated,
    trend,
    variant = "default"
}: PriceCardProps) {
    const { isRTL, locale } = useLanguage();
    const isUp = trend === "up";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "glass-card relative p-4 sm:p-7 group cursor-pointer overflow-hidden",
                variant === "gold" && "gold-shimmer"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className={`flex items-start justify-between mb-8 ${!isRTL && "flex-row-reverse"}`}>
                <div className={cn(
                    "relative h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12",
                    variant === "gold" ? "bg-gold-500/15 text-gold-500 dark:text-[#FFB800] dark:bg-[#FFB800]/10 shadow-[0_0_20px_rgba(255,215,0,0.15)]" :
                        variant === "blue" ? "bg-primary-500/15 text-primary-500 dark:text-[#2DD4BF] dark:bg-[#2DD4BF]/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]" :
                            "bg-slate-500/10 text-slate-500 dark:text-[#94A3B8] dark:bg-[#1E293B]"
                )}>
                    <Icon className="h-5 w-5 sm:h-7 sm:w-7 filter drop-shadow-sm" />
                </div>

                <div className={`flex flex-col items-end gap-1 ${!isRTL && "items-start"}`}>
                    <div className={cn(
                        "flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black",
                        isUp ? "bg-emerald-500/10 text-emerald-600 dark:text-[#2DD4BF] dark:bg-[#2DD4BF]/10" :
                            "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    )}>
                        {isUp ? <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                        <span>%{Math.abs(change).toFixed(2)}</span>
                    </div>
                    <button
                        aria-label={`More options for ${title}`}
                        className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                        <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>

            <div className={`space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
                <h3 className="text-slate-500 dark:text-[#94A3B8] text-[10px] sm:text-sm font-bold uppercase tracking-wider">{title}</h3>
                <div className={`flex items-baseline gap-1 sm:gap-2 ${!isRTL && "flex-row-reverse justify-end"}`}>
                    <span className="text-2xl sm:text-4xl font-black tracking-tight text-foreground bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
                        {typeof price === 'number'
                            ? new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(price)
                            : price}
                    </span>
                    <span className="text-[10px] sm:text-sm font-bold text-slate-400">{unit}</span>
                </div>
            </div>

            <div className={`mt-8 pt-5 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between ${!isRTL && "flex-row-reverse"}`}>
                <div className={`flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-[#94A3B8] ${!isRTL && "flex-row-reverse"}`}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{locale === 'ar' ? "تحديث" : "Updated"} {lastUpdated}</span>
                </div>
                <div className={cn(
                    "h-1.5 w-1.5 rounded-full animate-pulse",
                    isUp ? "bg-emerald-500 dark:bg-[#2DD4BF]" : "bg-rose-500"
                )} />
            </div>
        </motion.div >
    );
}
