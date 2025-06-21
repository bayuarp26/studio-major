'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminForm from '@/components/AdminForm';
import { Loader2 } from 'lucide-react';
import { getSession, logout } from '@/lib/auth';

export default function AdminPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setIsAuth(true);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    // Membersihkan semua data dari local storage saat logout
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    await logout();
    router.push('/');
    router.refresh();
  };


  if (!isAuth) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/5 min-h-screen">
      <div className="container mx-auto py-10">
        <AdminForm onLogout={handleLogout} />
      </div>
    </div>
  );
}
