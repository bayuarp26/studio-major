import LoginForm from '@/components/LoginForm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <LoginForm />
    </div>
  );
}
