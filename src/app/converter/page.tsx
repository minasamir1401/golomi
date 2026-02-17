"use client";

import { Navbar } from "@/components/navbar";
import { CurrencyConverter } from "@/components/currency-converter";
import { RefreshCcw, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function ConverterPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                <header className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="h-16 w-16 rounded-full blue-gradient-bg flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
                            <RefreshCcw className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground">محول العملات المتقدم</h1>
                        <p className="text-secondary max-w-xl">احصل على نتائج دقيقة وفورية لتحويل العملات بناءً على أحدث أسعار الصرف المتوفرة عالمياً ومحلياً.</p>
                    </motion.div>
                </header>

                <section className="mb-20">
                    <CurrencyConverter />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            title: "دقة عالية",
                            desc: "تحديثات لحظية لكل تغيير في سعر الصرف من مصادر موثوقة.",
                            icon: Info
                        },
                        {
                            title: "تعدد العملات",
                            desc: "دعم لأكثر من 20 عملة عربية وعالمية الأكثر تداولاً.",
                            icon: Info
                        },
                        {
                            title: "سهولة الاستخدام",
                            desc: "واجهة بسيطة وسريعة تعمل ببراعة على كافة الأجهزة.",
                            icon: Info
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 text-center group hover:bg-primary/5 transition-colors"
                        >
                            <div className="h-10 w-10 rounded-xl bg-primary-500/10 mx-auto flex items-center justify-center text-primary-500 mb-4 group-hover:scale-110 transition-transform">
                                <feature.icon className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold mb-2">{feature.title}</h4>
                            <p className="text-sm text-secondary">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
