"use client";

import { useState } from "react";
import { Calculator, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SilverCalculatorProps {
    prices: {
        silver_999?: { buy: number; sell: number };
        silver_925?: { buy: number; sell: number };
        silver_900?: { buy: number; sell: number };
        silver_800?: { buy: number; sell: number };
    };
}

export default function SilverCalculator({ prices }: SilverCalculatorProps) {
    const [grams, setGrams] = useState<string>("100");
    const [purity, setPurity] = useState<string>("925");
    const [mode, setMode] = useState<"buy" | "sell">("buy");
    const [workmanshipValue, setWorkmanshipValue] = useState<string>("0");
    const [workmanshipType, setWorkmanshipType] = useState<"fixed" | "percent">("fixed");

    const purities = [
        { value: "999", label: "999" },
        { value: "925", label: "925" },
        { value: "900", label: "900" },
        { value: "800", label: "800" },
    ];

    const priceKey = `silver_${purity}` as keyof typeof prices;
    const basePrice = prices[priceKey]?.[mode] || 0;

    // Calculate workmanship per gram
    const workValue = parseFloat(workmanshipValue || "0");
    const workmanshipPerGram = workmanshipType === "fixed"
        ? workValue
        : (basePrice * workValue) / 100;

    const finalPricePerGram = basePrice + workmanshipPerGram;
    const total = parseFloat(grams || "0") * finalPricePerGram;

    return (
        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-slate-400/10 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">آلة حاسبة الفضة</h3>
                    <p className="text-xs text-slate-500">احسب سعر الفضة بالجرام</p>
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
                    شراء فضة
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
                    بيع فضة
                </button>
            </div>

            {/* Purity Selection */}
            <div className="mb-6">
                <label className="block text-xs font-black text-slate-500 mb-3">اختر العيار</label>
                <div className="grid grid-cols-4 gap-2">
                    {purities.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setPurity(p.value)}
                            className={cn(
                                "py-3 px-2 rounded-xl font-black text-sm transition-all",
                                purity === p.value
                                    ? "bg-slate-600 text-white shadow-lg shadow-slate-600/30"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grams Input */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                        كم جرام تريد {mode === "buy" ? "شراء" : "بيع"}؟
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={grams}
                            onChange={(e) => setGrams(e.target.value)}
                            className="w-full px-4 py-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 transition-colors"
                            placeholder="0"
                            min="0"
                            step="any"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                            جرام
                        </span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-black text-slate-500">
                            المصنعية (لكل جرام)
                        </label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                            <button
                                onClick={() => setWorkmanshipType("fixed")}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-black rounded-md transition-all",
                                    workmanshipType === "fixed" ? "bg-white dark:bg-slate-700 text-slate-600 shadow-sm" : "text-slate-500"
                                )}
                            >
                                جنيه
                            </button>
                            <button
                                onClick={() => setWorkmanshipType("percent")}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-black rounded-md transition-all",
                                    workmanshipType === "percent" ? "bg-white dark:bg-slate-700 text-slate-600 shadow-sm" : "text-slate-500"
                                )}
                            >
                                %
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={workmanshipValue}
                            onChange={(e) => setWorkmanshipValue(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 transition-colors"
                            placeholder="0"
                            min="0"
                            step="any"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                            {workmanshipType === "fixed" ? "ج.م" : "%"}
                        </span>
                    </div>
                </div>

                {/* Exchange Icon */}
                <div className="flex justify-center">
                    <div className="h-10 w-10 rounded-full bg-slate-400/10 flex items-center justify-center">
                        <ArrowRightLeft className="h-5 w-5 text-slate-600" />
                    </div>
                </div>

                {/* Result */}
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                        المبلغ المطلوب
                    </label>
                    <div className="relative">
                        <div className="w-full px-4 py-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-2 border-slate-300 dark:border-slate-700 rounded-xl">
                            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                                {total.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs font-black text-slate-600 dark:text-slate-400 mt-1">
                                جنيه مصري
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Info */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">العيار:</span>
                        <span className="font-black text-slate-900 dark:text-white">فضة {purity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">سعر الجرام الأساسي ({mode === "buy" ? "شراء" : "بيع"}):</span>
                        <span className="font-black text-slate-900 dark:text-white">
                            {basePrice.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">المصنعية المضافة:</span>
                        <span className="font-black text-emerald-600">
                            +{workmanshipPerGram.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 font-bold">السعر النهائي للجرام:</span>
                        <span className="font-black text-slate-600">
                            {finalPricePerGram.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
