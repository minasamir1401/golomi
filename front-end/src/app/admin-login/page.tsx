"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Key, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { login } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await login(username, password);
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user_role", data.user.role);
            localStorage.setItem("username", data.user.username);

            // Redirect to admin portal
            router.push("/admin-hidden-portal");
        } catch (err: any) {
            console.error("Login Error:", err);
            setError("بيانات الدخول غير صحيحة");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative direction-rtl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),rgba(2,6,23,0))]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden relative group">
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex flex-col items-center mb-8">
                        <div className="h-16 w-16 bg-slate-950 rounded-2xl border border-gold-500/30 flex items-center justify-center mb-4 shadow-lg shadow-gold-500/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gold-400/10 animate-pulse" />
                            <ShieldCheck className="h-8 w-8 text-gold-500 relative z-10" />
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2">بوابة التحكم</h1>
                        <p className="text-slate-400 text-xs font-bold">يرجى تسجيل الدخول للمتابعة</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5 direction-rtl">
                            <label className="text-[10px] text-slate-400 font-bold px-1">اسم المستخدم</label>
                            <div className="relative group/input">
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-gold-500 transition-colors">
                                    <User className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pr-10 pl-4 text-sm font-bold focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-slate-700 text-right"
                                    placeholder="Username"
                                    dir="rtl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 direction-rtl">
                            <label className="text-[10px] text-slate-400 font-bold px-1">كلمة المرور</label>
                            <div className="relative group/input">
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-gold-500 transition-colors">
                                    <Key className="h-4 w-4" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pr-10 pl-4 text-sm font-bold focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-slate-700 text-right"
                                    placeholder="Password"
                                    dir="rtl"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs font-bold text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full bg-gold-500 hover:bg-gold-600 text-slate-950 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 mt-4",
                                loading && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    تسجيل الدخول
                                    <ArrowRight className="h-4 w-4 rotate-180" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <p className="text-[10px] text-slate-600 font-mono">
                            Secure Admin Portal • v1.0.0
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
