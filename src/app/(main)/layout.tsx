
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolioData } from "@/lib/data";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const portfolioData = await getPortfolioData();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header name={portfolioData.name} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
