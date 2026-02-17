"use client";

import { Navbar } from "@/components/navbar";
import { Landmark, ArrowRightLeft, Clock, Search, TrendingUp, Zap, ChevronDown, Building2, TrendingDown, Info, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getBanks, getBankRates, getAvailableCurrencyPairs, getMarketSummary, getDbLatestRates } from "@/lib/api";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import UnifiedCurrencyCalculator from "@/components/unified-currency-calculator";
import { QASection } from "@/components/qa-section";
import AdBanner from "@/components/ads/ad-banner";

export default function CurrenciesClient() {
    const { t, locale, isRTL } = useLanguage();

    const currencyNamesAr: Record<string, string> = {
        "USD": "الدولار الأمريكي",
        "EUR": "اليورو",
        "GBP": "الجنيه الإسترليني",
        "SAR": "الريال السعودي",
        "AED": "الدرهم الإماراتي",
        "KWD": "الدينار الكويتي",
        "QAR": "الريال القطري",
        "BHD": "الدينار البحريني",
        "OMR": "الريال العماني",
        "JOD": "الدينار الأردني",
        "CAD": "الدولار الكندي",
        "AUD": "الدولار الأسترالي",
        "CHF": "الفرنك السويسري",
        "JPY": "الين الياباني",
        "EGP": "الجنيه المصري"
    };

    const [banks, setBanks] = useState<any[]>([]);
    const [selectedBank, setSelectedBank] = useState<any>(null);
    const [bankRates, setBankRates] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [marketSummary, setMarketSummary] = useState<any>(null);
    const [selectedPair, setSelectedPair] = useState("USD/EGP");
    const [availablePairs, setAvailablePairs] = useState<any[]>([]);
    const [dbInfo, setDbInfo] = useState<any>(null);

    useEffect(() => {
        const fetchDbInfo = async () => {
            const data = await getDbLatestRates();
            if (data && data.status === "success") {
                setDbInfo(data);
            }
        };
        fetchDbInfo();
        const fetchAvailablePairs = async () => {
            const data = await getAvailableCurrencyPairs();
            if (data && data.currency_pairs) {
                setAvailablePairs(data.currency_pairs);
            }
        };
        fetchAvailablePairs();

        const fetchBanks = async () => {
            setLoading(true);
            const data = await getBanks();
            if (data) {
                setBanks(data);
            }
            setLoading(false);
        };
        fetchBanks();
    }, []);

    useEffect(() => {
        const fetchSummary = async () => {
            const [from, to] = selectedPair.split("/");
            const data = await getMarketSummary(from, to);
            if (data) {
                setMarketSummary(data);
            }
        };
        fetchSummary();
    }, [selectedPair]);

    useEffect(() => {
        if (selectedBank) {
            const fetchRates = async () => {
                setLoading(true);
                const data = await getBankRates(selectedBank.name);
                if (data) {
                    setBankRates(data);
                }
                setLoading(false);
            };
            fetchRates();
        } else {
            setBankRates(null);
        }
    }, [selectedBank]);

    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (val: number) => {
        return new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3
        }).format(val);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <Navbar />

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-gold-500/5 to-transparent pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-gold-500/5 blur-[100px] rounded-full pointer-events-none" />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <AnimatePresence mode="wait">
                    {!selectedBank ? (
                        <motion.div
                            key="bank-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-8 min-[350px]:mb-12 text-center pt-24 min-[350px]:pt-32 sm:pt-40">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center gap-2 min-[350px]:gap-3 px-4 min-[350px]:px-6 py-1.5 min-[350px]:py-2 rounded-xl min-[350px]:rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-4 min-[350px]:mb-6"
                                >
                                    <Building2 className="h-4 min-[350px]:h-5 w-4 min-[350px]:w-5" />
                                    <span className="text-[10px] min-[350px]:text-xs font-black uppercase tracking-widest">{locale === 'ar' ? 'البنوك المصرية' : 'Egyptian Banks'}</span>
                                </motion.div>

                                <h1 className="text-2xl min-[350px]:text-4xl md:text-6xl font-heavy text-slate-900 dark:text-white mb-3 min-[350px]:mb-4 tracking-tighter leading-tight px-4">
                                    {locale === 'ar' ? <>اختر <span className="text-gradient-gold lowercase">البنك</span> لمعرفة الأسعار</> : <>Choose a <span className="text-gradient-gold lowercase">Bank</span> for rates</>}
                                </h1>
                                <p className="text-slate-600 dark:text-[#94A3B8] font-bold max-w-2xl mx-auto text-[10px] min-[350px]:text-sm sm:text-base mb-6 min-[350px]:mb-10 px-6">
                                    {t.currencies_client.subtitle}
                                </p>
                                <div className="space-y-2 mt-4">
                                    <AdBanner type="horizontal" />
                                    <AdBanner type="native" />
                                </div>
                            </div>

                            <div className="mb-16 flex flex-col items-center gap-10">
                                <div className="max-w-xl w-full relative group px-4">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-amber-500 rounded-3xl blur opacity-10 group-focus-within:opacity-30 transition-opacity" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={locale === 'ar' ? 'بحث عن بنك...' : 'Search for a bank...'}
                                        className={cn(
                                            "relative w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-white/10 rounded-xl min-[350px]:rounded-2xl p-4 min-[350px]:p-6 font-heavy text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-gold-500 outline-none transition-all text-sm min-[350px]:text-lg shadow-xl shadow-black/5",
                                            isRTL ? "pr-12 min-[350px]:pr-14 text-right" : "pl-12 min-[350px]:pl-14 text-left"
                                        )}
                                    />
                                    <Search className={cn("absolute top-1/2 -translate-y-1/2 h-5 min-[350px]:h-6 w-5 min-[350px]:w-6 text-slate-400 dark:text-slate-600", isRTL ? "right-8 min-[350px]:right-10" : "left-8 min-[350px]:left-10")} />
                                </div>

                                {/* Pair Selection Chips - Premium Visuals */}
                                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 md:flex md:flex-wrap justify-center gap-2 md:gap-3 px-4 max-w-5xl mx-auto w-full">
                                    {availablePairs.map(p => {
                                        const [from, to] = p.pair.split("/");

                                        const isActive = selectedPair === p.pair;
                                        const label = locale === 'ar'
                                            ? currencyNamesAr[from] || from
                                            : from;

                                        return (
                                            <motion.button
                                                key={p.pair}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedPair(p.pair)}
                                                className={cn(
                                                    "relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 px-2 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-heavy transition-all border-2 overflow-hidden",
                                                    isActive
                                                        ? "bg-[#f16d34] border-[#f16d34] text-white shadow-[0_8px_25px_-5px_rgba(241,109,52,0.4)] z-10"
                                                        : "bg-slate-900/60 backdrop-blur-md border-white/10 text-white hover:border-gold-500/50 hover:bg-slate-900/80"
                                                )}
                                            >
                                                {/* Background Glow for Inactive (Subtle) */}
                                                {!isActive && (
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
                                                )}

                                                <span className="relative z-10 text-[9px] sm:text-xs text-center leading-tight">{label}</span>
                                                <span className={cn(
                                                    "relative z-10 px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-black",
                                                    isActive
                                                        ? "bg-white/20 text-white"
                                                        : "bg-white/10 text-white/60"
                                                )}>
                                                    {from}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Combined Market Overview & Calculator Section */}
                            {(marketSummary || (dbInfo?.data && dbInfo.data.length > 0)) && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
                                    {/* Market Overview Side */}
                                    {marketSummary && (
                                        <div className="lg:col-span-4 space-y-8">
                                            <h2 className="section-title text-right">
                                                {locale === 'ar' ? 'لمحة عن السوق' : 'Market Overview'}
                                            </h2>

                                            <div className="grid grid-cols-1 gap-4">
                                                <SummaryCard
                                                    title={locale === 'ar' ? 'أعلى سعر شراء' : 'Highest Buy'}
                                                    value={marketSummary.highest_buy}
                                                    change={marketSummary.highest_buy_change}
                                                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                                                    color="emerald"
                                                />
                                                <SummaryCard
                                                    title={locale === 'ar' ? 'أقل سعر بيع' : 'Lowest Sell'}
                                                    value={marketSummary.lowest_sell}
                                                    change={marketSummary.lowest_sell_change}
                                                    icon={<TrendingDown className="h-5 w-5 text-rose-500" />}
                                                    color="rose"
                                                />
                                                <SummaryCard
                                                    title={locale === 'ar' ? 'متوسط السعر' : 'Average Price'}
                                                    value={marketSummary.average}
                                                    change={marketSummary.average_change}
                                                    icon={<Zap className="h-5 w-5 text-blue-500" />}
                                                    color="blue"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Calculator Side */}
                                    {dbInfo?.data && dbInfo.data.length > 0 && (
                                        <div className="lg:col-span-8 space-y-8">
                                            <h2 className="section-title text-right">
                                                {locale === 'ar' ? 'محول العملات' : 'Currency Converter'}
                                            </h2>
                                            <UnifiedCurrencyCalculator
                                                availablePairs={availablePairs}
                                                dbInfo={dbInfo}
                                                currencyNames={currencyNamesAr}
                                                banks={banks}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="space-y-2">
                                <AdBanner type="horizontal" />
                                <AdBanner type="horizontal" />
                                <AdBanner type="native" />
                                <AdBanner type="horizontal" />
                            </div>

                            <div className="mb-16">
                                <QASection pageKey="currencies" />
                            </div>
                            <div className="space-y-2">
                                <AdBanner type="horizontal" />
                                <AdBanner type="horizontal" />
                                <AdBanner type="horizontal" />
                            </div>

                            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-1 min-[350px]:px-4">
                                {filteredBanks.map((bank, i) => {
                                    const bankRate = dbInfo?.data?.find((r: any) =>
                                        r.bank_name === bank.name &&
                                        `${r.from_currency}/${r.to_currency}` === selectedPair
                                    );

                                    return (
                                        <motion.button
                                            key={bank.name}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.01 }}
                                            onClick={() => setSelectedBank(bank)}
                                            className="group relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-4 min-[350px]:p-8 rounded-[1.5rem] min-[350px]:rounded-[2rem] border border-slate-200/50 dark:border-white/5 hover:border-gold-500/50 transition-all hover:shadow-2xl hover:shadow-gold-500/10 flex flex-col items-center gap-3 min-[350px]:gap-6 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/0 group-hover:to-gold-500/5 transition-all" />

                                            <div className="relative z-10 h-14 w-14 min-[350px]:h-24 min-[350px]:w-24 rounded-xl min-[350px]:rounded-[1.5rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center p-2 min-[350px]:p-5 border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-lg group-hover:shadow-black/5">
                                                {bank.logo ? (
                                                    <img src={bank.logo} alt={bank.name} className="w-full h-full object-contain filter brightness-105" />
                                                ) : (
                                                    <Building2 className="h-8 w-8 min-[350px]:h-10 min-[350px]:w-10 text-slate-300 dark:text-slate-700" />
                                                )}
                                            </div>

                                            <div className="relative z-10 flex flex-col items-center gap-1">
                                                <span className="font-heavy text-slate-900 dark:text-white text-center text-xs min-[350px]:text-sm leading-tight group-hover:text-gold-500 transition-colors uppercase tracking-tight">
                                                    {bank.name}
                                                </span>
                                                {bankRate && (
                                                    <div className="mt-1 min-[350px]:mt-2 text-peach-gold font-heavy text-base min-[350px]:text-lg tabular-nums">
                                                        {formatPrice(bankRate.sell_price)}
                                                        <span className="text-[8px] min-[350px]:text-[10px] text-slate-400 mr-1 font-bold">ج.م</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <div className="mt-12 flex flex-col gap-6 no-print">
                                <AdBanner type="native" />
                                <AdBanner type="horizontal" />
                                <AdBanner type="horizontal" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="bank-rates"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="pt-8"
                        >
                            <button
                                onClick={() => setSelectedBank(null)}
                                className="flex items-center gap-2 text-peach-gold font-heavy mb-12 transition-all group hover:opacity-80"
                            >
                                <ArrowLeft className={cn("h-5 w-5 transition-transform group-hover:-translate-x-1", isRTL && "rotate-180")} />
                                <span className="uppercase tracking-widest text-xs">{locale === 'ar' ? 'العودة لقائمة البنوك' : 'Back to Banks'}</span>
                            </button>

                            <div className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-white dark:bg-[#151D2E] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-[#1E293B]">
                                <div className="h-32 w-32 rounded-3xl bg-slate-50 dark:bg-[#0B1121] flex items-center justify-center p-6 border border-slate-100 dark:border-[#1E293B]">
                                    {selectedBank.logo ? (
                                        <img src={selectedBank.logo} alt={selectedBank.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 className="h-12 w-12 text-slate-300 dark:text-[#1E293B]" />
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-right">
                                    <h2 className="text-3xl md:text-5xl font-heavy text-slate-900 dark:text-white mb-4 tracking-tighter">{selectedBank.name}</h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-xl">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>{locale === 'ar' ? 'تحديث مباشر' : 'Live Update'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0B1121] px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1E293B]">
                                            <Clock className="h-4 w-4 text-slate-400 dark:text-[#94A3B8]" />
                                            <span className="text-slate-500 dark:text-white">{bankRates ? new Date(bankRates.timestamp).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : '...'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#151D2E] rounded-3xl border border-slate-200 dark:border-[#1E293B] shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="dark:bg-[#0B1121] dark:text-white dark:border-[#1E293B]">{locale === 'ar' ? 'العملة' : 'Currency'}</th>
                                                <th className="text-center dark:bg-[#0B1121] dark:text-white dark:border-[#1E293B]">{locale === 'ar' ? 'شراء' : 'Buy'}</th>
                                                <th className="text-center dark:bg-[#0B1121] dark:text-white dark:border-[#1E293B]">{locale === 'ar' ? 'بيع' : 'Sell'}</th>
                                                <th className="text-center dark:bg-[#0B1121] dark:text-white dark:border-[#1E293B]">{locale === 'ar' ? 'آخر تحديث' : 'Last Update'}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                                            {bankRates?.rates.map((rate: any, i: number) => (
                                                <motion.tr
                                                    key={rate.pair}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.01 }}
                                                >
                                                    <td className="dark:border-[#1E293B]">
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-2xl h-10 w-10 rounded-xl bg-slate-50 dark:bg-[#0B1121] flex items-center justify-center border border-slate-100 dark:border-[#1E293B]">
                                                                {rate.currency_flag ? (
                                                                    <img src={rate.currency_flag} alt={rate.from_currency} className="w-6 h-6 object-contain" />
                                                                ) : (
                                                                    <div className="font-black text-xs text-slate-400">{rate.from_currency}</div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-heavy text-slate-900 dark:text-white text-lg">
                                                                    {rate.from_currency}/{rate.to_currency}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-bold uppercase">
                                                                    {locale === 'ar' ? (currencyNamesAr[rate.from_currency] || rate.from_currency) : rate.from_currency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="text-xl font-heavy text-peach-gold tabular-nums">
                                                            {formatPrice(rate.buy_price)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center dark:border-[#1E293B]">
                                                        <span className="text-xl font-heavy text-slate-900 dark:text-white tabular-nums">
                                                            {formatPrice(rate.sell_price)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center dark:border-[#1E293B]">
                                                        <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-[#1E293B] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 dark:text-[#94A3B8]">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="tabular-nums">{rate.last_update_time}</span>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function SummaryCard({ title, value, change, icon, color }: any) {
    const colorMap: Record<string, string> = {
        emerald: "text-emerald-500 bg-emerald-500/10",
        rose: "text-rose-500 bg-rose-500/10",
        blue: "text-blue-500 bg-blue-500/10"
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-none p-3 min-[350px]:p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[1.5rem] min-[350px]:rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-xl transition-all w-full"
        >
            <div className="flex items-center gap-2 min-[350px]:gap-4 mb-4 min-[350px]:mb-6">
                <div className={`h-8 w-8 min-[350px]:h-12 min-[350px]:w-12 rounded-xl flex items-center justify-center ${colorMap[color] || 'bg-slate-100 dark:bg-white/5'} shrink-0`}>
                    {icon}
                </div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest min-[350px]:tracking-[0.2em]">{title}</h3>
            </div>

            <div className="flex items-baseline gap-1 min-[350px]:gap-2 mb-2">
                <span className="text-xl min-[350px]:text-3xl font-heavy text-slate-900 dark:text-white tabular-nums tracking-tighter">
                    {value ? value.toFixed(2) : "---"}
                </span>
                <span className="text-[10px] font-bold text-slate-400">ج.م</span>
            </div>

            {change !== null && (
                <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black",
                    change >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                )}>
                    <TrendingUp className={cn("h-3 w-3", change < 0 && "rotate-180")} />
                    {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                </div>
            )}
        </motion.div>
    );
}

function RegulatoryCard({ title, buy, sell, logo }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-none w-56 min-[350px]:w-72 p-3 min-[350px]:p-6 bg-slate-900 dark:bg-[#0B1121] rounded-[1.5rem] min-[350px]:rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group"
        >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-24 min-[350px]:w-32 h-24 min-[350px]:h-32 bg-gold-500/10 blur-[40px] min-[350px]:blur-[50px] rounded-full -mr-12 min-[350px]:-mr-16 -mt-12 min-[350px]:-mt-16 group-hover:bg-gold-500/20 transition-colors" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 min-[350px]:gap-4 mb-6 min-[350px]:mb-8">
                    <div className="h-8 w-8 min-[350px]:h-12 min-[350px]:w-12 rounded-xl bg-white/5 p-1 min-[350px]:p-2 flex items-center justify-center border border-white/10 shrink-0">
                        <img src={logo} alt={title} className="w-full h-full object-contain filter brightness-110" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-[8px] min-[350px]:text-[10px] font-black text-gold-500 uppercase tracking-widest mb-0.5">{title}</h3>
                        <span className="text-[7px] min-[350px]:text-[8px] text-slate-500 font-bold uppercase">Official Rates</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 min-[350px]:gap-6">
                    <div className="space-y-0.5 min-[350px]:space-y-1">
                        <span className="text-[8px] min-[350px]:text-[10px] font-bold text-slate-500 uppercase tracking-tighter">سعر الشراء</span>
                        <div className="text-lg min-[350px]:text-2xl font-heavy text-white tabular-nums tracking-tight">
                            {buy ? buy.toFixed(2) : "---"}
                        </div>
                    </div>
                    <div className="space-y-0.5 min-[350px]:space-y-1">
                        <span className="text-[8px] min-[350px]:text-[10px] font-bold text-slate-500 uppercase tracking-tighter">سعر البيع</span>
                        <div className="text-lg min-[350px]:text-2xl font-heavy text-gold-400 tabular-nums tracking-tight">
                            {sell ? sell.toFixed(2) : "---"}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
