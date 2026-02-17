"use client";

import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

interface ChartData {
    date: string;
    value: number;
}

interface HistoricalChartProps {
    data: ChartData[];
    color?: string;
    title: string;
}

export function HistoricalChart({
    data,
    color = "#ffd700",
    title,
}: HistoricalChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="glass-card p-6 w-full h-[400px]">
                <div className="h-6 w-48 bg-secondary/10 rounded mb-6 animate-pulse" />
                <div className="h-[300px] w-full bg-secondary/5 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="glass-card p-6 w-full h-[400px]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full" />
                {title}
            </h3>
            <div className="h-[300px] w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`${title.replace(/\s+/g, '-')}-gradient`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                            dy={10}
                        />
                        <YAxis hide={true} />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-card border border-border p-3 rounded-xl shadow-xl backdrop-blur-md">
                                            <p className="text-xs text-secondary mb-1">{payload[0].payload.date}</p>
                                            <p className="text-sm font-bold text-foreground">
                                                {new Intl.NumberFormat("ar-EG").format(payload[0].value as number)} ج.م
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#${title.replace(/\s+/g, '-')}-gradient)`}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
