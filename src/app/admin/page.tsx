'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminForm from '@/components/AdminForm';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('is-authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/30 min-h-screen">
      <div className="container mx-auto py-10">
        <AdminForm />
      </div>
    </div>
  );
}
