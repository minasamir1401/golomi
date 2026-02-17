import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin-hidden-portal/',
        },
        sitemap: 'https://goldservice-egypt.com/sitemap.xml',
    }
}
