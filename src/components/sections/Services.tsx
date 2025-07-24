import { Card, CardContent } from '@/components/ui/card';
import { Search, Share2, BarChart3, Target } from 'lucide-react';

interface ServicesProps {
  dictionary: any;
}

export default function Services({ dictionary }: ServicesProps) {
  // Fallback services data focused on Social Media & SEO
  const defaultServices = [
    {
      icon: Share2,
      title: 'Social Media Management',
      description: 'Creating engaging content, managing social media accounts, and building strong online communities across all platforms.',
      color: 'bg-blue-600'
    },
    {
      icon: Target,
      title: 'Social Media Advertising',
      description: 'Developing targeted ad campaigns on Facebook, Instagram, TikTok, and LinkedIn to maximize ROI and reach.',
      color: 'bg-purple-600'
    },
    {
      icon: Search,
      title: 'SEO Optimization',
      description: 'Improving website visibility and ranking in search engines through proven SEO strategies and keyword optimization.',
      color: 'bg-green-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive analysis of social media performance and SEO metrics to optimize strategy and drive results.',
      color: 'bg-orange-600'
    }
  ];

  const services = dictionary?.services?.items || defaultServices;

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            {dictionary?.services?.title || 'What I do?'}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            {dictionary?.services?.description || 'Saya menyediakan layanan profesional yang komprehensif untuk membantu bisnis Anda berkembang. Dari pengembangan web modern hingga strategi digital yang efektif, saya berkomitmen memberikan solusi berkualitas tinggi.'}
          </p>
        </div>

        {/* Services Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service: any, index: number) => {
            const IconComponent = service.icon || defaultServices[index % defaultServices.length].icon;
            
            return (
              <div key={index} className="group hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transform">
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    {/* Icon */}
                    <div 
                      className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 ${service.color || defaultServices[index % defaultServices.length].color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 flex-shrink-0 group-hover:rotate-6`}
                    >
                      <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-purple-600 transition-colors duration-500">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
