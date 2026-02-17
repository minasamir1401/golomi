"use client";

import { Navbar } from "@/components/navbar";
import { Calculator, Coins, Landmark, Scale, ShieldCheck, Printer, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getGoldPrices } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import AdBanner from "@/components/ads/ad-banner";

export default function CalculatorPage() {
    const { t, locale, isRTL } = useLanguage();
    const [prices, setPrices] = useState<any>(null);
    const [sourceInfo, setSourceInfo] = useState<{ source: string, timestamp: string } | null>(null);
    const [selectedKarat, setSelectedKarat] = useState("21");
    const [weight, setWeight] = useState<number>(0);
    const [workmanship, setWorkmanship] = useState<number>(0);
    const [workmanshipType, setWorkmanshipType] = useState<"fixed" | "percent">("fixed");
    const [tax, setTax] = useState<number>(0);
    const [taxType, setTaxType] = useState<"fixed" | "percent">("fixed");
    const [total, setTotal] = useState<number>(0);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        }).format(num);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getGoldPrices();
            if (data && data.prices) {
                setPrices(data.prices);
                setSourceInfo({ source: data.source, timestamp: data.timestamp });
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!prices) return;

        const priceKey = locale === 'ar' ? `عيار ${selectedKarat}` : `Carat ${selectedKarat}`;
        const priceItem = prices[priceKey] || prices[`عيار ${selectedKarat}`] || prices[selectedKarat];
        const pricePerGram = parseFloat(priceItem?.sell || "0");
        const baseValue = weight * pricePerGram;

        const totalWorkmanship = workmanshipType === "fixed"
            ? weight * workmanship
            : baseValue * (workmanship / 100);

        const totalTax = taxType === "fixed"
            ? weight * tax
            : (baseValue + totalWorkmanship) * (tax / 100);

        setTotal(baseValue + totalWorkmanship + totalTax);
    }, [selectedKarat, weight, workmanship, workmanshipType, tax, taxType, prices, locale]);

    const karats = ["24", "22", "21", "18", "14"];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* GROUNDED HERO */}
            <section className="hero-section pt-24 min-[350px]:pt-32 sm:pt-40 mb-6 sm:mb-12">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-slate-50 dark:bg-[#0B1121] px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-4 sm:mb-6 border border-slate-200 dark:border-[#1E293B] shadow-sm"
                    >
                        <Calculator className="h-3 w-3 sm:h-4 sm:w-4 text-gold-500 dark:text-[#FFB800]" />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest pt-0.5 text-slate-500 dark:text-[#94A3B8]">{t.calculator_client.title}</span>
                    </motion.div>
                    <h1 className="text-xl min-[350px]:text-2xl sm:text-4xl md:text-6xl font-heavy text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tighter leading-tight">
                        {locale === 'ar' ? (
                            <>احسب قيمة <span className="text-gradient-gold">استثمارك.</span></>
                        ) : (
                            <>{t.calculator_client.title} <span className="text-gradient-gold">{t.calculator_client.title_span}</span></>
                        )}
                    </h1>
                    <p className="text-slate-400 font-bold max-w-2xl mx-auto text-[10px] min-[350px]:text-sm sm:text-base px-2">
                        {t.calculator_client.subtitle}
                    </p>
                    <div className="mt-8 space-y-2">
                        <AdBanner type="horizontal" />
                        <AdBanner type="native" />
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-2 min-[350px]:px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
                    <div className="lg:col-span-7 space-y-6 sm:space-y-10">
                        {/* Calculator Inputs Card */}
                        <div className="bg-white dark:bg-[#151D2E] rounded-2xl sm:rounded-3xl p-4 min-[350px]:p-6 sm:p-12 border border-slate-200 dark:border-[#1E293B] shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-heavy text-slate-900 dark:text-white mb-6 sm:mb-10">{locale === 'ar' ? 'بيانات الحساب' : 'Calculation Data'}</h2>

                            <div className="space-y-6 sm:space-y-10">
                                <div>
                                    <label className="block text-[10px] min-[350px]:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-6">{t.calculator_client.karat_label}</label>
                                    <div className="grid grid-cols-3 min-[400px]:flex min-[400px]:flex-wrap gap-2 sm:gap-3">
                                        {karats.map((k) => (
                                            <button
                                                key={k}
                                                onClick={() => setSelectedKarat(k)}
                                                className={cn(
                                                    "px-2 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-2xl font-heavy transition-all text-[10px] min-[350px]:text-xs sm:text-sm border-2",
                                                    selectedKarat === k
                                                        ? "bg-slate-900 border-slate-900 text-white dark:bg-[#1E293B] dark:border-[#ff9769] dark:text-[#ff9769] shadow-lg sm:shadow-xl"
                                                        : "bg-slate-50 dark:bg-[#0B1121] border-slate-100 dark:border-[#1E293B] text-slate-600 dark:text-white hover:border-peach-gold/50"
                                                )}
                                            >
                                                {locale === 'ar' ? `عيار ${k}` : `${k}K`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-3 sm:space-y-4">
                                        <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{t.calculator_client.weight_label}</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={weight || ""}
                                                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                                                className={cn(
                                                    "w-full bg-slate-50 dark:bg-[#0B1121] border-2 border-slate-200 dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-3 sm:p-5 font-heavy text-lg sm:text-2xl text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-all shadow-sm",
                                                    isRTL ? "pl-14 sm:pl-20 pr-4 sm:pr-6 text-right" : "pr-14 sm:pr-20 pl-4 sm:pl-6 text-left"
                                                )}
                                                placeholder="0.00"
                                            />
                                            <span className={cn("absolute top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px] sm:text-xs uppercase tracking-widest", isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6")}>
                                                {t.calculator_client.gram}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{t.calculator_client.workmanship_label}</label>
                                            <div className="flex bg-slate-100 dark:bg-[#0B1121] p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-slate-200 dark:border-[#1E293B]">
                                                <button
                                                    onClick={() => setWorkmanshipType("fixed")}
                                                    className={cn("px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-black rounded-md sm:rounded-lg transition-all", workmanshipType === "fixed" ? "bg-white dark:bg-[#1E293B] shadow-sm text-gold-600 dark:text-[#FFB800]" : "text-slate-400 dark:text-[#94A3B8]")}
                                                >{t.calculator_client.fixed}</button>
                                                <button
                                                    onClick={() => setWorkmanshipType("percent")}
                                                    className={cn("px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-black rounded-md sm:rounded-lg transition-all", workmanshipType === "percent" ? "bg-white dark:bg-[#1E293B] shadow-sm text-gold-600 dark:text-[#FFB800]" : "text-slate-400 dark:text-[#94A3B8]")}
                                                >%</button>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={workmanship || ""}
                                                onChange={(e) => setWorkmanship(parseFloat(e.target.value) || 0)}
                                                className={cn(
                                                    "w-full bg-slate-50 dark:bg-[#0B1121] border-2 border-slate-200 dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-3 sm:p-5 font-heavy text-lg sm:text-2xl text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-all shadow-sm",
                                                    isRTL ? "pl-14 sm:pl-20 pr-4 sm:pr-6 text-right" : "pr-14 sm:pr-20 pl-4 sm:pl-6 text-left"
                                                )}
                                                placeholder="0.00"
                                            />
                                            <span className={cn("absolute top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px] sm:text-xs uppercase tracking-widest", isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6")}>
                                                {workmanshipType === "fixed" ? t.calculator_client.unit : "%"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{t.calculator_client.tax_label}</label>
                                        <div className="flex bg-slate-100 dark:bg-[#0B1121] p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-slate-200 dark:border-[#1E293B]">
                                            <button
                                                onClick={() => setTaxType("fixed")}
                                                className={cn("px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-black rounded-md sm:rounded-lg transition-all", taxType === "fixed" ? "bg-white dark:bg-[#1E293B] shadow-sm text-blue-600 dark:text-[#2DD4BF]" : "text-slate-400 dark:text-[#94A3B8]")}
                                            >{t.calculator_client.fixed}</button>
                                            <button
                                                onClick={() => setTaxType("percent")}
                                                className={cn("px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-black rounded-md sm:rounded-lg transition-all", taxType === "percent" ? "bg-white dark:bg-[#1E293B] shadow-sm text-blue-600 dark:text-[#2DD4BF]" : "text-slate-400 dark:text-[#94A3B8]")}
                                            >%</button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={tax || ""}
                                            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                            className={cn(
                                                "w-full bg-slate-50 dark:bg-[#0B1121] border-2 border-slate-200 dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-3 sm:p-5 font-heavy text-lg sm:text-2xl text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-all shadow-sm",
                                                isRTL ? "pl-14 sm:pl-20 pr-4 sm:pr-6 text-right" : "pr-14 sm:pr-20 pl-4 sm:pl-6 text-left"
                                            )}
                                            placeholder="0.00"
                                        />
                                        <span className={cn("absolute top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px] sm:text-xs uppercase tracking-widest", isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6")}>
                                            {taxType === "fixed" ? t.calculator_client.unit : "%"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <AdBanner type="native" />
                        </div>

                        <div className="bg-gold-50 dark:bg-[#151D2E] rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex items-center gap-4 sm:gap-6 border border-gold-200 dark:border-[#1E293B] shadow-sm">
                            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-[#1E293B] flex items-center justify-center shadow-lg dark:shadow-black/20 flex-shrink-0">
                                <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-gold-500 dark:text-[#FFB800]" />
                            </div>
                            <div>
                                <h4 className="font-heavy text-base sm:text-lg mb-0.5 sm:mb-1 text-gold-900 dark:text-white">{t.calculator_client.efficiency_title}</h4>
                                <p className="text-gold-700/70 dark:text-[#94A3B8] font-bold text-[10px] min-[350px]:text-xs sm:text-sm leading-relaxed max-w-lg">
                                    {t.calculator_client.efficiency_desc}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 dark:bg-[#0B1121] rounded-2xl sm:rounded-[2.5rem] p-5 min-[350px]:p-6 sm:p-12 text-white shadow-2xl border border-white/5 dark:border-[#1E293B] relative overflow-hidden h-fit lg:sticky lg:top-32">
                            <div className="absolute top-0 right-0 w-32 min-[350px]:w-64 h-32 min-[350px]:h-64 bg-gold-500/5 blur-[60px] min-[350px]:blur-[100px] -mr-16 min-[350px]:-mr-32 -mt-16 min-[350px]:-mt-32" />

                            <div className="relative flex flex-col">
                                <div className="flex items-center justify-between mb-6 sm:mb-12 border-b border-white/10 pb-4 sm:pb-8">
                                    <h3 className="text-base min-[350px]:text-lg sm:text-2xl font-heavy">{t.calculator_client.summary_title}</h3>
                                    <div className="h-8 w-8 min-[350px]:h-10 min-[350px]:h-12 min-[350px]:w-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <FileText className="h-4 w-4 min-[350px]:h-6 min-[350px]:w-6 text-gold-500" />
                                    </div>
                                </div>

                                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                                    <div className="flex justify-between items-center py-1 sm:py-2">
                                        <span className="text-slate-400 font-bold text-xs sm:text-sm">{t.calculator_client.price_per_gram}</span>
                                        <span className="font-heavy text-sm sm:text-lg">
                                            {prices ? formatNumber(parseFloat(prices[`عيار ${selectedKarat}`]?.sell || prices[selectedKarat]?.sell || "0")) : "0"} <span className="text-slate-500 text-[10px]">EGP</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 sm:py-2">
                                        <span className="text-slate-400 font-bold text-xs sm:text-sm">
                                            {t.calculator_client.total_workmanship} {workmanshipType === "percent" && `(${workmanship}%)`}
                                        </span>
                                        <span className="font-heavy text-sm sm:text-lg">
                                            {formatNumber(workmanshipType === "fixed" ? (workmanship * weight) : (weight * parseFloat(prices?.[`عيار ${selectedKarat}`]?.sell || prices?.[selectedKarat]?.sell || "0") * workmanship / 100))} <span className="text-slate-500 text-[10px]">EGP</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 sm:py-2">
                                        <span className="text-slate-400 font-bold text-xs sm:text-sm">
                                            {t.calculator_client.total_tax} {taxType === "percent" && `(${tax}%)`}
                                        </span>
                                        <span className="font-heavy text-sm sm:text-lg">
                                            {formatNumber(taxType === "fixed" ? (tax * weight) : ((weight * parseFloat(prices?.[`عيار ${selectedKarat}`]?.sell || prices?.[selectedKarat]?.sell || "0") + (workmanshipType === "fixed" ? (workmanship * weight) : (weight * parseFloat(prices?.[`عيار ${selectedKarat}`]?.sell || prices?.[selectedKarat]?.sell || "0") * workmanship / 100))) * (tax / 100)))} <span className="text-slate-500 text-[10px]">EGP</span>
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between items-baseline min-[350px]:items-center pt-6 sm:pt-8 border-t border-white/10 dark:border-[#1E293B] gap-2">
                                        <span className="font-black text-gold-500 dark:text-[#FFB800] uppercase tracking-widest text-[8px] sm:text-[10px]">{t.calculator_client.total_estimated}</span>
                                        <div className="text-left min-[350px]:text-right w-full min-[350px]:w-auto">
                                            <div className="text-xl min-[350px]:text-3xl sm:text-5xl font-heavy tabular-nums leading-none mb-1 text-white dark:text-[#FFFFFF]">{formatNumber(total)}</div>
                                            <span className="text-slate-500 dark:text-[#94A3B8] font-black text-[7px] min-[350px]:text-xs">EGYPTIAN POUND (EGP)</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] bg-white dark:bg-[#FFB800] text-slate-900 dark:text-[#0B1121] font-heavy shadow-xl hover:bg-gold-500 transition-all flex items-center justify-center gap-2 sm:gap-3 no-print active:scale-95 text-sm sm:text-base"
                                >
                                    <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
                                    {t.calculator_client.download_pdf}
                                </button>

                                <p className="text-center text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-4 sm:mt-6 opacity-50">
                                    Last Updated: {prices ? new Date(sourceInfo?.timestamp || "").toLocaleTimeString() : "..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Printable Invoice Branding */}
                <div className="print-only p-12 bg-white text-slate-900 font-sans border-4 border-slate-900">
                    <div className="flex justify-between items-start border-b-4 border-gold-500 pb-10 mb-12">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter mb-2">GOLD<span className="text-gold-600">MALL</span></h1>
                            <p className="text-slate-400 font-black tracking-[0.3em] uppercase text-xs">Premium Service</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-black mb-1">{isRTL ? 'عرض سعر رسمي' : 'Official Quotation'}</h2>
                            <p className="text-slate-500 font-bold">Ref: #GL-{Date.now().toString().slice(-6)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="space-y-6">
                            <div className="border-l-4 border-slate-100 pl-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Details</p>
                                <p className="font-heavy text-2xl">{locale === 'ar' ? `عيار ${selectedKarat}` : `${selectedKarat}K Gold`}</p>
                            </div>
                            <div className="border-l-4 border-slate-100 pl-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Net Weight</p>
                                <p className="font-heavy text-2xl">{weight} {t.calculator_client.gram}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Total Amount Due</p>
                            <div className="text-5xl font-black">{formatNumber(total)}</div>
                            <p className="font-black text-slate-900 mt-2">EGP</p>
                        </div>
                    </div>

                    <table className="w-full mb-12">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="p-4 text-left font-black uppercase tracking-widest text-xs">Item Description</th>
                                <th className="p-4 text-right font-black uppercase tracking-widest text-xs">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100">
                            <tr>
                                <td className="p-4 font-bold">Gold Raw Value ({prices ? parseFloat(prices[`عيار ${selectedKarat}`]?.sell || "0") : 0} /g)</td>
                                <td className="p-4 text-right font-heavy">{formatNumber(weight * parseFloat(prices?.[`عيار ${selectedKarat}`]?.sell || "0"))} </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-bold">Total Workmanship Fees</td>
                                <td className="p-4 text-right font-heavy">{formatNumber(workmanshipType === "fixed" ? (workmanship * weight) : (weight * parseFloat(prices?.[`عيار ${selectedKarat}`]?.sell || "0") * workmanship / 100))}</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-bold">Government Taxes & Stamp Duty</td>
                                <td className="p-4 text-right font-heavy">{formatNumber(taxType === "fixed" ? (tax * weight) : ((weight * parseFloat(prices?.[`عيار ${selectedKarat}`]?.sell || "0") + (workmanshipType === "fixed" ? (workmanship * weight) : (weight * parseFloat(prices?.[`عيار ${selectedKarat}`]?.sell || "0") * workmanship / 100))) * (tax / 100)))}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="border-t-2 border-slate-100 pt-8 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Disclaimer</p>
                        <p className="text-slate-400 text-[9px] font-bold max-w-lg mx-auto leading-relaxed">
                            This document is an automated price estimation and does not constitute a final binding contract. Market prices fluctuate instantly. Please verify final value at the time of transaction.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
