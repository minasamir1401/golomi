import { Metadata } from 'next';
import PricesClient from './PricesClient';

export const metadata: Metadata = {
  title: 'أسعار الذهب اليوم في مصر - تحديث لحظي | Gold Prices Egypt',
  description: 'أفضل مصدر لمتابعة أسعار الذهب اليوم في مصر. تحديث لحظي لأسعار عيار 21، 24، 18 والجنيه الذهب وسعر الأوقية عالمياً.',
  keywords: ['سعر الذهب', 'أسعار الذهب اليوم', 'ذهب عيار 21', 'سعر الذهب في مصر', 'Gold Prices Egypt'],
  openGraph: {
    title: 'أسعار الذهب اليوم في مصر - تحديث لحظي',
    description: 'تابع أسعار الذهب لحظة بلحظة في السوق المصري من مصادر موثوقة.',
    url: 'https://goldprices.today/prices',
    siteName: 'Gold Prices Egypt',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أسعار الذهب اليوم في مصر',
    description: 'تابع أسعار الذهب لحظة بلحظة في السوق المصري.',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PricesPage() {
  return <PricesClient />;
}
