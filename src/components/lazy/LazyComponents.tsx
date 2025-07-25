import dynamic from 'next/dynamic';

// Lazy load heavy components with loading states
export const LazyEducation = dynamic(() => import('../sections/Education'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
  ssr: true,
});

export const LazySkills = dynamic(() => import('../sections/Skills'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
  ssr: true,
});

export const LazyCertificates = dynamic(() => import('../sections/Certificates'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
  ssr: true,
});

export const LazyWorkProcess = dynamic(() => import('../sections/WorkProcess'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
  ssr: true,
});

export const LazyBlog = dynamic(() => import('../sections/Blog'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
  ssr: true,
});

export const LazyCTA = dynamic(() => import('../sections/CTA'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
  ssr: true,
});

// Admin components
export const LazyAdminForm = dynamic(() => import('../AdminForm'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
  ssr: false,
});

export const LazyBlogManager = dynamic(() => import('../admin/BlogManager'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
  ssr: false,
});
