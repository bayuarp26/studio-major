
import { redirect } from 'next/navigation';
import AdminForm from '@/components/AdminForm';
import { getSession } from '@/lib/auth';
import { getPortfolioData } from '@/lib/data';
import type { PortfolioData } from '@/lib/types';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch data directly on the server
  const portfolioData = await getPortfolioData();

  if (!portfolioData) {
     return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <p className="mt-4 text-lg text-destructive">Failed to load portfolio data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/5 min-h-screen">
      <div className="container mx-auto py-10">
        {/* Pass the server-fetched data to the client component */}
        <AdminForm initialData={portfolioData} />
      </div>
    </div>
  );
}
