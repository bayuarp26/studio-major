
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolioData } from "@/lib/data";
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '../../../i18n.config';

export default async function MainLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const portfolioData = await getPortfolioData();
  const dictionary = await getDictionary(params.lang);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header name={portfolioData.name} dictionary={dictionary} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer dictionary={dictionary} name={portfolioData.name} />
    </div>
  );
}
