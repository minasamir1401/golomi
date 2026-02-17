
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'لوحة التحكم - الذهب',
    description: 'إدارة أخبار وإعدادات موقع الذهب',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 font-cairo">
                        لوحة التحكم
                    </h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <a href="/dashboard" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors font-cairo">
                        الرئيسية
                    </a>
                    <a href="/dashboard/news" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors font-cairo">
                        الأخبار والمقالات
                    </a>
                    <a href="/dashboard/settings" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors font-cairo">
                        الإعدادات
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900 p-6">
                {children}
            </main>
        </div>
    );
}
