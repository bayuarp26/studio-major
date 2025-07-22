// LinkedIn Integration Helper
export interface LinkedInPost {
  id: string;
  text: string;
  author: string;
  authorImage?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  images?: string[];
  linkedinUrl: string;
  category?: string;
  excerpt?: string;
}

// Mock data for development - replace with actual API calls
export const mockLinkedInPosts: LinkedInPost[] = [
  {
    id: '1',
    text: 'Excited to share my latest web development project! Built with Next.js and TypeScript. 🚀',
    author: 'Your Name',
    authorImage: 'https://placehold.co/40x40.png',
    createdAt: '2024-03-15T10:30:00Z',
    likes: 45,
    comments: 12,
    shares: 8,
    images: ['https://placehold.co/400x300.png'],
    linkedinUrl: 'https://linkedin.com/posts/your-profile-123',
    category: 'Development',
    excerpt: 'Latest insights on modern web development...'
  },
  {
    id: '2',
    text: 'Digital marketing trends for 2024 that every business should know about. Thread 🧵',
    author: 'Your Name',
    authorImage: 'https://placehold.co/40x40.png',
    createdAt: '2024-03-12T14:20:00Z',
    likes: 67,
    comments: 23,
    shares: 15,
    images: ['https://placehold.co/400x300.png'],
    linkedinUrl: 'https://linkedin.com/posts/your-profile-456',
    category: 'Marketing',
    excerpt: 'Key strategies for digital marketing success...'
  }
];

// Function to fetch LinkedIn posts (placeholder for actual API integration)
export async function fetchLinkedInPosts(): Promise<LinkedInPost[]> {
  try {
    // First try to get posts from database
    const response = await fetch('/api/blog?limit=4');
    
    if (response.ok) {
      const blogPosts = await response.json();
      
      if (blogPosts.length > 0) {
        return blogPosts.map((post: any) => ({
          id: post.id,
          text: post.title,
          excerpt: post.excerpt,
          author: post.author,
          createdAt: post.createdAt,
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          linkedinUrl: post.linkedinUrl || '#',
          images: post.image ? [post.image] : undefined,
          category: post.category
        }));
      }
    }
    
    // Fallback to mock data if no posts in database
    return mockLinkedInPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return mock data as fallback
    return mockLinkedInPosts;
  }
}

// Function to format LinkedIn date
export function formatLinkedInDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Function to truncate LinkedIn text
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// LinkedIn API integration (when available)
export class LinkedInAPI {
  private accessToken: string;
  private baseUrl = 'https://api.linkedin.com/v2';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getUserPosts(personId: string): Promise<LinkedInPost[]> {
    try {
      // This would be the actual API call structure
      const response = await fetch(`${this.baseUrl}/people/${personId}/posts`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'LinkedIn-Version': '202304'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn posts');
      }

      const data = await response.json();
      return this.transformLinkedInData(data);
    } catch (error) {
      console.error('LinkedIn API Error:', error);
      // Fallback to mock data
      return mockLinkedInPosts;
    }
  }

  private transformLinkedInData(data: any): LinkedInPost[] {
    // Transform LinkedIn API response to our format
    return data.elements?.map((post: any) => ({
      id: post.id,
      text: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '',
      author: post.author?.name || 'Unknown',
      createdAt: new Date(post.created?.time).toISOString(),
      likes: post.socialDetail?.totalShareStatistics?.likeCount || 0,
      comments: post.socialDetail?.totalShareStatistics?.commentCount || 0,
      shares: post.socialDetail?.totalShareStatistics?.shareCount || 0,
      linkedinUrl: `https://linkedin.com/posts/${post.id}`,
      category: 'LinkedIn'
    })) || [];
  }
}
