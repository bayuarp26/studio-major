
'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getPortfolioData } from '@/lib/data';
import type { PortfolioData } from '@/lib/types';
import SessionChecker from '@/components/admin/SessionChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load heavy components
const AdminForm = lazy(() => import('@/components/AdminForm'));
const BlogManager = lazy(() => import('@/components/admin/BlogManager'));
const SessionTester = lazy(() => import('@/components/admin/SessionTester'));

export default function AdminDashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionData = await getSession();
        if (!sessionData) {
          router.push('/admin/login');
          return;
        }
        setSession(sessionData);

        // Load portfolio data after session is verified
        const data = await getPortfolioData();
        if (!data) {
          throw new Error('Failed to fetch portfolio data');
        }
        setPortfolioData(data);
      } catch (error) {
        console.error('Error loading data:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!portfolioData) {
     return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <p className="mt-4 text-lg text-destructive">Gagal memuat data portofolio. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/5 min-h-screen">
      {/* Session checker component - runs in background */}
      <SessionChecker />
      
      <div className="container mx-auto py-10">
        {/* Session testing component */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Session Testing</h3>
          <Suspense fallback={<div className="animate-pulse h-20 bg-muted rounded"></div>}>
            <SessionTester />
          </Suspense>
        </div>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio">Portfolio Data</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio" className="mt-6">
            <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded"></div>}>
              <AdminForm initialData={portfolioData} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="blog" className="mt-6">
            <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded"></div>}>
              <BlogManager />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
