"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
  const [showNameInHeader, setShowNameInHeader] = useState(false);

  useEffect(() => {
    const heroNameElement = document.getElementById('hero-name');
    if (!heroNameElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the hero name is NOT intersecting (i.e., scrolled out of view),
        // we want to show the name in the header.
        setShowNameInHeader(!entry.isIntersecting);
      },
      {
        // A top margin of -64px means the intersection event fires when the
        // element is 64px from the top of the viewport, which is exactly
        // when it goes under our sticky header.
        rootMargin: '-64px 0px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(heroNameElement);

    // Cleanup observer on component unmount
    return () => {
      observer.unobserve(heroNameElement);
    };
  }, []);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="#hero" className="mr-6 flex items-center space-x-2">
          <span
            className={cn(
              "text-2xl font-bold text-primary transition-opacity duration-300",
              showNameInHeader ? "opacity-100" : "opacity-0"
            )}
          >
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
