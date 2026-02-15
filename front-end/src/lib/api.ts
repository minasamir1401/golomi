const getBaseUrl = (): string => {
    // 1. Client-side: Uses relative proxy path
    if (typeof window !== "undefined") return "/api";

    // 2. Server-side: Must use absolute URL to backend
    // In local dev, backend is at port 8000
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    // Ensure we return the absolute URL with /api prefix for internal fetches
    const cleanBase = backendUrl.replace(/\/$/, "");
    return `${cleanBase}/api`;
};

export const API_URL = getBaseUrl();

// --- Auth Helpers ---

export const getAuthHeaders = (): Record<string, string> => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
            return {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };
        }
    }
    return {
        "Content-Type": "application/json"
    };
};

export interface User {
    id: number;
    username: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }
    return await response.json();
}

export async function getMe(): Promise<User | null> {
    try {
        const headers = getAuthHeaders();
        if (!headers.Authorization) return null;

        const response = await fetch(`${API_URL}/auth/me`, { headers });
        if (response.status === 401) return null;
        if (!response.ok) throw new Error("Failed to fetch user");
        return await response.json();
    } catch (error) {
        // Only log if it's not a standard unauthorized case or handled status
        console.error("Error fetching me:", error);
        return null;
    }
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<User> {
    const headers = getAuthHeaders();
    if (!headers.Authorization) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/auth/change-password?old_password=${encodeURIComponent(oldPassword)}&new_password=${encodeURIComponent(newPassword)}`, {
        method: "PUT",
        headers
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to change password");
    }
    return await response.json();
}

export async function getUsers(): Promise<User[]> {
    const headers = getAuthHeaders();
    if (!headers.Authorization) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/auth/users`, { headers });
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
}

export async function createUser(userData: any): Promise<User> {
    const headers = getAuthHeaders();
    if (!headers.Authorization) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/auth/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to create user");
    }
    return await response.json();
}

export async function updateUser(userId: number, userData: any): Promise<User> {
    const headers = getAuthHeaders();
    if (!headers.Authorization) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to update user");
    }
    return await response.json();
}

export async function deleteUser(userId: number): Promise<void> {
    const headers = getAuthHeaders();
    if (!headers.Authorization) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: "DELETE",
        headers
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to delete user");
    }
}



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

export interface GoldSnapshotPrice {
    sell: number;
    buy: number;
    timestamp?: string;
}

export interface MarketSnapshot {
    metadata: {
        timestamp: string;
        api_version: string;
    };
    settings: Record<string, string>;
    gold_egypt: {
        prices: Record<string, GoldSnapshotPrice>;
        source: string | null;
        last_update: string | null;
    };
    currencies: {
        rates: Record<string, GoldSnapshotPrice>;
        source: string | null;
        last_update: string | null;
    };
    silver: {
        gram: number | null;
        sell_price: number | null;
        buy_price: number | null;
        ounce: number | null;
        ounce_usd: number | null;
        purities: Record<string, number | null>;
        last_update: string | null;
    };
    news: Array<{
        title: string;
        slug: string;
        featured_image: string | null;
        created_at: string;
    }>;
    gold_history_preview: Array<{
        date: string;
        price: number;
    }>;
}

export const getGoldPricesMap = (prices: Record<string, GoldSnapshotPrice> | undefined) => {
    if (!prices) return {};
    const map: Record<string, GoldSnapshotPrice> = {};
    Object.entries(prices).forEach(([key, val]) => {
        map[key] = val;
        if (!key.includes("عيار")) {
            map[`عيار ${key}`] = val;
        }
    });
    return map;
};

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

export async function getNormalizedGoldPrices(): Promise<NormalizedGoldPrice[]> {
    try {
        const response = await fetch(`${API_URL}/gold/prices`);

        if (!response.ok) {
            throw new Error("Failed to fetch prices");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold prices:", error);
        return [];
    }
}

// Unified Production Endpoints

export async function getFullMarketSnapshot(): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/v1/snapshot`, { next: { revalidate: 10 } });

        if (!response.ok) throw new Error("Failed to fetch market snapshot");
        return await response.json();
    } catch (error) {
        console.error("Error fetching market snapshot:", error);
        return null;
    }
}

export async function getGoldPrices(): Promise<any | null> {
    try {
        const response = await fetch(`${API_URL}/v1/gold/today`, { next: { revalidate: 10 } });

        if (!response.ok) throw new Error("Failed to fetch prices");
        const data = await response.json();

        // Transform data format
        const pricesMap: Record<string, any> = {};
        Object.entries(data.prices).forEach(([key, val]: [string, any]) => {
            const keyAr = key.includes("عيار") ? key : `عيار ${key} `;
            const keyEn = key;
            pricesMap[keyAr] = val;
            pricesMap[keyEn] = val;
        });

        if (pricesMap["عيار 21"]) {
            const poundData = {
                sell: pricesMap["عيار 21"].sell * 8,
                buy: pricesMap["عيار 21"].buy * 8
            };
            pricesMap["الجنيه الذهب"] = poundData;
            pricesMap["gold_pound"] = poundData;
        }
        if (pricesMap["عيار 24"]) {
            const ounceData = {
                sell: pricesMap["عيار 24"].sell * 31.1035,
                buy: pricesMap["عيار 24"].buy * 31.1035
            };
            pricesMap["الأونصة"] = ounceData;
            pricesMap["gold_ounce"] = ounceData;
        }

        return {
            prices: pricesMap,
            timestamp: data.last_update,
            source: data.source || "Primary"
        };
    } catch (error) {
        console.error("Error fetching gold prices:", error);
        return null;
    }
}

export async function getSarfCurrencies() {
    try {
        const response = await fetch(`${API_URL}/v1/currency/today`, { next: { revalidate: 10 } });

        if (!response.ok) throw new Error("Failed to fetch sarf currencies");
        const data = await response.json();

        return Object.entries(data.rates).map(([currency, prices]: [string, any]) => ({
            currency,
            sell_price: prices.sell,
            buy_price: prices.buy,
            source: data.source
        }));
    } catch (error) {
        console.error("Error fetching sarf currencies:", error);
        return [];
    }
}

export async function getGoldHistory(karat: string, period: string = "7d") {
    try {
        const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "1y": 365, "90d": 90, "180d": 180 };
        const days = daysMap[period] || 7;
        const response = await fetch(`${API_URL}/v1/gold/history-range?karat=${karat}&days=${days}`, { cache: 'no-store' });

        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        return data.data; // Return the array of records
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
}

export async function getGoldHistoryRange(karat: string, days: number = 7) {
    try {
        const response = await fetch(`${API_URL}/v1/gold/history-range?karat=${karat}&days=${days}`, { cache: 'no-store' });
        if (!response.ok) throw new Error("Failed to fetch history range");
        return await response.json();
    } catch (error) {
        console.error("Error fetching history range:", error);
        return { data: [], chart_labels: [], chart_data: [] };
    }
}


export async function getPriceHistory(days: number = 7) {
    const period = days === 1 ? "7d" : days <= 7 ? "7d" : days <= 30 ? "30d" : "1y";
    return getGoldHistory("21", period);
}

export async function getGoldLiveCards() {
    try {
        const response = await fetch(`${API_URL}/gold-live-cards`);
        if (!response.ok) throw new Error("Failed to fetch gold live cards");
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold live cards:", error);
        return [];
    }
}

export async function getGoldLiveHistory() {
    try {
        const response = await fetch(`${API_URL}/gold-live-history`, { cache: 'no-store' });
        if (!response.ok) throw new Error("Failed to fetch gold live history");
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold live history:", error);
        return [];
    }
}

export async function getGoldLivePrices() {
    try {
        const response = await fetch(`${API_URL}/gold-live-prices`);
        if (!response.ok) throw new Error("Failed to fetch gold live prices");
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold live prices:", error);
        return [];
    }
}

export async function getGoldLiveProducts() {
    try {
        const response = await fetch(`${API_URL}/gold-live-products`);
        if (!response.ok) throw new Error("Failed to fetch gold live products");
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold live products:", error);
        return [];
    }
}

export async function getGoldLiveCurrencies() {
    try {
        const response = await fetch(`${API_URL}/gold-live-currencies`);
        if (!response.ok) throw new Error("Failed to fetch gold live currencies");
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold live currencies:", error);
        return [];
    }
}

export async function getAllCountriesPrices() {
    try {
        const response = await fetch(`${API_URL}/all-countries`);
        if (!response.ok) throw new Error("Failed to fetch all countries prices");
        return await response.json();
    } catch (error) {
        console.error("Error fetching all countries prices:", error);
        return {};
    }
}

export async function getCountryPrices(country: string) {
    try {
        const response = await fetch(`${API_URL}/country/${country}`);
        if (!response.ok) throw new Error(`Failed to fetch prices for ${country}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching prices for ${country}:`, error);
        return null;
    }
}

export async function getCurrencyPrices() {
    try {
        const response = await fetch(`${API_URL}/sarf-currencies`);
        if (!response.ok) throw new Error("Failed to fetch currency prices");
        return await response.json();
    } catch (error) {
        console.error("Error fetching currency prices:", error);
        return [];
    }
}

export async function getBanks() {
    try {
        const response = await fetch(`${API_URL}/currency/banks`);
        if (!response.ok) throw new Error("Failed to fetch banks");
        return await response.json();
    } catch (error) {
        console.error("Error fetching banks:", error);
        return [];
    }
}

export async function getBankRates(bankName: string) {
    try {
        const response = await fetch(`${API_URL}/currency/bank/${encodeURIComponent(bankName)}`);
        if (!response.ok) throw new Error(`Failed to fetch rates for bank: ${bankName}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching bank rates:", error);
        return null;
    }
}

export async function getMarketSummary(from: string = "USD", to: string = "EGP") {
    try {
        const response = await fetch(`${API_URL}/currency/summary/${from}/${to}`);
        if (!response.ok) throw new Error("Failed to fetch market summary");
        return await response.json();
    } catch (error) {
        console.error("Error fetching market summary:", error);
        return null;
    }
}

export async function getDetailedCurrencyRates(from: string = "USD", to: string = "EGP") {
    try {
        const response = await fetch(`${API_URL}/currency/rates/${from}/${to}`);
        if (!response.ok) throw new Error(`Failed to fetch rates for ${from}/${to}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching detailed rates:", error);
        return null;
    }
}

export async function getAvailableCurrencyPairs() {
    try {
        const response = await fetch(`${API_URL}/currency/available-currencies`);
        if (!response.ok) throw new Error("Failed to fetch available currencies");
        return await response.json();
    } catch (error) {
        console.error("Error fetching available currencies:", error);
        return { currency_pairs: [] };
    }
}

// DB-DRIVEN ARCHITECTURE FETCHERS
export async function getDbLatestRates() {
    try {
        const response = await fetch(`${API_URL}/currency/db/rates/latest`);
        if (!response.ok) throw new Error("Failed to fetch latest DB rates");
        return await response.json();
    } catch (error) {
        console.error("Error fetching latest DB rates:", error);
        return { status: "error", data: [] };
    }
}

export async function getDbRatesByDate(date: string) {
    try {
        const response = await fetch(`${API_URL}/currency/db/rates/by-date?date=${date}`);
        if (!response.ok) throw new Error(`Failed to fetch rates for ${date}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching rates by date:", error);
        return { status: "error", data: [] };
    }
}


export async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getMakingCharges() {
    try {
        const response = await fetch(`${API_URL}/making-charges`);
        if (!response.ok) throw new Error("Failed to fetch making charges");
        return await response.json();
    } catch (error) {
        console.error("Error fetching making charges:", error);
        return {};
    }
}

export async function getIsagha() {
    try {
        const response = await fetch(`${API_URL}/isagha`);
        if (!response.ok) throw new Error("Failed to fetch isagha data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching isagha data:", error);
        return null;
    }
}


// ARTICLES & NEWS

export async function getNews(category?: string, page: number = 1, limit: number = 10) {
    try {
        const skip = (page - 1) * limit;
        // Important: Added trailing slash before query params to avoid FastAPI 307 redirect
        let url = `${API_URL}/v1/news/?skip=${skip}&limit=${limit}`;
        // Category filtering is not yet implemented in backend, so we might want to skip sending it or send it for future compat
        // if (category) url += `&category=${encodeURIComponent(category)}`;

        const response = await fetch(url, { next: { revalidate: 10 } });
        if (!response.ok) throw new Error(`Failed to fetch news from ${url}`);

        const data = await response.json();
        if (Array.isArray(data)) {
            return { articles: data, total: data.length };
        }
        return data;
    } catch (error) {
        console.error(`Error fetching news from ${API_URL}/v1/news:`, error);
        return { articles: [], total: 0 };
    }
}


export async function getArticles(status: string = 'published', page: number = 1, limit: number = 10, category?: string) {
    return getNews(category, page, limit);
}

export async function getArticle(slug: string) {
    try {
        // Try exact slug
        const response = await fetch(`${API_URL}/v1/news/${slug}`, {
            cache: 'no-store',
            headers: { "Accept": "application/json" }
        });

        if (response.ok) return await response.json();

        // If not found, try decoded slug (in case of Arabic/Encoded URLs)
        const decodedSlug = decodeURIComponent(slug);
        if (decodedSlug !== slug) {
            const retryResponse = await fetch(`${API_URL}/v1/news/${encodeURIComponent(decodedSlug)}`, { cache: 'no-store' });
            if (retryResponse.ok) return await retryResponse.json();
        }

        // If still not found, throw error to trigger client-side fallback if needed
        console.warn(`[getArticle] Article not found: ${slug} (Status: ${response.status})`);
        return null;
    } catch (error) {
        console.error(`[getArticle] Critical error fetching ${slug}:`, error);
        return null;
    }
}

export async function createNewsArticle(payload: any) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/v1/news/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Failed to create article");
        }
        return await response.json();
    } catch (error) {
        console.error(`Error creating article:`, error);
        throw error;
    }
}

export async function updateNewsArticle(slug: string, payload: any) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/v1/news/${slug}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Failed to update article");
        }
        return await response.json();
    } catch (error) {
        console.error(`Error updating article ${slug}:`, error);
        throw error;
    }
}

export async function deleteNewsArticle(slug: string) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/v1/news/${slug}`, {
            method: 'DELETE',
            headers
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Failed to delete article");
        }
        return await response.json();
    } catch (error) {
        console.error(`Error deleting article ${slug}:`, error);
        throw error;
    }
}


// THEMES & SETTINGS

export async function getActiveTheme() {
    try {
        const response = await fetch(`${API_URL}/theme`, { next: { revalidate: 3600 } });
        if (!response.ok) throw new Error("Failed to fetch theme");
        return await response.json();
    } catch (error) {
        console.error("Error fetching theme:", error);
        return null;
    }
}

// ADMIN FUNCTIONS

export async function getAdminSettings() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/settings`, { headers, next: { revalidate: 60 } });
        if (response.status === 401 || response.status === 403) return null;
        if (!response.ok) throw new Error(`Failed to fetch admin settings from ${API_URL}/admin/settings`);
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function updateAdminSetting(key: string, value: string) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ key, value })
        });
        if (!response.ok) throw new Error("Failed to update setting");
        return await response.json();
    } catch (error) {
        console.error("Error updating admin setting:", error);
        return { status: "error" };
    }
}

export async function getAdminStats() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/stats`, { headers, cache: 'no-store' });
        if (response.status === 401 || response.status === 403) return null;
        if (!response.ok) throw new Error("Failed to fetch admin stats");
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function getRawCache() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/raw-cache`, { headers, cache: 'no-store' });
        if (response.status === 401 || response.status === 403) return null;
        if (!response.ok) throw new Error("Failed to fetch raw cache");
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function seedHistoricalArchive() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/seed-archive`, {
            method: 'POST',
            headers
        });
        if (!response.ok) throw new Error("Failed to seed archive");
        return await response.json();
    } catch (error) {
        console.error("Error seeding archive:", error);
        return { status: "error" };
    }
}

export async function updateManualPrice(karat: string, price: string | null) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/manual-price`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ karat, price })
        });
        if (!response.ok) throw new Error("Failed to update manual price");
        return await response.json();
    } catch (error) {
        console.error("Error updating manual price:", error);
        return { status: "error" };
    }
}

export async function getManualPrices() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/manual-prices`, { headers, cache: 'no-store' });
        if (response.status === 401 || response.status === 403) return {};
        if (!response.ok) throw new Error("Failed to fetch manual prices");
        return await response.json();
    } catch (error) {
        return {};
    }
}

export async function triggerNewsScrape() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/scrape-news`, {
            method: 'POST',
            headers
        });
        if (!response.ok) throw new Error("Failed to trigger news scrape");
        return await response.json();
    } catch (error) {
        console.error("Error triggering news scrape:", error);
        return { status: "error" };
    }
}

export async function testNewsSources() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/test-news-sources`, { headers });
        if (!response.ok) throw new Error("Failed to test news sources");
        return await response.json();
    } catch (error) {
        console.error("Error testing news sources:", error);
        return {};
    }
}

export async function triggerGoldScrape() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/scrape`, {
            method: 'POST',
            headers
        });
        if (!response.ok) throw new Error("Failed to trigger gold scrape");
        return await response.json();
    } catch (error) {
        console.error("Error triggering gold scrape:", error);
        return { status: "error" };
    }
}

export async function testGoldSource(sourceName: string) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/test-gold-source/${sourceName}`, {
            method: 'POST',
            headers
        });
        if (!response.ok) throw new Error("Failed to test gold source");
        return await response.json();
    } catch (error) {
        console.error("Error testing gold source:", error);
        return { status: "error" };
    }
}

export async function triggerCurrencyScrape() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/scrape/currency`, {
            method: 'POST',
            headers
        });
        if (!response.ok) throw new Error("Failed to trigger currency scrape");
        return await response.json();
    } catch (error) {
        console.error("Error triggering currency scrape:", error);
        return { status: "error" };
    }
}

export interface CurrencySource {
    id: number;
    source_name: string;
    display_name: string;
    is_enabled: boolean;
    priority: number;
    last_updated: string | null;
}

export async function getCurrencySources(): Promise<CurrencySource[]> {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/currency-sources`, { headers });
        if (!response.ok) throw new Error("Failed to fetch currency sources");
        return await response.json();
    } catch (error) {
        console.error("Error fetching currency sources:", error);
        return [];
    }
}

export async function updateCurrencySource(sourceName: string, isEnabled?: boolean, priority?: number): Promise<CurrencySource | null> {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/currency-sources/${sourceName}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ is_enabled: isEnabled, priority })
        });
        if (!response.ok) throw new Error("Failed to update currency source");
        return await response.json();
    } catch (error) {
        console.error("Error updating currency source:", error);
        return null;
    }
}

export async function reorderCurrencySources(order: string[]) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/currency-sources/reorder`, {
            method: 'POST',
            headers,
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error("Failed to reorder currency sources");
        return await response.json();
    } catch (error) {
        console.error("Error reordering currency sources:", error);
        return { status: "error" };
    }
}

export async function testCurrencySource(sourceName: string) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/test-currency-source/${sourceName}`, {
            method: 'POST',
            headers
        });
        if (!response.ok) throw new Error("Failed to test currency source");
        return await response.json();
    } catch (error) {
        console.error("Error testing currency source:", error);
        return { status: "error" };
    }
}

// ============= Silver Source Management APIs =============

export interface SilverSource {
    id: number;
    source_name: string;
    display_name: string;
    is_enabled: boolean;
    priority: number;
    last_updated: string | null;
}

export async function getSilverSources(): Promise<SilverSource[]> {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/silver-sources`, { headers });
        if (!response.ok) throw new Error("Failed to fetch silver sources");
        return await response.json();
    } catch (error) {
        console.error("Error fetching silver sources:", error);
        return [];
    }
}

export async function updateSilverSource(sourceName: string, isEnabled?: boolean, priority?: number): Promise<SilverSource | null> {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/silver-sources/${sourceName}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ is_enabled: isEnabled, priority })
        });
        if (!response.ok) throw new Error("Failed to update silver source");
        return await response.json();
    } catch (error) {
        console.error("Error updating silver source:", error);
        return null;
    }
}

export async function reorderSilverSources(order: string[]) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/silver-sources/reorder`, {
            method: 'POST',
            headers,
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error("Failed to reorder silver sources");
        return await response.json();
    } catch (error) {
        console.error("Error reordering silver sources:", error);
        return { status: "error" };
    }
}

export async function testSilverSource(sourceName: string) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/admin/test-silver-source/${sourceName}`, {
            method: 'POST',
            headers
        });
        if (!response.ok) throw new Error("Failed to test silver source");
        return await response.json();
    } catch (error) {
        console.error("Error testing silver source:", error);
        return { status: "error" };
    }
}

// ============= Silver Price APIs =============

export interface SilverPrice {
    id: number;
    source_used: string;
    source_status: string;
    prices: {
        gram: number | null;
        ounce: number | null;

        // 999 Purity
        silver_999_sell?: number | null;
        silver_999_buy?: number | null;
        silver_999_change?: number | null;
        silver_999_change_percent?: number | null;

        // 925 Purity
        silver_925_sell?: number | null;
        silver_925_buy?: number | null;
        silver_925_change?: number | null;
        silver_925_change_percent?: number | null;

        // 900 Purity
        silver_900_sell?: number | null;
        silver_900_buy?: number | null;
        silver_900_change?: number | null;
        silver_900_change_percent?: number | null;

        // 800 Purity
        silver_800_sell?: number | null;
        silver_800_buy?: number | null;
        silver_800_change?: number | null;
        silver_800_change_percent?: number | null;

        // Ounce USD
        ounce_usd_sell?: number | null;
        ounce_usd_buy?: number | null;
        ounce_usd_change?: number | null;
        ounce_usd_change_percent?: number | null;

        // Legacy
        silver_999: number | null;
        silver_925: number | null;
        buy: number | null;
        sell: number | null;
    };
    change: {
        absolute: number | null;
        percent: number | null;
    };
    currency: string;
    scraped_at: string | null;
    source_update_time: string | null;
    created_at: string;
}

export interface SilverHistoryResponse {
    total: number;
    limit: number;
    offset: number;
    data: SilverPrice[];
}

export interface SilverStatsResponse {
    period: {
        days: number;
        start: string;
        end: string;
    };
    total_records: number;
    gram_price: {
        current: number | null;
        min: number | null;
        max: number | null;
        avg: number | null;
    };
    ounce_price: {
        current: number | null;
        min: number | null;
        max: number | null;
        avg: number | null;
    };
    sources_used: {
        primary: number;
        fallback: number;
    };
}

export async function getLatestSilverPrice(): Promise<SilverPrice | null> {
    try {
        const response = await fetch(`${API_URL}/silver/latest`);
        if (!response.ok) {
            console.error(`Failed to fetch latest silver price: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching latest silver price:", error);
        return null;
    }
}

export async function getSilverPriceHistory(
    limit: number = 100,
    offset: number = 0
): Promise<SilverHistoryResponse | null> {
    try {
        const response = await fetch(
            `${API_URL}/silver/history?limit=${limit}&offset=${offset}`
        );
        if (!response.ok) {
            console.error(`Failed to fetch silver price history: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching silver price history:", error);
        return null;
    }
}

export async function getSilverPricesByDate(date: string): Promise<{
    date: string;
    count: number;
    data: SilverPrice[];
} | null> {
    try {
        const response = await fetch(`${API_URL}/silver/by-date?date=${date}`);
        if (!response.ok) {
            console.error(`Failed to fetch silver prices by date: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching silver prices by date:", error);
        return null;
    }
}

export async function getSilverPriceStats(
    days: number = 7
): Promise<SilverStatsResponse | null> {
    try {
        const response = await fetch(`${API_URL}/silver/stats?days=${days}`);
        if (!response.ok) {
            console.error(`Failed to fetch silver price stats: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching silver price stats:", error);
        return null;
    }
}

export async function getSilverSourceStatus(): Promise<{
    latest_source: string | null;
    latest_status: string | null;
    latest_scrape: string | null;
    recent_scrapes: Array<{
        source: string;
        status: string;
        timestamp: string;
    }>;
    source_reliability: {
        primary_success_rate: string;
        fallback_usage_rate: string;
    };
} | null> {
    try {
        const response = await fetch(`${API_URL}/silver/source-status/`);
        if (!response.ok) {
            console.error(`Failed to fetch silver source status: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching silver source status:", error);
        return null;
    }
}

// ============= QA APIs =============

export interface QAItem {
    id: number;
    page_key: string;
    question: string;
    answer: string;
    is_active: boolean;
    display_order: number;
    created_at?: string;
    updated_at?: string;
}

export async function getQAItems(activeOnly: boolean = true, pageKey?: string) {
    try {
        let url = `${API_URL}/qa/?active_only=${activeOnly}`;
        if (pageKey) url += `&page_key=${pageKey}`;

        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) throw new Error("Failed to fetch QA items");
        return await response.json();
    } catch (error) {
        console.error("Error fetching QA items:", error);
        return [];
    }
}

export async function createQAItem(payload: any) {
    try {
        const response = await fetch(`${API_URL}/qa/`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to create QA item");
        return await response.json();
    } catch (error) {
        console.error("Error creating QA item:", error);
        throw error;
    }
}

export async function updateQAItem(id: number, payload: any) {
    try {
        const response = await fetch(`${API_URL}/qa/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to update QA item");
        return await response.json();
    } catch (error) {
        console.error(`Error updating QA item ${id}:`, error);
        throw error;
    }
}

export async function deleteQAItem(id: number) {
    try {
        const response = await fetch(`${API_URL}/qa/${id}`, { method: 'DELETE' });

        if (!response.ok) throw new Error("Failed to delete QA item");
        return await response.json();
    } catch (error) {
        console.error(`Error deleting QA item ${id}:`, error);
        throw error;
    }
}
