"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Tentang", href: "#about" },
  { name: "Keahlian", href: "#skills" },
  { name: "Proyek", href: "#projects" },
];

const allSectionIds = ['hero', ...navLinks.map(link => link.href.substring(1)), 'contact'];

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  const activeSection = useActiveSection(allSectionIds);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span
            className={cn(
              "text-2xl font-bold text-primary transition-all duration-300",
              activeSection === 'hero' ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"
            )}
          >
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
                activeSection === link.href.substring(1) ? "text-primary" : "text-foreground/60"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
           <Button asChild className="hidden md:flex">
            <Link href="#contact">Hubungi Saya</Link>
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
