"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check for token on client side
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.replace("/admin-login");
        } else {
            setAuthorized(true);
        }
    }, [pathname, router]);

    if (!authorized) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gold-500">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-xs font-bold text-slate-400">جاري التحقق من الصلاحيات...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {children}
        </div>
    );
}
