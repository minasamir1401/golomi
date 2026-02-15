"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { getNews, deleteNewsArticle } from "@/lib/api";
import { ArrowLeft, Plus, Edit, Trash2, Eye, FileText, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewsDashboardPage() {
    const router = useRouter();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const data = await getNews(undefined, 1, 100);
            setArticles(data.articles || []);
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (slug: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الخبر؟")) return;

        try {
            await deleteNewsArticle(slug);
            setArticles(articles.filter(a => a.slug !== slug));
        } catch (error) {
            console.error("Delete error:", error);
            alert("حدث خطأ أثناء الحذف");
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto pt-32 px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin-hidden-portal" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white font-cairo">إدارة الأخبار</h1>
                            <p className="text-slate-500 font-cairo text-sm mt-1">إجمالي {articles.length} خبر</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="بحث..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-4 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-gold-500 font-cairo w-64"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <Link
                            href="/admin-hidden-portal/news/add"
                            className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 font-cairo transition-colors shadow-lg shadow-gold-600/20"
                        >
                            <Plus className="w-4 h-4" />
                            إضافة خبر جديد
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500 font-cairo">جاري التحميل...</div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center gap-4 text-slate-500">
                            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                            <p className="font-cairo text-lg">لا توجد أخبار حتى الآن</p>
                            <Link href="/admin-hidden-portal/news/add" className="text-gold-600 hover:underline font-cairo text-sm font-bold">إبدأ بإضافة أول خبر</Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-400 font-cairo text-xs uppercase tracking-wider">العنوان</th>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-400 font-cairo text-xs uppercase tracking-wider">الحالة</th>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-400 font-cairo text-xs uppercase tracking-wider">المشاهدات</th>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-400 font-cairo text-xs uppercase tracking-wider">تاريخ النشر</th>
                                        <th className="p-4 font-bold text-slate-600 dark:text-slate-400 font-cairo text-xs uppercase tracking-wider text-left">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {filteredArticles.map((article) => (
                                        <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {article.featured_image ? (
                                                        <img src={article.featured_image} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">No Img</div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 font-cairo">{article.title}</h3>
                                                        <span className="text-xs text-slate-500 font-cairo flex items-center gap-1">{article.category} • {article.author}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full text-[10px] font-bold font-cairo border",
                                                    article.status === 'published'
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-400"
                                                        : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400"
                                                )}>
                                                    {article.status === 'published' ? 'منشور' : 'مسودة'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-slate-500 text-sm font-bold font-mono">
                                                    <Eye className="w-3 h-3" />
                                                    {article.views || 0}
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-bold text-slate-500 font-cairo">
                                                {new Date(article.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/news/${article.slug}`}
                                                        target="_blank"
                                                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="عرض"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin-hidden-portal/news/edit/${article.slug}`}
                                                        className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                        title="تعديل"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(article.slug)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="حذف"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
