
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Belleza, Alegreya } from "next/font/google";
import { i18n, type Locale } from '../../i18n.config';

const belleza = Belleza({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-belleza",
});

const alegreya = Alegreya({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-alegreya",
});

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang?: Locale };
}>) {
  return (
    <html lang={params.lang || i18n.defaultLocale} suppressHydrationWarning className={`${belleza.variable} ${alegreya.variable}`}>
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
