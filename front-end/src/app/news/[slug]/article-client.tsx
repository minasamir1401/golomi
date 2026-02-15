"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Share2, Clock, Newspaper, Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";


interface ArticleClientProps {
    article: any;
    slug: string;
}

export default function ArticleClient({ article: initialArticle, slug }: ArticleClientProps) {
    const { isRTL } = useLanguage();
    const [article, setArticle] = useState<any>(initialArticle);
    const [loading, setLoading] = useState(!initialArticle);

    useEffect(() => {
        // Only fetch if we don't have the article and we have a slug
        if (!article && slug) {
            const fetchArticle = async () => {
                setLoading(true);
                try {
                    const { getArticle } = await import("@/lib/api");
                    const data = await getArticle(slug);
                    if (data) {
                        setArticle(data);
                    }
                } catch (err) {
                    console.error("Client fallback fetch failed:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchArticle();
        } else if (article) {
            setLoading(false);
        }
    }, [slug, initialArticle]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-10 w-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-4xl mx-auto pt-52 px-4 text-center">
                    <div className="h-20 w-20 bg-slate-100 dark:bg-[#151D2E] rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Bell className="h-10 w-10 text-slate-300 dark:text-[#1E293B]" />
                    </div>
                    <h1 className="text-2xl font-black mb-4">المقال غير موجود</h1>
                    <p className="text-slate-500 mb-8 font-bold">عذراً، لم نتمكن من العثور على الخبر الذي تبحث عنه.</p>
                    <Link href="/news" className="text-gold-500 font-bold flex items-center justify-center gap-2 hover:underline">
                        <ArrowRight className="h-4 w-4" />
                        <span>العودة للأخبار</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        "headline": article.title,
                        "image": [article.featured_image || "https://goldservice-egypt.com/og-image.jpg"],
                        "datePublished": article.created_at || new Date().toISOString(),
                        "dateModified": article.updated_at || new Date().toISOString(),
                        "author": [{
                            "@type": "Person",
                            "name": article.author || "Redaction Team",
                            "url": "https://goldservice-egypt.com/about"
                        }]
                    })
                }}
            />

            <main className="max-w-4xl mx-auto pt-44 sm:pt-52 px-4 sm:px-6 lg:px-8">
                {/* Back Link - Refined */}
                <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-600 font-bold mb-10 transition-colors group"
                >
                    <ArrowRight className={cn("h-4 w-4 transition-transform", isRTL ? "group-hover:translate-x-1" : "group-hover:-translate-x-1")} />
                    <span className="text-xs uppercase tracking-widest">العودة للأخبار والتقارير</span>
                </Link>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                    dir="rtl"
                >
                    {/* Header Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-[10px] tracking-widest uppercase border border-blue-500/20">
                                {article.category || "تقارير"}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Clock className="h-3.5 w-3.5" />
                                <span>قراءة في 5 دقائق</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-heavy text-slate-900 dark:text-white leading-[1.15] tracking-tighter">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-between py-6 border-y border-slate-100 dark:border-[#1E293B]">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center border border-slate-200 dark:border-[#33415C]">
                                    <User className="h-6 w-6 text-slate-400 dark:text-[#94A3B8]" />
                                </div>
                                <div>
                                    <p className="text-sm font-heavy text-slate-900 dark:text-white">{article.author || "فريق تحرير جولد سيرفيس"}</p>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-[#94A3B8] uppercase tracking-widest mt-0.5">{article.date}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (typeof navigator !== 'undefined' && navigator.share) {
                                        navigator.share({ title: article.title, url: window.location.href });
                                    }
                                }}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-[#0B1121] border border-slate-200 dark:border-[#1E293B] text-slate-500 hover:text-gold-600 transition-colors"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Featured Image - Grounded */}
                    {article.featured_image && (
                        <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-[#1E293B] shadow-sm relative aspect-[21/9]">
                            <img
                                src={article.featured_image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content Section - Simplified Styles */}
                    <div className="article-content prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:font-heavy prose-headings:tracking-tighter prose-headings:text-slate-900 dark:prose-headings:text-white
                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
                        prose-strong:text-slate-900 dark:prose-strong:text-gold-500
                        prose-img:rounded-3xl prose-img:border prose-img:border-slate-200 dark:prose-img:border-white/10
                    ">
                        {article.content_json && article.content_json !== "null" ? (
                            <div className="space-y-8">
                                {(() => {
                                    try {
                                        const blocks = typeof article.content_json === 'string'
                                            ? JSON.parse(article.content_json)
                                            : article.content_json;

                                        if (!Array.isArray(blocks)) return <div dangerouslySetInnerHTML={{ __html: article.content }} className="font-cairo" />;

                                        return blocks.map((block: any, idx: number) => {
                                            switch (block.type) {
                                                case 'h1': return <h1 key={idx} className="text-3xl md:text-4xl">{block.text}</h1>;
                                                case 'h2': return <h2 key={idx} className="text-2xl md:text-3xl">{block.text}</h2>;
                                                case 'p': return <p key={idx}>{block.text}</p>;
                                                case 'image': return (
                                                    <div key={idx} className="my-10 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10">
                                                        <img src={block.url} alt={block.caption || ""} className="w-full object-cover" />
                                                        {block.caption && <p className="text-center text-xs text-slate-400 mt-4 font-bold">{block.caption}</p>}
                                                    </div>
                                                );
                                                case 'html': return <div key={idx} dangerouslySetInnerHTML={{ __html: block.html }} />;
                                                default: return null;
                                            }
                                        });
                                    } catch (e) {
                                        return <div dangerouslySetInnerHTML={{ __html: article.content }} className="font-cairo" />;
                                    }
                                })()}
                            </div>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} className="font-cairo" />
                        )}
                    </div>

                    {/* Newsletter CTA - Grounded Style */}
                    <div className="mt-20 p-8 sm:p-14 bg-[#161E54] dark:bg-[#0B1121] rounded-[3rem] text-white overflow-hidden relative border border-white/5 dark:border-[#1E293B]">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold-500/10 to-transparent" />
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="h-16 w-16 bg-gold-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-gold-500/20">
                                <Newspaper className="h-8 w-8 text-[#0B1121]" />
                            </div>
                            <h3 className="text-3xl font-heavy mb-4">اشترك في نشرتنا الإخبارية</h3>
                            <p className="text-[#BBE0EF]/60 dark:text-[#94A3B8] font-bold mb-10 max-w-md mx-auto leading-relaxed">كن أول من يعلم بتحركات الذهب والفرص الاستثمارية في السوق المصري.</p>
                            <Link
                                href="/news"
                                className="inline-flex items-center gap-3 px-10 py-5 rounded-3xl bg-white text-[#161E54] font-heavy shadow-xl hover:bg-gold-500 transition-all hover:scale-105 active:scale-95 group"
                            >
                                <span>استكشف المزيد من التقارير</span>
                                <ArrowRight className={cn("h-5 w-5 transition-transform", isRTL && "rotate-180")} />
                            </Link>
                        </div>
                    </div>
                </motion.article>
            </main>

            <style>{`
                .article-content { font-family: inherit; }
                .article-content blockquote {
                    border-right: 4px solid #eab308;
                    padding-right: 1.5rem;
                    font-style: italic;
                    color: #64748b;
                    background: #f8fafc;
                    padding-top: 1rem;
                    padding-bottom: 1rem;
                    border-radius: 0 1rem 1rem 0;
                }
                .dark .article-content blockquote {
                    background: #0f172a;
                    color: #94a3b8;
                    border-right-color: #eab308;
                }
            `}</style>
        </div>
    );
}
