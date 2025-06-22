
import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate, User } from '@/lib/types';
import { Collection, Db, MongoClient, WithId, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// --- DATABASE & COLLECTION CONSTANTS ---
const DB_NAME = 'portfolioDB';
const USERS_COLLECTION_NAME = 'profil_settings';
const CONTENT_COLLECTION_NAME = 'content';
const PROJECTS_COLLECTION_NAME = 'projects';
const SKILLS_COLLECTION_NAME = 'skills';
const EDUCATION_COLLECTION_NAME = 'education';
const CERTIFICATES_COLLECTION_NAME = 'certificates';
const TOOLS_COLLECTION_NAME = 'tools';

// --- DOCUMENT ID FOR SINGLETONS ---
const MAIN_DOC_ID = 'main_content';

const EMPTY_DATA: PortfolioData = {
    name: "",
    title: "",
    about: "",
    cvUrl: "",
    profilePictureUrl: "https://placehold.co/400x400.png",
    contact: {
        email: "",
        linkedin: ""
    },
    skills: [],
    tools: [],
    projects: [],
    education: [],
    certificates: []
};

// --- DATABASE CONNECTION & INITIALIZATION ---
let db: Db;
let client: MongoClient;
let initializationPromise: Promise<void> | null = null;

const getDb = async () => {
    if (db) return db;
    client = await clientPromise;
    db = client.db(DB_NAME);
    return db;
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

const seedEmptyContent = async (db: Db) => {
    const contentCollection = db.collection(CONTENT_COLLECTION_NAME);
    const mainContentExists = await contentCollection.countDocuments({ _id: MAIN_DOC_ID }) > 0;

    if (!mainContentExists) {
        console.log("Main content not found, seeding empty data structure...");
        const { projects, education, certificates, skills, tools, ...emptyMainContent } = EMPTY_DATA;
        
        await contentCollection.insertOne({ _id: MAIN_DOC_ID, ...emptyMainContent });
        console.log("Empty data structure seeded successfully.");
    }
};

const ensureDbInitialized = async () => {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            try {
                const db = await getDb();
                await seedAdminUser(db);
                await seedEmptyContent(db);
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
    await ensureDbInitialized();
    const db = await getDb();
    
    try {
        const mainContentCollection = db.collection<Omit<PortfolioData, 'projects' | 'education' | 'certificates' | 'skills' | 'tools'>>(CONTENT_COLLECTION_NAME);
        const projectsCollection = db.collection<Project>(PROJECTS_COLLECTION_NAME);
        const educationCollection = db.collection<EducationItem>(EDUCATION_COLLECTION_NAME);
        const certificatesCollection = db.collection<Certificate>(CERTIFICATES_COLLECTION_NAME);
        const skillsCollection = db.collection<{ name: string }>(SKILLS_COLLECTION_NAME);
        const toolsCollection = db.collection<{ name: string }>(TOOLS_COLLECTION_NAME);

        const [mainContent, projects, education, certificates, skillsDocs, toolsDocs] = await Promise.all([
            mainContentCollection.findOne({ _id: MAIN_DOC_ID }),
            projectsCollection.find({}).sort({_id: -1}).toArray(),
            educationCollection.find({}).sort({_id: -1}).toArray(),
            certificatesCollection.find({}).sort({_id: -1}).toArray(),
            skillsCollection.find({}).toArray(),
            toolsCollection.find({}).toArray(),
        ]);

        if (!mainContent) {
            console.warn("Main content not found after initialization. Returning empty data.");
            return EMPTY_DATA;
        }

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
            skills: skillsDocs.map(s => s.name),
            tools: toolsDocs.map(t => t.name),
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

export async function updateMainContent(data: Omit<PortfolioData, 'projects' | 'education' | 'certificates' | 'skills' | 'tools'>): Promise<void> {
    const db = await getDb();
    await db.collection(CONTENT_COLLECTION_NAME).updateOne(
        { _id: MAIN_DOC_ID },
        { $set: data },
        { upsert: true }
    );
}

export async function updateSimpleCollection(collectionName: 'skills' | 'tools', items: string[]): Promise<void> {
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
