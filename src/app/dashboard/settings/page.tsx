
"use client";

import { useEffect, useState } from "react";
import { getAdminSettings, updateAdminSetting } from "@/lib/api";
import { Save, ArrowUp, ArrowDown, Database, Globe, Palette, Settings as SettingsIcon } from "lucide-react";

const ALL_SOURCES = [
    "GoldEra",
    "GoldBullion",
    "EgyptGoldPriceToday",
    "GoldPriceLive",
    "SouqPriceToday"
];

export default function SettingsPage() {
    const [settingsList, setSettingsList] = useState<any[]>([]);
    const [sourceOrder, setSourceOrder] = useState<string[]>(ALL_SOURCES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getAdminSettings();
            if (data && Array.isArray(data)) {
                setSettingsList(data);
                const orderSetting = data.find(s => s.key === "gold_source_order");
                if (orderSetting && orderSetting.value) {
                    const savedOrder = orderSetting.value.split(",").map((s: string) => s.trim());
                    // Filter valid and add missing
                    const validOrder = savedOrder.filter((s: string) => ALL_SOURCES.includes(s));
                    const fullOrder = [...validOrder, ...ALL_SOURCES.filter(s => !validOrder.includes(s))];
                    setSourceOrder(fullOrder);
                }
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSaveOrder = async () => {
        const orderValue = sourceOrder.join(",");
        await updateAdminSetting("gold_source_order", orderValue);
        alert("تم حفظ ترتيب المصادر بنجاح!");
    };

    const moveSource = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...sourceOrder];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newOrder.length) {
            [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
            setSourceOrder(newOrder);
        }
    };

    if (loading) return <div className="p-8 text-center font-cairo">جاري التحميل...</div>;

    return (
        <div className="container mx-auto p-6 font-cairo" dir="rtl">
            <div className="flex items-center gap-3 mb-8">
                <SettingsIcon className="w-8 h-8 text-yellow-600" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">إعدادات النظام</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gold Sources Reordering */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-bold">ترتيب مصادر أسعار الذهب</h2>
                        </div>
                        <button
                            onClick={handleSaveOrder}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-lg shadow-yellow-500/20"
                        >
                            <Save className="w-4 h-4" />
                            <span>حفظ الترتيب</span>
                        </button>
                    </div>

                    <p className="text-sm text-slate-500 mb-4">
                        المصدر الأول هو الأساسي، والباقي مصادر احتياطية تُستخدم بالترتيب في حال فشل الأساسي.
                    </p>

                    <div className="space-y-3">
                        {sourceOrder.map((source, index) => (
                            <div
                                key={source}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${index === 0
                                    ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/30"
                                    : "bg-slate-50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-800"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${index === 0 ? "bg-yellow-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <span className="font-bold">{source}</span>
                                    {index === 0 && (
                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-black uppercase">
                                            الأساسي
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => moveSource(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 transition-colors"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => moveSource(index, 'down')}
                                        disabled={index === sourceOrder.length - 1}
                                        className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 transition-colors"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* General Settings */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Globe className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-bold">إعدادات الموقع العام</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">اسم الموقع</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        defaultValue="جولد سيرفيس"
                                        className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-yellow-500 outline-none"
                                    />
                                    <button className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                                        <Save className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">الكلمات الدلالية (Keywords)</label>
                                <textarea
                                    rows={3}
                                    defaultValue="ذهب, أسعار, مصر, عيار 21, تحديث لحظي"
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-yellow-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Palette className="w-5 h-5 text-purple-500" />
                            <h2 className="text-xl font-bold">المظهر (Visual)</h2>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col">
                                <span className="font-bold">الوضع الليلي التلقائي</span>
                                <span className="text-xs text-slate-500">يتغير حسب إعدادات الجهاز</span>
                            </div>
                            <div className="w-12 h-6 bg-yellow-500 rounded-full flex items-center px-1">
                                <div className="w-4 h-4 bg-white rounded-full shadow-sm ml-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
