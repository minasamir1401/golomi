"use client";

import { useEffect, useState } from "react";
import { getCurrencySources, updateCurrencySource, triggerCurrencyScrape, type CurrencySource } from "@/lib/api";
import { motion } from "framer-motion";
import { Globe, RefreshCw, Power, Save, Zap, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CurrencySourcesManagement() {
    const [sources, setSources] = useState<CurrencySource[]>([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);
    const [scrapeResult, setScrapeResult] = useState<any>(null);

    useEffect(() => {
        loadSources();
    }, []);

    const loadSources = async () => {
        setLoading(true);
        const data = await getCurrencySources();
        setSources(data);
        setLoading(false);
    };

    const toggleSource = async (sourceName: string, currentState: boolean) => {
        const result = await updateCurrencySource(sourceName, !currentState);
        if (result) {
            setSources(prev => prev.map(s =>
                s.source_name === sourceName ? { ...s, is_enabled: !currentState } : s
            ));
        }
    };

    const handleScrape = async () => {
        setScraping(true);
        setScrapeResult(null);
        const result = await triggerCurrencyScrape();

        // Map the new response format {"status": "success", "count": X} 
        // to what the component expects { success: boolean, rates_saved: number }
        const mappedResult = {
            success: result.status === "success",
            rates_saved: result.count || 0,
            error: result.message || (result.status === "error" ? "Unexpected error" : null)
        };

        setScrapeResult(mappedResult);
        setScraping(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gold-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-blue-500" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        إدارة مصادر العملات
                    </h2>
                </div>
                <button
                    onClick={handleScrape}
                    disabled={scraping}
                    className={cn(
                        "px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all",
                        scraping
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                    )}
                >
                    <Zap className={cn("h-4 w-4", scraping && "animate-spin")} />
                    {scraping ? "جاري السحب..." : "تشغيل السحب الآن"}
                </button>
            </div>

            {scrapeResult && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "p-4 rounded-xl border-2 flex items-center gap-3",
                        scrapeResult.success
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"
                            : "bg-red-50 dark:bg-red-900/20 border-red-500"
                    )}
                >
                    {scrapeResult.success ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div className="flex-1">
                        <p className="font-black text-sm">
                            {scrapeResult.success
                                ? `تم السحب بنجاح! ${scrapeResult.rates_saved} سعر تم حفظه`
                                : `فشل السحب: ${scrapeResult.error}`}
                        </p>
                        {scrapeResult.sources_used && (
                            <p className="text-xs text-slate-500 mt-1">
                                المصادر المستخدمة: {scrapeResult.sources_used.join(", ")}
                            </p>
                        )}
                    </div>
                </motion.div>
            )}

            <div className="grid gap-4">
                {sources.map((source, idx) => (
                    <motion.div
                        key={source.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                            "p-6 rounded-xl border-2 transition-all",
                            source.is_enabled
                                ? "bg-white dark:bg-slate-800 border-emerald-500/50"
                                : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-60"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                        {source.display_name}
                                    </h3>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-black",
                                        source.is_enabled
                                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                    )}>
                                        {source.is_enabled ? "مفعّل" : "معطّل"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span>الأولوية: {source.priority}</span>
                                    {source.last_updated && (
                                        <span>
                                            آخر تحديث: {new Date(source.last_updated).toLocaleString("ar-EG")}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => toggleSource(source.source_name, source.is_enabled)}
                                className={cn(
                                    "px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all",
                                    source.is_enabled
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                )}
                            >
                                <Power className="h-4 w-4" />
                                {source.is_enabled ? "تعطيل" : "تفعيل"}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200 font-bold">
                    💡 <strong>ملاحظة:</strong> عند تعطيل مصدر، لن يتم استخدامه في عمليات السحب التالية.
                    المصادر المفعلة سيتم استخدامها حسب الأولوية (الرقم الأصغر = أولوية أعلى).
                </p>
            </div>
        </div>
    );
}
