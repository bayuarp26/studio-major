
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PortfolioData, Project, EducationItem, Certificate } from '@/lib/types';
import {
  saveGeneralInfo, saveSkills, saveTools,
  addProject, updateProject, deleteProject,
  addEducation, updateEducation, deleteEducation,
  addCertificate, updateCertificate, deleteCertificate
} from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { LogOut, PlusCircle, Trash2, Edit, Loader2, Sparkles, Wrench, GraduationCap, Award } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { FileUpload } from './FileUpload';

const projectSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Project title is required'),
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  details: z.string().min(1, 'Details is required'),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});

const educationSchema = z.object({
  _id: z.string().optional(),
  degree: z.string().min(1, 'Degree is required'),
  school: z.string().min(1, 'School is required'),
  period: z.string().min(1, 'Period is required'),
});

const certificateSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Certificate name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
});


const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().min(5, 'Title is required'),
  about: z.string().min(10, 'About section is required'),
  profilePictureUrl: z.string().optional(),
  cvUrl: z.string().min(1, 'CV URL/File Path is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  tools: z.array(z.string()).min(1, 'At least one tool is required'),
  projects: z.array(projectSchema),
  education: z.array(educationSchema),
  certificates: z.array(certificateSchema),
});

type FormValues = z.infer<typeof formSchema>;
type ProjectDialogValues = z.infer<typeof projectSchema>;
type EducationDialogValues = z.infer<typeof educationSchema>;
type CertificateDialogValues = z.infer<typeof certificateSchema>;

interface AdminFormProps {
  initialData: PortfolioData;
}

export default function AdminForm({ initialData }: AdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  
  const [isEducationDialogOpen, setEducationDialogOpen] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);

  const [isCertificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [editingCertificateIndex, setEditingCertificateIndex] = useState<number | null>(null);

  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      title: '',
      about: '',
      email: '',
      linkedin: '',
      skills: [],
      tools: [],
      projects: [],
      education: [],
      certificates: [],
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        email: initialData.contact.email.replace('mailto:', ''),
        linkedin: initialData.contact.linkedin || '',
        skills: initialData.skills || [],
        tools: initialData.tools || [],
        projects: initialData.projects || [],
        education: initialData.education || [],
        certificates: initialData.certificates || [],
      });
    }
  }, [initialData, form]);

  const { fields: projectFields, append: appendProject, remove: removeProject, update: updateProjectField } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: educationFields, append: appendEducation, remove: removeEducation, update: updateEducationField } = useFieldArray({ control: form.control, name: "education" });
  const { fields: certificateFields, append: appendCertificate, remove: removeCertificate, update: updateCertificateField } = useFieldArray({ control: form.control, name: "certificates" });

  const projectDialogForm = useForm<ProjectDialogValues>({ resolver: zodResolver(projectSchema) });
  const educationDialogForm = useForm<EducationDialogValues>({ resolver: zodResolver(educationSchema) });
  const certificateDialogForm = useForm<CertificateDialogValues>({ resolver: zodResolver(certificateSchema) });


  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    await logout();
    router.push('/');
    router.refresh();
  };

  const onGeneralSubmit = (data: FormValues) => {
    startTransition(async () => {
        const generalPromise = saveGeneralInfo({
            name: data.name,
            title: data.title,
            about: data.about,
            profilePictureUrl: data.profilePictureUrl || 'https://placehold.co/400x400.png',
            cvUrl: data.cvUrl,
            contact: {
                email: `mailto:${data.email}`,
                linkedin: data.linkedin || '',
            },
        });
        const skillsPromise = saveSkills(data.skills);
        const toolsPromise = saveTools(data.tools);

        const [generalResult, skillsResult, toolsResult] = await Promise.all([generalPromise, skillsPromise, toolsPromise]);

        if (generalResult.success && skillsResult.success && toolsResult.success) {
            toast({ title: 'Update Successful', description: 'General info, skills, and tools have been saved.' });
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: [generalResult.message, skillsResult.message, toolsResult.message].filter(m => m && !m.includes('success')).join(' '),
            });
        }
    });
  };

  // --- Project Handlers ---
  const openAddProjectDialog = () => {
    setEditingProjectIndex(null);
    projectDialogForm.reset({ title: '', imageUrl: '', imageHint: '', description: '', details: '', tags: '' });
    setProjectDialogOpen(true);
  };

  const openEditProjectDialog = (index: number) => {
    setEditingProjectIndex(index);
    const project = form.getValues().projects[index];
    projectDialogForm.reset({ ...project, tags: (project.tags || []).join(', ') });
    setProjectDialogOpen(true);
  };

  const handleProjectDialogSubmit = (data: ProjectDialogValues) => {
    const cleanData = {
        ...data,
        imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
        imageHint: data.imageHint || '',
        tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : (data.tags || [])
    };

    startTransition(async () => {
      const result = data._id ? await updateProject(cleanData as Project) : await addProject(cleanData);
      if (result.success) {
        if (data._id && editingProjectIndex !== null) {
          updateProjectField(editingProjectIndex, cleanData);
        } else if (result.data) {
          appendProject(result.data);
        }
        toast({ title: 'Success', description: result.message });
        setProjectDialogOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleRemoveProject = (index: number) => {
    const projectId = form.getValues().projects[index]?._id;
    if (!projectId) return;
    startTransition(async () => {
        const result = await deleteProject(projectId);
        if (result.success) {
            removeProject(index);
            toast({ title: 'Success', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    });
  };
  
  // --- Education Handlers ---
  const openAddEducationDialog = () => {
    setEditingEducationIndex(null);
    educationDialogForm.reset({ degree: '', school: '', period: '' });
    setEducationDialogOpen(true);
  };

  const openEditEducationDialog = (index: number) => {
    setEditingEducationIndex(index);
    educationDialogForm.reset(form.getValues().education[index]);
    setEducationDialogOpen(true);
  };

  const handleEducationDialogSubmit = (data: EducationDialogValues) => {
    startTransition(async () => {
      const result = data._id ? await updateEducation(data as EducationItem) : await addEducation(data);
       if (result.success) {
        if (data._id && editingEducationIndex !== null) {
          updateEducationField(editingEducationIndex, data);
        } else if (result.data) {
          appendEducation(result.data);
        }
        toast({ title: 'Success', description: result.message });
        setEducationDialogOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleRemoveEducation = (index: number) => {
    const educationId = form.getValues().education[index]?._id;
    if (!educationId) return;
    startTransition(async () => {
        const result = await deleteEducation(educationId);
        if (result.success) {
            removeEducation(index);
            toast({ title: 'Success', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    });
  };

  // --- Certificate Handlers ---
  const openAddCertificateDialog = () => {
    setEditingCertificateIndex(null);
    certificateDialogForm.reset({ name: '', issuer: '', date: '', url: '' });
    setCertificateDialogOpen(true);
  };
  const openEditCertificateDialog = (index: number) => {
    setEditingCertificateIndex(index);
    certificateDialogForm.reset(form.getValues().certificates[index]);
    setCertificateDialogOpen(true);
  };
  const handleCertificateDialogSubmit = (data: CertificateDialogValues) => {
     const cleanData = { ...data, url: data.url || '#' };
    startTransition(async () => {
      const result = data._id ? await updateCertificate(cleanData as Certificate) : await addCertificate(cleanData);
      if (result.success) {
        if (data._id && editingCertificateIndex !== null) {
          updateCertificateField(editingCertificateIndex, cleanData);
        } else if (result.data) {
          appendCertificate(result.data);
        }
        toast({ title: 'Success', description: result.message });
        setCertificateDialogOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleRemoveCertificate = (index: number) => {
    const certificateId = form.getValues().certificates[index]?._id;
    if (!certificateId) return;
    startTransition(async () => {
        const result = await deleteCertificate(certificateId);
        if (result.success) {
            removeCertificate(index);
            toast({ title: 'Success', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    });
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill) {
      const currentSkills = form.getValues('skills') || [];
      if (!currentSkills.map(s => s.toLowerCase()).includes(trimmedSkill.toLowerCase())) {
        form.setValue('skills', [...currentSkills, trimmedSkill], { shouldValidate: true, shouldDirty: true });
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    const currentSkills = form.getValues('skills');
    form.setValue('skills', currentSkills.filter((_, index) => index !== indexToRemove), { shouldValidate: true, shouldDirty: true });
  };

  const handleAddTool = () => {
    const trimmedTool = newTool.trim();
    if (trimmedTool) {
      const currentTools = form.getValues('tools') || [];
      if (!currentTools.map(t => t.toLowerCase()).includes(trimmedTool.toLowerCase())) {
        form.setValue('tools', [...currentTools, trimmedTool], { shouldValidate: true, shouldDirty: true });
      }
      setNewTool('');
    }
  };

  const handleRemoveTool = (indexToRemove: number) => {
    const currentTools = form.getValues('tools');
    form.setValue('tools', currentTools.filter((_, index) => index !== indexToRemove), { shouldValidate: true, shouldDirty: true });
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
        <form onSubmit={form.handleSubmit(onGeneralSubmit)} className="space-y-8">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Kelola Proyek</TabsTrigger>
              <TabsTrigger value="education">Kelola Pendidikan</TabsTrigger>
              <TabsTrigger value="certificates">Kelola Sertifikat</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan Umum</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Daftar Proyek</CardTitle><CardDescription>Tambah, edit, atau hapus proyek portofolio Anda.</CardDescription></div>
                  <Button type="button" onClick={openAddProjectDialog}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Proyek</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Judul Proyek</TableHead><TableHead className="w-[150px] text-right">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {projectFields.length === 0 ? (
                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No projects yet.</TableCell></TableRow>
                      ) : projectFields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{form.watch(`projects.${index}.title`)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => openEditProjectDialog(index)}><Edit className="h-3 w-3" /></Button>
                            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveProject(index)} disabled={isPending}><Trash2 className="h-3 w-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Riwayat Pendidikan</CardTitle><CardDescription>Kelola riwayat pendidikan formal Anda.</CardDescription></div>
                  <Button type="button" onClick={openAddEducationDialog}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Pendidikan</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Gelar & Jurusan</TableHead><TableHead>Sekolah</TableHead><TableHead className="w-[150px] text-right">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                     {educationFields.length === 0 ? (
                        <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No education history yet.</TableCell></TableRow>
                      ) : educationFields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{form.watch(`education.${index}.degree`)}</TableCell>
                          <TableCell>{form.watch(`education.${index}.school`)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => openEditEducationDialog(index)}><Edit className="h-3 w-3" /></Button>
                            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveEducation(index)} disabled={isPending}><Trash2 className="h-3 w-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates" className="mt-6">
               <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Daftar Sertifikat</CardTitle><CardDescription>Kelola sertifikat dan pelatihan yang Anda miliki.</CardDescription></div>
                  <Button type="button" onClick={openAddCertificateDialog}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Sertifikat</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Nama Sertifikat</TableHead><TableHead>Penerbit</TableHead><TableHead className="w-[150px] text-right">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {certificateFields.length === 0 ? (
                        <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No certificates yet.</TableCell></TableRow>
                      ) : certificateFields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{form.watch(`certificates.${index}.name`)}</TableCell>
                          <TableCell>{form.watch(`certificates.${index}.issuer`)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => openEditCertificateDialog(index)}><Edit className="h-3 w-3" /></Button>
                            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveCertificate(index)} disabled={isPending}><Trash2 className="h-3 w-3" /></Button>
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
                <CardHeader><CardTitle>Informasi Pribadi & Kontak</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                   <FormField control={form.control} name="profilePictureUrl" render={({ field }) => (<FormItem><FormLabel>Foto Profil</FormLabel><FormControl><ImageUpload value={field.value || ''} onChange={field.onChange} disabled={isPending}/></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="about" render={({ field }) => (<FormItem><FormLabel>About</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="cvUrl" render={({ field }) => (<FormItem><FormLabel>CV</FormLabel><FormControl><FileUpload value={field.value || ''} onChange={field.onChange} disabled={isPending} /></FormControl><FormMessage /></FormItem>)}/>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><CardTitle>Kelola Keahlian Utama</CardTitle></div>
                    <CardDescription>Tambah atau hapus keahlian yang ditampilkan di halaman utama.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="new-skill">Nama Keahlian Baru</Label>
                    <div className="flex gap-2 mt-2 mb-4">
                        <Input id="new-skill" placeholder="Contoh: SEO Specialist" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}/>
                        <Button type="button" onClick={handleAddSkill} disabled={!newSkill.trim()}><PlusCircle className="mr-2 h-4 w-4" />Tambah</Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Daftar Keahlian Saat Ini:</Label>
                        <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md bg-secondary/50">
                        {form.watch('skills')?.map((skill, index) => (
                            <Badge key={`${skill}-${index}`} variant="secondary" className="flex items-center gap-2 text-sm pl-3 pr-2 py-1">
                            {skill}
                            <button type="button" onClick={() => handleRemoveSkill(index)} className="rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-destructive">
                                <span className="sr-only">Hapus {skill}</span><Trash2 className="h-3.5 w-3.5" />
                            </button>
                            </Badge>
                        ))}
                        </div>
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <div className="flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /><CardTitle>Kelola Tools</CardTitle></div>
                    <CardDescription>Tambah atau hapus tools yang ditampilkan di halaman utama.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="new-tool">Nama Tool Baru</Label>
                    <div className="flex gap-2 mt-2 mb-4">
                        <Input id="new-tool" placeholder="Contoh: Figma" value={newTool} onChange={(e) => setNewTool(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTool(); } }}/>
                        <Button type="button" onClick={handleAddTool} disabled={!newTool.trim()}><PlusCircle className="mr-2 h-4 w-4" />Tambah</Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Daftar Tools Saat Ini:</Label>
                        <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md bg-secondary/50">
                        {form.watch('tools')?.map((tool, index) => (
                            <Badge key={`${tool}-${index}`} variant="secondary" className="flex items-center gap-2 text-sm pl-3 pr-2 py-1">
                            {tool}
                            <button type="button" onClick={() => handleRemoveTool(index)} className="rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-destructive">
                                <span className="sr-only">Hapus {tool}</span><Trash2 className="h-3.5 w-3.5" />
                            </button>
                            </Badge>
                        ))}
                        </div>
                    </div>
                </CardContent>
              </Card>

               <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Simpan Semua Pengaturan Umum</CardTitle>
                    <CardDescription>Klik tombol ini untuk menyimpan semua perubahan di tab ini: Info Pribadi, Keahlian, dan Tools.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button size="lg" type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Simpan Pengaturan Umum
                    </Button>
                </CardFooter>
              </Card>

            </TabsContent>
          </Tabs>

        </form>
      </Form>

      {/* Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProjectIndex !== null ? 'Edit Proyek' : 'Tambah Proyek Baru'}</DialogTitle></DialogHeader>
          <Form {...projectDialogForm}>
            <form onSubmit={projectDialogForm.handleSubmit(handleProjectDialogSubmit)} className="space-y-4 py-4">
                <FormField control={projectDialogForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image</FormLabel><FormControl><ImageUpload value={field.value || ''} onChange={field.onChange} disabled={isPending} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={projectDialogForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input placeholder="e.g. 'project abstract'" {...field} /></FormControl><FormDescription>One or two keywords for AI to find a relevant image.</FormDescription><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="details" render={({ field }) => (<FormItem><FormLabel>Details</FormLabel><FormControl><Textarea placeholder="Use new lines for list items" rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Save Project'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Education Dialog */}
      <Dialog open={isEducationDialogOpen} onOpenChange={setEducationDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingEducationIndex !== null ? 'Edit Pendidikan' : 'Tambah Pendidikan'}</DialogTitle></DialogHeader>
          <Form {...educationDialogForm}>
            <form onSubmit={educationDialogForm.handleSubmit(handleEducationDialogSubmit)} className="space-y-4 py-4">
              <FormField control={educationDialogForm.control} name="degree" render={({ field }) => (<FormItem><FormLabel>Gelar & Jurusan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={educationDialogForm.control} name="school" render={({ field }) => (<FormItem><FormLabel>Nama Sekolah/Universitas</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={educationDialogForm.control} name="period" render={({ field }) => (<FormItem><FormLabel>Periode</FormLabel><FormControl><Input placeholder="e.g., 2018 - 2022" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog open={isCertificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCertificateIndex !== null ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</DialogTitle></DialogHeader>
          <Form {...certificateDialogForm}>
            <form onSubmit={certificateDialogForm.handleSubmit(handleCertificateDialogSubmit)} className="space-y-4 py-4">
              <FormField control={certificateDialogForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nama Sertifikat</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={certificateDialogForm.control} name="issuer" render={({ field }) => (<FormItem><FormLabel>Penerbit</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={certificateDialogForm.control} name="date" render={({ field }) => (<FormItem><FormLabel>Tanggal Diperoleh</FormLabel><FormControl><Input placeholder="e.g., Jan 2023" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={certificateDialogForm.control} name="url" render={({ field }) => (<FormItem><FormLabel>URL Verifikasi (Opsional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
