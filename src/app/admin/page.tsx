
import { redirect } from 'next/navigation';

// Halaman ini sekarang hanya ada sebagai fallback.
// Middleware akan menangkap permintaan ke /admin dan mengarahkannya ke /admin/dashboard.
export default function AdminRootPage() {
  redirect('/admin/dashboard');
}
