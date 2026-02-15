"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getGoldPrices, getSarfCurrencies } from "@/lib/api";

export function PriceTicker() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [goldData, currencyData] = await Promise.all([
                    getGoldPrices(),
                    getSarfCurrencies()
                ]);

                const formatted: any[] = [];

                if (goldData) {
                    const sortedKeys = Object.keys(goldData).sort();
                    sortedKeys.forEach((key) => {
                        const val = goldData[key];
                        let name = key;

                        if (key === "gold_pound") name = "جنيه ذهب";
                        else if (key === "gold_ounce") name = "أوقية ذهب";
                        else if (key === "silver_ounce") name = "أوقية فضة";
                        else if (key === "silver_gram_24") name = "فضة 999";
                        else if (key.startsWith("gold_21")) name = "ذهب عيار 21";
                        else if (key.startsWith("gold_18")) name = "ذهب عيار 18";
                        else if (key.startsWith("gold_24")) name = "ذهب عيار 24";
                        else if (key.includes("عيار")) { /* keep */ }
                        else return; // Skip others for ticker

                        const parse = (v: any) => {
                            if (typeof v === 'string') return parseFloat(v.replace(/,/g, ''));
                            return Number(v);
                        };

                        const buy = val.buy_price || val.buy;
                        const sell = val.sell_price || val.sell;

                        if (!buy && !sell) return;

                        const buyFormatted = (buy ? parse(buy) : 0).toLocaleString("ar-EG");
                        const sellFormatted = (sell ? parse(sell) : 0).toLocaleString("ar-EG");

                        formatted.push({
                            name,
                            price: `بيع: ${sellFormatted} / شراء: ${buyFormatted}`,
                            color: "text-gold-600 dark:text-gold-500"
                        });
                    });
                }

                // Process Currencies
                if (Array.isArray(currencyData) && currencyData.length > 0) {
                    currencyData.forEach((curr: any) => {
                        // Only show major currencies or filtered list
                        if (["USD", "EUR", "SAR", "KWD", "AED"].includes(curr.code)) {
                            formatted.push({
                                name: curr.name,
                                price: `بيع: ${curr.sell} / شراء: ${curr.buy}`,
                                color: "text-emerald-600 dark:text-emerald-400"
                            });
                        }
                    });
                } else if (currencyData && typeof currencyData === 'object') {
                    // Handle if currencyData is object (legacy or different format)
                    Object.values(currencyData).forEach((curr: any) => {
                        if (["USD", "EUR", "SAR"].includes(curr?.code)) {
                            formatted.push({
                                name: curr.name,
                                price: `بيع: ${curr.sell} / شراء: ${curr.buy}`,
                                color: "text-emerald-600 dark:text-emerald-400"
                            });
                        }
                    });
                }

                setItems(formatted);
            } catch (e) {
                console.error("Ticker fetch error:", e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // 1 minute refresh
        return () => clearInterval(interval);
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="w-full max-w-full bg-white dark:bg-[#020617] text-slate-900 dark:text-white overflow-hidden py-2 border-b border-slate-100 dark:border-white/5 whitespace-nowrap dir-ltr transition-colors duration-500">
            <motion.div
                animate={{ x: [0, -2000] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
                className="flex items-center gap-12 px-4 whitespace-nowrap"
            >
                {/* Duplicate the list to create seamless loop effect */}
                {[...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-xs font-bold">
                        <span className="text-slate-400">{item.name}</span>
                        <span className={item.color}>{item.price}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
