import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'لوحة التحكم | الرئيسية',
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-cairo">
                مرحباً بك في لوحة تحكم موقع الذهب
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-gray-500 font-medium mb-2">إجمالي المقالات</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-gray-500 font-medium mb-2">حالة النظام</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        نشط
                    </span>
                </div>
            </div>
        </div>
    );
}
