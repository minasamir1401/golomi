"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { TiptapEditor } from "@/components/tiptap-editor";
import { HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Layout, Palette, Image as ImageIcon, FileText, User, Tag, ChevronDown, Check } from "lucide-react";
import { getArticle, updateNewsArticle } from "@/lib/api";

export default function EditNewsPage() {
    const router = useRouter();
    const params = useParams();
    const slugParams = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [titleColor, setTitleColor] = useState("#000000");
    const [titleSize, setTitleSize] = useState("text-3xl");
    const [featuredImage, setFeaturedImage] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDesc, setMetaDesc] = useState("");
    const [author, setAuthor] = useState("Admin");
    const [category, setCategory] = useState("General");
    const [status, setStatus] = useState("published");

    // UI Toggles
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        if (slugParams) {
            fetchArticleData();
        }
    }, [slugParams]);

    const fetchArticleData = async () => {
        try {
            const data = await getArticle(slugParams);
            if (data) {
                setTitle(data.title);
                setSlug(data.slug);
                setContent(data.content);
                setTitleColor(data.title_color || "#000000");
                setTitleSize(data.title_size || "text-3xl");
                setFeaturedImage(data.featured_image || "");
                setMetaTitle(data.meta_title || "");
                setMetaDesc(data.meta_description || "");
                setAuthor(data.author || "Admin");
                setCategory(data.category || "General");
                setStatus(data.status || "published");
            }
        } catch (error) {
            console.error("Error fetching article:", error);
            alert("فشل تحميل بيانات الخبر");
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (text: string) => {
        // Arabic to Latin transliteration map
        const arabicToLatin: Record<string, string> = {
            'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
            'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
            'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
            'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
            'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
            'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
            'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
            'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
            'ة': 'h', 'ء': 'a'
        };

        let slug = text.toLowerCase();

        // Replace Arabic characters with Latin equivalents
        slug = slug.split('').map(char => arabicToLatin[char] || char).join('');

        // Remove special characters and keep only alphanumeric and spaces
        slug = slug.replace(/[^a-z0-9\s-]/g, '');

        // Replace spaces with hyphens
        slug = slug.replace(/\s+/g, '-');

        // Replace multiple hyphens with single hyphen
        slug = slug.replace(/--+/g, '-');

        // Remove leading/trailing hyphens
        slug = slug.replace(/^-+|-+$/g, '');

        return slug || `article-${Date.now()}`; // Fallback if slug is empty
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleUpdate = async () => {
        setSaving(true);
        try {
            const payload = {
                title,
                slug: slug || generateSlug(title),
                content,
                title_color: titleColor,
                title_size: titleSize,
                featured_image: featuredImage,
                meta_title: metaTitle || title,
                meta_description: metaDesc,
                author,
                category,
                status
            };

            await updateNewsArticle(slugParams, payload);

            alert("تم تحديث الخبر بنجاح!");
            router.push("/admin-hidden-portal/news");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "حدث خطأ أثناء التحديث.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-cairo">
                جاري تحميل البيانات...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            <Navbar />

            <div className="max-w-5xl mx-auto pt-32 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </button>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white font-cairo">تعديل الخبر</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleUpdate}
                            disabled={saving || !title}
                            className="px-6 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 font-cairo disabled:opacity-50 transition-all"
                        >
                            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            حفظ التعديلات
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title Section */}
                        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-500 mb-2 font-cairo">عنوان الخبر</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    className="w-full text-2xl font-bold bg-transparent border-b-2 border-slate-200 dark:border-slate-800 focus:border-gold-500 outline-none py-2 transition-colors font-cairo"
                                    placeholder="أكتب عنواناً جذاباً..."
                                    style={{ color: titleColor }}
                                />
                            </div>

                            {/* Toolbar for Title */}
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: titleColor }} />
                                        <span className="font-cairo">لون العنوان</span>
                                        <ChevronDown className="w-3 h-3 text-slate-400" />
                                    </button>
                                    <AnimatePresence>
                                        {showColorPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-2 z-20"
                                            >
                                                <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)} />
                                                <div className="relative z-20 bg-white p-2 rounded-xl shadow-xl border border-slate-100">
                                                    <HexColorPicker color={titleColor} onChange={setTitleColor} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                                    {['text-xl', 'text-2xl', 'text-3xl', 'text-4xl'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setTitleSize(size)}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${titleSize === size ? 'bg-white dark:bg-slate-800 shadow-sm text-gold-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {size.replace('text-', '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <TiptapEditor content={content} onChange={setContent} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Status */}
                        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-cairo text-sm">
                                <Layout className="w-4 h-4 text-emerald-500" />
                                حالة النشر
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 cursor-pointer border border-transparent hover:border-gold-500/30 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold font-cairo text-emerald-600 dark:text-emerald-400">نشر فوراً (Published)</span>
                                        <span className="text-[10px] text-slate-400 font-cairo mt-1">يظهر للزوار على الموقع فوراً</span>
                                    </div>
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={status === 'published'}
                                        onChange={() => setStatus('published')}
                                        className="accent-gold-600 w-4 h-4 mt-1"
                                    />
                                </label>
                                <label className="flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 cursor-pointer border border-transparent hover:border-gold-500/30 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold font-cairo text-amber-600 dark:text-amber-400">مسودة (Draft)</span>
                                        <span className="text-[10px] text-slate-400 font-cairo mt-1">حفظ للمراجعة فقط (لا يظهر)</span>
                                    </div>
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={status === 'draft'}
                                        onChange={() => setStatus('draft')}
                                        className="accent-gold-600 w-4 h-4 mt-1"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Category & Author */}
                        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-cairo text-sm">
                                <Tag className="w-4 h-4 text-purple-500" />
                                التصنيف والكاتب
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block font-cairo">القسم</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-sm font-cairo outline-none focus:border-gold-500"
                                    >
                                        <option value="General">عام</option>
                                        <option value="Economy">اقتصاد</option>
                                        <option value="Gold">ذهب</option>
                                        <option value="Currencies">عملات</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block font-cairo">الكاتب</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-sm font-cairo outline-none focus:border-gold-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-cairo text-sm">
                                <ImageIcon className="w-4 h-4 text-blue-500" />
                                صورة الغلاف
                            </h3>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="رابط الصورة..."
                                        value={featuredImage}
                                        onChange={(e) => setFeaturedImage(e.target.value)}
                                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-sm font-cairo outline-none focus:border-gold-500 dir-ltr"
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = async (e) => {
                                                const file = (e.target as HTMLInputElement).files?.[0];
                                                if (file) {
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    try {
                                                        const res = await fetch(`/api/upload`, { method: 'POST', body: formData });
                                                        if (res.ok) {
                                                            const data = await res.json();
                                                            setFeaturedImage(data.url);
                                                        } else alert("فشل الرفع");
                                                    } catch (err) { alert("حدث خطأ"); }
                                                }
                                            };
                                            input.click();
                                        }}
                                        className="px-3 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200"
                                    >
                                        <ImageIcon className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>
                                {featuredImage && (
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <img src={featuredImage} alt="Cover" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEO */}
                        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 font-cairo text-sm">
                                <FileText className="w-4 h-4 text-orange-500" />
                                تحسينات SEO
                            </h3>
                            <p className="text-xs text-slate-400 mb-4 font-cairo">💡 إذا تركت الحقول فارغة، سيتم ملؤها تلقائياً من العنوان والمحتوى</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block font-cairo">Meta Title</label>
                                    <input
                                        type="text"
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-sm font-cairo outline-none focus:border-gold-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block font-cairo">Meta Description</label>
                                    <textarea
                                        value={metaDesc}
                                        onChange={(e) => setMetaDesc(e.target.value)}
                                        rows={3}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-sm font-cairo outline-none focus:border-gold-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block font-cairo">Slug</label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs font-mono font-cairo outline-none focus:border-gold-500 dir-ltr text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
