
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePathname } from "next/navigation";

const sectionIds = ["hero", "about", "skills", "services", "projects", "education", "certificates", "contact"];

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
    { name: "Home", href: `${locale}#hero` },
    { name: "About", href: `${locale}#about` },
    { name: "Service", href: `${locale}#services` },
    { name: "Portfolio", href: `${locale}#projects` },
    { name: "Blog", href: `${locale}#blog` },
    { name: "Contact", href: `${locale}#contact` },
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

    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`${locale}#hero`} className="flex items-center">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div className={cn(
            "transition-opacity duration-200",
            showNameInHeader ? "opacity-100" : "opacity-0"
          )}>
            <span className="font-bold text-gray-900 text-lg">Brooklyn</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600",
                activeSection === link.href.split('#')[1] 
                  ? "text-purple-600" 
                  : "text-gray-600"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Button 
            asChild 
            className="hidden md:inline-flex bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6"
          >
            <Link href={`${locale}#contact`}>
              Download CV
            </Link>
          </Button>
          <MobileNav navLinks={navLinks} name={name} dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
}
