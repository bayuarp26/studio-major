
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Inter } from "next/font/google";
import { i18n, type Locale } from '../../i18n.config';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang?: Locale }>;
}>) {
  const { lang } = await params;
  
  return (
    <html lang={lang || i18n.defaultLocale} suppressHydrationWarning className={inter.variable}>
      <body className={cn("font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
