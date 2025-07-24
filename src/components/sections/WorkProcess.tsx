'use client';

import { Search, BarChart3, Palette, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';

interface WorkProcessProps {
  dictionary: any;
}

export default function WorkProcess({ dictionary }: WorkProcessProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderGrid = (steps: any[], title: string) => (
    <div className="mb-12 sm:mb-16 lg:mb-20">
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center px-4">
        {title}
      </h3>
      
      {/* Mobile: Stack Layout */}
      <div className="block sm:hidden space-y-6 px-4">
        {steps.map((process, index) => {
          const defaultIcons = [Search, BarChart3, Palette, Upload];
          const IconComponent = process.icon || defaultIcons[index % defaultIcons.length];
          
          return (
            <div 
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl p-6 group cursor-pointer hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${process.color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {process.step}. {process.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet: 2x2 Grid Layout */}
      <div className="hidden sm:block lg:hidden">
        <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto px-4">
          {steps.map((process, index) => {
            const defaultIcons = [Search, BarChart3, Palette, Upload];
            const IconComponent = process.icon || defaultIcons[index % defaultIcons.length];
            
            return (
              <div 
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 group cursor-pointer w-full h-64 relative rounded-2xl hover:scale-105 hover:z-10">
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-center mb-4">
                      <div className={`w-14 h-14 ${process.color} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}>
                        <IconComponent className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                        {process.step}. {process.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {process.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Sticky Notes Layout */}
      <div className="hidden lg:block relative max-w-4xl mx-auto h-[600px]">
        {steps.map((process, index) => {
          const defaultIcons = [Search, BarChart3, Palette, Upload];
          const IconComponent = process.icon || defaultIcons[index % defaultIcons.length];

          const positions = [
            { top: '0px', left: '0px', rotation: '-rotate-2' },
            { top: '20px', right: '0px', rotation: 'rotate-1' },
            { bottom: '20px', left: '20px', rotation: 'rotate-2' },
            { bottom: '0px', right: '20px', rotation: '-rotate-1' }
          ];

          const position = positions[index];

          return (
            <div
              key={index}
              className={`absolute transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                ...position,
                transitionDelay: `${index * 0.15}s`,
              }}
            >
              <div className={`bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 group cursor-pointer w-72 h-64 relative transform ${position.rotation} hover:scale-105 hover:z-10 rounded-2xl`}>
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 ${process.color} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}>
                      <IconComponent className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                      {process.step}. {process.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Work Process
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            {dictionary?.workProcess?.description || 'Proses kerja yang terstruktur dan sistematis untuk memastikan setiap proyek berjalan lancar dan menghasilkan output berkualitas tinggi sesuai dengan kebutuhan klien.'}
          </p>
        </div>

        {/* Fallback data when dictionary is not available */}
        {renderGrid(
          dictionary?.workProcess?.digitalMarketing || [
            { step: '1', title: 'Perencanaan dan Strategi', description: 'Menyusun rencana pemasaran digital, termasuk target audiens, tujuan, dan anggaran.', color: 'bg-purple-600' },
            { step: '2', title: 'Pembuatan Konten', description: 'Membuat konten yang menarik dan relevan untuk berbagai platform digital (website, blog, media sosial, dll.).', color: 'bg-purple-500' },
            { step: '3', title: 'Optimasi SEO', description: 'Meningkatkan peringkat website di hasil pencarian mesin pencari.', color: 'bg-purple-400' },
            { step: '4', title: 'Pemasaran Media Sosial', description: 'Mengelola akun media sosial, membuat konten, dan berinteraksi dengan audiens.', color: 'bg-purple-300' }
          ], 
          'Digital Marketing'
        )}
        {renderGrid(
          dictionary?.workProcess?.juniorProgramming || [
            { step: '1', title: 'Plan', description: 'Perencanaan arsitektur sistem dan teknologi yang akan digunakan dalam pengembangan.', color: 'bg-blue-600' },
            { step: '2', title: 'Code', description: 'Implementasi fitur dengan clean code dan best practices untuk maintainability.', color: 'bg-blue-500' },
            { step: '3', title: 'Test', description: 'Pengujian menyeluruh untuk memastikan aplikasi berfungsi optimal dan bebas bug.', color: 'bg-blue-400' },
            { step: '4', title: 'Deploy', description: 'Deployment ke production dengan monitoring dan documentation yang lengkap.', color: 'bg-blue-300' }
          ], 
          'Junior Programming'
        )}
      </div>
    </section>
  );
}
