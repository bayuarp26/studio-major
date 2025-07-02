
// This file is no longer used, as middleware redirects to /[lang]
// and the root page is now at /src/app/[lang]/page.tsx
// However, we keep it as a fallback.
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/profile');
}
