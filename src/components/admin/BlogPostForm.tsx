'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { BlogPost, CreateBlogPostInput } from '@/lib/blog-types';

interface BlogPostFormProps {
  post?: BlogPost | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export function BlogPostForm({ post, onSubmit, onCancel }: BlogPostFormProps) {
  const [formData, setFormData] = useState<CreateBlogPostInput>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'Web Development',
    author: 'Bayu',
    published: true,
    linkedinUrl: '',
    tags: [],
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkedinPreview, setLinkedinPreview] = useState<any>(null);
  const [extractingLinkedin, setExtractingLinkedin] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        image: post.image || '',
        category: post.category,
        author: post.author,
        published: post.published,
        linkedinUrl: post.linkedinUrl || '',
        tags: post.tags,
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = post ? `/api/blog/${post.id}` : '/api/blog';
      const method = post ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateBlogPostInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const categories = [
    'Web Development',
    'Digital Marketing',
    'UI/UX Design',
    'Technology',
    'Business',
    'Tutorial',
    'Tips & Tricks',
  ];

  // Function to extract LinkedIn post data
  const extractLinkedInData = async (url: string) => {
    if (!url) return;
    
    setExtractingLinkedin(true);
    try {
      const response = await fetch('/api/linkedin-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setLinkedinPreview(data);
        
        // Auto-populate form fields
        if (data.title && !formData.title) {
          setFormData(prev => ({ ...prev, title: data.title }));
        }
        if (data.excerpt && !formData.excerpt) {
          setFormData(prev => ({ ...prev, excerpt: data.excerpt }));
        }
        if (data.content && !formData.content) {
          setFormData(prev => ({ ...prev, content: data.content }));
        }
        if (data.image && !formData.image) {
          setFormData(prev => ({ ...prev, image: data.image }));
        }
      }
    } catch (error) {
      console.error('Error extracting LinkedIn data:', error);
    } finally {
      setExtractingLinkedin(false);
    }
  };

  // Auto-extract when LinkedIn URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.linkedinUrl && formData.linkedinUrl.includes('linkedin.com')) {
        extractLinkedInData(formData.linkedinUrl);
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData.linkedinUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? 'Edit Post' : 'Tambah Post Baru'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Masukkan judul post"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Masukkan ringkasan singkat post"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Konten</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Masukkan konten lengkap post"
              rows={8}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image">URL Gambar</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">URL LinkedIn Embed</Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                placeholder="Paste LinkedIn post URL here..."
                type="url"
              />
              {extractingLinkedin && (
                <p className="text-sm text-blue-600 mt-1">🔄 Extracting LinkedIn data...</p>
              )}
              
              {/* LinkedIn Preview */}
              {linkedinPreview && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-sm mb-2">📱 LinkedIn Preview:</h4>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Title:</strong> {linkedinPreview.title}</p>
                    <p className="text-sm"><strong>Excerpt:</strong> {linkedinPreview.excerpt}</p>
                    {linkedinPreview.image && (
                      <img src={linkedinPreview.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    )}
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => formData.linkedinUrl && extractLinkedInData(formData.linkedinUrl)}
                      className="mt-2"
                    >
                      🔄 Re-extract Data
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="author">Penulis</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Nama penulis"
              required
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tambah tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleInputChange('published', checked)}
            />
            <Label htmlFor="published">Publikasikan</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : post ? 'Update' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
