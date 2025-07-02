
import AdminForm from '@/components/AdminForm';
import { getPortfolioData } from '@/lib/data';
import type { PortfolioData } from '@/lib/types';

// Middleware akan melindungi rute ini.
// Kita bisa dengan aman berasumsi sesi valid di sini.
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
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
        {/* Meneruskan data yang diambil dari server ke komponen klien */}
        <AdminForm initialData={portfolioData} />
      </div>
    </div>
  );
}
