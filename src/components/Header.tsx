
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Profile", href: "/profile" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Certificates", href: "/certificates" },
];

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/profile" className="mr-6 flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">
            {name}
          </span>
        </Link>
        <nav className="hidden md:flex md:items-center md:gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/60"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
           <Button asChild className="hidden md:flex">
            <Link href="/contact">Hubungi Saya</Link>
          </Button>
          <ThemeToggle />
          <div className="md:hidden">
            <MobileNav navLinks={navLinks} name={name} />
          </div>
        </div>
      </div>
    </header>
  );
}
