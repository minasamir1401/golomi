import { MetadataRoute } from 'next'
import { getNews, getAllCountriesPrices } from '@/lib/api'

export const revalidate = 3600; // Update sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://goldservice-egypt.com'

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/gold',
        '/silver',
        '/calculator',
        '/countries',
        '/currencies',
        '/news',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // 2. Dynamic News Articles
    let articles: MetadataRoute.Sitemap = []
    try {
        const newsData = await getNews(undefined, 1, 100) // Fetch last 100 articles
        if (newsData && Array.isArray(newsData.articles)) {
            articles = newsData.articles.map((article: any) => ({
                url: `${baseUrl}/news/${article.slug}`,
                lastModified: new Date(article.updated_at || article.created_at),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        }
    } catch (e) {
        console.error("Failed to fetch news for sitemap", e)
    }

    // 3. Dynamic Countries
    let countryRoutes: MetadataRoute.Sitemap = []
    try {
        const countriesData = await getAllCountriesPrices()
        if (countriesData) {
            countryRoutes = Object.keys(countriesData).map((countryCode) => ({
                url: `${baseUrl}/countries/${countryCode.toLowerCase()}`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.6,
            }))
        }
    } catch (e) {
        // Fallback if API fails
        const defaultCountries = [
            'egypt', 'saudi-arabia', 'united-arab-emirates', 'kuwait',
            'qatar', 'bahrain', 'oman', 'jordan', 'lebanon', 'iraq',
            'yemen', 'palestine', 'algeria', 'morocco'
        ]
        countryRoutes = defaultCountries.map((slug) => ({
            url: `${baseUrl}/countries/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.6,
        }))
    }

    return [...staticRoutes, ...articles, ...countryRoutes]
}
