
'use server';

import type { PortfolioData, Project, EducationItem, Certificate, SoftwareSkill } from './types';
import { 
    updateMainContent, 
    updateSimpleCollection, 
    addDocument, 
    updateDocument, 
    deleteDocument 
} from './data';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

// --- Authorization Check ---
async function checkAuth() {
    const session = await getSession();
    if (!session) {
        throw new Error('Authentication required.');
    }
    return session;
}

function revalidatePublicPaths() {
    revalidatePath('/');
    revalidatePath('/[lang]', 'layout');
    revalidatePath('/admin/dashboard');
}

// --- Generic Success/Error Response ---
type ActionResponse<T = any> = {
    success: boolean;
    message: string;
    data?: T;
};


// --- General Info, Skills, Tools ---

export async function saveGeneralInfo(
    data: Omit<PortfolioData, 'projects' | 'education' | 'certificates' | 'softSkills' | 'hardSkills' | 'softwareSkills'>
): Promise<ActionResponse> {
    try {
        await checkAuth();
        await updateMainContent(data);
        revalidatePublicPaths();
        return { success: true, message: 'General info updated successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update general info: ${message}` };
    }
}

export async function saveSoftSkills(skills: string[]): Promise<ActionResponse> {
    try {
        await checkAuth();
        await updateSimpleCollection('soft_skills', skills);
        revalidatePublicPaths();
        return { success: true, message: 'Soft skills updated successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update soft skills: ${message}` };
    }
}

export async function saveHardSkills(skills: string[]): Promise<ActionResponse> {
    try {
        await checkAuth();
        await updateSimpleCollection('hard_skills', skills);
        revalidatePublicPaths();
        return { success: true, message: 'Hard skills updated successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update hard skills: ${message}` };
    }
}

// --- Software Skills CRUD ---

export async function addSoftwareSkill(skill: Omit<SoftwareSkill, '_id'>): Promise<ActionResponse<SoftwareSkill>> {
    try {
        await checkAuth();
        const newSkill = await addDocument('software_skills', skill);
        revalidatePublicPaths();
        return { success: true, message: 'Software skill added successfully!', data: newSkill };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add software skill: ${message}` };
    }
}

export async function updateSoftwareSkill(skill: SoftwareSkill): Promise<ActionResponse> {
    try {
        await checkAuth();
        if (!skill._id) throw new Error("Skill ID is missing for update.");
        await updateDocument('software_skills', skill._id, skill);
        revalidatePublicPaths();
        return { success: true, message: 'Software skill updated successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update software skill: ${message}` };
    }
}

export async function deleteSoftwareSkill(id: string): Promise<ActionResponse> {
    try {
        await checkAuth();
        await deleteDocument('software_skills', id);
        revalidatePublicPaths();
        return { success: true, message: 'Software skill deleted successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete software skill: ${message}` };
    }
}


// --- Projects CRUD ---

export async function addProject(project: Omit<Project, '_id'>): Promise<ActionResponse<Project>> {
    try {
        await checkAuth();
        const newProject = await addDocument('projects', project);
        revalidatePublicPaths();
        return { success: true, message: 'Project added successfully!', data: newProject };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add project: ${message}` };
    }
}

export async function updateProject(project: Project): Promise<ActionResponse> {
    try {
        await checkAuth();
        if (!project._id) throw new Error("Project ID is missing for update.");
        await updateDocument('projects', project._id, project);
        revalidatePublicPaths();
        return { success: true, message: 'Project updated successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update project: ${message}` };
    }
}

export async function deleteProject(id: string): Promise<ActionResponse> {
    try {
        await checkAuth();
        await deleteDocument('projects', id);
        revalidatePublicPaths();
        return { success: true, message: 'Project deleted successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete project: ${message}` };
    }
}


// --- Education CRUD ---

export async function addEducation(education: Omit<EducationItem, '_id'>): Promise<ActionResponse<EducationItem>> {
    try {
        await checkAuth();
        const newEducation = await addDocument('education', education);
        revalidatePublicPaths();
        return { success: true, message: 'Education added successfully!', data: newEducation };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add education: ${message}` };
    }
}

export async function updateEducation(education: EducationItem): Promise<ActionResponse> {
    try {
        await checkAuth();
        if (!education._id) throw new Error("Education ID is missing for update.");
        await updateDocument('education', education._id, education);
        revalidatePublicPaths();
        return { success: true, message: 'Education updated successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update education: ${message}` };
    }
}

export async function deleteEducation(id: string): Promise<ActionResponse> {
    try {
        await checkAuth();
        await deleteDocument('education', id);
        revalidatePublicPaths();
        return { success: true, message: 'Education deleted successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete education: ${message}` };
    }
}

// --- Certificates CRUD ---

export async function addCertificate(certificate: Omit<Certificate, '_id'>): Promise<ActionResponse<Certificate>> {
    try {
        await checkAuth();
        const newCertificate = await addDocument('certificates', certificate);
        revalidatePublicPaths();
        return { success: true, message: 'Certificate added successfully!', data: newCertificate };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add certificate: ${message}` };
    }
}

export async function updateCertificate(certificate: Certificate): Promise<ActionResponse> {
    try {
        await checkAuth();
        if (!certificate._id) throw new Error("Certificate ID is missing for update.");
        await updateDocument('certificates', certificate._id, certificate);
        revalidatePublicPaths();
        return { success: true, message: 'Certificate updated successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update certificate: ${message}` };
    }
}

export async function deleteCertificate(id: string): Promise<ActionResponse> {
    try {
        await checkAuth();
        await deleteDocument('certificates', id);
        revalidatePublicPaths();
        return { success: true, message: 'Certificate deleted successfully!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete certificate: ${message}` };
    }
}
