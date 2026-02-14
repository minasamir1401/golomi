"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getGoldLiveProducts } from "@/lib/api";
import { LoadingSpinner } from "./loading-spinner";

export function ProductList() {
    const [products, setProducts] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getGoldLiveProducts();
            if (data) setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="p-20 flex justify-center"><LoadingSpinner /></div>;
    if (!products) return null;

    const sections = [
        { title: "سبائك ذهبية صغيرة", items: products.small_ingots },
        { title: "عملات ذهبية", items: products.coins },
        { title: "سبائك ذهبية كبيرة", items: products.large_ingots },
    ];

    return (
        <div className="space-y-16 py-12">
            {sections.map((section, idx) => (
                <section key={idx}>
                    <h2 className="text-3xl font-black mb-8 border-r-4 border-gold-500 pr-4">{section.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {section.items.map((product: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card group flex flex-col items-center p-6 hover:border-gold-500/50 transition-all"
                            >
                                <div className="h-40 w-full mb-6 relative overflow-hidden rounded-2xl bg-white/5">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h4 className="font-bold text-center mb-4 min-h-[3rem] line-clamp-2">{product.title}</h4>
                                <div className="w-full flex items-center justify-between mt-auto">
                                    <span className="text-gold-600 dark:text-gold-400 font-black">{product.price}</span>
                                    <a
                                        href={product.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-gold-500 hover:text-white transition-all"
                                    >
                                        عرض التفاصيل
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
