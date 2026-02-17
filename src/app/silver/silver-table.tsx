
"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { SilverPrice } from "@/lib/api";

interface SilverTableProps {
    data: SilverPrice | null;
}

export function SilverTable({ data }: SilverTableProps) {
    const { locale } = useLanguage();

    if (!data) return null;

    const rows = [
        {
            name: { ar: "عيار 999", en: "999 Purity" },
            sell: data.prices.silver_999_sell,
            buy: data.prices.silver_999_buy,
            change: data.prices.silver_999_change,
            percent: data.prices.silver_999_change_percent,
            isOunce: false
        },
        {
            name: { ar: "عيار 925", en: "925 Purity" },
            sell: data.prices.silver_925_sell,
            buy: data.prices.silver_925_buy,
            change: data.prices.silver_925_change,
            percent: data.prices.silver_925_change_percent,
            isOunce: false
        },
        {
            name: { ar: "عيار 900", en: "900 Purity" },
            sell: data.prices.silver_900_sell,
            buy: data.prices.silver_900_buy,
            change: data.prices.silver_900_change,
            percent: data.prices.silver_900_change_percent,
            isOunce: false
        },
        {
            name: { ar: "عيار 800", en: "800 Purity" },
            sell: data.prices.silver_800_sell,
            buy: data.prices.silver_800_buy,
            change: data.prices.silver_800_change,
            percent: data.prices.silver_800_change_percent,
            isOunce: false
        },
        {
            name: { ar: "الأوقية ($)", en: "Ounce ($)" },
            sell: data.prices.ounce_usd_sell,
            buy: data.prices.ounce_usd_buy,
            change: data.prices.ounce_usd_change,
            percent: data.prices.ounce_usd_change_percent,
            isOunce: true
        }
    ];

    const formatPrice = (val: number | null | undefined) => {
        if (val === null || val === undefined) return "---";
        // Force English numerals for clarity, consistent with reference
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#03aae9] text-white">
                            <th className="py-3 px-1 min-[350px]:px-4 text-center font-bold text-xs min-[350px]:text-lg whitespace-nowrap">
                                {locale === 'ar' ? "العيار" : "Purity"}
                            </th>
                            <th className="py-3 px-1 min-[350px]:px-4 text-center font-bold text-xs min-[350px]:text-lg whitespace-nowrap">
                                {locale === 'ar' ? "بيع" : "Sell"}
                            </th>
                            <th className="py-3 px-1 min-[350px]:px-4 text-center font-bold text-xs min-[350px]:text-lg whitespace-nowrap">
                                {locale === 'ar' ? "شراء" : "Buy"}
                            </th>
                            <th className="py-3 px-1 min-[350px]:px-4 text-center font-bold text-xs min-[350px]:text-lg whitespace-nowrap">
                                {locale === 'ar' ? "التغيير" : "Change"}
                            </th>
                            <th className="py-3 px-1 min-[350px]:px-4 text-center font-bold text-xs min-[350px]:text-lg whitespace-nowrap">
                                {locale === 'ar' ? "النسبة %" : "Val %"}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {rows.map((row, index) => {
                            const isPositive = (row.change || 0) > 0;
                            const isNegative = (row.change || 0) < 0;
                            const changeColor = isPositive ? "text-emerald-500" : isNegative ? "text-rose-500" : "text-slate-500";

                            return (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="py-3 px-1 min-[350px]:px-4 text-right">
                                        <div className="flex items-center justify-start gap-1 min-[350px]:gap-3">
                                            <div className="relative w-5 h-5 min-[350px]:w-8 min-[350px]:h-8 flex-shrink-0">
                                                <img
                                                    src="https://cdn0.iconfinder.com/data/icons/48_px_web_icons/48/Money_silver.png"
                                                    alt="silver"
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                            <span className="font-bold text-amber-500 text-[10px] min-[350px]:text-lg whitespace-nowrap">
                                                {locale === 'ar' ? row.name.ar : row.name.en}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-1 min-[350px]:px-4 text-center text-[10px] min-[350px]:text-lg font-bold text-slate-800 dark:text-white tabular-nums">
                                        {formatPrice(row.sell)}
                                    </td>
                                    <td className="py-3 px-1 min-[350px]:px-4 text-center text-[10px] min-[350px]:text-lg font-bold text-slate-800 dark:text-white tabular-nums">
                                        {formatPrice(row.buy)}
                                    </td>
                                    <td className={cn("py-3 px-1 min-[350px]:px-4 text-center font-bold text-[9px] min-[350px]:text-sm dir-ltr", changeColor)}>
                                        <div className="flex items-center justify-center gap-0.5 min-[350px]:gap-1">
                                            {formatPrice(Math.abs(row.change || 0))}
                                            <span className="text-[8px]">{row.isOunce ? "$" : "ج.م"}</span>
                                            {isPositive && <ArrowUp className="w-2 h-2 min-[350px]:w-4 min-[350px]:h-4" />}
                                            {isNegative && <ArrowDown className="w-2 h-2 min-[350px]:w-4 min-[350px]:h-4" />}
                                            {!isPositive && !isNegative && <Minus className="w-2 h-2 min-[350px]:w-4 min-[350px]:h-4" />}
                                        </div>
                                    </td>
                                    <td className={cn("py-3 px-1 min-[350px]:px-4 text-center font-bold text-[9px] min-[350px]:text-sm dir-ltr", changeColor)}>
                                        <div className="flex items-center justify-center gap-0.5 min-[350px]:gap-1">
                                            %{formatPrice(Math.abs(row.percent || 0))}
                                            {isPositive && <ArrowUp className="w-2 h-2 min-[350px]:w-4 min-[350px]:h-4" />}
                                            {isNegative && <ArrowDown className="w-2 h-2 min-[350px]:w-4 min-[350px]:h-4" />}
                                            {!isPositive && !isNegative && <Minus className="w-2 h-2 min-[350px]:w-4 min-[350px]:h-4" />}
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <span>
                    {locale === 'ar'
                        ? `آخر تحديث: ${data.source_update_time || 'الآن'}`
                        : `Last Updated: ${data.source_update_time || 'Just now'}`}
                </span>

            </div>
        </div>
    );
}
