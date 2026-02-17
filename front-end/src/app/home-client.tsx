"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Coins, CircleDollarSign, Landmark, ArrowLeft, Zap, Smartphone, ChevronLeft, ChevronRight, Newspaper, Globe, History, Activity, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MarketSnapshot, getGoldPricesMap } from "@/lib/api";
import { useLanguage } from "@/components/language-provider";
import { useMarketData } from "@/components/market-data-provider";

const TradingViewChart = dynamic(() => import("@/components/trading-view-chart").then(mod => mod.TradingViewChart), { ssr: false });
const CurrencyConverter = dynamic(() => import("@/components/currency-converter").then(mod => mod.CurrencyConverter), { ssr: false });
const LiveGoldTable = dynamic(() => import("@/components/live-gold-table").then(mod => mod.LiveGoldTable), { ssr: false });
const GoldHistoryTable = dynamic(() => import("@/components/gold-history-table").then(mod => mod.GoldHistoryTable), { ssr: false });
const GoldAnalysisChart = dynamic(() => import("@/components/gold-analysis-chart").then(mod => mod.GoldAnalysisChart), { ssr: false });
const QASection = dynamic(() => import("@/components/qa-section").then(mod => mod.QASection), { ssr: false });
import AdBanner from "@/components/ads/ad-banner";



export interface HomeClientProps {
  initialSnapshot: MarketSnapshot | null;
}

export default function HomeClient({ initialSnapshot }: HomeClientProps) {
  const { snapshot: globalSnapshot } = useMarketData();
  const { t, isRTL, locale } = useLanguage();

  // Use global snapshot if available, otherwise fallback to initialSnapshot
  const snapshot = globalSnapshot || initialSnapshot;

  const livePrices = getGoldPricesMap(snapshot?.gold_egypt?.prices);
  const currencyRates = snapshot?.currencies?.rates || {};

  const karats = ["24", "21", "18", "14", "12"];
  const lastUpdate = snapshot?.gold_egypt?.last_update
    ? new Date(snapshot.gold_egypt.last_update).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
    : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ENHANCED HERO SECTION - Compact & Premium */}
      <section
        className="hero-section relative overflow-hidden pt-24 pb-8 min-[350px]:pt-32 min-[350px]:pb-12 sm:pt-40 sm:pb-20"
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          .dark .hero-section { 
            background-color: lab(40 -1.05 -15.03) !important; 
            background-image: none !important; 
          }
        `}} />

        {/* Floating Assets Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-30">
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="absolute top-20 right-[10%] animate-float-slow">
            <Coins className="w-16 h-16 text-[#FFB800]" />
          </motion.div>
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="absolute top-40 left-[15%] animate-float-fast">
            <CircleDollarSign className="w-12 h-12 text-[#F16D34]" />
          </motion.div>
          <motion.div className="absolute bottom-10 right-[20%] animate-float-slow opacity-50">
            <Banknote className="w-20 h-20 text-[#BBE0EF]" />
          </motion.div>
          <motion.div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gold-500/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 px-2 min-[350px]:px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-white/50 dark:bg-[#0B1121]/50 backdrop-blur-md px-3 py-1 min-[350px]:px-4 min-[350px]:py-1.5 rounded-full mb-4 min-[350px]:mb-6 border border-white/20 dark:border-[#1E293B] shadow-sm"
          >
            <span className="live-dot" />
            <span className="text-[8px] min-[350px]:text-[10px] font-black text-slate-700 dark:text-[#F8FAFC] uppercase tracking-[0.1em] min-[350px]:tracking-[0.2em] pt-0.5">
              {locale === 'ar' ? 'تحديث حي ومباشر' : 'Live Market Pulse'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl min-[350px]:text-3xl sm:text-5xl md:text-6xl font-heavy text-slate-900 dark:text-[#FFFFFF] tracking-tighter mb-3 min-[350px]:mb-4 leading-[1.1] max-w-4xl px-2"
          >
            {locale === 'ar' ? (
              <>سعر الذهب اليوم | بوصلتك <span className="text-gradient-gold">الاستثمارية</span> الأولى</>
            ) : (
              <>Gold Price Today | Your Ultimate <span className="text-gradient-gold">Investment</span> Companion</>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-800 dark:text-slate-200 font-heavy max-w-2xl mx-auto mb-6 min-[350px]:mb-8 text-xs min-[350px]:text-base sm:text-lg leading-relaxed opacity-90 px-4"
          >
            {locale === 'ar'
              ? "تابع سعر الذهب عيار 21 وسعر الذهب الآن لحظة بلحظة. منصة جولد مول تقدم لك تغطية حية لبورصة الذهب، أسعار العملات، وسعر الدولار اليوم في مصر."
              : "Track the gold price today and live market moves. Gold Mall provides real-time coverage of the gold market, currency rates, and USD price in Egypt."}
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="px-3 py-1.5 min-[350px]:px-4 min-[350px]:py-2 bg-white/40 dark:bg-[#0B1121]/40 backdrop-blur-sm rounded-lg min-[350px]:rounded-xl border border-white/20 dark:border-[#1E293B] shadow-sm"
            >
              <p className="text-[8px] min-[350px]:text-[9px] font-black text-slate-500 dark:text-[#94A3B8] uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                <Activity className="w-2 h-2 min-[350px]:w-2.5 min-[350px]:h-2.5 text-gold-600 dark:text-[#FFB800]" />
                <span>{locale === 'ar' ? 'يتم التحديث بشكل لحظي' : 'Updated Instantly'}</span>
              </p>
              <p className="text-[9px] min-[350px]:text-[11px] font-heavy text-slate-900 dark:text-white tabular-nums">{lastUpdate}</p>
            </motion.div>
          </div>
          <div className="mt-8">
            <AdBanner type="horizontal" />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 pb-20">
        <AdBanner type="horizontal" />
        {/* CTA APP BANNER - Re-Colored to Navy/Sky Palette */}
        <div className="bg-[#161E54] dark:bg-[#151D2E] rounded-[2rem] min-[350px]:rounded-[2.5rem] p-6 min-[350px]:p-8 sm:p-12 mb-12 min-[350px]:mb-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 border border-[#BBE0EF]/10 dark:border-[#1E293B] shadow-2xl dark:shadow-black/40 overflow-hidden relative text-center lg:text-right">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 blur-[100px] -mr-48 -mt-48" />
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative z-10">
            <div className="w-16 h-16 min-[350px]:w-20 min-[350px]:h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
              <Smartphone className="w-8 h-8 min-[350px]:w-10 min-[350px]:h-10 text-[#FF986A]" />
            </div>
            <div>
              <h3 className="text-xl min-[350px]:text-2xl sm:text-3xl font-heavy mb-2" style={{ color: '#FFFFFF' }}>
                {locale === 'ar' ? 'حمل تطبيق جولد مول' : 'Download Gold Mall App'}
              </h3>
              <p className="text-xs min-[350px]:text-sm sm:text-base font-bold opacity-80" style={{ color: '#FFFFFF' }}>
                {locale === 'ar' ? 'تابع التحركات لحظة بلحظة من هاتفك مباشرة' : 'Stay updated with live moves directly from your phone'}
              </p>
            </div>
          </div>
          <div className="flex flex-col min-[400px]:flex-row items-center gap-3 sm:gap-4 relative z-10 w-full lg:w-auto">
            <button className="w-full min-[400px]:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#F16D34] text-white rounded-xl sm:rounded-2xl font-heavy hover:bg-[#FF986A] transition-all text-sm sm:text-base shadow-lg shadow-orange-500/20" style={{ color: '#FFFFFF' }}>Google Play</button>
            <button className="w-full min-[400px]:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-white/20 text-white rounded-xl sm:rounded-2xl font-heavy hover:bg-white/10 transition-all text-sm sm:text-base" style={{ color: '#FFFFFF' }}>App Store</button>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-12">
          <AdBanner type="horizontal" />
          <AdBanner type="horizontal" />
        </div>

        <AdBanner type="horizontal" />

        {/* PRICE CARDS GRID */}
        <div className="grid grid-cols-1 min-[320px]:grid-cols-2 lg:grid-cols-5 gap-2 min-[350px]:gap-3 sm:gap-6 mb-12 sm:mb-16">
          {karats.map((karat) => {
            const price = livePrices[karat] || livePrices[`عيار ${karat}`];
            const is21 = karat === "21";
            return (
              <motion.div
                key={karat}
                whileHover={{ y: -5 }}
                className={cn(
                  "price-card flex flex-col items-center justify-center p-2 min-[350px]:p-4 sm:p-6 text-center border-2",
                  is21 ? "price-card-highlight scale-100 min-[350px]:scale-105 z-20 shadow-xl text-white" : "border-[#BBE0EF]/30 dark:border-[#1E293B] bg-white dark:bg-[#151D2E] dark:shadow-black/40"
                )}
              >
                <span className={cn("text-[9px] min-[350px]:text-[10px] font-black uppercase tracking-[0.1em] min-[350px]:tracking-[0.2em] mb-2 min-[350px]:mb-3", is21 ? "text-white" : "text-[#161E54]/60 dark:text-white")}>
                  {locale === 'ar' ? `GOLD عيار ${karat}` : `${karat}K Gold`}
                </span>
                <span className={cn("text-2xl min-[350px]:text-3xl sm:text-4xl font-heavy tracking-tighter mb-1 min-[350px]:mb-2", is21 ? "text-white" : "text-peach-gold")}>
                  {price?.sell?.toLocaleString() || "---"}
                </span>
                <span className={cn("text-[8px] min-[350px]:text-[10px] font-black uppercase tracking-[0.2em] min-[350px]:tracking-[0.3em]", is21 ? "text-white" : "text-[#161E54]/40 dark:text-white")}>
                  {t.price_cards.unit}
                </span>
              </motion.div>
            );
          })}
        </div>
        <AdBanner type="native" />
        <AdBanner type="native" />
        <AdBanner type="horizontal" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Data & Tables */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="section-title">
                {locale === 'ar' ? 'حركة السوق اليوم' : 'Market Performance Today'}
              </h2>
              <div className="bg-white dark:bg-[#151D2E] rounded-[2.5rem] p-4 sm:p-8 border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-black/40">
                <TradingViewChart />
              </div>
              <div className="space-y-2 mt-4">
                <AdBanner type="horizontal" />
                <AdBanner type="native" />
                <AdBanner type="horizontal" />
                <AdBanner type="horizontal" />
              </div>
              <GoldAnalysisChart />

              <AdBanner type="horizontal" />
              <AdBanner type="horizontal" />

            </div>

            <div className="space-y-4">
              <AdBanner type="horizontal" />
              <AdBanner type="horizontal" />
            </div>

            <QASection pageKey="home" />

            <AdBanner type="horizontal" />

            <div>
              <h2 className="section-title">
                {locale === 'ar' ? 'جدول أسعار الذهب' : 'Gold Price Tables'}
              </h2>
              <div className="space-y-8">
                <AdBanner type="horizontal" />
                <LiveGoldTable />
                <AdBanner type="horizontal" />
                <AdBanner type="horizontal" />
                <GoldHistoryTable />
                <AdBanner type="horizontal" />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#151D2E] rounded-[2.5rem] p-8 border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-black/40">
              <h3 className="text-lg font-heavy mb-8 flex items-center gap-3 border-r-4 border-gold-600 dark:border-[#FFB800] pr-3 text-slate-900 dark:text-white">
                {locale === 'ar' ? 'أسعار العملات والدولار' : 'Currencies & USD Rates'}
              </h3>
              <div className="space-y-4">
                {[
                  { code: "USD", name: locale === 'ar' ? "الدولار الأمريكي" : "US Dollar", icon: CircleDollarSign, color: "text-emerald-600" },
                  { code: "SAR", name: locale === 'ar' ? "الريال السعودي" : "Saudi Riyal", icon: Landmark, color: "text-amber-600" },
                  { code: "EUR", name: locale === 'ar' ? "اليورو" : "Euro", icon: Globe, color: "text-blue-600" }
                ].map((cur) => (
                  <div key={cur.code} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-[#1E293B] transition-all hover:border-gold-500/30 dark:hover:bg-[#1E293B]/80 group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#0B1121] flex items-center justify-center border border-slate-200 dark:border-[#1E293B] shadow-sm group-hover:scale-105 transition-transform">
                        <cur.icon className={cn("w-5 h-5", cur.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-heavy text-slate-900 dark:text-white">{cur.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cur.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-heavy text-slate-900 dark:text-white tabular-nums">{currencyRates[cur.code]?.sell || "---"}</p>
                      <p className="text-[10px] font-black text-emerald-500 flex items-center gap-1 justify-end">
                        <Activity className="w-2.5 h-2.5" />
                        <span>+{cur.code === 'USD' ? '0.12' : '0.05'}%</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/currencies" className="mt-8 w-full py-4 bg-slate-900 dark:bg-[#FFB800] text-white dark:text-[#0B1121] rounded-2xl text-center font-heavy text-sm block hover:opacity-90 transition-all border border-slate-800 dark:border-[#FFB800] shadow-xl dark:shadow-black/40">
                {locale === 'ar' ? 'عرض كافة أسعار البنوك' : 'View All Bank Rates'}
              </Link>
              <div className="mt-6 flex flex-col gap-4">
                <AdBanner type="horizontal" />
                <AdBanner type="horizontal" />
              </div>
            </div>

            <CurrencyConverter />
            <AdBanner type="horizontal" />
            <AdBanner type="horizontal" />

            {/* News Sidebar Preview */}
            <div className="bg-white dark:bg-[#151D2E] rounded-3xl p-8 border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-black/40">
              <h3 className="text-lg font-heavy mb-8 flex items-center gap-3 border-r-4 border-gold-500 dark:border-[#FFB800] pr-3 text-slate-900 dark:text-white">
                {locale === 'ar' ? 'آخر التحليلات' : 'Latest Insights'}
              </h3>
              <div className="space-y-8">
                {snapshot?.news?.slice(0, 3).map((item: any) => (
                  <Link key={item.slug} href={`/news/${item.slug}`} className="group block">
                    <p className="text-sm font-bold group-hover:text-gold-600 transition-colors line-clamp-2 mb-2 leading-relaxed">
                      {item.title}
                    </p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(item.created_at || item.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/news" className="mt-10 flex items-center justify-center gap-2 text-sm font-heavy text-slate-500 hover:text-gold-600 transition-all">
                {locale === 'ar' ? 'مشاهدة المزيد من الأخبار' : 'Watch More News'}
                <ChevronLeft className={cn("w-4 h-4", locale !== 'ar' && "rotate-180")} />
              </Link>
              <div className="mt-6">
                <AdBanner type="horizontal" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <AdBanner type="native" />
          <AdBanner type="horizontal" />
          <AdBanner type="horizontal" />
        </div>
      </main>

      <footer className="bg-slate-950 text-white pt-20 pb-10 mt-20 no-print border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
                  <Coins className="h-6 w-6 text-slate-900" />
                </div>
                <span className="text-2xl font-heavy leading-none text-white tracking-tighter">
                  GOLD<span className="text-gold-500">MALL</span>
                </span>
              </Link>
              <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-sm mb-6">
                {t.footer.desc}
              </p>
              <div className="flex gap-4">
                {["FB", "X", "IG", "YT"].map(social => (
                  <div key={social} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black border border-white/5 hover:border-gold-500 transition-all cursor-pointer">
                    {social}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heavy mb-6 text-gold-500 uppercase tracking-widest text-[10px]">{t.footer.platform}</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">{t.footer.about}</li>
                <li className="hover:text-white transition-colors cursor-pointer">جدول الأسعار</li>
                <li className="hover:text-white transition-colors cursor-pointer">الأخبار والتقارير</li>
              </ul>
            </div>
            <div>
              <h4 className="font-heavy mb-6 text-gold-500 uppercase tracking-widest text-[10px]">{t.footer.support}</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">{t.footer.contact}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{t.footer.terms}</li>
                <li className="hover:text-white transition-colors cursor-pointer">سياسة الخصوصية</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} GOLD MALL. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
