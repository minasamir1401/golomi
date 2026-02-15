"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getFullMarketSnapshot } from "@/lib/api";

interface MarketDataContextType {
    snapshot: any | null;
    loading: boolean;
    lastUpdated: Date | null;
    refresh: () => Promise<void>;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: ReactNode }) {
    const [snapshot, setSnapshot] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const refresh = async () => {
        try {
            const data = await getFullMarketSnapshot();
            if (data) {
                setSnapshot(data);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error("MarketDataProvider: Failed to fetch snapshot", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 30000); // Global refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <MarketDataContext.Provider value={{ snapshot, loading, lastUpdated, refresh }}>
            {children}
        </MarketDataContext.Provider>
    );
}

export function useMarketData() {
    const context = useContext(MarketDataContext);
    if (context === undefined) {
        throw new Error("useMarketData must be used within a MarketDataProvider");
    }
    return context;
}
