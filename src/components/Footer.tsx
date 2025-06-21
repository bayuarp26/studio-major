import Link from "next/link";
import { Settings } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex items-center justify-between py-4 text-sm text-muted-foreground">
        <p>&copy; {currentYear} portofolio wahyu. All rights reserved.</p>
        <Link href="/login" className="transition-colors hover:text-primary" aria-label="Admin Login">
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
}
