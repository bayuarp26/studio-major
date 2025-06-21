"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Certificates", href: "#certificates" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-headline text-2xl font-bold text-primary">Wahyu</span>
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
           <Button asChild className="hidden md:flex" variant="outline" style={{borderColor: 'hsl(var(--primary))', color: 'hsl(var(--primary))'}}>
            <Link href="#contact">Contact Me</Link>
          </Button>
          <div className="md:hidden">
            <MobileNav navLinks={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}
