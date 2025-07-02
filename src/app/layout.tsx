
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Inter } from "next/font/google";
import type { Metadata } from 'next';
import { getPortfolioData } from '@/lib/data';
import { getDictionary } from '@/lib/dictionaries';
import { i18n, type Locale } from '../../i18n.config';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const portfolioData = await getPortfolioData();
  const dictionary = await getDictionary(lang);
  return {
    title: `${dictionary.metadata.portfolio} ${portfolioData.name}`,
    description: portfolioData.title,
  };
}


export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  return (
    <html lang={params.lang} className="!scroll-smooth" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
