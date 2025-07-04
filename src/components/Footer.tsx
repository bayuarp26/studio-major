
import Link from "next/link";
import { Settings } from "lucide-react";

export default function Footer({ dictionary, name }: { dictionary: any, name: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex items-center justify-between py-4 text-sm text-muted-foreground">
        <p>&copy; {currentYear} {name}. {dictionary.footer.rights}</p>
        <Link href="/admin/login" className="transition-colors hover:text-primary" aria-label="Admin Login">
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
}
