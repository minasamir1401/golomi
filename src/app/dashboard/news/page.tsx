
"use client";

import { useEffect, useState } from "react";
import { getNews, deleteNewsArticle } from "@/lib/api";
import { Trash2, Edit, Plus, RefreshCw, X } from "lucide-react";

export default function NewsDashboard() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newArticle, setNewArticle] = useState({
        title: "",
        content: "",
        slug: "",
        meta_title: "",
        meta_description: "",
        featured_image: ""
    });

    const fetchNews = async () => {
        setLoading(true);
        const data = await getNews(undefined, 1, 50);
        setNews(data.articles || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (slug: string) => {
        if (confirm("Are you sure you want to delete this article?")) {
            await deleteNewsArticle(slug);
            fetchNews();
        }
    };

    const handleSaveArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement create/update logic via API call
        // Currently using placeholder
        alert("Article creation API integration pending backend adjustment for POST");
        setShowModal(false);
    };

    return (
        <div className="container mx-auto p-6 font-cairo" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">إدارة الأخبار والمقالات</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة مقال جديد</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-4 font-semibold">العنوان</th>
                            <th className="px-6 py-4 font-semibold">Slug</th>
                            <th className="px-6 py-4 font-semibold">تاريخ النشر</th>
                            <th className="px-6 py-4 font-semibold text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    جاري التحميل...
                                </td>
                            </tr>
                        ) : news.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    لا توجد مقالات حالياً
                                </td>
                            </tr>
                        ) : (
                            news.map((item) => (
                                <tr key={item.id || item.slug} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                        {item.title}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                                        {item.slug}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(item.created_at || Date.now()).toLocaleDateString("ar-EG")}
                                    </td>
                                    <td className="px-6 py-4 flex justify-center gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.slug)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-4">إضافة مقال جديد</h2>
                            <form onSubmit={handleSaveArticle} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان المقال</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                                        value={newArticle.title}
                                        onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (Rabit)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-yellow-500"
                                            value={newArticle.slug}
                                            onChange={(e) => setNewArticle({ ...newArticle, slug: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">صورة بارزة (URL)</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-yellow-500"
                                            value={newArticle.featured_image}
                                            onChange={(e) => setNewArticle({ ...newArticle, featured_image: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المحتوى</label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-yellow-500 resize-none"
                                        value={newArticle.content}
                                        onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition shadow-lg shadow-yellow-500/20"
                                    >
                                        حفظ ونشر
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
