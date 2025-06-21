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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { LogOut, PlusCircle, Trash2, Edit } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().min(5, 'Title is required'),
  about: z.string().min(10, 'About section is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  skills: z.array(z.object({
    icon: z.string().min(1, 'Icon name is required'),
    name: z.string().min(1, 'Skill name is required'),
    description: z.string().min(1, 'Description is required'),
  })),
  projects: z.array(z.object({
    topTitle: z.string().min(1, 'Brand is required'),
    handle: z.string().min(1, 'Handle is required'),
    title: z.string().min(1, 'Project title is required'),
    description: z.string().min(1, 'Description is required'),
    tags: z.string().min(1, 'Tags are required (comma-separated)'),
    logoUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
    imageHint: z.string().optional(),
  })),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    school: z.string().min(1, 'School is required'),
    period: z.string().min(1, 'Period is required'),
  })),
  certificates: z.array(z.object({
    name: z.string().min(1, 'Certificate name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
    url: z.string().url("Invalid URL").optional().or(z.literal('')),
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
      skills: portfolioData.skills,
      projects: portfolioData.projects.map(p => ({ ...p, tags: p.tags.join(', ') })),
      education: portfolioData.education,
      certificates: portfolioData.certificates,
    },
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control: form.control, name: "education" });
  const { fields: certificateFields, append: appendCertificate, remove: removeCertificate } = useFieldArray({ control: form.control, name: "certificates" });

  const onSubmit = (data: FormValues) => {
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

  const sections = [
    { id: 'info', title: 'Personal Info', description: 'Name, title, about, contact info.' },
    { id: 'skills', title: 'Keahlian', description: 'Your professional skills.' },
    { id: 'projects', title: 'Proyek', description: 'Your portfolio projects.' },
    { id: 'education', title: 'Pendidikan', description: 'Your academic background.' },
    { id: 'certificates', title: 'Sertifikat', description: 'Certificates and trainings.' },
  ];

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="font-headline text-3xl text-primary">Admin Dashboard</CardTitle>
          <CardDescription>Update your portfolio content section by section.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
      </CardHeader>
      
      <Form {...form}>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(section => (
            <Dialog key={section.id}>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4" /> Edit Section</Button>
                  </DialogTrigger>
                </CardFooter>
              </Card>

              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Edit {section.title}</DialogTitle></DialogHeader>
                <div className="py-4 space-y-6">
                  {section.id === 'info' && (<>
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="about" render={({ field }) => (<FormItem><FormLabel>About</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </>)}

                  {section.id === 'skills' && (<>
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        <FormField control={form.control} name={`skills.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Skill Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`skills.${index}.icon`} render={({ field }) => (<FormItem><FormLabel>Icon Name</FormLabel><FormControl><Input placeholder="e.g., Target, Briefcase" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`skills.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ name: '', icon: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                  </>)}

                  {section.id === 'projects' && (<>
                    {projectFields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeProject(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        <FormField control={form.control} name={`projects.${index}.topTitle`} render={({ field }) => (<FormItem><FormLabel>Brand</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`projects.${index}.handle`} render={({ field }) => (<FormItem><FormLabel>Handle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`projects.${index}.title`} render={({ field }) => (<FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`projects.${index}.tags`} render={({ field }) => (<FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendProject({ topTitle: '', handle: '', title: '', description: '', tags: '', logoUrl: '', imageHint: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Project</Button>
                  </>)}

                  {section.id === 'education' && (<>
                    {educationFields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEducation(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>Degree/Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`education.${index}.school`} render={({ field }) => (<FormItem><FormLabel>School/Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`education.${index}.period`} render={({ field }) => (<FormItem><FormLabel>Period</FormLabel><FormControl><Input placeholder="e.g., 2020 - 2025" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendEducation({ degree: '', school: '', period: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
                  </>)}

                  {section.id === 'certificates' && (<>
                    {certificateFields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeCertificate(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        <FormField control={form.control} name={`certificates.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Certificate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`certificates.${index}.issuer`} render={({ field }) => (<FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`certificates.${index}.date`} render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={form.control} name={`certificates.${index}.url`} render={({ field }) => (<FormItem><FormLabel>URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendCertificate({ name: '', issuer: '', date: '', url: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Certificate</Button>
                  </>)}
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                  <Button type="button" onClick={form.handleSubmit(onSubmit)}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </CardContent>
      </Form>
    </Card>
  );
}
