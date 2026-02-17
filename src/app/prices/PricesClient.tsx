
"use client";

import { useEffect, useState } from "react";
import { getNormalizedGoldPrices, NormalizedGoldPrice } from "@/lib/api";
import { ArrowUp, ArrowDown, RefreshCcw, TrendingUp, Wallet, AlertOctagon } from "lucide-react";

export default function PricesClient() {
    const [prices, setPrices] = useState<NormalizedGoldPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchPrices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNormalizedGoldPrices();
            if (data && data.length > 0) {
                setPrices(data);
                const latest = data.reduce((prev, current) =>
                    (new Date(prev.timestamp ?? 0) > new Date(current.timestamp ?? 0) ? prev : current)
                );

                // Fallback for timezone if locale fails
                try {
                    setLastUpdated(new Date(latest.timestamp).toLocaleTimeString("ar-EG"));
                } catch (e) {
                    setLastUpdated(new Date(latest.timestamp).toLocaleTimeString());
                }
            } else {
                setError("لم يتم العثور على بيانات (No Data Found).");
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError(err.message || "حدث خطأ أثناء الاتصال بالخادم.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 60000); // Auto refresh every minute
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <AlertOctagon className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">عفواً، حدث خطأ</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button
                    onClick={fetchPrices}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm font-cairo">
                        أسعار الذهب اليوم
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-cairo">
                        تحديث لحظي لأسعار الذهب في السوق المصري
                    </p>
                    {lastUpdated && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
                            <RefreshCcw className="w-4 h-4 text-primary-500 animate-spin-slow" />
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                آخر تحديث: {lastUpdated}
                            </span>
                        </div>
                    )}
                </div>

                {/* Prices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="glass-card p-6 h-40 flex flex-col justify-center animate-pulse"
                            >
                                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4 mx-auto"></div>
                                <div className="h-8 w-32 bg-slate-300 dark:bg-slate-600 rounded mx-auto"></div>
                            </div>
                        ))
                        : prices.map((price) => (
                            <div
                                key={price.id} // or price.karat as key if unique
                                className="glass-card relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp className="w-24 h-24 text-yellow-500" />
                                </div>

                                <div className="p-6 text-center z-10 relative">
                                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-2">
                                        عيار {price.karat}
                                    </div>

                                    <div className="flex flex-col gap-4 mt-4">
                                        {/* Sell Price */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-slate-400 dark:text-slate-500 mb-1">بيع</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-slate-800 dark:text-white font-cairo">
                                                    {price.sell_price.toLocaleString("en-US")}
                                                </span>
                                                <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded">
                                                    {price.currency}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>

                                        {/* Buy Price */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-slate-400 dark:text-slate-500 mb-1">شراء</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-slate-600 dark:text-slate-300 font-cairo">
                                                    {price.buy_price.toLocaleString("en-US")}
                                                </span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    {price.currency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Info Section */}
                <div className="mt-12 p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-cairo">
                                معلومات عن التسعير
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-cairo">
                                الأسعار المعروضة يتم تحديثها بشكل لحظي من مصادر السوق الرسمية. الأسعار تشمل سعر الذهب الخام وتختلف المصنعية من تاجر لآخر.
                                جميع البيانات تخضع للمراجعة الدورية لضمان الدقة.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
