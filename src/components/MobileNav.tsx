
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
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
             <Link href={`${locale}#hero`} className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-headline text-2xl font-bold text-primary">
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
                className={cn("text-lg font-medium text-foreground/70 transition-colors hover:text-primary")}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button asChild>
                <Link href={`${locale}#contact`} onClick={() => setOpen(false)}>{dictionary.nav.contactMe}</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
