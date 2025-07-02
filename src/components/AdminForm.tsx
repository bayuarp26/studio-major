
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
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
import { useToast } from '@/hooks/use-toast';
import { LogOut, PlusCircle, Trash2, Edit, Loader2, Sparkles, Wrench, Briefcase, GraduationCap, Award, Settings2 } from 'lucide-react';
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
  link: z.string().url('Invalid URL format').optional().or(z.literal('')),
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

// This schema ONLY validates the fields in the "Settings" tab.
const generalSettingsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().min(5, 'Title is required'),
  about: z.string().min(10, 'About section is required'),
  profilePictureUrl: z.string().optional(),
  cvUrl: z.string().min(1, 'CV URL/File Path is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  tools: z.array(z.string()).min(1, 'At least one tool is required'),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
type ProjectDialogValues = z.infer<typeof projectSchema>;
type EducationDialogValues = z.infer<typeof educationSchema>;
type CertificateDialogValues = z.infer<typeof certificateSchema>;
type AdminView = 'projects' | 'education' | 'certificates' | 'settings';

interface AdminFormProps {
  initialData: PortfolioData;
}

export default function AdminForm({ initialData }: AdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<AdminView>('projects');

  const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  
  const [isEducationDialogOpen, setEducationDialogOpen] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);

  const [isCertificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [editingCertificateIndex, setEditingCertificateIndex] = useState<number | null>(null);

  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');
  
  // The main form now only manages and validates General Settings.
  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      name: initialData.name,
      title: initialData.title,
      about: initialData.about,
      profilePictureUrl: initialData.profilePictureUrl,
      cvUrl: initialData.cvUrl,
      email: initialData.contact.email.replace('mailto:', ''),
      linkedin: initialData.contact.linkedin || '',
      skills: initialData.skills || [],
      tools: initialData.tools || [],
    }
  });

  const projectDialogForm = useForm<ProjectDialogValues>({ resolver: zodResolver(projectSchema) });
  const educationDialogForm = useForm<EducationDialogValues>({ resolver: zodResolver(educationSchema) });
  const certificateDialogForm = useForm<CertificateDialogValues>({ resolver: zodResolver(certificateSchema) });


  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const onGeneralSubmit = (data: GeneralSettingsFormValues) => {
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
            router.refresh();
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
    projectDialogForm.reset({ title: '', imageUrl: '', imageHint: '', description: '', details: '', tags: '', link: '' });
    setProjectDialogOpen(true);
  };

  const openEditProjectDialog = (index: number) => {
    setEditingProjectIndex(index);
    const project = initialData.projects[index];
    projectDialogForm.reset({ ...project, tags: (project.tags || []).join(', '), link: project.link || '' });
    setProjectDialogOpen(true);
  };

  const handleProjectDialogSubmit = (data: ProjectDialogValues) => {
    const cleanData = {
        ...data,
        imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
        imageHint: data.imageHint || '',
        tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : (data.tags || []),
        link: data.link || '#'
    };

    startTransition(async () => {
      const result = data._id ? await updateProject(cleanData as Project) : await addProject(cleanData);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setProjectDialogOpen(false);
        router.refresh();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleRemoveProject = (index: number) => {
    const projectId = initialData.projects[index]?._id;
    if (!projectId) return;
    startTransition(async () => {
        const result = await deleteProject(projectId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            router.refresh();
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
    educationDialogForm.reset(initialData.education[index]);
    setEducationDialogOpen(true);
  };

  const handleEducationDialogSubmit = (data: EducationDialogValues) => {
    startTransition(async () => {
      const result = data._id ? await updateEducation(data as EducationItem) : await addEducation(data);
       if (result.success) {
        toast({ title: 'Success', description: result.message });
        setEducationDialogOpen(false);
        router.refresh();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleRemoveEducation = (index: number) => {
    const educationId = initialData.education[index]?._id;
    if (!educationId) return;
    startTransition(async () => {
        const result = await deleteEducation(educationId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            router.refresh();
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
    certificateDialogForm.reset(initialData.certificates[index]);
    setCertificateDialogOpen(true);
  };
  const handleCertificateDialogSubmit = (data: CertificateDialogValues) => {
     const cleanData = { ...data, url: data.url || '#' };
    startTransition(async () => {
      const result = data._id ? await updateCertificate(cleanData as Certificate) : await addCertificate(cleanData);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setCertificateDialogOpen(false);
        router.refresh();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleRemoveCertificate = (index: number) => {
    const certificateId = initialData.certificates[index]?._id;
    if (!certificateId) return;
    startTransition(async () => {
        const result = await deleteCertificate(certificateId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    });
  };

  // --- Skill/Tool Handlers ---
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
  
  const NavButton = ({ active, onClick, icon: Icon, children }: { active: boolean, onClick: () => void, icon: React.ElementType, children: React.ReactNode }) => (
    <Button variant={active ? 'secondary' : 'ghost'} onClick={onClick} className="w-full justify-start text-base">
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Button>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome! Manage your portfolio content here.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[220px_1fr] min-h-[600px]">
          <div className="flex flex-col justify-between p-4 bg-muted/40 border-r">
            <nav className="flex flex-col gap-2">
               <NavButton active={view === 'projects'} onClick={() => setView('projects')} icon={Briefcase}>Projects</NavButton>
               <NavButton active={view === 'education'} onClick={() => setView('education')} icon={GraduationCap}>Education</NavButton>
               <NavButton active={view === 'certificates'} onClick={() => setView('certificates')} icon={Award}>Certificates</NavButton>
               <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={Settings2}>Settings</NavButton>
            </nav>
            <div className="text-xs text-muted-foreground p-2">
                &copy; {new Date().getFullYear()} {form.getValues('name') || 'Portfolio'}
            </div>
          </div>
          <div className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onGeneralSubmit)} className="space-y-8">

              {view === 'projects' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle>Manage Projects</CardTitle><CardDescription>Add, edit, or remove your portfolio projects.</CardDescription></div>
                    <Button type="button" onClick={openAddProjectDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add Project</Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Project Title</TableHead><TableHead className="w-[150px] text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {initialData.projects.length === 0 ? (
                          <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground h-24">No projects yet.</TableCell></TableRow>
                        ) : initialData.projects.map((project, index) => (
                          <TableRow key={project._id || index}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button type="button" variant="outline" size="icon" onClick={() => openEditProjectDialog(index)}><Edit className="h-4 w-4" /></Button>
                              <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveProject(index)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {view === 'education' && (
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle>Manage Education</CardTitle><CardDescription>Manage your formal education history.</CardDescription></div>
                    <Button type="button" onClick={openAddEducationDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Degree & Major</TableHead><TableHead>School</TableHead><TableHead className="w-[150px] text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                      {initialData.education.length === 0 ? (
                          <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground h-24">No education history yet.</TableCell></TableRow>
                        ) : initialData.education.map((edu, index) => (
                          <TableRow key={edu._id || index}>
                            <TableCell className="font-medium">{edu.degree}</TableCell>
                            <TableCell>{edu.school}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button type="button" variant="outline" size="icon" onClick={() => openEditEducationDialog(index)}><Edit className="h-4 w-4" /></Button>
                              <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveEducation(index)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {view === 'certificates' && (
                  <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle>Manage Certificates</CardTitle><CardDescription>Manage your certificates and trainings.</CardDescription></div>
                    <Button type="button" onClick={openAddCertificateDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add Certificate</Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Certificate Name</TableHead><TableHead>Issuer</TableHead><TableHead className="w-[150px] text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {initialData.certificates.length === 0 ? (
                          <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground h-24">No certificates yet.</TableCell></TableRow>
                        ) : initialData.certificates.map((cert, index) => (
                          <TableRow key={cert._id || index}>
                            <TableCell className="font-medium">{cert.name}</TableCell>
                            <TableCell>{cert.issuer}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button type="button" variant="outline" size="icon" onClick={() => openEditCertificateDialog(index)}><Edit className="h-4 w-4" /></Button>
                              <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveCertificate(index)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {view === 'settings' && (
                <div className="space-y-8">
                  <Card>
                    <CardHeader><CardTitle>Personal & Contact Info</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <FormField control={form.control} name="profilePictureUrl" render={({ field }) => (<FormItem><FormLabel>Profile Photo</FormLabel><FormControl><ImageUpload value={field.value || ''} onChange={field.onChange} disabled={isPending}/></FormControl><FormMessage /></FormItem>)}/>
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
                        <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><CardTitle>Manage Main Skills</CardTitle></div>
                        <CardDescription>Add or remove skills displayed on the main page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="new-skill">New Skill Name</Label>
                        <div className="flex gap-2 mt-2 mb-4">
                            <Input id="new-skill" placeholder="e.g., SEO Specialist" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}/>
                            <Button type="button" onClick={handleAddSkill} disabled={!newSkill.trim()}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Current Skills:</Label>
                            <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md bg-secondary/50">
                            {form.watch('skills')?.map((skill, index) => (
                                <Badge key={`${skill}-${index}`} variant="secondary" className="flex items-center gap-2 text-sm pl-3 pr-2 py-1">
                                {skill}
                                <button type="button" onClick={() => handleRemoveSkill(index)} className="rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-destructive">
                                    <span className="sr-only">Remove {skill}</span><Trash2 className="h-3.5 w-3.5" />
                                </button>
                                </Badge>
                            ))}
                            </div>
                        </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /><CardTitle>Manage Tools</CardTitle></div>
                        <CardDescription>Add or remove tools displayed on the main page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="new-tool">New Tool Name</Label>
                        <div className="flex gap-2 mt-2 mb-4">
                            <Input id="new-tool" placeholder="e.g., Figma" value={newTool} onChange={(e) => setNewTool(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTool(); } }}/>
                            <Button type="button" onClick={handleAddTool} disabled={!newTool.trim()}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Current Tools:</Label>
                            <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md bg-secondary/50">
                            {form.watch('tools')?.map((tool, index) => (
                                <Badge key={`${tool}-${index}`} variant="secondary" className="flex items-center gap-2 text-sm pl-3 pr-2 py-1">
                                {tool}
                                <button type="button" onClick={() => handleRemoveTool(index)} className="rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-destructive">
                                    <span className="sr-only">Remove {tool}</span><Trash2 className="h-3.5 w-3.5" />
                                </button>
                                </Badge>
                            ))}
                            </div>
                        </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-6 bg-secondary/30">
                    <CardHeader>
                        <CardTitle>Save General Settings</CardTitle>
                        <CardDescription>Click this to save all changes in this tab: Personal Info, Skills, and Tools.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button size="lg" type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Save General Settings
                        </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
              </form>
            </Form>
          </div>
        </div>
      </Card>

      {/* Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProjectIndex !== null ? 'Edit Project' : 'Add New Project'}</DialogTitle></DialogHeader>
          <Form {...projectDialogForm}>
            <form onSubmit={projectDialogForm.handleSubmit(handleProjectDialogSubmit)} className="space-y-4 py-4">
                <FormField control={projectDialogForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image</FormLabel><FormControl><ImageUpload value={field.value || ''} onChange={field.onChange} disabled={isPending} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={projectDialogForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input placeholder="e.g. 'project abstract'" {...field} /></FormControl><FormDescription>One or two keywords for AI to find a relevant image.</FormDescription><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="details" render={({ field }) => (<FormItem><FormLabel>Details</FormLabel><FormControl><Textarea placeholder="Use new lines for list items" rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={projectDialogForm.control} name="link" render={({ field }) => (<FormItem><FormLabel>Project Link</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
          <DialogHeader><DialogTitle>{editingEducationIndex !== null ? 'Edit Education' : 'Add Education'}</DialogTitle></DialogHeader>
          <Form {...educationDialogForm}>
            <form onSubmit={educationDialogForm.handleSubmit(handleEducationDialogSubmit)} className="space-y-4 py-4">
              <FormField control={educationDialogForm.control} name="degree" render={({ field }) => (<FormItem><FormLabel>Degree & Major</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={educationDialogForm.control} name="school" render={({ field }) => (<FormItem><FormLabel>School/University Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={educationDialogForm.control} name="period" render={({ field }) => (<FormItem><FormLabel>Period</FormLabel><FormControl><Input placeholder="e.g., 2018 - 2022" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
          <DialogHeader><DialogTitle>{editingCertificateIndex !== null ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle></DialogHeader>
          <Form {...certificateDialogForm}>
            <form onSubmit={certificateDialogForm.handleSubmit(handleCertificateDialogSubmit)} className="space-y-4 py-4">
              <FormField control={certificateDialogForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Certificate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={certificateDialogForm.control} name="issuer" render={({ field }) => (<FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={certificateDialogForm.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date Issued</FormLabel><FormControl><Input placeholder="e.g., Jan 2023" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={certificateDialogForm.control} name="url" render={({ field }) => (<FormItem><FormLabel>Verification URL (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
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
