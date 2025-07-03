
'use client';

import { useState, useTransition } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PortfolioData, Project, EducationItem, Certificate, SoftwareSkill, MultilingualString } from '@/lib/types';
import {
  saveGeneralInfo, saveSoftSkills, saveHardSkills,
  addProject, updateProject, deleteProject,
  addEducation, updateEducation, deleteEducation,
  addCertificate, updateCertificate, deleteCertificate,
  addSoftwareSkill, updateSoftwareSkill, deleteSoftwareSkill
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
import { LogOut, PlusCircle, Trash2, Edit, Loader2, Sparkles, Wrench, Briefcase, GraduationCap, Award, Settings2, Cpu } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { FileUpload } from './FileUpload';
import Image from "next/image";

// --- Reusable Multilingual Form Field ---
interface MultilingualFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholders: { id: string; en: string };
  isTextarea?: boolean;
}

const MultilingualFormField = ({ form, name, label, placeholders, isTextarea = false }: MultilingualFormFieldProps) => {
  const InputComponent = isTextarea ? Textarea : Input;
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Tabs defaultValue="id" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="id">Indonesia</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>
        <TabsContent value="id" className="pt-2">
          <FormField
            control={form.control}
            name={`${name}.id`}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">{label} (Indonesia)</FormLabel>
                <FormControl><InputComponent placeholder={placeholders.id} {...field} rows={isTextarea ? 5 : undefined} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
        <TabsContent value="en" className="pt-2">
          <FormField
            control={form.control}
            name={`${name}.en`}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">{label} (English)</FormLabel>
                <FormControl><InputComponent placeholder={placeholders.en} {...field} rows={isTextarea ? 5 : undefined} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </FormItem>
  );
};


// --- Zod Schemas ---
const multilingualStringSchema = z.object({
  id: z.string().min(1, 'Versi Bahasa Indonesia wajib diisi.'),
  en: z.string().min(1, 'Versi Bahasa Inggris wajib diisi.'),
});

const softwareSkillSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required'),
  iconUrl: z.string().min(1, 'Icon is required'),
});

const projectSchema = z.object({
  _id: z.string().optional(),
  title: multilingualStringSchema,
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
  description: multilingualStringSchema,
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  link: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

const educationSchema = z.object({
  _id: z.string().optional(),
  degree: multilingualStringSchema,
  school: multilingualStringSchema,
  period: z.string().min(1, 'Period is required'),
});

const certificateSchema = z.object({
  _id: z.string().optional(),
  name: multilingualStringSchema,
  description: multilingualStringSchema,
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const generalSettingsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: multilingualStringSchema,
  about: multilingualStringSchema,
  profilePictureUrl: z.string().optional(),
  cvUrl: z.string().min(1, 'CV URL/File Path is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
type SoftwareSkillDialogValues = z.infer<typeof softwareSkillSchema>;
type ProjectDialogValues = z.infer<typeof projectSchema>;
type EducationDialogValues = z.infer<typeof educationSchema>;
type CertificateDialogValues = z.infer<typeof certificateSchema>;
type AdminView = 'projects' | 'education' | 'certificates' | 'skills' | 'settings';

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
  
  const [isSoftwareSkillDialogOpen, setSoftwareSkillDialogOpen] = useState(false);
  const [editingSoftwareSkillIndex, setEditingSoftwareSkillIndex] = useState<number | null>(null);

  const [softSkills, setSoftSkills] = useState<string[]>(initialData.softSkills || []);
  const [hardSkills, setHardSkills] = useState<string[]>(initialData.hardSkills || []);
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newHardSkill, setNewHardSkill] = useState('');
  
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
    }
  });

  const projectDialogForm = useForm<ProjectDialogValues>({ resolver: zodResolver(projectSchema) });
  const educationDialogForm = useForm<EducationDialogValues>({ resolver: zodResolver(educationSchema) });
  const certificateDialogForm = useForm<CertificateDialogValues>({ resolver: zodResolver(certificateSchema) });
  const softwareSkillDialogForm = useForm<SoftwareSkillDialogValues>({ resolver: zodResolver(softwareSkillSchema) });

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const onSettingsSubmit = (data: GeneralSettingsFormValues) => {
    startTransition(async () => {
        const result = await saveGeneralInfo({
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

        if (result.success) {
            toast({ title: 'Update Successful', description: 'General settings have been saved.' });
            router.refresh();
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: result.message,
            });
        }
    });
  };

  // --- Project Handlers ---
  const openAddProjectDialog = () => {
    setEditingProjectIndex(null);
    projectDialogForm.reset({ title: {id: '', en: ''}, imageUrl: '', imageHint: '', description: {id: '', en: ''}, tags: '', link: '' });
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
    educationDialogForm.reset({ degree: {id: '', en: ''}, school: {id: '', en: ''}, period: '' });
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
    certificateDialogForm.reset({ name: {id: '', en: ''}, description: {id: '', en: ''}, imageUrl: '', imageHint: '', issuer: '', date: '', url: '' });
    setCertificateDialogOpen(true);
  };
  const openEditCertificateDialog = (index: number) => {
    setEditingCertificateIndex(index);
    const cert = initialData.certificates[index];
    certificateDialogForm.reset({
        ...cert,
        description: cert.description || {id: '', en: ''},
        imageUrl: cert.imageUrl || '',
        imageHint: cert.imageHint || ''
    });
    setCertificateDialogOpen(true);
  };
  const handleCertificateDialogSubmit = (data: CertificateDialogValues) => {
     const cleanData = { 
        ...data, 
        imageUrl: data.imageUrl || 'https://placehold.co/1754x1241.png',
        imageHint: data.imageHint || '',
        url: data.url || '#' 
    };
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
  
  // --- Software Skill Handlers ---
  const openAddSoftwareSkillDialog = () => {
    setEditingSoftwareSkillIndex(null);
    softwareSkillDialogForm.reset({ name: '', iconUrl: '' });
    setSoftwareSkillDialogOpen(true);
  };

  const openEditSoftwareSkillDialog = (index: number) => {
    setEditingSoftwareSkillIndex(index);
    softwareSkillDialogForm.reset(initialData.softwareSkills[index]);
    setSoftwareSkillDialogOpen(true);
  };

  const handleSoftwareSkillDialogSubmit = (data: SoftwareSkillDialogValues) => {
    startTransition(async () => {
      const result = data._id ? await updateSoftwareSkill(data as SoftwareSkill) : await addSoftwareSkill(data);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setSoftwareSkillDialogOpen(false);
        router.refresh();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleRemoveSoftwareSkill = (index: number) => {
    const skillId = initialData.softwareSkills[index]?._id;
    if (!skillId) return;
    startTransition(async () => {
      const result = await deleteSoftwareSkill(skillId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        router.refresh();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };


  // --- Skill/Tool Handlers ---
  const handleSaveSkills = () => {
    startTransition(async () => {
        const softSkillsPromise = saveSoftSkills(softSkills);
        const hardSkillsPromise = saveHardSkills(hardSkills);
        const [softSkillsResult, hardSkillsResult] = await Promise.all([softSkillsPromise, hardSkillsPromise]);

        if (softSkillsResult.success && hardSkillsResult.success) {
            toast({ title: 'Update Successful', description: 'Your skills have been saved.' });
            router.refresh();
        } else {
            const errorMessages = [softSkillsResult.message, hardSkillsResult.message]
                .filter(m => m && !m.includes('success'))
                .join(' ');
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: errorMessages || 'An unknown error occurred while saving skills.',
            });
        }
    });
  };
  
  const handleAddSoftSkill = () => {
    const trimmedSkill = newSoftSkill.trim();
    if (trimmedSkill) {
      if (!softSkills.map(s => s.toLowerCase()).includes(trimmedSkill.toLowerCase())) {
        setSoftSkills([...softSkills, trimmedSkill]);
      }
      setNewSoftSkill('');
    }
  };

  const handleRemoveSoftSkill = (indexToRemove: number) => {
    setSoftSkills(softSkills.filter((_, index) => index !== indexToRemove));
  };

  const handleAddHardSkill = () => {
    const trimmedSkill = newHardSkill.trim();
    if (trimmedSkill) {
      if (!hardSkills.map(t => t.toLowerCase()).includes(trimmedSkill.toLowerCase())) {
        setHardSkills([...hardSkills, trimmedSkill]);
      }
      setNewHardSkill('');
    }
  };

  const handleRemoveHardSkill = (indexToRemove: number) => {
    setHardSkills(hardSkills.filter((_, index) => index !== indexToRemove));
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
               <NavButton active={view === 'skills'} onClick={() => setView('skills')} icon={Cpu}>Skills</NavButton>
               <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={Settings2}>Settings</NavButton>
            </nav>
            <div className="text-xs text-muted-foreground p-2">
                &copy; {new Date().getFullYear()} {form.getValues('name') || 'Portfolio'}
            </div>
          </div>
          <div className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSettingsSubmit)} className="space-y-8">

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
                            <TableCell className="font-medium">{project.title.id}</TableCell>
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
                            <TableCell className="font-medium">{edu.degree.id}</TableCell>
                            <TableCell>{edu.school.id}</TableCell>
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
                            <TableCell className="font-medium">{cert.name.id}</TableCell>
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
              
              {view === 'skills' && (
                <div className="space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div><CardTitle>Manage Software Skills</CardTitle><CardDescription>Add, edit, or remove your software skills.</CardDescription></div>
                            <Button type="button" onClick={openAddSoftwareSkillDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead className="w-[80px]">Icon</TableHead><TableHead>Skill Name</TableHead><TableHead className="w-[150px] text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {initialData.softwareSkills.length === 0 ? (
                                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground h-24">No software skills yet.</TableCell></TableRow>
                                    ) : initialData.softwareSkills.map((skill, index) => (
                                    <TableRow key={skill._id || index}>
                                        <TableCell>
                                            <Image src={skill.iconUrl} alt={skill.name} width={40} height={40} className="rounded-md object-contain" />
                                        </TableCell>
                                        <TableCell className="font-medium">{skill.name}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                        <Button type="button" variant="outline" size="icon" onClick={() => openEditSoftwareSkillDialog(index)}><Edit className="h-4 w-4" /></Button>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveSoftwareSkill(index)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Soft & Hard Skills</CardTitle>
                            <CardDescription>Add or remove skills that will be displayed in separated lists.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><h3 className="text-xl font-semibold">Soft Skills</h3></div>
                                <div>
                                    <Label htmlFor="new-soft-skill">New Soft Skill</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input id="new-soft-skill" placeholder="e.g., Public Speaking" value={newSoftSkill} onChange={(e) => setNewSoftSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSoftSkill(); } }}/>
                                        <Button type="button" onClick={handleAddSoftSkill} disabled={!newSoftSkill.trim()}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Current Skills:</Label>
                                    <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md bg-secondary/50">
                                        {softSkills.map((skill, index) => (
                                            <Badge key={`${skill}-${index}`} variant="secondary" className="flex items-center gap-2 text-sm pl-3 pr-2 py-1">
                                            {skill}
                                            <button type="button" onClick={() => handleRemoveSoftSkill(index)} className="rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-destructive">
                                                <span className="sr-only">Remove {skill}</span><Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /><h3 className="text-xl font-semibold">Hard Skills</h3></div>
                                <div>
                                    <Label htmlFor="new-hard-skill">New Hard Skill</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input id="new-hard-skill" placeholder="e.g., UI/UX Design" value={newHardSkill} onChange={(e) => setNewHardSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHardSkill(); } }}/>
                                        <Button type="button" onClick={handleAddHardSkill} disabled={!newHardSkill.trim()}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Current Skills:</Label>
                                    <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md bg-secondary/50">
                                    {hardSkills.map((skill, index) => (
                                        <Badge key={`${skill}-${index}`} variant="secondary" className="flex items-center gap-2 text-sm pl-3 pr-2 py-1">
                                        {skill}
                                        <button type="button" onClick={() => handleRemoveHardSkill(index)} className="rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-destructive">
                                            <span className="sr-only">Remove {skill}</span><Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                        </Badge>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" type="button" onClick={handleSaveSkills} disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                Save Skills
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
              )}

              {view === 'settings' && (
                <div className="space-y-8">
                  <Card>
                    <CardHeader><CardTitle>Personal & Contact Info</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <FormField control={form.control} name="profilePictureUrl" render={({ field }) => (<FormItem><FormLabel>Profile Photo</FormLabel><FormControl><ImageUpload value={field.value || ''} onChange={field.onChange} disabled={isPending}/></FormControl><FormMessage /></FormItem>)}/>
                      <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <MultilingualFormField form={form} name="title" label="Title" placeholders={{id: "Jabatan Anda", en: "Your Title"}} />
                      <MultilingualFormField form={form} name="about" label="About" placeholders={{id: "Tentang Anda", en: "About You"}} isTextarea />
                      <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="cvUrl" render={({ field }) => (<FormItem><FormLabel>CV</FormLabel><FormControl><FileUpload value={field.value || ''} onChange={field.onChange} disabled={isPending} /></FormControl><FormMessage /></FormItem>)}/>
                    </CardContent>
                  </Card>

                  <Card className="mt-6 bg-secondary/30">
                    <CardHeader>
                        <CardTitle>Save Settings</CardTitle>
                        <CardDescription>Click this to save all changes in this tab: Personal Info & Contact.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button size="lg" type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Save Settings
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
                <MultilingualFormField form={projectDialogForm} name="title" label="Title" placeholders={{id: "Judul Proyek", en: "Project Title"}} />
                <FormField control={projectDialogForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image</FormLabel><FormControl><ImageUpload value={field.value || ''} onChange={field.onChange} disabled={isPending} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={projectDialogForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input placeholder="e.g. 'project abstract'" {...field} /></FormControl><FormDescription>One or two keywords for AI to find a relevant image.</FormDescription><FormMessage /></FormItem>)} />
                <MultilingualFormField form={projectDialogForm} name="description" label="Description" placeholders={{id: "Deskripsi Proyek", en: "Project Description"}} isTextarea />
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
              <MultilingualFormField form={educationDialogForm} name="degree" label="Degree & Major" placeholders={{id: "Gelar & Jurusan", en: "Degree & Major"}} />
              <MultilingualFormField form={educationDialogForm} name="school" label="School/University Name" placeholders={{id: "Nama Sekolah/Universitas", en: "School/University Name"}} />
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
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingCertificateIndex !== null ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle></DialogHeader>
          <Form {...certificateDialogForm}>
            <form onSubmit={certificateDialogForm.handleSubmit(handleCertificateDialogSubmit)} className="space-y-4 py-4">
              <MultilingualFormField form={certificateDialogForm} name="name" label="Certificate Name" placeholders={{id: "Nama Sertifikat", en: "Certificate Name"}} />
              <FormField control={certificateDialogForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image</FormLabel><FormControl><ImageUpload value={field.value || ''} onChange={field.onChange} disabled={isPending} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={certificateDialogForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input placeholder="e.g. 'certificate design'" {...field} /></FormControl><FormDescription>One or two keywords for AI to find a relevant image.</FormDescription><FormMessage /></FormItem>)} />
              <MultilingualFormField form={certificateDialogForm} name="description" label="Description" placeholders={{id: "Deskripsi Sertifikat", en: "Certificate Description"}} isTextarea />
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
      
      {/* Software Skill Dialog */}
      <Dialog open={isSoftwareSkillDialogOpen} onOpenChange={setSoftwareSkillDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingSoftwareSkillIndex !== null ? 'Edit Software Skill' : 'Add Software Skill'}</DialogTitle></DialogHeader>
          <Form {...softwareSkillDialogForm}>
            <form onSubmit={softwareSkillDialogForm.handleSubmit(handleSoftwareSkillDialogSubmit)} className="space-y-4 py-4">
              <FormField control={softwareSkillDialogForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Skill Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={softwareSkillDialogForm.control} name="iconUrl" render={({ field }) => (<FormItem><FormLabel>Icon</FormLabel><FormControl><ImageUpload value={field.value || ''} onChange={field.onChange} disabled={isPending} /></FormControl><FormMessage /></FormItem>)}/>
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
