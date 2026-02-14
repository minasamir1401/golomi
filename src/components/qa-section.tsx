"use client";

import { useEffect, useState } from "react";
import { QAItem, getQAItems } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { useMarketData } from "./market-data-provider";

export function QASection({ pageKey }: { pageKey?: string }) {
    const { snapshot, loading } = useMarketData();
    const [expanded, setExpanded] = useState<number | null>(null);
    const { locale } = useLanguage();

    const items = (snapshot?.qa as any[])?.filter((q: any) => !pageKey || q.page_key === pageKey) || [];

    if (loading && !snapshot) return null;
    if (items.length === 0) return null;

    return (
        <section className="w-full">

            <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-gold-500" />
                <h2 className="section-title mb-0">
                    {locale === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
                </h2>
            </div>

            <div className="bg-white dark:bg-[#151D2E] rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-black/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="border border-slate-100 dark:border-[#1E293B] rounded-2xl overflow-hidden bg-slate-50 dark:bg-[#0B1121]/50 transition-all hover:border-gold-500/30 h-fit"

                        >
                            <button
                                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 text-right w-full"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                                        <MessageCircle className="w-4 h-4 text-gold-600 dark:text-gold-500" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-heavy text-slate-900 dark:text-white leading-relaxed">
                                        {item.question}
                                    </h3>
                                </div>
                                <ChevronDown
                                    className={cn(
                                        "w-5 h-5 text-slate-400 transition-transform duration-300",
                                        expanded === item.id && "rotate-180 text-gold-500"
                                    )}
                                />
                            </button>
                            <AnimatePresence>
                                {expanded === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0">
                                            <div className="pr-11 pl-4">
                                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
