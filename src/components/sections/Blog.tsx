'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  linkedinUrl?: string;
  category: string;
  author: string;
  createdAt: string;
  published: boolean;
}

interface BlogProps {
  dictionary: any;
}

export default function Blog({ dictionary }: BlogProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blog posts from API
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const posts = await response.json();
        setBlogPosts(posts.filter((post: BlogPost) => post.published));
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default posts if no data from API
  const defaultPosts: BlogPost[] = [
    {
      id: "1",
      title: "AEO Bukan Cuma SEO, Ini era Jawaban Instan",
      excerpt: "Sadar nggak sih, sekarang ini semua orang pengen jawaban instan? Nah, di dunia digital yang makin canggih, kuncinya ada di Answer Engine Optimization (AEO).",
      content: "",
      linkedinUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7350376062809239552",
      category: "Digital Marketing",
      author: "Wahyu Pratomo",
      createdAt: new Date().toISOString(),
      published: true
    },
    {
      id: "2", 
      title: "SEO Tips untuk Website Modern",
      excerpt: "Tips dan trik terbaru untuk optimasi SEO di era modern dengan fokus pada user experience dan Core Web Vitals.",
      content: "",
      linkedinUrl: "",
      category: "SEO",
      author: "Wahyu Pratomo", 
      createdAt: new Date().toISOString(),
      published: true
    },
    {
      id: "3",
      title: "Social Media Marketing Strategy 2025",
      excerpt: "Strategi marketing media sosial yang efektif untuk meningkatkan engagement dan konversi di tahun 2025.",
      content: "",
      linkedinUrl: "",
      category: "Social Media",
      author: "Wahyu Pratomo",
      createdAt: new Date().toISOString(),
      published: true
    }
  ];

  const postsToShow = blogPosts.length > 0 ? blogPosts : defaultPosts;
  
  // Determine layout based on number of posts
  const getFlexLayout = (postCount: number) => {
    if (postCount === 1) {
      return "justify-center"; // Single post centered
    } else if (postCount === 2) {
      return "justify-center lg:justify-center"; // Two posts centered
    } else if (postCount === 3) {
      return "justify-center"; // Three posts, center alignment
    } else {
      return "justify-center"; // Multiple posts, responsive center
    }
  };

  return (
    <section id="blog" className="py-24 sm:py-32 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            {dictionary?.blog?.title || 'Blog & Insights'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {dictionary?.blog?.description || 'Sharing knowledge about digital marketing, SEO, and web development trends.'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Responsive container with adaptive layout */}
            <div className={`
              flex flex-wrap gap-6 lg:gap-8 
              ${getFlexLayout(postsToShow.length)}
              ${postsToShow.length === 1 ? 'max-w-md mx-auto' : ''}
              ${postsToShow.length === 2 ? 'max-w-4xl mx-auto' : ''}
            `}>
              {postsToShow.slice(0, 6).map((post) => (
                <Card key={post.id} className="w-full sm:w-80 lg:w-96 bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group flex-shrink-0">
                <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                  {post.linkedinUrl ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm text-gray-600">LinkedIn Post</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {post.linkedinUrl ? (
                      <Button 
                        asChild 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <a href={post.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on LinkedIn
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        asChild 
                        variant="outline" 
                        className="flex-1"
                        size="sm"
                      >
                        <Link href={`/blog/${post.id}`}>
                          Read More
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
