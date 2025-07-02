
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useActiveSection } from "@/hooks/use-active-section";

const navLinks = [
  { name: "Profile", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Certificates", href: "#education" },
];

const sectionIds = ["hero", "about", "skills", "tools", "projects", "education", "certificates", "contact"];

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  const activeSection = useActiveSection(sectionIds);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="#hero" className="mr-6 flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">
            {name}
          </span>
        </Link>
        <nav className="hidden md:flex md:items-center md:gap-6 text-sm">
          {navLinks.map((link) => {
            const isActive =
              link.href === `#${activeSection}` ||
              (link.href === '#education' && activeSection === 'certificates') ||
              (link.href === '#skills' && activeSection === 'tools');
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground/60"
                )}
              >
                {link.name}
              </Link>
            );
          })}
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
