import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes('linkedin.com')) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn URL' },
        { status: 400 }
      );
    }

    // Extract post data from LinkedIn URL
    const extractedData = await extractLinkedInPostData(url);

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error('Error extracting LinkedIn data:', error);
    return NextResponse.json(
      { error: 'Failed to extract LinkedIn data' },
      { status: 500 }
    );
  }
}

async function extractLinkedInPostData(url: string) {
  try {
    // Method 1: Try LinkedIn oEmbed API
    const oembedData = await tryLinkedInOEmbed(url);
    if (oembedData) {
      return oembedData;
    }

    // Method 2: Fallback to manual embed creation
    const postId = extractPostIdFromUrl(url);
    const embedHtml = createLinkedInEmbedHtml(url);
    
    // Extract some basic info from URL if possible
    const title = extractTitleFromUrl(url) || 'LinkedIn Post';
    
    return {
      title: title,
      excerpt: 'Professional content shared on LinkedIn',
      content: embedHtml,
      image: null,
      embedUrl: url,
      postId: postId,
      platform: 'linkedin',
      author: 'LinkedIn User',
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing LinkedIn URL:', error);
    throw error;
  }
}

async function tryLinkedInOEmbed(url: string) {
  try {
    // LinkedIn oEmbed endpoint
    const oembedUrl = `https://www.linkedin.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    
    const response = await fetch(oembedUrl);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    return {
      title: data.title || 'LinkedIn Post',
      excerpt: data.title || 'Professional content from LinkedIn',
      content: data.html || createLinkedInEmbedHtml(url),
      image: null,
      embedUrl: url,
      platform: 'linkedin',
      author: data.author_name || 'LinkedIn User',
      createdAt: new Date().toISOString(),
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.log('LinkedIn oEmbed failed, using fallback');
    return null;
  }
}

function extractTitleFromUrl(url: string): string | null {
  // Try to extract meaningful title from URL
  const urlParts = url.split('/');
  const postPart = urlParts.find(part => part.includes('-'));
  
  if (postPart) {
    // Convert kebab-case to title case
    return postPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .substring(0, 100); // Limit length
  }
  
  return null;
}

function extractPostIdFromUrl(url: string): string {
  // Extract post ID from different LinkedIn URL formats
  const patterns = [
    /\/posts\/.*?-(\d+)-/,  // Regular post
    /\/feed\/update\/urn:li:activity:(\d+)/,  // Activity update
    /\/posts\/(.+)/  // General posts
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return url.split('/').pop() || 'unknown';
}

function createLinkedInEmbedHtml(url: string): string {
  // Create responsive LinkedIn embed
  const embedCode = `
    <div class="linkedin-embed-container" style="position: relative; width: 100%; max-width: 504px; margin: 20px auto;">
      <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe 
          src="https://www.linkedin.com/embed/feed/update/${url}" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
          allowfullscreen 
          title="LinkedIn Post Embed"
          loading="lazy">
        </iframe>
      </div>
      <div style="margin-top: 16px; text-align: center;">
        <a href="${url}" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color: #0066cc; text-decoration: none; font-size: 14px; font-weight: 500;">
          📱 View original post on LinkedIn →
        </a>
      </div>
    </div>
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SocialMediaPosting",
      "url": "${url}",
      "author": {
        "@type": "Person",
        "name": "Wahyu Pratomo"
      },
      "publisher": {
        "@type": "Organization",
        "name": "LinkedIn"
      }
    }
    </script>
  `;

  return embedCode.trim();
}
