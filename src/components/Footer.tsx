
import Link from "next/link";
import { Settings } from "lucide-react";
import type { Locale } from "../../i18n.config";

export default function Footer({ dictionary, name, lang = 'id' }: { dictionary: any, name: string, lang?: Locale }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={`/${lang}`} className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">
                  {name ? name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'WP'}
                </span>
              </div>
              <span className="font-bold text-white text-lg">{name || 'Wahyu Pratomo'}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {lang === 'id' 
                ? 'Saya merancang dan mengembangkan layanan untuk klien yang mengkhususkan diri dalam menciptakan website modern dan stylish.'
                : 'I design and develop services for customers specializing creating stylish, modern websites.'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {lang === 'id' ? 'Tautan Cepat' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li><Link href={`/${lang}#about`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dictionary?.nav?.about || (lang === 'id' ? 'Tentang' : 'About')}
              </Link></li>
              <li><Link href={`/${lang}#services`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dictionary?.nav?.services || (lang === 'id' ? 'Layanan' : 'Services')}
              </Link></li>
              <li><Link href={`/${lang}#projects`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dictionary?.nav?.projects || (lang === 'id' ? 'Portfolio' : 'Portfolio')}
              </Link></li>
              <li><Link href={`/${lang}#contact`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dictionary?.nav?.contact || (lang === 'id' ? 'Kontak' : 'Contact')}
              </Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {dictionary?.services?.title || (lang === 'id' ? 'Layanan' : 'Services')}
            </h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">
                {lang === 'id' ? 'Desain Web' : 'Web Design'}
              </span></li>
              <li><span className="text-gray-400 text-sm">
                {lang === 'id' ? 'Marketing Digital' : 'Digital Marketing'}
              </span></li>
              <li><span className="text-gray-400 text-sm">
                {lang === 'id' ? 'Spesialis Media Sosial' : 'Social Media Specialist'}
              </span></li>
              <li><span className="text-gray-400 text-sm">
                {lang === 'id' ? 'Spesialis SEO' : 'SEO Specialist'}
              </span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {dictionary?.contact?.title || (lang === 'id' ? 'Kontak' : 'Contact')}
            </h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">wahyupratomo187@gmail.com</span></li>
              <li><span className="text-gray-400 text-sm">+62 822-8651-4244</span></li>
              <li><span className="text-gray-400 text-sm">Tanjungpinang, Indonesia</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            &copy; {currentYear} {name}. {dictionary?.footer?.rights || (lang === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.')}
          </p>
          <div className="flex items-center justify-center sm:justify-end text-gray-400 text-sm">
            <span className="text-center sm:text-right">
              {dictionary?.footer?.madeWith || (lang === 'id' ? 'Dibuat dengan' : 'Made with')} Nextjs {dictionary?.footer?.by || (lang === 'id' ? 'oleh' : 'by')} 
              <span className="text-white font-medium">{name}</span>
            </span>
            <Link 
              href="/admin" 
              className="ml-2 inline-flex items-center text-gray-500 hover:text-purple-400 transition-colors duration-200 touch-target"
              title={lang === 'id' ? 'Login Admin' : 'Admin Login'}
            >
              <Settings size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
