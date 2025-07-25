
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  navLinks: { name: string; href: string }[];
  name: string;
  dictionary: any;
}

export function MobileNav({ navLinks, name, dictionary }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = `/${pathname.split('/')[1]}`;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    
    // Small delay to allow sheet to close
    setTimeout(() => {
      const targetId = href.split('#')[1];
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden">
          <Menu className="h-6 w-6 text-gray-900" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-background [&>button]:hidden">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex h-full flex-col">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between border-b pb-4">
            <Link 
              href={`${locale}#hero`} 
              className="flex items-center space-x-2" 
              onClick={(e) => handleSmoothScroll(e, `${locale}#hero`)}
            >
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {name ? name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'WP'}
                </span>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                {name}
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8">
              <X className="h-5 w-5 text-gray-900" />
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 flex flex-1 flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="mobile-nav-link touch-target"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="space-y-4 border-t pt-4">
            {/* Language Switcher */}
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
            
            {/* Contact Button */}
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link 
                href={`${locale}#contact`} 
                onClick={(e) => handleSmoothScroll(e, `${locale}#contact`)}
              >
                {dictionary?.nav?.hireMeNow || "Hire Me Now"}
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
