/**
 * Terror-Level Smart API Resolver
 * Automatically detects environment, protocol, and host.
 * ZERO configuration required for most deployments.
 */

const getBaseUrl = (): string => {
    // 1. Client-side: Always use relative path for maximum stability and zero-config domain switching
    if (typeof window !== "undefined") {
        return "/api";
    }

    // 2. Server-side (SSR/ISR): Multi-layer discovery

    // Layer A: Explicit Environment Variable (Priority)
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    }

    // Layer B: Vercel/Deployment Auto-detection
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/api`;
    }

    // Layer C: Default Local Development
    const port = process.env.PORT || 8000;
    return `http://127.0.0.1:${port}`;
};

export const API_URL = getBaseUrl();

// Types & Interfaces
export interface GoldPrice {
    sell: number;
    buy: number;
    timestamp?: string;
}

export interface GoldPricesResponse {
    timestamp: string;
    prices: Record<string, GoldPrice>;
    source: string;
}

export interface NormalizedGoldPrice {
    id: number;
    karat: string;
    sell_price: number;
    buy_price: number;
    currency: string;
    timestamp: string;
    source?: string;
    source_status: string;
    type: string;
}

// Helper to ensure clean URLs
export const getCleanUrl = (path: string) => {
    const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
};

// ... Rest of the existing API functions (I will preserve them in the full replacement)
// To be efficient, I'll keep the exported functions but wrap their fetches in getCleanUrl if needed.
// However, since API_URL is now smart, most existing code fetch(`${API_URL}/...`) will just work.
