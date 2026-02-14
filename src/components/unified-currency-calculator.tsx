"use client";

import { useState, useMemo } from "react";
import { Calculator, ArrowLeftRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedCurrencyCalculatorProps {
    availablePairs: Array<{ pair: string; count: number }>;
    dbInfo: any;
    currencyNames: Record<string, string>;
    banks?: any[];
}

export default function UnifiedCurrencyCalculator({ availablePairs, dbInfo, currencyNames, banks = [] }: UnifiedCurrencyCalculatorProps) {
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EGP");
    const [amount, setAmount] = useState<string>("100");
    const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");
    const [selectedBankName, setSelectedBankName] = useState<string>("all");

    // Extract unique currencies
    const currencies = useMemo(() => {
        const set = new Set<string>();
        set.add("EGP");
        availablePairs.forEach(p => {
            const code = p.pair.split("/")[0];
            set.add(code);
        });
        return Array.from(set).sort((a, b) => {
            if (a === "EGP") return -1;
            if (b === "EGP") return 1;
            const nameA = currencyNames[a] || a;
            const nameB = currencyNames[b] || b;
            return nameA.localeCompare(nameB, 'ar');
        });
    }, [availablePairs, currencyNames]);

    const getRate = (code: string) => {
        if (code === "EGP") return { bankBuy: 1, bankSell: 1 };

        let relevantRates = dbInfo?.data?.filter((r: any) =>
            r.from_currency === code && r.to_currency === "EGP"
        ) || [];

        if (selectedBankName !== "all" && relevantRates.length > 0) {
            relevantRates = relevantRates.filter((r: any) => r.bank_name === selectedBankName);
        }

        if (relevantRates.length === 0) return { bankBuy: 0, bankSell: 0 };

        // Average for "All Banks", otherwise specific bank rate
        const avgBuy = relevantRates.reduce((acc: number, r: any) => acc + (r.buy_price || 0), 0) / relevantRates.length;
        const avgSell = relevantRates.reduce((acc: number, r: any) => acc + (r.sell_price || 0), 0) / relevantRates.length;

        return {
            bankBuy: avgBuy,
            bankSell: avgSell
        };
    };

    const calculateResult = () => {
        const val = parseFloat(amount) || 0;
        if (val === 0) return 0;

        let egpVal = 0;
        if (fromCurrency === "EGP") {
            egpVal = val;
        } else {
            const r = getRate(fromCurrency);
            const rate = transactionType === "buy" ? r.bankSell : r.bankBuy;
            egpVal = val * (rate || 0);
        }

        if (toCurrency === "EGP") {
            return egpVal;
        } else {
            const r = getRate(toCurrency);
            const rate = transactionType === "buy" ? r.bankSell : r.bankBuy;
            if (!rate || rate === 0) return 0;
            return egpVal / rate;
        }
    };

    const result = calculateResult();

    return (
        <div className="bg-white dark:bg-[#151D2E] rounded-[2.5rem] p-6 border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-black/40">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-gold-600 dark:text-gold-500" />
                </div>
                <div>
                    <h3 className="text-lg font-heavy text-slate-900 dark:text-white leading-none mb-1">محول العملات</h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">حاسبة أسعار البيع والشراء</p>
                </div>
            </div>

            <div className="space-y-5">
                {/* Transaction Type Toggle */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-[#0B1121] rounded-2xl">
                    <button
                        onClick={() => setTransactionType("buy")}
                        className={cn(
                            "py-3 rounded-xl text-sm font-heavy transition-all duration-300 flex items-center justify-center gap-2",
                            transactionType === "buy"
                                ? "bg-white dark:bg-[#1E293B] text-emerald-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        )}
                    >
                        <span>سعر الشراء</span>
                        <span className="text-[10px] opacity-60">(من البنك)</span>
                    </button>
                    <button
                        onClick={() => setTransactionType("sell")}
                        className={cn(
                            "py-3 rounded-xl text-sm font-heavy transition-all duration-300 flex items-center justify-center gap-2",
                            transactionType === "sell"
                                ? "bg-white dark:bg-[#1E293B] text-red-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        )}
                    >
                        <span>سعر البيع</span>
                        <span className="text-[10px] opacity-60">(للبنك)</span>
                    </button>
                </div>

                {/* Bank Selection */}
                <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">اختر البنك</label>
                    <div className="relative">
                        <select
                            value={selectedBankName}
                            onChange={(e) => setSelectedBankName(e.target.value)}
                            className="w-full h-14 pl-10 pr-4 bg-slate-50 dark:bg-[#0B1121] border-2 border-slate-100 dark:border-[#1E293B] rounded-2xl text-sm font-heavy text-slate-900 dark:text-white appearance-none cursor-pointer focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all outline-none"
                        >
                            <option value="all">كل البنوك (متوسط السوق)</option>
                            {banks.map(bank => (
                                <option key={bank.id || bank.name} value={bank.name}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-hover:text-gold-500 transition-colors" />
                    </div>
                </div>

                {/* FROM Currency */}
                <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">من عملة</label>
                    <div className="relative">
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className="w-full h-14 pl-10 pr-4 bg-slate-50 dark:bg-[#0B1121] border-2 border-slate-100 dark:border-[#1E293B] rounded-2xl text-sm font-heavy text-slate-900 dark:text-white appearance-none cursor-pointer focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all outline-none"
                        >
                            {currencies.map(code => (
                                <option key={`from-${code}`} value={code}>
                                    {currencyNames[code] || code} ({code})
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-hover:text-gold-500 transition-colors" />
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-2 relative z-10">
                    <button
                        onClick={() => {
                            const temp = fromCurrency;
                            setFromCurrency(toCurrency);
                            setToCurrency(temp);
                        }}
                        className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-[#151D2E] flex items-center justify-center text-slate-400 hover:text-gold-500 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <ArrowLeftRight className="h-4 w-4 rotate-90" />
                    </button>
                </div>

                {/* TO Currency */}
                <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">إلى عملة</label>
                    <div className="relative">
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            className="w-full h-14 pl-10 pr-4 bg-slate-50 dark:bg-[#0B1121] border-2 border-slate-100 dark:border-[#1E293B] rounded-2xl text-sm font-heavy text-slate-900 dark:text-white appearance-none cursor-pointer focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all outline-none"
                        >
                            {currencies.map(code => (
                                <option key={`to-${code}`} value={code}>
                                    {currencyNames[code] || code} ({code})
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-hover:text-gold-500 transition-colors" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="relative">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">
                        المبلغ ({fromCurrency})
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full h-14 px-4 bg-slate-50 dark:bg-[#0B1121] border-2 border-slate-100 dark:border-[#1E293B] rounded-2xl text-xl font-heavy text-slate-900 dark:text-white focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all outline-none"
                        placeholder="0.00"
                    />
                </div>

                {/* Result Area */}
                <div className={cn(
                    "relative overflow-hidden rounded-2xl border-2 transition-colors duration-300",
                    transactionType === "buy"
                        ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-500/20"
                        : "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-500/20"
                )}>
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                القيمة المقدرة ({transactionType === 'buy' ? 'سعر الشراء' : 'سعر البيع'})
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className={cn(
                                    "text-2xl sm:text-3xl font-black tracking-tight",
                                    transactionType === "buy" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                                )}>
                                    {result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{toCurrency}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
