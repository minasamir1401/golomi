"use client";

import { useState } from "react";
import { Calculator, ArrowRightLeft, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoldCalculatorProps {
    prices: Record<string, { buy: number; sell: number }>;
}

export default function GoldCalculator({ prices }: GoldCalculatorProps) {
    const [grams, setGrams] = useState<string>("10");
    const [karat, setKarat] = useState<string>("21");
    const [mode, setMode] = useState<"buy" | "sell">("buy");
    const [workmanshipValue, setWorkmanshipValue] = useState<string>("0");
    const [workmanshipType, setWorkmanshipType] = useState<"fixed" | "percent">("fixed");

    const karats = ["24", "21", "18", "14"];
    const basePrice = prices[karat]?.[mode] || 0;

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
                <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-gold-600" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">آلة حاسبة الذهب</h3>
                    <p className="text-xs text-slate-500">احسب سعر الذهب بالجرام</p>
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
                    شراء ذهب
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
                    بيع ذهب
                </button>
            </div>

            {/* Karat Selection */}
            <div className="mb-6">
                <label className="block text-xs font-black text-slate-500 mb-3">اختر العيار</label>
                <div className="grid grid-cols-4 gap-2">
                    {karats.map((k) => (
                        <button
                            key={k}
                            onClick={() => setKarat(k)}
                            className={cn(
                                "py-3 px-2 rounded-xl font-black text-sm transition-all",
                                karat === k
                                    ? "bg-gold-500 text-white shadow-lg shadow-gold-500/30"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            )}
                        >
                            عيار {k}
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
                            className="w-full px-4 py-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors"
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
                                    workmanshipType === "fixed" ? "bg-white dark:bg-slate-700 text-gold-600 shadow-sm" : "text-slate-500"
                                )}
                            >
                                جنيه
                            </button>
                            <button
                                onClick={() => setWorkmanshipType("percent")}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-black rounded-md transition-all",
                                    workmanshipType === "percent" ? "bg-white dark:bg-slate-700 text-gold-600 shadow-sm" : "text-slate-500"
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
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors"
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
                    <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                        <ArrowRightLeft className="h-5 w-5 text-gold-600" />
                    </div>
                </div>

                {/* Result */}
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                        المبلغ المطلوب
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
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">العيار:</span>
                        <span className="font-black text-slate-900 dark:text-white">عيار {karat}</span>
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
                        <span className="font-black text-gold-600">
                            {finalPricePerGram.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
