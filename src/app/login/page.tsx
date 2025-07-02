
import { redirect } from 'next/navigation';

// Halaman ini sekarang hanya ada sebagai fallback.
// Middleware akan menangkap permintaan ke /login dan mengarahkannya ke /admin/login.
export default function DeprecatedLoginPage() {
  redirect('/admin/login');
}
