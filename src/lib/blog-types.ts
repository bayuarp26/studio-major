import { LinkedInPost } from '@/lib/linkedin-integration';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  category: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  likes: number;
  comments: number;
  shares: number;
  linkedinUrl?: string;
  tags: string[];
}

export interface CreateBlogPostInput {
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  category: string;
  author: string;
  published: boolean;
  linkedinUrl?: string;
  tags: string[];
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}

// Convert BlogPost to LinkedInPost format
export function blogPostToLinkedInPost(post: BlogPost): LinkedInPost {
  return {
    id: post.id,
    text: post.title,
    excerpt: post.excerpt,
    author: post.author,
    createdAt: post.createdAt.toISOString(),
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    linkedinUrl: post.linkedinUrl || '#',
    images: post.image ? [post.image] : undefined,
    category: post.category
  };
}
