"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getGoldLiveCards } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { Coins, CircleDollarSign, Scale, TrendingUp, Info, Activity } from "lucide-react";

const iconMap: Record<string, any> = {
    "golden-pound": Coins,
    "golden-ounce": Scale,
    "bank-usd": Landmark,
    "sagha-usd": CircleDollarSign,
    "sagha-difference": Activity,
    "our-advice": Info,
    "silver-price": Coins,
};

import { Landmark } from "lucide-react";

export function LivePriceCards() {
    const [cards, setCards] = useState<any[]>([]);
    const { isRTL, locale, t } = useLanguage();

    useEffect(() => {
        const fetchCards = async () => {
            const data = await getGoldLiveCards();
            if (data && data.length > 0) {
                setCards(data);
            }
        };

        fetchCards();
        const interval = setInterval(fetchCards, 60000); // 1 minute
        return () => clearInterval(interval);
    }, []);

    if (cards.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 rounded-[32px] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {cards.map((card, index) => {
                const Icon = iconMap[card.id] || Coins;
                const isAdvice = card.id === "our-advice";

                return (
                    <motion.a
                        key={card.id || index}
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${card.label}: ${card.price} ${card.unit}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative flex items-center gap-4 p-4 rounded-[32px] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500"
                    >
                        <div className={cn(
                            "flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                            isAdvice ? "bg-blue-500/10 text-blue-500" : "bg-gold-500/10 text-gold-500"
                        )}>
                            <Icon className="w-7 h-7" aria-hidden="true" />
                        </div>

                        <div className={cn("flex flex-col min-w-0", isRTL ? "text-right" : "text-left")}>
                            <span className="text-xs font-bold text-slate-400 truncate uppercase tracking-wider">
                                {card.label}
                            </span>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                                <span className={cn(
                                    "text-lg font-black tracking-tight",
                                    isAdvice ? "text-blue-600 dark:text-blue-400" : "text-gold-600 dark:text-gold-400"
                                )}>
                                    {card.price}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 opacity-60">
                                    {card.unit}
                                </span>
                            </div>
                        </div>

                        <div className={cn(
                            "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity",
                            !isRTL && "right-auto left-4"
                        )}>
                            <TrendingUp className="w-3 h-3 text-gold-500" />
                        </div>
                    </motion.a>
                );
            })}
        </div>
    );
}
