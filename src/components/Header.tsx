"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { name: "Tentang", href: "#about" },
  { name: "Pendidikan", href: "#education" },
  { name: "Sertifikat", href: "#certificates" },
  { name: "Keahlian", href: "#skills" },
  { name: "Proyek", href: "#projects" },
];

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  const firstName = name.split(" ")[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">{firstName}</span>
        </Link>
        <nav className="hidden md:flex md:items-center md:gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
           <Button asChild className="hidden md:flex">
            <Link href="#contact">Hubungi Saya</Link>
          </Button>
          <div className="md:hidden">
            <MobileNav navLinks={navLinks} name={name} />
          </div>
        </div>
      </div>
    </header>
  );
}
