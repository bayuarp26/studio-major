
import AdminForm from '@/components/AdminForm';
import BlogManager from '@/components/admin/BlogManager';
import { getPortfolioData } from '@/lib/data';
import type { PortfolioData } from '@/lib/types';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    // Jika tidak ada sesi yang valid, paksa redirect ke halaman login.
    // Ini adalah lapisan keamanan utama kita sekarang.
    redirect('/admin/login');
  }
  
  // Pengambilan data sekarang menjadi satu-satunya tanggung jawab halaman ini.
  const portfolioData = await getPortfolioData();

  if (!portfolioData) {
     return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <p className="mt-4 text-lg text-destructive">Gagal memuat data portofolio. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/5 min-h-screen">
      <div className="container mx-auto py-10">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio">Portfolio Data</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio" className="mt-6">
            {/* Meneruskan data yang diambil dari server ke komponen klien */}
            <AdminForm initialData={portfolioData} />
          </TabsContent>
          
          <TabsContent value="blog" className="mt-6">
            <BlogManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
