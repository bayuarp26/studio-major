'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminForm from '@/components/AdminForm';
import { Loader2 } from 'lucide-react';
import { getSession, logout } from '@/lib/auth';
import type { PortfolioData } from '@/lib/types';

export default function AdminPage() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndFetchData() {
      const session = await getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      setSessionChecked(true);

      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const data = await response.json();
        setPortfolioData(data);
      } catch (error) {
        console.error("Failed to load initial data for admin form", error);
        // Optionally, show a toast message to the user
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthAndFetchData();
  }, [router]);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    await logout();
    router.push('/');
    router.refresh();
  };

  if (!sessionChecked || isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading Admin Panel...</p>
      </div>
    );
  }
  
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
        <AdminForm initialData={portfolioData} onLogout={handleLogout} />
      </div>
    </div>
  );
}
