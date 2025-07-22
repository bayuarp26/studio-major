import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface LinkedInPost {
  id: string;
  embedUrl: string;
  title?: string;
  description?: string;
}

interface BlogProps {
  dictionary: any;
}

export default function Blog({ dictionary }: BlogProps) {
  // LinkedIn embed posts - add your LinkedIn post embed URLs here
  const linkedInPosts: LinkedInPost[] = [
    {
      id: "1",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7350376062809239552",
      title: "AEO Bukan Cuma SEO, Ini era Jawaban Instan",
      description: "Halo teman-teman! 👋 Sadar nggak sih, sekarang ini semua orang pengen jawaban instan? Nah, di dunia digital yang makin canggih, kuncinya ada di Answer Engine Optimization (AEO). Ini bukan cuma soal SEO biasa, tapi gimana caranya konten kita bisa langsung menjawab pertanyaan orang di Google. Penting banget lho buat strategi digital marketing kita di 2025 ke depan, biar bisnis kita makin kelihatan, dapet traffic yang niat banget, dan jadi sumber info yang bisa dipercaya! Yuk, ngobrol santai soal AEO!"
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Blog
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
          </p>
        </div>

        {/* LinkedIn Posts Section */}
        {linkedInPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }, (_, index) => {
              const post = linkedInPosts[0]; // Use first post as template
              return (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="font-semibold text-gray-800 text-sm mb-2">
                          {index === 0 ? post.title : `Blog Post ${index + 1}`}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {index === 0 ? "Latest article" : "Coming soon"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {index === 0 ? post.title : `Article Title ${index + 1}`}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {index === 0 ? 
                        "Insight about modern digital marketing strategies..." : 
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                      }
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State - When no LinkedIn posts are added yet */
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                LinkedIn Posts Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                This section is prepared for LinkedIn embedded posts. Add your LinkedIn post embed URLs to display them here.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>To add LinkedIn posts:</strong>
                </p>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Get embed URL from LinkedIn post</li>
                  <li>2. Add to linkedInPosts array</li>
                  <li>3. Posts will appear automatically</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
