"use client";

import { useState } from "react";
import { Calculator, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyCalculatorProps {
    buyPrice: number;
    sellPrice: number;
    currencyCode: string;
    currencyName: string;
}

export default function CurrencyCalculator({ buyPrice, sellPrice, currencyCode, currencyName }: CurrencyCalculatorProps) {
    const [amount, setAmount] = useState<string>("100");
    const [mode, setMode] = useState<"buy" | "sell">("buy");

    const price = mode === "buy" ? buyPrice : sellPrice;
    const total = parseFloat(amount || "0") * price;

    return (
        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-gold-600" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">آلة حاسبة</h3>
                    <p className="text-xs text-slate-500">{currencyName}</p>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setMode("buy")}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all",
                        mode === "buy"
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    )}
                >
                    شراء {currencyCode}
                </button>
                <button
                    onClick={() => setMode("sell")}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all",
                        mode === "sell"
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    )}
                >
                    بيع {currencyCode}
                </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                        كم {currencyCode} تريد {mode === "buy" ? "شراء" : "بيع"}؟
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors"
                            placeholder="0"
                            min="0"
                            step="any"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                            {currencyCode}
                        </span>
                    </div>
                </div>

                {/* Exchange Icon */}
                <div className="flex justify-center">
                    <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                        <ArrowRightLeft className="h-5 w-5 text-gold-600" />
                    </div>
                </div>

                {/* Result */}
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                        المبلغ المطلوب بالجنيه المصري
                    </label>
                    <div className="relative">
                        <div className="w-full px-4 py-4 bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gold-900/20 dark:to-amber-900/20 border-2 border-gold-200 dark:border-gold-800 rounded-xl">
                            <div className="text-3xl font-black text-gold-900 dark:text-gold-100 tabular-nums">
                                {total.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs font-black text-gold-600 dark:text-gold-400 mt-1">
                                جنيه مصري
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Info */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">سعر {mode === "buy" ? "الشراء" : "البيع"}:</span>
                        <span className="font-black text-slate-900 dark:text-white">
                            {price.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
