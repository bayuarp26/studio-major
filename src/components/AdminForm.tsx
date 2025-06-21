'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { portfolioData } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LogOut, PlusCircle, Trash2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().min(5, 'Title is required'),
  about: z.string().min(10, 'About section is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  cv: z.any().optional(),
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required'),
    description: z.string().min(1, 'Description is required'),
  })),
  projects: z.array(z.object({
    topTitle: z.string().min(1, 'Top title is required'),
    handle: z.string().min(1, 'Handle is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    tags: z.string().min(1, 'Tags are required (comma-separated)'),
  })),
  certificates: z.array(z.object({
    name: z.string().min(1, 'Certificate name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
  }))
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
      skills: portfolioData.skills.map(skill => ({ name: skill.name, description: skill.description })),
      projects: portfolioData.projects.map(p => ({
        ...p,
        tags: p.tags.join(', '),
      })),
      certificates: portfolioData.certificates.map(c => ({ name: c.name, issuer: c.issuer, date: c.date })),
    },
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: certificateFields, append: appendCertificate, remove: removeCertificate } = useFieldArray({ control: form.control, name: "certificates" });

  const onSubmit = (data: FormValues) => {
    // In a real app, you would send this data to your backend API.
    // Here, we just log it to the console.
    console.log('Form data submitted:', {
      ...data,
      projects: data.projects.map(p => ({...p, tags: p.tags.split(',').map(t => t.trim())}))
    });
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
          <CardContent className="space-y-8">
            
            {/* General Info */}
            <div className="space-y-6 p-6 border rounded-lg bg-card/50">
              <h3 className="text-xl font-semibold text-foreground border-b pb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title / Tagline</FormLabel><FormControl><Input placeholder="Your Title" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="about" render={({ field }) => (<FormItem><FormLabel>About Me</FormLabel><FormControl><Textarea placeholder="Tell us about yourself" rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="cv" render={({ field }) => (<FormItem><FormLabel>Upload New CV (PDF)</FormLabel><FormControl><Input type="file" accept=".pdf" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            {/* Skills */}
            <div className="space-y-4 p-6 border rounded-lg bg-card/50">
              <h3 className="text-xl font-semibold text-foreground border-b pb-3">Keahlian</h3>
              {skillFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md relative space-y-4 bg-background">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  <FormField control={form.control} name={`skills.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Skill Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`skills.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ name: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
            </div>
            
            {/* Projects */}
            <div className="space-y-4 p-6 border rounded-lg bg-card/50">
              <h3 className="text-xl font-semibold text-foreground border-b pb-3">Proyek</h3>
              {projectFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md relative space-y-4 bg-background">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeProject(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name={`projects.${index}.topTitle`} render={({ field }) => (<FormItem><FormLabel>Brand</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`projects.${index}.handle`} render={({ field }) => (<FormItem><FormLabel>Handle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={form.control} name={`projects.${index}.title`} render={({ field }) => (<FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`projects.${index}.tags`} render={({ field }) => (<FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="Comma-separated, e.g. Branding, SEO" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendProject({ topTitle: '', handle: '', title: '', description: '', tags: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Project</Button>
            </div>

            {/* Certificates */}
            <div className="space-y-4 p-6 border rounded-lg bg-card/50">
              <h3 className="text-xl font-semibold text-foreground border-b pb-3">Sertifikat</h3>
              {certificateFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md relative space-y-4 bg-background">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeCertificate(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  <FormField control={form.control} name={`certificates.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Certificate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name={`certificates.${index}.issuer`} render={({ field }) => (<FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`certificates.${index}.date`} render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendCertificate({ name: '', issuer: '', date: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Certificate</Button>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end pt-8">
            <Button type="submit" size="lg">Save Changes</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
