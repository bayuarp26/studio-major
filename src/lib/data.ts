
'use server';

import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate, User, SoftwareSkill } from '@/lib/types';
import { Collection, Db, MongoClient, WithId, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { unstable_noStore as noStore } from 'next/cache';

// --- DATABASE & COLLECTION CONSTANTS ---
const DB_NAME = 'portfolioDB';
const USERS_COLLECTION_NAME = 'profil_settings';
const CONTENT_COLLECTION_NAME = 'content';
const PROJECTS_COLLECTION_NAME = 'projects';
const EDUCATION_COLLECTION_NAME = 'education';
const CERTIFICATES_COLLECTION_NAME = 'certificates';
const SOFTSKILLS_COLLECTION_NAME = 'soft_skills';
const HARDSKILLS_COLLECTION_NAME = 'hard_skills';
const SOFTWARE_SKILLS_COLLECTION_NAME = 'software_skills';


// --- DOCUMENT ID FOR SINGLETONS ---
const MAIN_DOC_ID = new ObjectId('507f1f77bcf86cd799439011'); // Fixed ObjectId for main content

const EMPTY_DATA: PortfolioData = {
    name: "",
    title: { id: "Judul Portofolio Anda", en: "Your Portfolio Title" },
    about: { id: "Tuliskan sesuatu tentang diri Anda di sini.", en: "Write something about yourself here." },
    cvUrl: "",
    profilePictureUrl: "https://placehold.co/400x400.png",
    contact: {
        email: "",
        linkedin: ""
    },
    workProcessVariant: "digital-marketing",
    softSkills: [],
    hardSkills: [],
    softwareSkills: [],
    projects: [],
    education: [],
    certificates: []
};

// --- DATABASE CONNECTION & INITIALIZATION ---
let initializationPromise: Promise<void> | null = null;

const getDb = async (): Promise<Db> => {
    const client: MongoClient = await clientPromise;
    return client.db(DB_NAME);
};

const seedAdminUser = async (db: Db) => {
    const usersCollection = db.collection<User>(USERS_COLLECTION_NAME);
    const adminUsername = '082286514244';
    const adminUser = await usersCollection.findOne({ username: adminUsername });
    
    if (!adminUser) {
        console.log("Admin user not found, creating one...");
        const hashedPassword = await bcrypt.hash('wahyu-58321', 10);
        await usersCollection.insertOne({ username: adminUsername, password: hashedPassword });
        console.log("Admin user created successfully.");
    }
};

const ensureDbInitialized = async () => {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            try {
                const db = await getDb();
                await seedAdminUser(db);
            } catch (error) {
                console.error("Critical error during database initialization:", error);
                initializationPromise = null; 
                throw error;
            }
        })();
    }
    return initializationPromise;
};

// --- DATA SERIALIZATION ---
function serializeDoc<T>(doc: WithId<T>): T & { _id: string } {
    const { _id, ...rest } = doc;
    return { ...rest, _id: _id.toHexString() } as T & { _id: string };
}


// --- PUBLIC DATA ACCESS FUNCTIONS ---

export const getPortfolioData = async (): Promise<PortfolioData> => {
    noStore();
    await ensureDbInitialized();
    const db = await getDb();
    
    try {
        const mainContentCollection = db.collection<Omit<PortfolioData, 'projects' | 'education' | 'certificates' | 'softSkills' | 'hardSkills' | 'softwareSkills'>>(CONTENT_COLLECTION_NAME);
        
        let mainContent = await mainContentCollection.findOne({ _id: MAIN_DOC_ID });

        if (!mainContent) {
            console.warn("Main content not found. Seeding and re-fetching.");
            const { projects, education, certificates, softSkills, hardSkills, softwareSkills, ...emptyMainContent } = EMPTY_DATA;
            await mainContentCollection.insertOne({ _id: MAIN_DOC_ID, ...emptyMainContent });
            mainContent = await mainContentCollection.findOne({ _id: MAIN_DOC_ID });
            
            if (!mainContent) {
                console.error("FATAL: Could not create or find main content after seeding. Returning empty data.");
                return EMPTY_DATA;
            }
        }
        
        const projectsCollection = db.collection<Project>(PROJECTS_COLLECTION_NAME);
        const educationCollection = db.collection<EducationItem>(EDUCATION_COLLECTION_NAME);
        const certificatesCollection = db.collection<Certificate>(CERTIFICATES_COLLECTION_NAME);
        const softSkillsCollection = db.collection<{ name: string }>(SOFTSKILLS_COLLECTION_NAME);
        const hardSkillsCollection = db.collection<{ name: string }>(HARDSKILLS_COLLECTION_NAME);
        const softwareSkillsCollection = db.collection<SoftwareSkill>(SOFTWARE_SKILLS_COLLECTION_NAME);

        const [projects, education, certificates, softSkillsDocs, hardSkillsDocs, softwareSkillsDocs] = await Promise.all([
            projectsCollection.find({}).sort({_id: -1}).toArray(),
            educationCollection.find({}).sort({_id: -1}).toArray(),
            certificatesCollection.find({}).sort({_id: -1}).toArray(),
            softSkillsCollection.find({}).toArray(),
            hardSkillsCollection.find({}).toArray(),
            softwareSkillsCollection.find({}).toArray(),
        ]);

        return {
            name: mainContent.name,
            title: mainContent.title,
            about: mainContent.about,
            contact: mainContent.contact,
            cvUrl: mainContent.cvUrl,
            profilePictureUrl: mainContent.profilePictureUrl,
            projects: projects.map(serializeDoc),
            education: education.map(serializeDoc),
            certificates: certificates.map(serializeDoc),
            softSkills: softSkillsDocs.map(s => s.name),
            hardSkills: hardSkillsDocs.map(s => s.name),
            softwareSkills: softwareSkillsDocs.map(serializeDoc),
        };
    } catch (error) {
        console.error("Failed to get portfolio data, returning empty set:", error);
        return EMPTY_DATA;
    }
};

export const getUser = async (username: string): Promise<WithId<User> | null> => {
    await ensureDbInitialized();
    const db = await getDb();
    return db.collection<User>(USERS_COLLECTION_NAME).findOne({ username });
};


// --- GRANULAR UPDATE/CRUD FUNCTIONS (for Server Actions) ---

export async function updateMainContent(data: Omit<PortfolioData, 'projects' | 'education' | 'certificates' | 'softSkills' | 'hardSkills' | 'softwareSkills'>): Promise<void> {
    const db = await getDb();
    await db.collection(CONTENT_COLLECTION_NAME).updateOne(
        { _id: MAIN_DOC_ID },
        { $set: data },
        { upsert: true }
    );
}

export async function updateSimpleCollection(collectionName: 'soft_skills' | 'hard_skills', items: string[]): Promise<void> {
    const db = await getDb();
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    if (items && items.length > 0) {
        await collection.insertMany(items.map(name => ({ name })));
    }
}

export async function addDocument<T extends { _id?: string | ObjectId }>(collectionName: string, doc: Omit<T, '_id'>): Promise<T> {
    const db = await getDb();
    const result = await db.collection(collectionName).insertOne(doc as any);
    const newDoc = await db.collection(collectionName).findOne({ _id: result.insertedId });
    if (!newDoc) throw new Error("Failed to retrieve new document after insertion.");
    return serializeDoc(newDoc) as T;
}

export async function updateDocument<T extends { _id?: string | ObjectId }>(collectionName: string, id: string, doc: T): Promise<void> {
    const db = await getDb();
    const { _id, ...dataToUpdate } = doc;
    await db.collection(collectionName).updateOne(
        { _id: new ObjectId(id) },
        { $set: dataToUpdate }
    );
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
    const db = await getDb();
    await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
}
