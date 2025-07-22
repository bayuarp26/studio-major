
import Link from "next/link";
import { Settings } from "lucide-react";

export default function Footer({ dictionary, name }: { dictionary: any, name: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-white text-lg">Brooklyn</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              I design and develop services for customers specializing creating stylish, modern websites.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link href="#services" className="text-gray-400 hover:text-white transition-colors text-sm">Services</Link></li>
              <li><Link href="#projects" className="text-gray-400 hover:text-white transition-colors text-sm">Portfolio</Link></li>
              <li><Link href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">Web Design</span></li>
              <li><span className="text-gray-400 text-sm">UI/UX Design</span></li>
              <li><span className="text-gray-400 text-sm">Web Development</span></li>
              <li><span className="text-gray-400 text-sm">SEO</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">johndoe@gmail.com</span></li>
              <li><span className="text-gray-400 text-sm">+1 (555) 000-0000</span></li>
              <li><span className="text-gray-400 text-sm">Brooklyn, NY</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {currentYear} {name}. All rights reserved.</p>
          <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors mt-4 md:mt-0" aria-label="Admin Login">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
