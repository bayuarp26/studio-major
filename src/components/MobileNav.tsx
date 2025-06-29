"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

interface MobileNavProps {
  navLinks: { name: string; href: string }[];
  name: string;
}

export function MobileNav({ navLinks, name }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const allSectionIds = useMemo(() => 
    ['hero', ...navLinks.map(link => link.href.substring(1)), 'tools', 'contact']
  , [navLinks]);
  const activeSection = useActiveSection(allSectionIds);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-background">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b pb-4">
             <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <span
                className={cn(
                  "font-headline text-2xl font-bold text-primary transition-opacity duration-300",
                  activeSection === 'hero' ? "opacity-0" : "opacity-100"
                )}
              >
                {name}
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5"/>
            </Button>
          </div>
          <div className="mt-6 flex flex-1 flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  activeSection === link.href.substring(1) ? "text-primary" : "text-foreground/70"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button asChild>
                <Link href="#contact" onClick={() => setOpen(false)}>Hubungi Saya</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
