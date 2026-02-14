"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw, Save, ArrowUp, ArrowDown } from "lucide-react"

interface Bank {
    bank_id: string
    bank_name: string
    is_enabled: boolean
    display_order: number
}

export default function BanksManagement() {
    const [banks, setBanks] = useState<Bank[]>([])
    const [loading, setLoading] = useState(true)
    const [scraping, setScraping] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const API_BASE = typeof window !== "undefined" ? "/api" : (process.env.NEXT_PUBLIC_API_URL || "https://headline-lions-human-ware.trycloudflare.com/api");

    useEffect(() => {
        fetchBanks()
    }, [])

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text })
        setTimeout(() => setMessage(null), 3000)
    }

    const fetchBanks = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_BASE}/admin/banks/all/`)
            if (!response.ok) throw new Error("Failed to fetch")
            const data = await response.json()
            setBanks(data)
        } catch (error) {
            showMessage('error', 'فشل في تحميل البنوك')
        } finally {
            setLoading(false)
        }
    }

    const handleScrapeAll = async () => {
        try {
            setScraping(true)
            const response = await fetch(`${API_BASE}/admin/banks/scrape-all/`, {
                method: "POST"
            })
            const data = await response.json()

            showMessage('success', `تم سحب ${data.banks_scraped || 0} سعر من البنوك (في الخلفية)`)
            // Wait a bit for background task to start/finish
            setTimeout(fetchBanks, 2000)
        } catch (error) {
            showMessage('error', 'فشل في سحب البيانات')
        } finally {
            setScraping(false)
        }
    }

    const handleToggleBank = (bankId: string) => {
        setBanks(banks.map(bank =>
            bank.bank_id === bankId
                ? { ...bank, is_enabled: !bank.is_enabled }
                : bank
        ))
    }

    const handleOrderChange = (bankId: string, newOrder: number) => {
        setBanks(banks.map(bank =>
            bank.bank_id === bankId
                ? { ...bank, display_order: newOrder }
                : bank
        ))
    }

    const moveUp = (index: number) => {
        if (index === 0) return
        const newBanks = [...banks]
        const temp = newBanks[index].display_order
        newBanks[index].display_order = newBanks[index - 1].display_order
        newBanks[index - 1].display_order = temp
        newBanks.sort((a, b) => a.display_order - b.display_order)
        setBanks(newBanks)
    }

    const moveDown = (index: number) => {
        if (index === banks.length - 1) return
        const newBanks = [...banks]
        const temp = newBanks[index].display_order
        newBanks[index].display_order = newBanks[index + 1].display_order
        newBanks[index + 1].display_order = temp
        newBanks.sort((a, b) => a.display_order - b.display_order)
        setBanks(newBanks)
    }

    const handleSaveSettings = async () => {
        try {
            setSaving(true)
            const updates = banks.map(bank => ({
                bank_id: bank.bank_id,
                is_enabled: bank.is_enabled,
                display_order: bank.display_order
            }))

            const response = await fetch(`${API_BASE}/admin/banks/settings/update/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                showMessage('success', 'تم حفظ إعدادات البنوك بنجاح')
            }
        } catch (error) {
            showMessage('error', 'فشل في حفظ الإعدادات')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Message Toast */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white font-bold`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">إدارة البنوك</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                التحكم في البنوك المعروضة وترتيبها
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleScrapeAll}
                                disabled={scraping}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                            >
                                {scraping ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        جاري السحب...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4" />
                                        سحب جميع البنوك
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                disabled={saving}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        حفظ الإعدادات
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-4 pb-2 border-b border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-300">
                            <div className="col-span-1">الترتيب</div>
                            <div className="col-span-5">اسم البنك</div>
                            <div className="col-span-3">معرف البنك</div>
                            <div className="col-span-2">الحالة</div>
                            <div className="col-span-1">تحريك</div>
                        </div>

                        {banks.map((bank, index) => (
                            <div
                                key={bank.bank_id}
                                className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="col-span-1">
                                    <input
                                        type="number"
                                        value={bank.display_order}
                                        onChange={(e) => handleOrderChange(bank.bank_id, parseInt(e.target.value))}
                                        className="w-16 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div className="col-span-5 font-medium text-slate-900 dark:text-white">
                                    {bank.bank_name}
                                </div>

                                <div className="col-span-3 text-sm text-slate-500 dark:text-slate-400 font-mono">
                                    {bank.bank_id}
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={bank.is_enabled}
                                                onChange={() => handleToggleBank(bank.bank_id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${bank.is_enabled
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                            }`}>
                                            {bank.is_enabled ? 'مفعّل' : 'معطّل'}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-1 flex gap-1">
                                    <button
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ArrowUp className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                    </button>
                                    <button
                                        onClick={() => moveDown(index)}
                                        disabled={index === banks.length - 1}
                                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ArrowDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">إحصائيات</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{banks.length}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">إجمالي البنوك</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {banks.filter(b => b.is_enabled).length}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">بنوك مفعّلة</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-3xl font-bold text-slate-400">
                            {banks.filter(b => !b.is_enabled).length}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">بنوك معطّلة</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
