import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Palette, Globe } from "lucide-react";
import Link from "next/link";

interface ServicesProps {
  dictionary: any;
}

export default function Services({ dictionary }: ServicesProps) {
  const services = [
    {
      icon: Globe,
      title: "User Experience (UX)",
      description: "Creating intuitive and user-friendly interfaces that enhance user satisfaction and drive engagement.",
      color: "bg-purple-600"
    },
    {
      icon: Palette,
      title: "User Interface (UI)", 
      description: "Designing beautiful, modern, and responsive interfaces that captivate users and reflect your brand.",
      color: "bg-purple-400"
    },
    {
      icon: Code,
      title: "Web Development",
      description: "Building fast, secure, and scalable web applications using modern technologies and best practices.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Content */}
          <div>
            <h2 className="font-headline text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              What I do?
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla purus arcu, varius eget velit non, laoreet imperdiet orci. Mauris ultrices eget lorem ac vestibulum. Suspendis imperdiet,
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla purus arcu, varius eget velit non.
            </p>
            <Button 
              asChild 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-3"
            >
              <Link href="#contact">
                Hire Me
              </Link>
            </Button>
          </div>

          {/* Right Side - Services with Cards */}
          <div className="space-y-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {service.description}
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
