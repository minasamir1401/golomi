import { getNews } from "@/lib/api";
import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Bell, ChevronLeft, Calendar, Share2 } from "lucide-react";
import AdBanner from "@/components/ads/ad-banner";

export const metadata: Metadata = {
    title: "أخبار الذهب والاقتصاد | جولد مول",
    description: "تابع أحدث أخبار سوق الذهب والتحليلات الاقتصادية في مصر والعالم.",
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewsPage() {
    const data = await getNews(undefined, 1, 100);
    const news = data.articles || [];

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            {/* GROUNDED HERO */}
            <section className="hero-section mb-8 min-[350px]:mb-12 pt-24 min-[350px]:pt-32">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center px-4">
                    <div className="inline-flex items-center gap-2 bg-[#BBE0EF]/10 border border-[#BBE0EF]/20 text-[#161E54] dark:text-[#94A3B8] px-3 min-[350px]:px-4 py-1.5 rounded-full mb-4 min-[350px]:mb-6">
                        <Bell className="w-3.5 min-[350px]:w-4 h-3.5 min-[350px]:h-4" />
                        <span className="text-[10px] min-[350px]:text-xs font-black uppercase tracking-widest pt-0.5">آخر الأخبار والتقارير</span>
                    </div>
                    <h1 className="text-2xl min-[350px]:text-4xl sm:text-6xl font-heavy text-[#161E54] dark:text-white mb-3 min-[350px]:mb-4 tracking-tighter leading-tight">
                        أخبار <span className="text-gradient-gold lowercase">الذهب</span> والاقتصاد
                    </h1>
                    <p className="max-w-xl text-[#161E54]/40 dark:text-[#94A3B8] font-bold text-xs min-[350px]:text-base leading-relaxed px-4">
                        تحليلات يومية وأخبار حصرية من خبراء السوق لمساعدتك في اتخاذ قراراتك الاستثمارية
                    </p>
                </div>
            </section>
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <AdBanner type="horizontal" />
                <AdBanner type="native" />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {news.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-[#BBE0EF]/5 dark:bg-white/5 rounded-3xl border border-dashed border-[#BBE0EF]/30">
                            <p className="text-[#161E54]/40 dark:text-[#BBE0EF]/40 font-bold">لا توجد أخبار حالياً.</p>
                        </div>
                    ) : (
                        news.map((item: any) => (
                            <Link
                                href={`/news/${item.slug}`}
                                key={item.slug}
                                className="group flex flex-col bg-white dark:bg-[#151D2E] rounded-[2rem] min-[350px]:rounded-3xl overflow-hidden border border-[#BBE0EF]/30 dark:border-[#1E293B] hover:border-[#FFB800] transition-all shadow-sm hover:shadow-2xl"
                            >
                                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100 dark:bg-[#0B1121]">
                                    {item.featured_image ? (
                                        <img
                                            src={item.featured_image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Bell className="w-12 h-12 text-[#BBE0EF]/30" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#161E54]/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        {item.category || "عام"}
                                    </div>
                                </div>

                                <div className="p-6 min-[350px]:p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-4 text-[#161E54]/40 dark:text-[#94A3B8]">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {new Date(item.created_at).toLocaleDateString("ar-EG", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <h3 className="text-lg min-[350px]:text-xl font-heavy text-[#161E54] dark:text-white mb-3 min-[350px]:mb-4 line-clamp-2 leading-tight group-hover:text-gold-500 transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-[#161E54]/60 dark:text-[#94A3B8] line-clamp-3 text-[10px] min-[350px]:text-sm font-bold leading-relaxed mb-6 flex-1">
                                        {item.meta_description || "اقرأ المزيد عن هذا الخبر والتحليلات الاقتصادية المتعلقة بتوقعات أسعار الذهب."}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-[#BBE0EF]/10 dark:border-[#1E293B]">
                                        <div className="flex items-center gap-2 text-gold-500 font-heavy text-xs">
                                            <span>إقرأ المزيد</span>
                                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                <div className="mt-6 flex flex-col gap-2 no-print">
                    <AdBanner type="native" />
                    <AdBanner type="horizontal" />
                    <AdBanner type="horizontal" />
                </div>
            </main>
        </div>
    );
}
