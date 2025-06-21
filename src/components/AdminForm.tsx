'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { portfolioData } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().min(5, 'Title is required'),
  about: z.string().min(10, 'About section is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid URL'),
  cv: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: portfolioData.name,
      title: portfolioData.title,
      about: portfolioData.about,
      email: portfolioData.contact.email.replace('mailto:', ''),
      linkedin: portfolioData.contact.linkedin,
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, you would send this data to your backend API
    console.log('Form data submitted:', data);
    toast({
      title: 'Update Successful',
      description: 'Portfolio information has been updated (check console).',
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('is-authenticated');
    toast({ description: 'You have been logged out.' });
    router.push('/');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="font-headline text-3xl text-primary">Admin Dashboard</CardTitle>
          <CardDescription>Update your portfolio information here.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4"/>
          Logout
        </Button>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title / Tagline</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="cv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload New CV (PDF)</FormLabel>
                    <FormControl>
                      <Input type="file" accept=".pdf" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
             <p className="text-sm text-muted-foreground pt-4 border-t">
              Note: Updating skills, projects, and certificates requires code changes in a real-world scenario without a full backend. This form demonstrates UI for primary info.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
