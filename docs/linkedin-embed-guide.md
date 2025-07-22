# LinkedIn Embed Guide

## How to Add LinkedIn Posts to Your Blog Section

### Step 1: Get LinkedIn Post Embed URL

1. Go to your LinkedIn post
2. Click on the "..." menu on the post
3. Select "Embed this post"
4. Copy the embed URL (looks like: `https://www.linkedin.com/embed/feed/update/urn:li:share:POST_ID`)

### Step 2: Add to Blog Component

Open `/src/components/sections/Blog.tsx` and add your LinkedIn posts to the `linkedInPosts` array:

```typescript
const linkedInPosts: LinkedInPost[] = [
  {
    id: "1",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:YOUR_POST_ID",
    title: "Your Post Title (Optional)",
    description: "Brief description of your post (Optional)"
  },
  {
    id: "2", 
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:ANOTHER_POST_ID",
    title: "Another Post Title",
    description: "Another post description"
  },
  // Add more posts as needed...
];
```

### Step 3: Update LinkedIn Profile Link

Don't forget to update your LinkedIn profile link in the button:

```typescript
<Link href="https://linkedin.com/in/your-actual-profile" target="_blank" rel="noopener noreferrer">
```

### Example LinkedIn Post Structure

```typescript
{
  id: "unique-id",
  embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7150123456789",
  title: "My Latest Project Update", // Optional
  description: "Sharing insights about my recent work" // Optional
}
```

### Notes

- The `title` and `description` fields are optional
- LinkedIn embeds will automatically show the post content
- The component will show an empty state with instructions when no posts are added
- Posts will be displayed in a responsive grid (1 column on mobile, 2 on tablet, 3 on desktop)
