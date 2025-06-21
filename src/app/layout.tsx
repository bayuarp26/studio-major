import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import fs from 'fs';
import path from 'path';
import type { PortfolioData } from '@/lib/types';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const getPortfolioData = (): PortfolioData => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'portfolio-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Coerce skills to be string[] if they are objects
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0 && typeof data.skills[0] === 'object' && data.skills[0] !== null) {
      data.skills = data.skills.map((skill: any) => String(skill.name || ''));
    }

    return data;
  } catch (error) {
    console.error("Failed to load portfolio data for layout, returning fallback. Error: ", error);
    // Return a fallback object if the file can't be read
    return {
      name: "Portfolio",
      title: "My Portfolio",
      about: "",
      cvUrl: "",
      profilePictureUrl: "",
      contact: { email: "", linkedin: "" },
      skills: [],
      projects: [],
      education: [],
      certificates: [],
    };
  }
};


export async function generateMetadata(): Promise<Metadata> {
  const portfolioData = getPortfolioData();
  return {
    title: `Portofolio ${portfolioData.name}`,
    description: portfolioData.title,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable)}>
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
