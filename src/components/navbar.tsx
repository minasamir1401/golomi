"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Bell, Globe, Banknote, LayoutDashboard, Calculator, Menu, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { useMarketData } from "./market-data-provider";

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { locale, setLocale, t } = useLanguage();
    const { snapshot } = useMarketData();
    const [siteTitle, setSiteTitle] = useState({ first: "جولد", second: "سيرفيس" });

    useEffect(() => {
        if (snapshot?.settings?.site_title) {
            const title = snapshot.settings.site_title;
            const parts = title.split("|")[0].trim().split(" ");
            if (parts.length > 1) {
                setSiteTitle({ first: parts[0], second: parts.slice(1).join(" ") });
            } else {
                setSiteTitle({ first: locale === 'ar' ? 'سوق' : 'Market', second: parts[0] });
            }
        }
    }, [snapshot, locale]);

    const navigation = [
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: "/", icon: LayoutDashboard },
        { name: t.nav.gold, href: "/gold", icon: Coins },
        { name: locale === 'ar' ? 'الفضة' : 'Silver', href: "/silver", icon: Coins },
        { name: t.nav.currencies, href: "/currencies", icon: Banknote },
        { name: t.nav.calc, href: "/calculator", icon: Calculator },
        { name: locale === 'ar' ? 'الأخبار' : 'News', href: "/news", icon: Bell },
        { name: t.nav.countries, href: "/countries", icon: Globe },
    ];

    const menuVariants = {
        closed: {
            opacity: 0,
            y: -20,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.07,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -10 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <header className="navbar-header fixed top-0 left-0 right-0 z-[100] no-print shadow-md">
            <div className="max-w-7xl mx-auto px-1.5 min-[320px]:px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex items-center justify-between h-14 min-[320px]:h-16">
                    {/* LOGO SECTION (START) */}
                    <Link href="/" className="flex items-center gap-0.5 min-[350px]:gap-3 shrink-0">
                        <div className="flex flex-col items-start rtl:items-end">
                            <div className="flex items-center gap-0.5 min-[350px]:gap-1">
                                <span className="bg-[#161E54] dark:bg-[#FFB800] text-white dark:text-[#0B1121] text-[5px] min-[320px]:text-[10px] px-0.5 min-[350px]:px-1 py-0.5 rounded font-black uppercase whitespace-nowrap">
                                    {siteTitle.first}
                                </span>
                                <span className="text-xs min-[320px]:text-sm min-[350px]:text-xl sm:text-2xl font-heavy text-[#161E54] dark:text-white tracking-tighter whitespace-nowrap">
                                    {siteTitle.second}
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* NAVIGATION LINKS (CENTER) */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-base font-heavy transition-all",
                                        isActive
                                            ? "text-[#161E54] dark:text-white underline underline-offset-8 decoration-2 decoration-[#F16D34] dark:decoration-[#FFB800]"
                                            : "text-[#161E54]/70 dark:text-[#B6B09F] hover:text-[#161E54] dark:hover:text-white"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ACTIONS AREA (END) */}
                    <div className="flex items-center gap-0.5 min-[320px]:gap-2 min-[400px]:gap-3">
                        <Link
                            href="https://play.google.com/store/apps"
                            className="hidden sm:flex items-center gap-2 bg-[#F16D34] text-white px-5 py-2 rounded-full font-heavy text-sm shadow-sm hover:opacity-90 transition-all"
                        >
                            <svg className="w-4 h-4 -rotate-45" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            {locale === 'ar' ? 'تحميل التطبيق' : 'Download App'}
                        </Link>

                        <div className="scale-75 min-[320px]:scale-100 origin-right">
                            <ThemeToggle />
                        </div>

                        <button
                            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
                            className="h-7 min-[320px]:h-8 px-1 min-[320px]:px-3 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-heavy text-[8px] min-[320px]:text-xs hover:bg-slate-200 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-white/20 whitespace-nowrap"
                        >
                            {locale === 'ar' ? 'EN' : 'عربي'}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden h-7 w-7 min-[320px]:h-10 min-[320px]:w-10 flex items-center justify-center rounded-lg min-[320px]:rounded-xl bg-slate-100 dark:bg-white/10 text-[#161E54] dark:text-white shrink-0 active:scale-90 transition-transform"
                        >
                            {isOpen ? <X className="h-4 w-4 min-[320px]:h-6 min-[320px]:w-6" /> : <Menu className="h-4 w-4 min-[320px]:h-6 min-[320px]:w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 top-16 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
                        />
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-16 left-0 right-0 z-[100] lg:hidden overflow-hidden"
                        >
                            <div className="bg-white/95 dark:bg-[#0B1121]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-2xl rounded-b-[2.5rem]">
                                <div className="p-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        const Icon = item.icon;
                                        return (
                                            <motion.div key={item.href} variants={itemVariants}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-2xl text-base font-bold transition-all relative group",
                                                        isActive
                                                            ? "bg-[#F16D34]/10 dark:bg-[#FFB800]/10 text-[#F16D34] dark:text-[#FFB800]"
                                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#161E54] dark:hover:text-white"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                                                        isActive
                                                            ? "bg-[#F16D34] dark:bg-[#FFB800] text-white dark:text-[#0B1121]"
                                                            : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-white/20"
                                                    )}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className="flex-1">{item.name}</span>
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="active-pill-mobile"
                                                            className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#F16D34] dark:bg-[#FFB800]"
                                                        />
                                                    )}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}

                                    <motion.div variants={itemVariants} className="pt-2">
                                        <Link
                                            href="https://play.google.com/store/apps"
                                            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#F16D34] to-[#FF986A] dark:from-[#FFB800] dark:to-[#F59E0B] text-white font-heavy shadow-lg shadow-orange-500/20 dark:shadow-yellow-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            <svg className="w-5 h-5 -rotate-45" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                            </svg>
                                            {locale === 'ar' ? 'تحميل تطبيق السوق' : 'Download Market App'}
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
