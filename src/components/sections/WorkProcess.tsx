'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp, Edit, Monitor } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface WorkProcessProps {
  dictionary: any;
}

export default function WorkProcess({ dictionary }: WorkProcessProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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

  const processSteps = [
    {
      step: '1',
      title: 'Research',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla purus arcu.',
      icon: Calendar,
      color: 'bg-purple-600'
    },
    {
      step: '2',
      title: 'Analyze', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla purus arcu.',
      icon: TrendingUp,
      color: 'bg-purple-400'
    },
    {
      step: '3',
      title: 'Design',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla purus arcu.',
      icon: Edit,
      color: 'bg-purple-400'
    },
    {
      step: '4',
      title: 'Launch',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla purus arcu.',
      icon: Monitor,
      color: 'bg-purple-400'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-gray-100">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="font-headline text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              Work Process
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla purus arcu, varius eget velit non, laoreet imperdiet orci. Mauris ultrices eget lorem ac vestibulum. Suspendis imperdiet,
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla purus arcu, varius eget velit non.
            </p>
          </div>

          {/* Right Side - Process Steps in 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ perspective: '1000px' }}>
            {processSteps.map((process, index) => {
              const IconComponent = process.icon;
              return (
                <Card 
                  key={index} 
                  className={`bg-white shadow-md hover:shadow-lg transition-all duration-700 border-0 group cursor-pointer ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transitionDelay: `${index * 0.2}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(3deg) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)';
                  }}
                >
                  <CardContent className="p-8 h-full">
                    <div className="flex flex-col items-center text-center gap-4 h-full">
                      <div 
                        className={`w-16 h-16 ${process.color} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-500`}
                        style={{
                          transform: 'translateZ(10px)',
                          transition: 'all 0.5s ease-out'
                        }}
                      >
                        <IconComponent className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                          {process.step}. {process.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {process.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
