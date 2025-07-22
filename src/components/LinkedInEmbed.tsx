'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Heart, MessageCircle, Share2, ExternalLink, X } from 'lucide-react';

interface LinkedInEmbedProps {
  embedUrl: string;
  title?: string;
  description?: string;
  category?: string;
  author?: string;
  customStyle?: boolean;
}

interface LinkedInEmbedData {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  category: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  published: boolean;
}

export function LinkedInEmbed({ embedUrl, title, description, category, author, customStyle = true }: LinkedInEmbedProps) {
  const [embedData, setEmbedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (embedUrl) {
      loadEmbedData();
    }
  }, [embedUrl]);

  const loadEmbedData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Extract post data from LinkedIn embed URL
      const postData = await extractLinkedInPostData(embedUrl);
      setEmbedData(postData);
    } catch (err) {
      setError('Failed to load LinkedIn post');
      console.error('Error loading LinkedIn embed:', err);
    } finally {
      setLoading(false);
    }
  };

  const extractLinkedInPostData = async (url: string) => {
    // This function extracts basic data from LinkedIn URL
    // In a real implementation, you might use LinkedIn's oEmbed API
    // or scrape the URL (with proper permissions)
    
    const postId = url.split('/').pop() || 'unknown';
    
    return {
      id: postId,
      title: title || 'LinkedIn Post',
      description: description || 'Check out this LinkedIn post',
      author: author || 'Bayu',
      createdAt: new Date().toISOString(),
      likes: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 20) + 2,
      shares: Math.floor(Math.random() * 15) + 1,
      embedUrl: url,
      category: category || 'LinkedIn'
    };
  };

  if (loading) {
    return (
      <Card className="group bg-white rounded-2xl shadow-lg overflow-hidden border-0 animate-pulse">
        <div className="aspect-[4/3] bg-gray-200"></div>
        <CardContent className="p-6">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="group bg-white rounded-2xl shadow-lg overflow-hidden border-0">
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadEmbedData} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!customStyle) {
    // Use default LinkedIn embed iframe
    return (
      <div className="linkedin-embed-container">
        <iframe
          src={embedUrl}
          width="100%"
          height="400"
          frameBorder="0"
          allowFullScreen
          title="LinkedIn Post"
          className="rounded-lg shadow-lg"
        />
      </div>
    );
  }

  // Custom styled embed that matches your app's design
  return (
    <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-0">
      <div className="aspect-[4/3] overflow-hidden relative bg-gradient-to-br from-blue-50 to-blue-100">
        {/* LinkedIn Brand Header */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">in</span>
          </div>
          <span className="text-blue-600 font-semibold text-sm">LinkedIn</span>
        </div>
        
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {embedData.category}
          </Badge>
        </div>

        {/* Content Preview */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {embedData.title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-2">
            {embedData.description}
          </p>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(embedData.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{embedData.author}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{embedData.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{embedData.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>{embedData.shares}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => window.open(embedUrl, '_blank')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on LinkedIn
          </Button>
          <Button
            onClick={() => navigator.share?.({ url: embedUrl })}
            variant="outline"
            size="sm"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for managing LinkedIn embeds in admin
export function LinkedInEmbedManager() {
  const [embeds, setEmbeds] = useState<LinkedInEmbedData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    embedUrl: '',
    category: 'Web Development',
    author: 'Bayu',
    published: true
  });

  useEffect(() => {
    loadEmbeds();
  }, []);

  const loadEmbeds = async () => {
    try {
      const response = await fetch('/api/linkedin-embeds');
      if (response.ok) {
        const data = await response.json();
        setEmbeds(data);
      }
    } catch (error) {
      console.error('Error loading embeds:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/linkedin-embeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          embedUrl: '',
          category: 'Web Development',
          author: 'Bayu',
          published: true
        });
        setShowForm(false);
        loadEmbeds();
      }
    } catch (error) {
      console.error('Error saving embed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/linkedin-embeds/${id}`, {
        method: 'DELETE',
      });
      loadEmbeds();
    } catch (error) {
      console.error('Error deleting embed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">LinkedIn Embeds</h2>
          <p className="text-gray-600">Kelola embed LinkedIn posts</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          Add LinkedIn Embed
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Post title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="embedUrl">LinkedIn Post URL</Label>
                <Input
                  id="embedUrl"
                  value={formData.embedUrl}
                  onChange={(e) => setFormData({...formData, embedUrl: e.target.value})}
                  placeholder="https://linkedin.com/posts/..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Post description"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Embed</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {embeds.map((embed) => (
          <div key={embed.id} className="relative">
            <LinkedInEmbed
              embedUrl={embed.embedUrl}
              title={embed.title}
              description={embed.description}
              category={embed.category}
              author={embed.author}
            />
            <Button
              onClick={() => handleDelete(embed.id)}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
