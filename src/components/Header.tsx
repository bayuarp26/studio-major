"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePathname } from "next/navigation";

interface HeaderProps {
  name: string;
  dictionary: any;
}

export default function Header({ name, dictionary }: HeaderProps) {
  const sectionIds = ["hero", "about", "workProcess", "projects", "blog", "certificates", "services", "contact"];
  const activeSection = useActiveSection(sectionIds);
  const [showNameInHeader, setShowNameInHeader] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Extract locale from pathname, e.g., /en/projects -> /en
  const locale = `/${pathname.split('/')[1]}`;

  const navLinks = [
    { name: dictionary?.nav?.home || "Home", href: `${locale}#hero` },
    { name: dictionary?.nav?.about || "About", href: `${locale}#about` },
    { name: dictionary?.nav?.projects || "Projects", href: `${locale}#projects` },
    { name: dictionary?.nav?.blog || "Blog", href: `${locale}#blog` },
    { name: dictionary?.nav?.certificates || "Certificates", href: `${locale}#certificates` },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.split('#')[1];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById("hero-name");
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        setShowNameInHeader(rect.bottom < 0);
      }
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-safe",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/20" 
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-12xl">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo/Brand - Left Side */}
          <Link 
            href={locale || "/"} 
            className="flex items-center space-x-2 group touch-manipulation"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-700 transition-colors duration-300">
              <span className="text-white font-bold text-sm sm:text-base">
                {name ? name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'WP'}
              </span>
            </div>
            <span 
              className={cn(
                "font-headline font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 transition-all duration-300",
                showNameInHeader ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 sm:opacity-100 sm:translate-x-0"
              )}
            >
              {name || "Wahyu Pratomo"}
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={cn(
                  "px-3 xl:px-4 py-2 rounded-full text-sm xl:text-base font-medium transition-all duration-300 touch-manipulation hover:bg-purple-50",
                  activeSection === link.href.split('#')[1]
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:text-purple-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* CTA Button - Hidden on mobile */}
            <Button 
              asChild 
              size="sm"
              className="hidden sm:inline-flex bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 lg:px-6 py-2 text-sm lg:text-base transition-all duration-300 hover:scale-105 touch-manipulation"
            >
              <Link 
                href={`${locale}#contact`}
                onClick={(e) => handleSmoothScroll(e, `${locale}#contact`)}
              >
                {dictionary?.nav?.hireMeNow || "Hire Me Now"}
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <MobileNav navLinks={navLinks} name={name} dictionary={dictionary} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
