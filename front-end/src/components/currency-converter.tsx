"use client";

import { useState, useEffect } from "react";
import { RefreshCcw, ArrowRightLeft, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { useMarketData } from "./market-data-provider";

export function CurrencyConverter() {
    const { t, locale, isRTL } = useLanguage();
    const { snapshot, loading } = useMarketData();
    const [amount, setAmount] = useState<string>("1000");
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EGP");
    const [result, setResult] = useState<number>(0);
    const [rates, setRates] = useState<{ [key: string]: number }>({
        USD: 50.00,
        EUR: 54.00,
        SAR: 13.00,
        EGP: 1,
    });
    const [lastUpdate, setLastUpdate] = useState<string>("");

    const currencies = [
        { code: "EGP", name: t.converter.egp, flag: "🇪🇬" },
        { code: "USD", name: t.converter.usd, flag: "🇺🇸" },
        { code: "EUR", name: t.converter.eur, flag: "🇪🇺" },
        { code: "SAR", name: t.converter.sar, flag: "🇸🇦" },
        { code: "AED", name: locale === 'ar' ? "درهم إماراتي" : "UAE Dirham", flag: "🇦🇪" },
        { code: "KWD", name: locale === 'ar' ? "دينار كويتي" : "Kuwaiti Dinar", flag: "🇰🇼" },
    ];

    useEffect(() => {
        if (snapshot?.currencies?.rates) {
            const newRates: { [key: string]: number } = { EGP: 1 };
            Object.entries(snapshot.currencies.rates).forEach(([code, prices]: [string, any]) => {
                newRates[code] = prices.sell;
            });
            setRates(newRates);

            if (snapshot.currencies.last_update) {
                const date = new Date(snapshot.currencies.last_update);
                setLastUpdate(date.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }));
            }
        }
    }, [snapshot, locale]);

    useEffect(() => {
        const numericAmount = parseFloat(amount) || 0;
        const fromRate = rates[from] || 1;
        const toRate = rates[to] || 1;
        setResult((numericAmount * fromRate) / toRate);
    }, [amount, from, to, rates]);

    const swap = () => {
        setFrom(to);
        setTo(from);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card relative overflow-hidden"
        >
            <div className="premium-header">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black">{t.converter.title}</h2>
                </div>
            </div>

            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                <div className="space-y-3">
                    <label htmlFor="amount-input" className="text-xs font-black text-slate-500 dark:text-[#94A3B8] uppercase tracking-widest px-1">{t.converter.amount_label}</label>
                    <div className="relative">
                        <input
                            id="amount-input"
                            type="text"
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow numbers and one decimal point
                                if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                    setAmount(val);
                                }
                            }}
                            className={cn(
                                "w-full h-16 sm:h-20 bg-slate-50 dark:bg-[#0B1121] border-2 border-slate-100 dark:border-[#1E293B] focus:border-primary/20 rounded-2xl sm:rounded-3xl px-4 sm:px-8 text-xl sm:text-3xl font-black focus:outline-none transition-all placeholder:text-slate-300 text-slate-900 dark:text-white text-center"
                            )}
                            dir="ltr"
                        />
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 px-2 sm:px-4 py-1 bg-slate-100 dark:bg-[#151D2E] rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-black text-slate-600 dark:text-[#FFFFFF]",
                            isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6"
                        )}>
                            {from}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="space-y-2">
                        <select
                            aria-label="From Currency"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full h-14 bg-slate-50 dark:bg-[#0B1121] border border-slate-200 dark:border-[#1E293B] rounded-2xl px-6 font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
                        >
                            {currencies.map((c) => (
                                <option key={c.code} value={c.code} className="bg-white dark:bg-[#0B1121] dark:text-white">
                                    {c.flag} {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={swap}
                        aria-label="Swap Currencies"
                        className="h-14 w-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 flex items-center justify-center hover:rotate-180 transition-transform duration-700 mx-auto"
                    >
                        <ArrowRightLeft className="h-6 w-6" />
                    </button>

                    <div className="space-y-2">
                        <select
                            aria-label="To Currency"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full h-14 bg-slate-50 dark:bg-[#0B1121] border border-slate-200 dark:border-[#1E293B] rounded-2xl px-6 font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
                        >
                            {currencies.map((c) => (
                                <option key={c.code} value={c.code} className="bg-white dark:bg-[#0B1121] dark:text-white">
                                    {c.flag} {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="relative mt-4 sm:mt-8 p-6 sm:p-10 bg-primary rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
                    <div className="relative z-10 text-center">
                        <p className="text-blue-100 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2 sm:mb-4">{t.converter.result_label}</p>
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                                {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(result)}
                            </span>
                            <span className="text-lg sm:text-xl font-bold text-blue-200">{to}</span>
                        </div>
                        <div className="mt-4 sm:mt-8 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-bold text-blue-200/60 tracking-widest border-t border-white/10 pt-4 sm:pt-6 uppercase italic">
                            <RefreshCcw className={cn("h-2.5 w-2.5 sm:h-3 sm:w-3", loading && "animate-spin")} />
                            {t.converter.update_notice} {lastUpdate && `(${lastUpdate})`}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
