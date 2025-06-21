'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { portfolioData } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { LogOut, PlusCircle, Trash2, Edit } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { FileUpload } from './FileUpload';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().min(5, 'Title is required'),
  about: z.string().min(10, 'About section is required'),
  profilePictureUrl: z.string().optional(),
  cvUrl: z.string().min(1, 'CV URL/File Path is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  skills: z.array(z.object({
    icon: z.string().min(1, 'Icon name is required'),
    name: z.string().min(1, 'Skill name is required'),
    description: z.string().min(1, 'Description is required'),
  })),
  projects: z.array(z.object({
    title: z.string().min(1, 'Project title is required'),
    imageUrl: z.string().optional(),
    imageHint: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    details: z.string().min(1, 'Details are required'),
    tags: z.string().min(1, 'Tags are required (comma-separated)'),
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

// Temporary state for the project dialog form
const projectDialogSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  details: z.string().min(1, 'Details are required'),
  tags: z.string().min(1, 'Tags are required (comma-separated)'),
});
type ProjectDialogValues = z.infer<typeof projectDialogSchema>;

export default function AdminForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: portfolioData.name,
      title: portfolioData.title,
      about: portfolioData.about,
      profilePictureUrl: portfolioData.profilePictureUrl,
      cvUrl: portfolioData.cvUrl,
      email: portfolioData.contact.email.replace('mailto:', ''),
      linkedin: portfolioData.contact.linkedin,
      skills: portfolioData.skills,
      projects: portfolioData.projects.map(p => ({ ...p, tags: p.tags.join(', ') })),
      education: portfolioData.education,
      certificates: portfolioData.certificates,
    },
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });
  const { fields: projectFields, append: appendProject, remove: removeProject, update: updateProject } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control: form.control, name: "education" });
  const { fields: certificateFields, append: appendCertificate, remove: removeCertificate } = useFieldArray({ control: form.control, name: "certificates" });

  const projectDialogForm = useForm<ProjectDialogValues>({
    resolver: zodResolver(projectDialogSchema),
  });

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

  const openAddProjectDialog = () => {
    setEditingProjectIndex(null);
    projectDialogForm.reset({ title: '', imageUrl: '', imageHint: '', description: '', details: '', tags: '' });
    setProjectDialogOpen(true);
  };

  const openEditProjectDialog = (index: number) => {
    setEditingProjectIndex(index);
    const project = form.getValues().projects[index];
    projectDialogForm.reset(project);
    setProjectDialogOpen(true);
  };

  const handleProjectDialogSubmit = (data: ProjectDialogValues) => {
    if (editingProjectIndex !== null) {
      updateProject(editingProjectIndex, data);
    } else {
      appendProject(data);
    }
    setProjectDialogOpen(false);
    toast({
        title: editingProjectIndex !== null ? 'Project Updated' : 'Project Added',
        description: 'Click "Save All Changes" to finalize.',
    });
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Pengaturan Admin</h1>
          <p className="text-muted-foreground">Kelola konten portofolio Anda di sini.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Kelola Proyek</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan Umum</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Daftar Proyek</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus proyek portofolio Anda.</CardDescription>
                  </div>
                  <Button type="button" onClick={openAddProjectDialog}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Proyek</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Judul Proyek</TableHead>
                        <TableHead className="w-[150px] text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectFields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{form.watch(`projects.${index}.title`)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => openEditProjectDialog(index)}><Edit className="h-3 w-3" /></Button>
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeProject(index)}><Trash2 className="h-3 w-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6 space-y-6">
              <Card>
                <CardHeader><CardTitle>Informasi Pribadi</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                   <FormField
                    control={form.control}
                    name="profilePictureUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Foto Profil</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value || ''}
                            onChange={field.onChange}
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="about" render={({ field }) => (<FormItem><FormLabel>About</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField
                    control={form.control}
                    name="cvUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CV</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value || ''}
                            onChange={field.onChange}
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Keahlian</CardTitle></CardHeader>
                <CardContent>
                   <div className="space-y-4">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-4 p-2 border rounded-md">
                        <span className="flex-grow">{form.watch(`skills.${index}.name`)}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)} className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    ))}
                     <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ name: 'New Skill', icon: 'Star', description: 'Skill description' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                     <p className="text-sm text-muted-foreground">Note: Skill icon and description can be edited in the project source file for now.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Pendidikan</CardTitle></CardHeader>
                <CardContent>
                  {educationFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md relative space-y-4 mb-4">
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeEducation(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>Degree/Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`education.${index}.school`} render={({ field }) => (<FormItem><FormLabel>School/Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`education.${index}.period`} render={({ field }) => (<FormItem><FormLabel>Period</FormLabel><FormControl><Input placeholder="e.g., 2020 - 2025" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendEducation({ degree: '', school: '', period: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle>Sertifikat</CardTitle></CardHeader>
                <CardContent>
                  {certificateFields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md relative space-y-4 mb-4">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeCertificate(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        <FormField control={form.control} name={`certificates.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Certificate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`certificates.${index}.issuer`} render={({ field }) => (<FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`certificates.${index}.date`} render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={form.control} name={`certificates.${index}.url`} render={({ field }) => (<FormItem><FormLabel>URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendCertificate({ name: '', issuer: '', date: '', url: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Certificate</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button size="lg" type="submit">Save All Changes</Button>
          </div>
        </form>
      </Form>

      <Dialog open={isProjectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProjectIndex !== null ? 'Edit Proyek' : 'Tambah Proyek Baru'}</DialogTitle>
          </DialogHeader>
          <Form {...projectDialogForm}>
            <form onSubmit={projectDialogForm.handleSubmit(handleProjectDialogSubmit)} className="space-y-4 py-4">
                <FormField control={projectDialogForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                  control={projectDialogForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || ''}
                          onChange={field.onChange}
                          disabled={projectDialogForm.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={projectDialogForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input placeholder="e.g. 'project abstract'" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="details" render={({ field }) => (<FormItem><FormLabel>Details</FormLabel><FormControl><Textarea placeholder="Use new lines for list items" rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={projectDialogForm.formState.isSubmitting}>
                  {projectDialogForm.formState.isSubmitting ? 'Saving...' : 'Save Project'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
