
import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate, User } from '@/lib/types';
import { Collection, Db, MongoClient, WithId } from 'mongodb';
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

// --- DEFAULT DATA STRUCTURES ---
const DEFAULT_DATA: PortfolioData = {
    name: "Wahyu Pratomo",
    title: "Digital Marketing Specialist & SEO Analyst",
    about: "I'm a passionate Digital Marketing specialist with a knack for SEO and content strategy. I thrive on data-driven insights to boost online visibility and drive meaningful engagement. Let's connect and create something amazing!",
    contact: {
        email: "mailto:wahyu.pratomo@example.com",
        linkedin: "https://linkedin.com/in/wahyu-pratomo"
    },
    cvUrl: "#",
    profilePictureUrl: "https://placehold.co/400x400.png",
    projects: [
        {
            title: "Kampanye Pemasaran Digital",
            description: "Meningkatkan brand awareness dan akuisisi pelanggan untuk klien e-commerce melalui strategi media sosial dan SEO yang komprehensif.",
            details: "Meningkatkan lalu lintas organik sebesar 40% dalam 6 bulan. Menjalankan kampanye iklan berbayar yang menghasilkan ROI 300%. Mengelola anggaran bulanan sebesar $5.000.",
            imageUrl: "https://placehold.co/600x400.png",
            imageHint: "marketing campaign",
            tags: ["Digital Marketing", "SEO", "Social Media"]
        },
    ],
    education: [
        { degree: "S1 Ilmu Komunikasi", school: "Universitas Gadjah Mada", period: "2018 - 2022" }
    ],
    certificates: [
        { name: "Google Analytics for Beginners", issuer: "Google", date: "Jan 2023", url: "#" }
    ],
    skills: [
        "Digital marketing", "Manajemen Proyek", "Ads Desain", "Kolaborasi Tim",
        "SEO Specialist", "Social Media Specialist", "Content Ads Creation"
    ],
    tools: [
        "Social Blade", "Canva", "Google Analytics", "Meta Business Suite", "Instagram Insights", "Figma"
    ]
};

// --- DATABASE CONNECTION & INITIALIZATION ---
let dbInstance: Db | null = null;
const getDb = async () => {
    if (dbInstance) return dbInstance;
    const client = await clientPromise;
    dbInstance = client.db(DB_NAME);
    return dbInstance;
};

// One-time setup function
const setupInitialDatabase = async (db: Db) => {
    console.log("Performing one-time database setup...");
    try {
        const hashedPassword = await bcrypt.hash('wahyu-58321', 10);
        await db.collection<User>(USERS_COLLECTION_NAME).updateOne(
            { username: '085156453246' },
            { $setOnInsert: { username: '085156453246', password: hashedPassword } },
            { upsert: true }
        );

        const { projects, education, certificates, skills, tools, ...mainContent } = DEFAULT_DATA;
        await db.collection(CONTENT_COLLECTION_NAME).updateOne(
            { _id: MAIN_DOC_ID },
            { $setOnInsert: { _id: MAIN_DOC_ID, ...mainContent } },
            { upsert: true }
        );

        const populateIfEmpty = async (collectionName: string, items: any[], isSimpleArray = false) => {
            const collection = db.collection(collectionName);
            const count = await collection.countDocuments();
            if (count === 0 && items.length > 0) {
                const documentsToInsert = isSimpleArray ? items.map(name => ({ name })) : items;
                await collection.insertMany(documentsToInsert.map(d => ({...d})));
            }
        };

        await populateIfEmpty(PROJECTS_COLLECTION_NAME, projects);
        await populateIfEmpty(EDUCATION_COLLECTION_NAME, education);
        await populateIfEmpty(CERTIFICATES_COLLECTION_NAME, certificates);
        await populateIfEmpty(SKILLS_COLLECTION_NAME, skills, true);
        await populateIfEmpty(TOOLS_COLLECTION_NAME, tools, true);
        
        console.log("Database setup complete.");
    } catch (error) {
        console.error("Critical error during one-time database setup:", error);
        throw new Error("Database initialization failed.");
    }
};

// Singleton promise to ensure initialization runs only once.
let initializationPromise: Promise<void> | null = null;
const ensureInitialized = async () => {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            const db = await getDb();
            const mainContent = await db.collection(CONTENT_COLLECTION_NAME).findOne({ _id: MAIN_DOC_ID });
            if (!mainContent) {
                await setupInitialDatabase(db);
            }
        })();
    }
    await initializationPromise;
};

// --- PUBLIC DATA ACCESS FUNCTIONS ---

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        await ensureInitialized();
        const db = await getDb();

        const [mainContent, projects, education, certificates, skillsDocs, toolsDocs] = await Promise.all([
            db.collection<PortfolioData>(CONTENT_COLLECTION_NAME).findOne({ _id: MAIN_DOC_ID }),
            db.collection<Project>(PROJECTS_COLLECTION_NAME).find({}).toArray(),
            db.collection<EducationItem>(EDUCATION_COLLECTION_NAME).find({}).toArray(),
            db.collection<Certificate>(CERTIFICATES_COLLECTION_NAME).find({}).toArray(),
            db.collection(SKILLS_COLLECTION_NAME).find({}, { projection: { name: 1, _id: 0 } }).toArray(),
            db.collection(TOOLS_COLLECTION_NAME).find({}, { projection: { name: 1, _id: 0 } }).toArray(),
        ]);

        if (!mainContent) {
            console.error("Main content not found after initialization, returning default data.");
            return DEFAULT_DATA;
        }

        const cleanDocs = (docs: WithId<any>[]) => docs.map(({ _id, ...rest }) => rest);

        return {
            ...DEFAULT_DATA, // Start with defaults to ensure all keys exist
            name: mainContent.name,
            title: mainContent.title,
            about: mainContent.about,
            contact: mainContent.contact,
            cvUrl: mainContent.cvUrl,
            profilePictureUrl: mainContent.profilePictureUrl,
            projects: cleanDocs(projects),
            education: cleanDocs(education),
            certificates: cleanDocs(certificates),
            skills: skillsDocs.map(s => s.name),
            tools: toolsDocs.map(t => t.name),
        };
    } catch (error) {
        console.error("Failed to get portfolio data, returning default set:", error);
        return DEFAULT_DATA;
    }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    await ensureInitialized();
    const client: MongoClient = await clientPromise;
    const session = client.startSession();

    try {
        await session.withTransaction(async () => {
            const db = client.db(DB_NAME);
            const { name, title, about, contact, cvUrl, profilePictureUrl, projects, education, certificates, skills, tools } = data;

            await db.collection(CONTENT_COLLECTION_NAME).updateOne(
                { _id: MAIN_DOC_ID },
                { $set: { name, title, about, contact, cvUrl, profilePictureUrl } },
                { upsert: true, session }
            );

            const overwriteCollection = async (collectionName: string, items: any[], isSimpleArray = false) => {
                const collection = db.collection(collectionName);
                await collection.deleteMany({}, { session });
                if (items && items.length > 0) {
                    const documentsToInsert = isSimpleArray
                        ? items.map(name => ({ name }))
                        : items.map(item => { const { _id, id, ...rest } = item; return rest; });
                    if (documentsToInsert.length > 0) {
                        await collection.insertMany(documentsToInsert, { session });
                    }
                }
            };
            
            await overwriteCollection(PROJECTS_COLLECTION_NAME, projects);
            await overwriteCollection(EDUCATION_COLLECTION_NAME, education);
            await overwriteCollection(CERTIFICATES_COLLECTION_NAME, certificates);
            await overwriteCollection(SKILLS_COLLECTION_NAME, skills, true);
            await overwriteCollection(TOOLS_COLLECTION_NAME, tools, true);
        });
    } catch (error) {
        console.error('Error during MongoDB transaction:', error);
        throw new Error('Could not update portfolio data due to a database transaction error.');
    } finally {
        await session.endSession();
    }
};

export const getUser = async (username: string): Promise<WithId<User> | null> => {
    await ensureInitialized();
    const db = await getDb();
    return db.collection<User>(USERS_COLLECTION_NAME).findOne({ username });
};

    