
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolioData } from "@/lib/data";
import { getDictionary } from '@/lib/dictionaries';
import type { Metadata } from 'next';
import { i18n, type Locale } from '../../../i18n.config';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const portfolioData = await getPortfolioData();
  const dictionary = await getDictionary(lang);
  return {
    title: `${dictionary.metadata.portfolio} ${portfolioData.name}`,
    description: portfolioData.title[lang],
  };
}


export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;
  const portfolioData = await getPortfolioData();
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header name={portfolioData.name} dictionary={dictionary} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer dictionary={dictionary} name={portfolioData.name} lang={lang} />
    </div>
  );
}
