
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useActiveSection } from "@/hooks/use-active-section";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePathname } from "next/navigation";

const sectionIds = ["hero", "about", "skills", "projects", "education", "certificates", "contact"];

interface HeaderProps {
  name: string;
  dictionary: any;
}

export default function Header({ name, dictionary }: HeaderProps) {
  const activeSection = useActiveSection(sectionIds);
  const [showNameInHeader, setShowNameInHeader] = useState(false);
  const pathname = usePathname();

  // Extract locale from pathname, e.g., /en/projects -> /en
  const locale = `/${pathname.split('/')[1]}`;

  const navLinks = [
    { name: dictionary.nav.profile, href: `${locale}#hero` },
    { name: dictionary.nav.about, href: `${locale}#about` },
    { name: dictionary.nav.skills, href: `${locale}#skills` },
    { name: dictionary.nav.projects, href: `${locale}#projects` },
    { name: dictionary.nav.certificates, href: `${locale}#education` },
  ];
  
  useEffect(() => {
    const heroNameElement = document.getElementById('hero-name');
    if (!heroNameElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNameInHeader(!entry.isIntersecting);
      },
      {
        rootMargin: '-64px 0px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(heroNameElement);

    return () => {
      observer.unobserve(heroNameElement);
    };
  }, []);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href={`${locale}#hero`} className="mr-6 flex items-center space-x-2">
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
              link.href === `${locale}#${activeSection}` ||
              (link.href === `${locale}#education` && activeSection === 'certificates');
            
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
            <Link href={`${locale}#contact`}>{dictionary.nav.contactMe}</Link>
          </Button>
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="md:hidden">
            <MobileNav navLinks={navLinks} name={name} dictionary={dictionary} />
          </div>
        </div>
      </div>
    </header>
  );
}
