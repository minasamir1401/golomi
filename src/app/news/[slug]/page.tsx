
import { Metadata } from 'next';
import { getArticle } from "@/lib/api";
import ArticleClient from './article-client';

interface PageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const article = await getArticle(params.slug);

    if (!article) {
        return {
            title: 'المقال غير موجود | جولد سيرفيس',
            robots: { index: false }
        };
    }

    return {
        title: article.title,
        description: article.excerpt || article.title,
        openGraph: {
            title: article.title,
            description: article.excerpt || article.title,
            images: article.featured_image ? [article.featured_image] : [],
            type: 'article',
            publishedTime: article.created_at,
            modifiedTime: article.updated_at,
            authors: [article.author || 'Gold Service'],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt || article.title,
            images: article.featured_image ? [article.featured_image] : [],
        }
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const article = await getArticle(params.slug);

    return <ArticleClient article={article} slug={params.slug} />;
}
