import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog-db';

export async function GET(request: NextRequest) {
  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
