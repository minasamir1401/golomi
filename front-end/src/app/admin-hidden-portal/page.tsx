"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminSettings, updateAdminSetting, getAdminStats, seedHistoricalArchive, getRawCache, updateManualPrice, getManualPrices, getNews, deleteNewsArticle, triggerNewsScrape, testNewsSources, triggerGoldScrape, triggerCurrencyScrape, getQAItems, createQAItem, updateQAItem, deleteQAItem, getMe, getUsers, createUser, updateUser, deleteUser, changePassword, getCurrencySources, updateCurrencySource, reorderCurrencySources, testCurrencySource, getSilverSources, updateSilverSource, reorderSilverSources, testSilverSource, testGoldSource } from "@/lib/api";

import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Shield, Power, Activity, Clock, Database, Globe, Zap, AlertCircle, DatabaseBackup, ListTree, Code2, RefreshCw, ShieldCheck, Coins, Newspaper, Trash2, PlusCircle, Search, ArrowUp, ArrowDown, ArrowRightLeft, Save, HelpCircle, MessageCircle, Users, KeyRound, LogOut, UserPlus, Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminPortal() {
    const router = useRouter();
    const [settings, setSettings] = useState<any>({});
    const [stats, setStats] = useState<any>({});
    const [rawCache, setRawCache] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);
    const [activeTab, setActiveTab] = useState<"config" | "prices" | "news" | "qa" | "live" | "raw" | "sources" | "users" | "security">("config");

    // Auth & User States
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userForm, setUserForm] = useState({ username: "", password: "", role: "admin", is_active: true });
    const [isEditingUser, setIsEditingUser] = useState<number | null>(null);
    const [passwordForm, setPasswordForm] = useState({ oldWith: "", newWith: "" });
    const [profileForm, setProfileForm] = useState({ username: "", oldPassword: "", newPassword: "", confirmPassword: "" });
    const [showUserModal, setShowUserModal] = useState(false);

    // Price Control States
    const [manualPrices, setManualPrices] = useState<any>({});
    const [offset, setOffset] = useState("0");
    const [siteTitle, setSiteTitle] = useState("");
    const [siteKeywords, setSiteKeywords] = useState("");

    // News States
    const [news, setNews] = useState<any[]>([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [newsStats, setNewsStats] = useState<any>(null);

    // QA States
    const [qaItems, setQaItems] = useState<any[]>([]);
    const [qaLoading, setQaLoading] = useState(false);
    const [qaForm, setQaForm] = useState({ question: "", answer: "", display_order: 0, is_active: true, page_key: "home" });
    const [editingQaId, setEditingQaId] = useState<number | null>(null);
    const [filterPage, setFilterPage] = useState<string>("all");


    const scrapers = [
        { id: "GoldEra", name: "Gold Era Egypt", icon: Zap, color: "text-gold-600", desc: "المصدر الرئيسي للأسعار في مصر، يسحب من الموقع الرسمي لشركة Gold Era." },
        { id: "GoldBullion", name: "Gold Bullion", icon: Coins, color: "text-amber-600", desc: "مصدر موثوق لأسعار الذهب والسبائك." },
        { id: "EgyptGoldPriceToday", name: "Gold Price Today", icon: Globe, color: "text-emerald-600", desc: "تحديثات لحظية من سوق الصاغة المصري." },
        { id: "GoldPriceLive", name: "Gold Price Live", icon: Activity, color: "text-purple-600", desc: "أسعار حيّة وتحليلات للسوق المحلي." },
        { id: "SouqPriceToday", name: "Souq Price Today", icon: ListTree, color: "text-red-500", desc: "متابعة أسعار السوق والعملات." },
    ];



    const [sourceOrder, setSourceOrder] = useState<string[]>([]);
    const [goldTestResults, setGoldTestResults] = useState<any>({});
    const [currencySources, setCurrencySources] = useState<any[]>([]);
    const [currencyTestResults, setCurrencyTestResults] = useState<any>({});
    const [silverSources, setSilverSources] = useState<any[]>([]);
    const [silverTestResults, setSilverTestResults] = useState<any>({});
    const [newsTestResults, setNewsTestResults] = useState<any>(null);
    const [testingNews, setTestingNews] = useState(false);

    const [isInitialized, setIsInitialized] = useState(false);

    const fetchAll = async (isInitial = false) => {
        try {
            if (isInitial) {
                // 🛡️ Pre-auth check: check storage first
                const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
                if (!token) {
                    router.push("/admin-login");
                    return;
                }

                const me = await getMe();
                if (me) {
                    setCurrentUser(me);
                    setProfileForm({ username: me.username, oldPassword: "", newPassword: "", confirmPassword: "" });
                } else {
                    router.push("/admin-login");
                    return;
                }
            }

            const [sData, stData, rData, mData, cSources, sSources] = await Promise.all([
                (isInitial || !isInitialized) ? getAdminSettings() : Promise.resolve(null),
                getAdminStats(),
                (activeTab === "raw" || activeTab === "live") ? getRawCache() : Promise.resolve(null),
                (isInitial || !isInitialized) ? getManualPrices() : Promise.resolve(null),
                getCurrencySources(),
                getSilverSources()
            ]);

            if (cSources) setCurrencySources(cSources);
            if (sSources) setSilverSources(sSources);

            if (sData) {
                setSettings(sData);
                setOffset(sData.price_offset || "0");

                const orderSetting = Array.isArray(sData)
                    ? sData.find((s: any) => s.key === "gold_source_order")
                    : sData.gold_source_order;

                if (orderSetting?.value) {
                    setSourceOrder(orderSetting.value.split(",").map((s: string) => s.trim()).filter((id: string) => scrapers.find(sc => sc.id === id)));
                } else if (typeof orderSetting === 'string') {
                    setSourceOrder(orderSetting.split(",").map(s => s.trim()).filter(id => scrapers.find(sc => sc.id === id)));
                } else {
                    setSourceOrder(scrapers.map(s => s.id));
                }

                const titleSet = Array.isArray(sData) ? sData.find((s: any) => s.key === "site_title") : sData.site_title;
                const keySet = Array.isArray(sData) ? sData.find((s: any) => s.key === "site_keywords") : sData.site_keywords;
                setSiteTitle(titleSet?.value || titleSet || "جولد سيرفيس");
                setSiteKeywords(keySet?.value || keySet || "ذهب, أسعار, مصر, تحديث لحظي");

                setIsInitialized(true);
            }

            if (stData) setStats(stData);
            if (rData) setRawCache(rData);
            if (mData && (isInitial || !isInitialized)) setManualPrices(mData);

            if (activeTab === "news" && isInitial) fetchNews();
            if (activeTab === "qa" && isInitial) fetchQa();
            if (activeTab === "security") fetchUsersList();

        } catch (error) {
            console.error("Error in fetchAll:", error);
            // If it's the initial load and it fails critically, maybe redirect to login
            if (isInitial) router.push("/admin-login");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersList = async () => {
        setUsersLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (e) {
            console.error("Failed to fetch users", e);
        }
        setUsersLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("username");
        router.push("/admin-login");
    };

    const handleSaveUser = async () => {
        setSaving("user");
        if (!userForm.username || (!isEditingUser && !userForm.password)) {
            setSaving(null);
            return alert("يرجى ملء جميع الحقول");
        }
        try {
            if (isEditingUser) {
                await updateUser(isEditingUser, userForm);
                alert("تم تحديث المستخدم بنجاح");
            } else {
                await createUser(userForm);
                alert("تم إنشاء المستخدم بنجاح");
            }
            setShowUserModal(false);
            setUserForm({ username: "", password: "", role: "admin", is_active: true });
            setIsEditingUser(null);
            fetchUsersList();
        } catch (e: any) {
            alert(e.message || "حدث خطأ");
        } finally {
            setSaving(null);
        }
    };

    const handleUpdateProfile = async () => {
        if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
            return alert("كلمة المرور الجديدة غير متطابقة");
        }

        setSaving("profile");
        try {
            // 1. Update Username if changed
            if (profileForm.username !== currentUser.username) {
                await updateUser(currentUser.id, { username: profileForm.username });
                alert("تم تحديث اسم المستخدم. يرجى تسجيل الدخول مرة أخرى.");
                handleLogout();
                return;
            }

            // 2. Update Password if provided
            if (profileForm.newPassword) {
                if (!profileForm.oldPassword) {
                    setSaving(null);
                    return alert("يرجى إدخال كلمة المرور الحالية لتغييرها");
                }
                await changePassword(profileForm.oldPassword, profileForm.newPassword);
                alert("تم تحديث كلمة المرور بنجاح");
            }

            // Refresh user data
            const me = await getMe();
            if (me) {
                setCurrentUser(me);
                setProfileForm(prev => ({ ...prev, oldPassword: "", newPassword: "", confirmPassword: "" }));
            }
            alert("تم تحديث الملف الشخصي بنجاح");
        } catch (e: any) {
            alert(e.message || "فشل تحديث الملف الشخصي");
        } finally {
            setSaving(null);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
        try {
            await deleteUser(id);
            alert("تم الحذف بنجاح");
            fetchUsersList();
        } catch (e: any) {
            alert(e.message || "حدث خطأ");
        }
    };

    const handleChangePassword = async () => {
        if (!passwordForm.oldWith || !passwordForm.newWith) return alert("يرجى إدخال كلمة المرور القديمة والجديدة");
        try {
            await changePassword(passwordForm.oldWith, passwordForm.newWith);
            alert("تم تغيير كلمة المرور بنجاح");
            setPasswordForm({ oldWith: "", newWith: "" });
        } catch (e: any) {
            alert(e.message || "فشل تغيير كلمة المرور");
        }
    };

    const fetchNews = async () => {
        setNewsLoading(true);
        const data = await getNews(undefined, 1, 50);
        if (data && data.articles) setNews(data.articles);
        setNewsLoading(false);
    };

    const fetchQa = async () => {
        setQaLoading(true);
        const data = await getQAItems(false); // Fetch all, including inactive
        if (data) setQaItems(data);
        setQaLoading(false);
    };

    const handleSaveQa = async () => {
        if (!qaForm.question || !qaForm.answer) return alert("الرجاء إدخال السؤال والإجابة");

        try {
            if (editingQaId) {
                await updateQAItem(editingQaId, qaForm);
                alert("تم تحديث السؤال بنجاح");
            } else {
                await createQAItem(qaForm);
                alert("تم إضافة السؤال بنجاح");
            }
            setQaForm({ question: "", answer: "", display_order: 0, is_active: true, page_key: "home" });
            setEditingQaId(null);
            fetchQa();
        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء الحفظ");
        }
    };

    const handleEditQa = (item: any) => {
        setQaForm({
            question: item.question,
            answer: item.answer,
            display_order: item.display_order,
            is_active: item.is_active,
            page_key: item.page_key || "home"
        });
        setEditingQaId(item.id);
    };

    const handleDeleteQa = async (id: number) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        try {
            await deleteQAItem(id);
            fetchQa();
        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء الحذف");
        }
    };


    useEffect(() => {
        // Initial fetch for everything
        fetchAll(true); // Don't rely on 'true' here to fetch sub-tabs

        if (activeTab === "qa") fetchQa();
        if (activeTab === "news") fetchNews();
        if (activeTab === "users") fetchUsersList();

        // Interval only for live stats
        const interval = setInterval(() => fetchAll(false), activeTab === "raw" || activeTab === "live" ? 5000 : 30000);
        return () => clearInterval(interval);
    }, [activeTab]);


    const toggleScraper = async (id: string) => {
        const enabled = settings?.enabled_scrapers ? JSON.parse(settings.enabled_scrapers) : [];
        let newEnabled;
        if (enabled.includes(id)) {
            newEnabled = enabled.filter((i: string) => i !== id);
        } else {
            newEnabled = [...enabled, id];
        }
        setSaving(id);
        await updateAdminSetting("enabled_scrapers", JSON.stringify(newEnabled));
        setSettings({ ...settings, enabled_scrapers: JSON.stringify(newEnabled) });
        setSaving(null);
    };

    const updateInterval = async (key: string, val: string) => {
        setSaving(key);
        try {
            await updateAdminSetting(key, val);
            // Updating local state to reflect change immediately in UI
            setSettings((prev: any) => {
                const newSettings = { ...prev };
                newSettings[key] = val;
                return newSettings;
            });

            alert("تم الحفظ بنجاح");
        } catch (e) {
            console.error(e);
            alert("فشل الحفظ");
        } finally {
            setSaving(null);
        }
    };

    const handleSeed = async () => {
        if (!confirm("هل أنت متأكد؟ سيتم سحب بيانات تاريخية لمدة شهر وإضافتها لقاعدة البيانات.")) return;
        setSeeding(true);
        const res = await seedHistoricalArchive();
        setSeeding(false);
        if (res.status === "success") {
            alert("تم سحب البيانات التاريخية بنجاح!");
            fetchAll();
        }
    };

    const handleSaveOrder = async () => {
        setSaving("order");
        await updateAdminSetting("gold_source_order", sourceOrder.join(","));
        setSaving(null);
        alert("تم حفظ ترتيب المصادر!");
    };

    const moveSource = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...sourceOrder];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newOrder.length) {
            [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
            setSourceOrder(newOrder);
        }
    };

    const toggleCurrencySource = async (name: string, currentStatus: boolean) => {
        setSaving(name);
        await updateCurrencySource(name, !currentStatus);
        setCurrencySources(prev => prev.map(s => s.source_name === name ? { ...s, is_enabled: !currentStatus } : s));
        setSaving(null);
    };

    const moveCurrencySource = async (index: number, direction: 'up' | 'down') => {
        const newSources = [...currencySources];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newSources.length) {
            [newSources[index], newSources[newIndex]] = [newSources[newIndex], newSources[index]];
            setCurrencySources(newSources);
            // Auto-save the new order
            const names = newSources.map(s => s.source_name);
            await reorderCurrencySources(names);
        }
    };

    const testSource = async (name: string) => {
        setCurrencyTestResults((prev: any) => ({ ...prev, [name]: { loading: true } }));
        try {
            const res = await testCurrencySource(name);
            setCurrencyTestResults((prev: any) => ({ ...prev, [name]: { loading: false, result: res } }));
        } catch (e) {
            setCurrencyTestResults((prev: any) => ({ ...prev, [name]: { loading: false, error: String(e) } }));
        }
    };

    const toggleSilverSource = async (name: string, currentStatus: boolean) => {
        setSaving(name + "_silver");
        await updateSilverSource(name, !currentStatus);
        setSilverSources(prev => prev.map(s => s.source_name === name ? { ...s, is_enabled: !currentStatus } : s));
        setSaving(null);
    };

    const moveSilverSource = async (index: number, direction: 'up' | 'down') => {
        const newSources = [...silverSources];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newSources.length) {
            [newSources[index], newSources[newIndex]] = [newSources[newIndex], newSources[index]];
            setSilverSources(newSources);
            const names = newSources.map(s => s.source_name);
            await reorderSilverSources(names);
        }
    };

    const testSilverSourceHandler = async (name: string) => {
        setSilverTestResults((prev: any) => ({ ...prev, [name]: { loading: true } }));
        try {
            const res = await testSilverSource(name);
            setSilverTestResults((prev: any) => ({ ...prev, [name]: { loading: false, result: res } }));
        } catch (e) {
            setSilverTestResults((prev: any) => ({ ...prev, [name]: { loading: false, error: String(e) } }));
        }
    };

    const testGoldSourceHandler = async (name: string) => {
        setGoldTestResults((prev: any) => ({ ...prev, [name]: { loading: true } }));
        try {
            const res = await testGoldSource(name);
            setGoldTestResults((prev: any) => ({ ...prev, [name]: { loading: false, result: res } }));
        } catch (e) {
            setGoldTestResults((prev: any) => ({ ...prev, [name]: { loading: false, error: String(e) } }));
        }
    };



    if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-gold-600">جاري الدخول إلى بوابة التحكم...</div>;


    const enabledList = settings?.enabled_scrapers ? JSON.parse(settings.enabled_scrapers) : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-20">
            <Navbar />

            <main className="mx-auto max-w-5xl px-2 min-[350px]:px-4 pt-24 sm:pt-40 pb-20">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-slate-900 border-2 border-gold-500/50 flex items-center justify-center text-gold-500 shadow-xl sm:shadow-2xl flex-shrink-0">
                            <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">بوابة الإدارة الذكية</h1>
                            <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 font-bold">تحكم كامل في الأسعار، المصادر، والمحتوى الإخباري</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="h-10 px-4 sm:h-12 sm:px-6 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 flex items-center gap-2 transition-all font-black text-xs"
                    >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                    </button>
                </div>

                {/* Main Detailed Navigation - Prioritized */}
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar mb-8">
                    <button
                        onClick={() => setActiveTab("prices")}
                        className={cn("px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap", activeTab === "prices" ? "bg-gold-500 text-slate-900 shadow-lg shadow-gold-500/20" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <Coins className="h-4 w-4" />
                        التحكم بالأسعار
                    </button>
                    <Link
                        href="/admin-hidden-portal/news"
                        className={cn("px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap text-slate-500 hover:bg-slate-50")}
                    >
                        <Newspaper className="h-4 w-4" />
                        إدارة الأخبار
                    </Link>
                    <button
                        onClick={() => setActiveTab("sources")}
                        className={cn("px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap", activeTab === "sources" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <Globe className="h-4 w-4" />
                        مصادر البيانات
                    </button>
                    <button
                        onClick={() => setActiveTab("live")}
                        className={cn("px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap", activeTab === "live" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <Activity className="h-4 w-4" />
                        مراقبة الحالة
                    </button>
                    <button
                        onClick={() => setActiveTab("config")}
                        className={cn("px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap", activeTab === "config" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <Settings className="h-4 w-4" />
                        إرشادات عامة
                    </button>
                    <button
                        onClick={() => setActiveTab("qa")}
                        className={cn("px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap", activeTab === "qa" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <HelpCircle className="h-4 w-4" />
                        الأسئلة
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={cn("px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap", activeTab === "security" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <ShieldCheck className="h-4 w-4" />
                        الأمان والمدراء
                    </button>
                    <button
                        onClick={() => setActiveTab("raw")}
                        className={cn("px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap", activeTab === "raw" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                    >
                        <Code2 className="h-4 w-4" />
                        RAW
                    </button>
                </div>

                {/* Detailed Summary Row - IMPORTANT STUFF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div className="glass-card p-4 sm:p-5 bg-white dark:bg-slate-900 border-l-4 border-l-gold-500">
                        <div className="flex items-center gap-3 mb-2 text-slate-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase">آخر تحديث للذهب</span>
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">
                            {stats?.cache_last_updated ? new Date(stats.cache_last_updated).toLocaleTimeString("ar-EG") : "---"}
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 font-bold">المصدر النشط: {stats?.active_source || "تلقائي"}</p>
                    </div>

                    <div className="glass-card p-4 sm:p-5 bg-white dark:bg-slate-900 border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-3 mb-2 text-slate-400">
                            <Newspaper className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase">إجمالي الأخبار</span>
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">
                            {stats?.total_articles || 0} مقال
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 font-bold">تم نشر جميع المقالات بنجاح</p>
                    </div>

                    <div className="glass-card p-4 sm:p-5 bg-white dark:bg-slate-900 border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-3 mb-2 text-slate-400">
                            <Database className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase">سجلات الأرشيف</span>
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">
                            {stats?.db_snapshots_count || 0} لقطة
                        </div>
                        <div className="mt-2 flex gap-2">
                            <button onClick={handleSeed} disabled={seeding} className="text-[9px] font-black text-emerald-600 hover:underline flex items-center gap-1">
                                <DatabaseBackup className={cn("h-3 w-3", seeding && "animate-spin")} />
                                {seeding ? "جاري السحب..." : "تحديث الأرشيف"}
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-4 sm:p-5 bg-white dark:bg-slate-900 border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-3 mb-2 text-slate-400">
                            <Activity className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase">استقرار النظام</span>
                        </div>
                        <div className="text-xl font-black text-emerald-500 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            متصل الآن
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 font-bold">الباك-إند والسكربتات تعمل</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">


                    {
                        activeTab === "security" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="security">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* My Profile Section */}
                                    <div className="lg:col-span-1 space-y-8">
                                        <section className="glass-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 h-fit">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <UserPlus className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg text-slate-900 dark:text-white">ملفي الشخصي</h3>
                                                    <p className="text-xs text-slate-500">تحديث بيانات الدخول الخاصة بك</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-black text-slate-400 mb-2 block">اسم المستخدم</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={profileForm.username}
                                                            onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                                                            className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 pl-10 text-sm font-bold focus:border-gold-500 transition-colors"
                                                            placeholder="اسم المستخدم الجديد"
                                                        />
                                                        <Users className="absolute left-3 top-2.5 h-5 w-5 text-slate-300" />
                                                    </div>
                                                </div>

                                                <hr className="border-slate-100 dark:border-slate-800 my-4" />

                                                <div>
                                                    <label className="text-xs font-black text-slate-400 mb-2 block">كلمة المرور الحالية</label>
                                                    <div className="relative">
                                                        <input
                                                            type="password"
                                                            value={profileForm.oldPassword}
                                                            onChange={(e) => setProfileForm({ ...profileForm, oldPassword: e.target.value })}
                                                            className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 pl-10 text-sm font-bold focus:border-gold-500 transition-colors"
                                                            placeholder="كلمة المرور الحالية"
                                                        />
                                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-300" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-black text-slate-400 mb-2 block">كلمة المرور الجديدة</label>
                                                    <div className="relative">
                                                        <input
                                                            type="password"
                                                            value={profileForm.newPassword}
                                                            onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                                                            className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 pl-10 text-sm font-bold focus:border-gold-500 transition-colors"
                                                            placeholder="********"
                                                        />
                                                        <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-300" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-black text-slate-400 mb-2 block">تأكيد كلمة المرور</label>
                                                    <div className="relative">
                                                        <input
                                                            type="password"
                                                            value={profileForm.confirmPassword}
                                                            onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                                                            className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 pl-10 text-sm font-bold focus:border-gold-500 transition-colors"
                                                            placeholder="********"
                                                        />
                                                        <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-slate-300" />
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-1 font-bold">* اترك حقول كلمة المرور فارغة إذا لا تريد تغييرها</p>
                                                </div>

                                                <button
                                                    onClick={handleUpdateProfile}
                                                    disabled={saving === "profile" || !profileForm.username}
                                                    className="w-full h-12 bg-slate-900 text-white rounded-xl font-black hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                                >
                                                    {saving === "profile" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                    حفظ بيانات الملف الشخصي
                                                </button>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Users Management Section (Super Admin Only) */}
                                    {currentUser?.role === "super_admin" && (
                                        <div className="lg:col-span-2">
                                            <section className="glass-card overflow-hidden bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 h-full">
                                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                            <ShieldCheck className="h-5 w-5 text-blue-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-lg text-slate-900 dark:text-white">إدارة المسؤولين</h3>
                                                            <p className="text-xs text-slate-500">إضافة وحذف وتعديل صلاحيات المسؤولين</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setIsEditingUser(null);
                                                            setUserForm({ username: "", password: "", role: "admin", is_active: true });
                                                            setShowUserModal(true);
                                                        }}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                                    >
                                                        <UserPlus className="h-4 w-4" />
                                                        إضافة مسؤول جديد
                                                    </button>
                                                </div>

                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-right">
                                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                                            <tr>
                                                                <th className="px-6 py-4 text-xs font-black text-slate-400">المستخدم</th>
                                                                <th className="px-6 py-4 text-xs font-black text-slate-400">الدور</th>
                                                                <th className="px-6 py-4 text-xs font-black text-slate-400">الحالة</th>
                                                                <th className="px-6 py-4 text-xs font-black text-slate-400">تاريخ الإنشاء</th>
                                                                <th className="px-6 py-4 text-xs font-black text-slate-400">تحكم</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                            {users.map((user: any) => (
                                                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 uppercase">
                                                                                {user.username.substring(0, 2)}
                                                                            </div>
                                                                            <span className="font-bold text-sm text-slate-900 dark:text-white">{user.username}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <span className={cn(
                                                                            "px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider",
                                                                            user.role === "super_admin" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                                        )}>
                                                                            {user.role === "super_admin" ? "مدير عام" : "مسؤول"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <span className={cn(
                                                                            "px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit",
                                                                            user.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                        )}>
                                                                            <span className={cn("h-1.5 w-1.5 rounded-full", user.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                                                            {user.is_active ? "نشط" : "معطل"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-[10px] font-mono text-slate-400">
                                                                        {new Date(user.created_at).toLocaleDateString("ar-EG")}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setIsEditingUser(user.id);
                                                                                    setUserForm({
                                                                                        username: user.username,
                                                                                        password: "",
                                                                                        role: user.role,
                                                                                        is_active: user.is_active
                                                                                    });
                                                                                    setShowUserModal(true);
                                                                                }}
                                                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-all"
                                                                                title="تعديل"
                                                                            >
                                                                                <Settings className="h-4 w-4" />
                                                                            </button>
                                                                            {user.id !== currentUser?.id && (
                                                                                <button
                                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-all"
                                                                                    title="حذف"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </section>
                                        </div>
                                    )}
                                </div>

                                {/* User Modal */}
                                {showUserModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 dark:border-slate-800 transform scale-100 transition-all">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                                    {isEditingUser ? <Settings className="h-5 w-5 text-blue-500" /> : <UserPlus className="h-5 w-5 text-emerald-500" />}
                                                    {isEditingUser ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
                                                </h3>
                                                <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600">
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">اسم المستخدم</label>
                                                    <input
                                                        type="text"
                                                        value={userForm.username}
                                                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                                        className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-4 text-sm font-bold focus:border-blue-500 focus:outline-none transition-colors"
                                                        placeholder="ادخل اسم المستخدم..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                                                        كلمة المرور
                                                        {isEditingUser && <span className="text-xs text-amber-500 font-normal mr-1">(اتركها فارغة للإبقاء على الحالية)</span>}
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={userForm.password}
                                                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                                        className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-4 text-sm font-bold focus:border-blue-500 focus:outline-none transition-colors"
                                                        placeholder="********"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">الدور (الصلاحية)</label>
                                                        <select
                                                            value={userForm.role}
                                                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                                            className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 text-sm font-bold focus:border-blue-500 focus:outline-none transition-colors"
                                                        >
                                                            <option value="admin">مسؤول (Admin)</option>
                                                            <option value="super_admin">مدير عام (Super Admin)</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-end pb-3">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={userForm.is_active}
                                                                    onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })}
                                                                    className="sr-only"
                                                                />
                                                                <div className={cn("w-10 h-6 rounded-full transition-colors", userForm.is_active ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700")}></div>
                                                                <div className={cn("absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform", userForm.is_active ? "translate-x-4" : "translate-x-0")}></div>
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 transition-colors">حساب نشط</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                    <button
                                                        onClick={handleSaveUser}
                                                        disabled={saving === "user"}
                                                        className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {saving === "user" ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                                        {isEditingUser ? "حفظ التعديلات" : "إضافة المستخدم"}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowUserModal(false)}
                                                        className="px-6 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                                    >
                                                        إلغاء
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )
                    }



                    {
                        activeTab === "config" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="config">
                                <section className="mb-8 sm:mb-12">
                                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                        <Globe className="h-5 sm:h-6 w-5 sm:w-6 text-blue-500" />
                                        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">إعدادات الموقع العامة</h2>
                                    </div>
                                    <div className="glass-card p-4 sm:p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">اسم الموقع (Site Title)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={siteTitle}
                                                    onChange={e => setSiteTitle(e.target.value)}
                                                    className="flex-1 h-10 sm:h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 sm:px-4 font-black text-xs sm:text-sm"
                                                />
                                                <button
                                                    onClick={() => updateInterval("site_title", siteTitle)}
                                                    className="h-10 sm:h-12 px-3 sm:px-4 bg-slate-900 text-white rounded-xl font-black text-[9px] sm:text-[10px] hover:bg-blue-600 transition-colors"
                                                >
                                                    حفظ
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">الكلمات الدلالية (Keywords)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={siteKeywords}
                                                    onChange={e => setSiteKeywords(e.target.value)}
                                                    className="flex-1 h-10 sm:h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 sm:px-4 font-black text-xs sm:text-sm"
                                                />
                                                <button
                                                    onClick={() => updateInterval("site_keywords", siteKeywords)}
                                                    className="h-10 sm:h-12 px-3 sm:px-4 bg-slate-900 text-white rounded-xl font-black text-[9px] sm:text-[10px] hover:bg-blue-600 transition-colors"
                                                >
                                                    حفظ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="mb-8 sm:mb-12">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <Zap className="h-5 sm:h-6 w-5 sm:w-6 text-gold-500" />
                                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">إدارة مصادر البيانات</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={async () => {
                                                    setSaving("scrape");
                                                    const res = await triggerGoldScrape();
                                                    setSaving(null);
                                                    if (res.status === "success") {
                                                        alert(`تم التحديث بنجاح من ${res.source}!`);
                                                        fetchAll();
                                                    } else {
                                                        alert("فشل التحديث. حاول مرة أخرى.");
                                                    }
                                                }}
                                                disabled={saving === "scrape"}
                                                className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                                            >
                                                <RefreshCw className={cn("h-3 w-3", saving === "scrape" && "animate-spin")} />
                                                {saving === "scrape" ? "جاري التحديث..." : "تحديث الأسعار"}
                                            </button>
                                            <button
                                                onClick={handleSaveOrder}
                                                disabled={saving === "order"}
                                                className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                            >
                                                <Database className="h-3 w-3" />
                                                {saving === "order" ? "جاري الحفظ..." : "حفظ الترتيب"}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    const allIds = scrapers.map(s => s.id);
                                                    const allEnabled = enabledList.length === scrapers.length;
                                                    const newEnabled = allEnabled ? [] : allIds;
                                                    await updateAdminSetting("enabled_scrapers", JSON.stringify(newEnabled));
                                                    setSettings({ ...settings, enabled_scrapers: JSON.stringify(newEnabled) });
                                                }}
                                                className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-gold-600 transition-colors"
                                            >
                                                {enabledList.length === scrapers.length ? "تعطيل الكل" : "تشغيل الكل"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {sourceOrder.map((sid, index) => {
                                            const s = scrapers.find(sc => sc.id === sid);
                                            if (!s) return null;
                                            return (
                                                <div key={s.id} className={cn(
                                                    "glass-card p-5 bg-white dark:bg-slate-900/80 border-slate-100 dark:border-white/5 relative",
                                                    index === 0 && "border-2 border-gold-500/30 ring-1 ring-gold-500/10 shadow-lg shadow-gold-500/5"
                                                )}>
                                                    {index === 0 && (
                                                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-gold-500 text-slate-900 text-[9px] font-black rounded-full shadow-lg z-10">
                                                            المصدر الأساسي
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center", s.color)}>
                                                                <s.icon className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">{s.name}</h3>
                                                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">#{index + 1}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-0.5">
                                                                        {enabledList.includes(s.id) ? "مفعل في الإعدادات" : "معطل"}
                                                                    </span>
                                                                    {stats?.scraper_status?.[s.id] && (
                                                                        <span className="text-[10px] font-black">
                                                                            {stats.scraper_status[s.id].status === "Running" && (
                                                                                <span className="text-amber-500 flex items-center gap-1">
                                                                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                                                                    جاري السحب...
                                                                                </span>
                                                                            )}
                                                                            {stats.scraper_status[s.id].status === "Idle" && (
                                                                                <span className="text-emerald-500 flex items-center gap-1">
                                                                                    <ShieldCheck className="h-3 w-3" />
                                                                                    تم ({new Date(stats.scraper_status[s.id].last_success).toLocaleTimeString("ar-EG")})
                                                                                </span>
                                                                            )}
                                                                            {(stats.scraper_status[s.id].status === "Error" || stats.scraper_status[s.id].status === "Failed") && (
                                                                                <span className="text-red-500 flex items-center gap-1" title={stats.scraper_status[s.id].last_error}>
                                                                                    <AlertCircle className="h-3 w-3" />
                                                                                    فشل ({new Date(stats.scraper_status[s.id].last_start).toLocaleTimeString("ar-EG")})
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <button
                                                                    onClick={() => moveSource(index, 'up')}
                                                                    disabled={index === 0}
                                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20"
                                                                >
                                                                    <ArrowUp className="h-3 w-3" />
                                                                </button>
                                                                <button
                                                                    onClick={() => moveSource(index, 'down')}
                                                                    disabled={index === sourceOrder.length - 1}
                                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20"
                                                                >
                                                                    <ArrowDown className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => toggleScraper(s.id)}
                                                                disabled={saving === s.id}
                                                                className={cn(
                                                                    "h-8 px-3 rounded-lg font-black text-[10px] transition-all",
                                                                    enabledList.includes(s.id) ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"
                                                                )}
                                                            >
                                                                {enabledList.includes(s.id) ? "إيقاف" : "تشغيل"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{s.desc}</p>

                                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                        <button
                                                            onClick={() => testGoldSourceHandler(s.id)}
                                                            disabled={goldTestResults[s.id]?.loading}
                                                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-gold-500 hover:text-white rounded-lg text-[10px] font-black text-slate-500 transition-all flex items-center gap-1.5"
                                                        >
                                                            {goldTestResults[s.id]?.loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Activity className="h-3 w-3" />}
                                                            {goldTestResults[s.id]?.loading ? "جاري الفحص..." : "فحص المصدر"}
                                                        </button>

                                                        {goldTestResults[s.id]?.result && (
                                                            <span className={cn(
                                                                "text-[10px] font-black flex items-center gap-1.5 px-2 py-1 rounded-lg",
                                                                goldTestResults[s.id].result.status === "success" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                            )}>
                                                                {goldTestResults[s.id].result.status === "success" ? (
                                                                    <>
                                                                        <ShieldCheck className="h-3 w-3" />
                                                                        <span>تم بنجاح: {goldTestResults[s.id].result.sample}</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <AlertCircle className="h-3 w-3" />
                                                                        <span title={goldTestResults[s.id].result.error || "Unknown error"}>فشل الفحص: {goldTestResults[s.id].result.error ? "انظر التفاصيل" : ""}</span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        )}

                                                        {goldTestResults[s.id]?.error && (
                                                            <span className="text-[10px] font-black flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                                <AlertCircle className="h-3 w-3" />
                                                                <span>حدث خطأ</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                <section className="mb-8 sm:mb-12">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-5 sm:h-6 w-5 sm:w-6 text-blue-500" />
                                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">إدارة مصادر العملات</h2>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                setSaving("currency_scrape");
                                                const res = await triggerCurrencyScrape();
                                                setSaving(null);
                                                if (res.status === "success") {
                                                    alert(`تم تحديث ${res.count} سعر بنجاح!`);
                                                    fetchAll();
                                                } else {
                                                    alert("فشل التحديث. حاول مرة أخرى.");
                                                }
                                            }}
                                            disabled={saving === "currency_scrape"}
                                            className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <RefreshCw className={cn("h-3 w-3", saving === "currency_scrape" && "animate-spin")} />
                                            {saving === "currency_scrape" ? "جاري التحديث..." : "تحديث العملات الآن"}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {currencySources.map((source, index) => (
                                            <div key={source.source_name} className={cn(
                                                "glass-card p-5 bg-white dark:bg-slate-900/80 border-slate-100 dark:border-white/5 relative",
                                                index === 0 && "border-2 border-blue-500/30 ring-1 ring-blue-500/10 shadow-lg shadow-blue-500/5"
                                            )}>
                                                {index === 0 && (
                                                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-blue-500 text-white text-[9px] font-black rounded-full shadow-lg z-10">
                                                        المصدر الأساسي (Primary)
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-500")}>
                                                            <Globe className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">{source.display_name}</h3>
                                                            <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{source.source_name}.com</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                onClick={() => moveCurrencySource(index, 'up')}
                                                                disabled={index === 0}
                                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 translate-y-0.5"
                                                            >
                                                                <ArrowUp className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveCurrencySource(index, 'down')}
                                                                disabled={index === currencySources.length - 1}
                                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 -translate-y-0.5"
                                                            >
                                                                <ArrowDown className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-white/5 mb-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-slate-400 font-black uppercase">آخر تحديث</span>
                                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                            {source.last_updated ? new Date(source.last_updated).toLocaleTimeString("ar-EG") : "لا يوجد"}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => testSource(source.source_name)}
                                                        disabled={currencyTestResults[source.source_name]?.loading}
                                                        className="h-7 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-md text-[9px] font-black hover:bg-blue-600 transition-colors"
                                                    >
                                                        {currencyTestResults[source.source_name]?.loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "فحص المصدر"}
                                                    </button>
                                                </div>

                                                {currencyTestResults[source.source_name]?.result && (
                                                    <div className={cn("mb-3 p-2 rounded-lg text-[9px] font-bold", currencyTestResults[source.source_name].result.status === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20")}>
                                                        {currencyTestResults[source.source_name].result.status === "success"
                                                            ? `ناجح: ${currencyTestResults[source.source_name].result.count} سعر - ${currencyTestResults[source.source_name].result.duration.toFixed(2)}s`
                                                            : `فشل: ${currencyTestResults[source.source_name].result.error || "خطأ غير معروف"}`
                                                        }
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => toggleCurrencySource(source.source_name, source.is_enabled)}
                                                    disabled={saving === source.source_name}
                                                    className={cn(
                                                        "w-full h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2",
                                                        source.is_enabled
                                                            ? "bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20"
                                                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20"
                                                    )}
                                                >
                                                    {saving === source.source_name ? <RefreshCw className="h-4 w-4 animate-spin" /> : (source.is_enabled ? <Power className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />)}
                                                    {source.is_enabled ? "تعطيل المصدر" : "تفعيل المصدر"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="mb-8 sm:mb-12">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-5 sm:h-6 w-5 sm:w-6 text-purple-500" />
                                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">إدارة مصادر الفضة</h2>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {silverSources.map((source, index) => (
                                            <div key={source.source_name} className={cn(
                                                "glass-card p-5 bg-white dark:bg-slate-900/80 border-slate-100 dark:border-white/5 relative",
                                                index === 0 && "border-2 border-purple-500/30 ring-1 ring-purple-500/10 shadow-lg shadow-purple-500/5"
                                            )}>
                                                {index === 0 && (
                                                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-purple-500 text-white text-[9px] font-black rounded-full shadow-lg z-10">
                                                        المصدر الأساسي (Primary)
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-purple-500")}>
                                                            <Globe className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">{source.display_name}</h3>
                                                            <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{source.source_name}.com</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                onClick={() => moveSilverSource(index, 'up')}
                                                                disabled={index === 0}
                                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 translate-y-0.5"
                                                            >
                                                                <ArrowUp className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveSilverSource(index, 'down')}
                                                                disabled={index === silverSources.length - 1}
                                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 -translate-y-0.5"
                                                            >
                                                                <ArrowDown className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-white/5 mb-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-slate-400 font-black uppercase">آخر تحديث</span>
                                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                            {source.last_updated ? new Date(source.last_updated).toLocaleTimeString("ar-EG") : "لا يوجد"}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => testSilverSourceHandler(source.source_name)}
                                                        disabled={silverTestResults[source.source_name]?.loading}
                                                        className="h-7 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-md text-[9px] font-black hover:bg-purple-600 transition-colors"
                                                    >
                                                        {silverTestResults[source.source_name]?.loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "فحص المصدر"}
                                                    </button>
                                                </div>

                                                {silverTestResults[source.source_name]?.result && (
                                                    <div className={cn("mb-3 p-2 rounded-lg text-[9px] font-bold", silverTestResults[source.source_name].result.status === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20")}>
                                                        {silverTestResults[source.source_name].result.status === "success"
                                                            ? `ناجح: ${silverTestResults[source.source_name].result.count} سعر - ${silverTestResults[source.source_name].result.duration.toFixed(2)}s`
                                                            : `فشل: ${silverTestResults[source.source_name].result.error || "خطأ غير معروف"}`
                                                        }
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => toggleSilverSource(source.source_name, source.is_enabled)}
                                                    disabled={saving === source.source_name + "_silver"}
                                                    className={cn(
                                                        "w-full h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2",
                                                        source.is_enabled
                                                            ? "bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20"
                                                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20"
                                                    )}
                                                >
                                                    {saving === source.source_name + "_silver" ? <RefreshCw className="h-4 w-4 animate-spin" /> : (source.is_enabled ? <Power className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />)}
                                                    {source.is_enabled ? "تعطيل المصدر" : "تفعيل المصدر"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>

                                    <div className="flex items-center gap-3 mb-6">
                                        <Settings className="h-6 w-6 text-slate-400" />
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">إعدادات التردد الزمني</h2>
                                    </div>
                                    <div className="glass-card p-8 bg-white dark:bg-slate-900/80 border-slate-100 dark:border-white/5 space-y-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h4 className="font-black mb-1 text-slate-900 dark:text-slate-100">تردد سحب البيانات (Scrape Interval)</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">كم مرة يتم سحب السعر الحي من المواقع (بالثواني)</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {[30, 60, 300, 600].map(int => (
                                                    <button
                                                        key={int}
                                                        onClick={() => updateInterval("scrape_interval", int.toString())}
                                                        className={cn(
                                                            "h-12 w-16 rounded-xl font-black text-sm border-2 transition-all",
                                                            settings?.scrape_interval === int.toString()
                                                                ? "bg-slate-900 border-gold-500 text-gold-500"
                                                                : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                                                        )}
                                                    >
                                                        {int}s
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h4 className="font-black mb-1 text-slate-900 dark:text-slate-100">تردد النسخ الاحتياطي (Backup Interval)</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">متى يتم حفظ نسخة دائمة في قاعدة البيانات (بالثواني)</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {[600, 1800, 3600].map(int => (
                                                    <button
                                                        key={int}
                                                        onClick={() => updateInterval("backup_interval", int.toString())}
                                                        className={cn(
                                                            "h-12 w-16 rounded-xl font-black text-sm border-2 transition-all",
                                                            settings?.backup_interval === int.toString()
                                                                ? "bg-slate-900 border-gold-500 text-gold-500"
                                                                : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                                                        )}
                                                    >
                                                        {int / 60}m
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )
                    }

                    {
                        activeTab === "prices" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="prices">
                                <section className="mb-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Coins className="h-6 w-6 text-gold-500" />
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">التحكم اليدوي في الأسعار</h2>
                                    </div>
                                    <div className="glass-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 space-y-8">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                            <div className="flex-1">
                                                <h4 className="font-black text-amber-600 mb-1">زيادة إضافية عامة (Price Offset)</h4>
                                                <p className="text-xs text-slate-500 font-bold">هذا المبلغ سيتم إضافته لجميع الأسعار القادمة من المواقع تلقائياً.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="number"
                                                    value={offset}
                                                    onChange={(e) => setOffset(e.target.value)}
                                                    className="w-32 h-12 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-4 font-black"
                                                />
                                                <button
                                                    onClick={() => updateInterval("price_offset", offset)}
                                                    className="px-6 h-12 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-gold-600 transition-all"
                                                >
                                                    تطبيق
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            {["24", "21", "18"].map((karat) => (
                                                <div key={karat} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="font-black text-sm uppercase">عيار {karat}</span>
                                                        {manualPrices[karat] && <span className="text-[10px] text-emerald-500 font-black flex items-center gap-1">
                                                            <ShieldCheck className="h-3 w-3" />
                                                            مثبت
                                                        </span>}
                                                    </div>
                                                    <input
                                                        type="number"
                                                        placeholder={stats?.prices?.[`عيار ${karat}`]?.sell || stats?.prices?.[karat]?.sell || "تلقائي"}
                                                        value={manualPrices[karat] || ""}
                                                        onChange={(e) => setManualPrices({ ...manualPrices, [karat]: e.target.value })}
                                                        className="w-full h-12 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 px-4 font-black mb-3 focus:border-gold-500 outline-none transition-all"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => updateManualPrice(karat, manualPrices[karat])}
                                                            className="flex-1 h-10 rounded-lg bg-slate-900 text-white text-[10px] font-black hover:bg-gold-600"
                                                        >
                                                            حفظ السعر
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                await updateManualPrice(karat, null);
                                                                const newM = { ...manualPrices }; delete newM[karat]; setManualPrices(newM);
                                                            }}
                                                            className="h-10 px-3 rounded-lg border-2 border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                        >
                                                            <RefreshCw className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )
                    }

                    {
                        activeTab === "news" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="news">
                                <section>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-3">
                                                <Newspaper className="h-5 sm:h-6 w-5 sm:w-6 text-gold-500" />
                                                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">إدارة الأخبار</h2>
                                            </div>
                                            <Link
                                                href="/admin-hidden-portal/news/add"
                                                className="px-3 sm:px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] sm:text-[10px] font-black flex items-center gap-2 hover:bg-emerald-500/20 transition-all font-cairo"
                                            >
                                                <PlusCircle className="h-3 w-3" />
                                                إضافة خبر
                                            </Link>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                setSaving("news");
                                                await triggerNewsScrape();
                                                setTimeout(fetchNews, 2000);
                                                setSaving(null);
                                            }}
                                            disabled={saving === "news"}
                                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-xl text-[10px] sm:text-xs font-black flex items-center gap-2 hover:bg-gold-600 w-fit"
                                        >
                                            <RefreshCw className={cn("h-3 w-3", saving === "news" && "animate-spin")} />
                                            تحديث الأخبار الآن
                                        </button>
                                        <button
                                            onClick={async () => {
                                                setTestingNews(true);
                                                const res = await testNewsSources();
                                                setNewsTestResults(res);
                                                setTestingNews(false);
                                            }}
                                            disabled={testingNews}
                                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl text-[10px] sm:text-xs font-black flex items-center gap-2 hover:bg-blue-700 w-fit"
                                        >
                                            <Activity className={cn("h-3 w-3", testingNews && "animate-spin")} />
                                            اختبار المصادر
                                        </button>
                                    </div>

                                    {newsTestResults && (
                                        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                                            <h3 className="font-black text-sm mb-3 text-slate-900 dark:text-white">نتائج اختبار المصادر</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {Object.entries(newsTestResults).map(([source, result]: [string, any]) => (
                                                    <div key={source} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-bold text-xs">{source}</span>
                                                            <span className={cn(
                                                                "text-[10px] font-black px-2 py-0.5 rounded",
                                                                result.status === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                                                            )}>
                                                                {result.status === "success" ? "نجاح" : "فشل"}
                                                            </span>
                                                        </div>
                                                        {result.status === "success" ? (
                                                            <div className="text-[10px] text-slate-500 space-y-1">
                                                                <div className="flex justify-between">
                                                                    <span>عدد المقالات:</span>
                                                                    <span className="font-mono">{result.count}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>الوقت المستغرق:</span>
                                                                    <span className="font-mono">{result.duration?.toFixed(2)}s</span>
                                                                </div>
                                                                {result.sample && (
                                                                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                                        <span className="block mb-1">مثال:</span>
                                                                        <p className="line-clamp-1 text-slate-900 dark:text-slate-300">{result.sample}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-[10px] text-red-500 break-words">{result.error}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setNewsTestResults(null)}
                                                className="mt-4 text-[10px] text-slate-400 hover:text-slate-600 underline"
                                            >
                                                إخفاء النتائج
                                            </button>
                                        </div>
                                    )}

                                    <div className="glass-card bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 overflow-hidden">
                                        <div className="overflow-x-auto no-scrollbar">
                                            <table className="w-full text-right min-w-[600px]">
                                                <thead>
                                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                                        <th className="px-6 py-4 text-xs font-black text-slate-400">العنوان</th>
                                                        <th className="px-6 py-4 text-xs font-black text-slate-400">التاريخ</th>
                                                        <th className="px-6 py-4 text-xs font-black text-slate-400">المصدر</th>
                                                        <th className="px-6 py-4 text-xs font-black text-slate-400">تحكم</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                    {news.map((item: any) => (
                                                        <tr key={item.slug} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <img src={item.image} className="h-8 w-12 rounded bg-slate-100 object-cover" />
                                                                    <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200 line-clamp-1">{item.title}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-[10px] text-slate-400 font-mono">{item.date}</td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-600 dark:text-slate-400">
                                                                    {item.author}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Link
                                                                        href={`/admin-hidden-portal/news/edit/${item.slug}`}
                                                                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gold-600 transition-all"
                                                                    >
                                                                        <Save className="h-4 w-4" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (confirm("هل تريد حذف هذا الخبر؟")) {
                                                                                try {
                                                                                    await deleteNewsArticle(item.slug);
                                                                                    setNews(news.filter(n => n.slug !== item.slug));
                                                                                } catch (error: any) {
                                                                                    console.error(error);
                                                                                    alert(error.message || "حدث خطأ أثناء الحذف");
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {newsLoading && <div className="p-8 text-center text-xs font-black animate-pulse">جاري جلب أحدث الأخبار...</div>}
                                    </div>
                                </section>
                            </motion.div>
                        )
                    }



                    {
                        activeTab === "qa" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="qa">
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <HelpCircle className="h-6 w-6 text-gold-500" />
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">إدارة الأسئلة الشائعة</h2>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-black text-slate-400">تصفية حسب الصفحة:</label>
                                            <select
                                                value={filterPage}
                                                onChange={e => setFilterPage(e.target.value)}
                                                className="h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 px-2 text-[10px] font-bold"
                                            >
                                                <option value="all">كل الصفحات (الكل)</option>
                                                <option value="home">الرئيسية</option>
                                                <option value="gold">الذهب</option>
                                                <option value="silver">الفضة</option>
                                                <option value="currencies">العملات</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Form */}
                                        <div className="glass-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 h-fit">
                                            <h3 className="font-black text-lg mb-4 text-slate-900 dark:text-white">
                                                {editingQaId ? "تعديل السؤال" : "إضافة سؤال جديد"}
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-black text-slate-400 mb-1">السؤال</label>
                                                    <input
                                                        type="text"
                                                        value={qaForm.question}
                                                        onChange={e => setQaForm({ ...qaForm, question: e.target.value })}
                                                        className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 font-bold text-sm"
                                                        placeholder="اكتب السؤال هنا..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-slate-400 mb-1">الإجابة</label>
                                                    <textarea
                                                        value={qaForm.answer}
                                                        onChange={e => setQaForm({ ...qaForm, answer: e.target.value })}
                                                        className="w-full h-32 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 p-3 font-bold text-sm resize-none"
                                                        placeholder="اكتب الإجابة هنا..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-slate-400 mb-1">الصفحة</label>
                                                    <select
                                                        value={qaForm.page_key}
                                                        onChange={e => setQaForm({ ...qaForm, page_key: e.target.value })}
                                                        className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 font-bold text-sm"
                                                    >
                                                        <option value="all">كل الصفحات</option>
                                                        <option value="home">الرئيسية</option>
                                                        <option value="gold">الذهب</option>
                                                        <option value="silver">الفضة</option>
                                                        <option value="currencies">العملات</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-black text-slate-400 mb-1">الترتيب</label>
                                                        <input
                                                            type="number"
                                                            value={qaForm.display_order}
                                                            onChange={e => setQaForm({ ...qaForm, display_order: parseInt(e.target.value) })}
                                                            className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-3 font-bold text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex items-end pb-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={qaForm.is_active}
                                                                onChange={e => setQaForm({ ...qaForm, is_active: e.target.checked })}
                                                                className="w-5 h-5 rounded text-gold-600 focus:ring-gold-500"
                                                            />
                                                            <span className="text-sm font-black text-slate-600 dark:text-slate-300">نشط</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={handleSaveQa}
                                                        className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-black hover:bg-gold-600 transition-colors"
                                                    >
                                                        {editingQaId ? "تحديث" : "إضافة"}
                                                    </button>
                                                    {editingQaId && (
                                                        <button
                                                            onClick={() => {
                                                                setEditingQaId(null);
                                                                setQaForm({ question: "", answer: "", display_order: 0, is_active: true, page_key: "home" });
                                                            }}
                                                            className="h-12 w-12 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500"
                                                        >
                                                            <Activity className="w-5 h-5 rotate-45" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* List */}
                                        <div className="lg:col-span-2 glass-card bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 overflow-hidden">
                                            <div className="overflow-x-auto no-scrollbar">
                                                <table className="w-full text-right min-w-[600px]">
                                                    <thead>
                                                        <tr className="border-b border-slate-100 dark:border-slate-800">
                                                            <th className="px-6 py-4 text-xs font-black text-slate-400">الصفحة</th>
                                                            <th className="px-6 py-4 text-xs font-black text-slate-400">السؤال</th>
                                                            <th className="px-6 py-4 text-xs font-black text-slate-400">الترتيب</th>
                                                            <th className="px-6 py-4 text-xs font-black text-slate-400">الحالة</th>
                                                            <th className="px-6 py-4 text-xs font-black text-slate-400">تحكم</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                        {qaItems
                                                            .filter(item => filterPage === "all" || item.page_key === filterPage)
                                                            .map((item: any) => (
                                                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                                    <td className="px-6 py-4">
                                                                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase">
                                                                            {item.page_key}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="max-w-md">
                                                                            <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{item.question}</p>
                                                                            <p className="text-xs text-slate-500 line-clamp-1 mt-1">{item.answer}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 font-mono text-sm">{item.display_order}</td>
                                                                    <td className="px-6 py-4">
                                                                        <span className={cn(
                                                                            "px-2 py-1 rounded-md text-[9px] font-black",
                                                                            item.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                                                                        )}>
                                                                            {item.is_active ? "نشط" : "غير نشط"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={() => handleEditQa(item)}
                                                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gold-600 transition-all"
                                                                            >
                                                                                <Save className="h-4 w-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteQa(item.id)}
                                                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        {qaItems.length === 0 && (
                                                            <tr>
                                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-bold text-sm">
                                                                    لا توجد أسئلة مضافة حتى الآن
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )
                    }

                    {
                        activeTab === "live" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="live">
                                <div className="glass-card p-8 bg-white dark:bg-slate-900/80 border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-3 mb-8">
                                        <ListTree className="h-6 w-6 text-gold-500" />
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">ملخص البيانات المحملة حالياً</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">أسعار الذهب (أساسي)</h4>
                                            <div className="space-y-2">
                                                {Object.entries(rawCache?.prices || {}).slice(0, 5).map(([k, v]: [string, any]) => (
                                                    <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20">
                                                        <span className="text-sm font-bold dark:text-slate-200">{k}</span>
                                                        <span className="text-sm font-black text-gold-600 font-mono">{v.sell}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">الأسواق الدولية والدول العربية</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20">
                                                    <span className="text-sm font-bold dark:text-slate-200">الدول المغطاة</span>
                                                    <span className="text-sm font-black text-blue-600">{Object.keys(rawCache?.countries || {}).length} دول</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20">
                                                    <span className="text-sm font-bold dark:text-slate-200">العملات الحية</span>
                                                    <span className="text-sm font-black text-purple-600">{rawCache?.sarf_currencies?.length || 0} عملة</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20">
                                                    <span className="text-sm font-bold dark:text-slate-200">تاريخ Live</span>
                                                    <span className="text-sm font-black text-emerald-600">{rawCache?.gold_live_history?.length || 0} يوم</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }

                    {
                        activeTab === "raw" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="raw">
                                <div className="glass-card p-4 sm:p-6 bg-black/40 border-gold-500/20 overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                            <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">Live JSON Stream</span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto no-scrollbar">
                                        <pre className="text-[10px] sm:text-xs font-mono text-emerald-400 overflow-auto max-h-[400px] sm:max-h-[600px] p-3 sm:p-4 bg-black/40 rounded-xl">
                                            {JSON.stringify(rawCache, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }

                    {
                        activeTab === "sources" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="sources">
                                <div className="glass-card p-6 bg-white dark:bg-slate-900/50 border-slate-100 dark:border-white/5">
                                    {typeof window !== 'undefined' && (
                                        <div>
                                            {/* Dynamically import the component */}
                                            {(() => {
                                                const CurrencySourcesManagement = require('@/components/admin/currency-sources-management').default;
                                                return <CurrencySourcesManagement />;
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    }
                </AnimatePresence >
            </main >
        </div >
    );
}
