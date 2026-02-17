"use client";

import { Navbar } from "@/components/navbar";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        alert("شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.");
        setFormData({ name: "", email: "", phone: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                <header className="mb-8 sm:mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-6"
                    >
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest">تواصل معنا</span>
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-4">
                        نحن هنا <span className="text-gradient-gold">لمساعدتك.</span>
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 font-bold max-w-2xl mx-auto px-4">
                        لديك استفسار عن أسعار الذهب أو تحتاج مساعدة؟ فريقنا جاهز للرد على جميع أسئلتك.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4">
                                <Phone className="h-6 w-6 text-gold-600" />
                            </div>
                            <h3 className="font-black text-lg mb-2">اتصل بنا</h3>
                            <p className="text-slate-500 font-bold text-sm mb-3">متاحون على مدار الساعة</p>
                            <a href="tel:+201234567890" className="text-gold-600 font-black hover:underline">
                                +20 123 456 7890
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-black text-lg mb-2">البريد الإلكتروني</h3>
                            <p className="text-slate-500 font-bold text-sm mb-3">راسلنا في أي وقت</p>
                            <a href="mailto:info@goldservice.com" className="text-blue-600 font-black hover:underline">
                                info@goldservice.com
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h3 className="font-black text-lg mb-2">ساعات العمل</h3>
                            <p className="text-slate-500 font-bold text-sm">
                                السبت - الخميس: 9 صباحاً - 6 مساءً<br />
                                الجمعة: مغلق
                            </p>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 sm:p-10"
                        >
                            <h2 className="text-2xl font-black mb-6">أرسل لنا رسالة</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-3">
                                            الاسم الكامل
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 font-bold text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-colors"
                                            placeholder="أدخل اسمك"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-3">
                                            البريد الإلكتروني
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 font-bold text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-colors"
                                            placeholder="example@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mb-3">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl p-4 font-bold text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-colors"
                                        placeholder="+20 123 456 7890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-3">
                                        رسالتك
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 font-bold text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-colors resize-none"
                                        placeholder="اكتب رسالتك هنا..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-900 font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="h-5 w-5" />
                                    إرسال الرسالة
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-12 sm:mt-20 glass-card p-6 sm:p-10"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-500/10 flex items-center justify-center">
                            <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black">موقعنا</h2>
                            <p className="text-sm sm:text-base text-slate-500 font-bold">القاهرة، مصر</p>
                        </div>
                    </div>
                    <div className="w-full h-64 sm:h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <p className="text-slate-400 font-bold">خريطة الموقع</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
