// Simple LinkedIn Posts Mock Data
export const linkedinPosts = [
  {
    id: '1',
    title: 'Excited to share my latest web development project!',
    excerpt: 'Just completed a modern portfolio website with Next.js and TypeScript.',
    date: '2024-03-15',
    author: 'Bayu',
    image: 'https://placehold.co/400x300/2563eb/ffffff?text=Web+Development',
    category: 'Web Development',
    linkedinUrl: 'https://linkedin.com/posts/your-profile-123',
    likes: 45,
    comments: 12,
    shares: 8
  },
  {
    id: '2',
    title: 'Digital marketing trends for 2024',
    excerpt: 'AI-powered personalization is changing the game in digital marketing.',
    date: '2024-03-12',
    author: 'Bayu',
    image: 'https://placehold.co/400x300/f97316/ffffff?text=Digital+Marketing',
    category: 'Digital Marketing',
    linkedinUrl: 'https://linkedin.com/posts/your-profile-456',
    likes: 78,
    comments: 23,
    shares: 15
  },
  {
    id: '3',
    title: 'The importance of responsive design',
    excerpt: 'Creating seamless user experiences across all devices.',
    date: '2024-03-10',
    author: 'Bayu',
    image: 'https://placehold.co/400x300/059669/ffffff?text=Responsive+Design',
    category: 'UI/UX Design',
    linkedinUrl: 'https://linkedin.com/posts/your-profile-789',
    likes: 32,
    comments: 7,
    shares: 5
  },
  {
    id: '4',
    title: 'Website performance optimization tips',
    excerpt: 'Improving Core Web Vitals for better user experience.',
    date: '2024-03-08',
    author: 'Bayu',
    image: 'https://placehold.co/400x300/dc2626/ffffff?text=Performance',
    category: 'Technology',
    linkedinUrl: 'https://linkedin.com/posts/your-profile-101',
    likes: 56,
    comments: 18,
    shares: 11
  }
];

// Simple function to get posts
export function getLinkedInPosts() {
  return linkedinPosts;
}
