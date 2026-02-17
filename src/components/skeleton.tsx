"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-xl bg-secondary/10",
                className
            )}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="glass-card p-6 h-[180px] flex flex-col gap-4">
            <div className="flex justify-between">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-3 w-20" />
        </div>
    );
}
