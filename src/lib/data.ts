
import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate } from '@/lib/types';
import { Collection, Db, MongoClient, WithId } from 'mongodb';

// --- DATABASE & COLLECTION CONSTANTS ---
const DB_NAME = 'portfolioDB';
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

// --- DATABASE CONNECTION & HELPERS ---
let dbInstance: Db | null = null;
const getDb = async () => {
    if (dbInstance) return dbInstance;
    const client = await clientPromise;
    dbInstance = client.db(DB_NAME);
    return dbInstance;
};

// --- DATA INITIALIZATION ---
// This function runs once to ensure the database is seeded.
const initializeData = async (db: Db) => {
    console.log("Checking database initialization...");
    const contentCollection = db.collection<PortfolioData>(CONTENT_COLLECTION_NAME);
    const mainContent = await contentCollection.findOne({ _id: MAIN_DOC_ID });

    if (!mainContent) {
        console.log("Database is empty. Seeding with default data...");
        // Use a temporary structure to match PortfolioData for the singleton doc
        const singletonDoc = {
            _id: MAIN_DOC_ID,
            name: DEFAULT_DATA.name,
            title: DEFAULT_DATA.title,
            about: DEFAULT_DATA.about,
            contact: DEFAULT_DATA.contact,
            cvUrl: DEFAULT_DATA.cvUrl,
            profilePictureUrl: DEFAULT_DATA.profilePictureUrl,
        };
        await contentCollection.insertOne(singletonDoc as any);
        if (DEFAULT_DATA.projects.length > 0) await db.collection(PROJECTS_COLLECTION_NAME).insertMany(DEFAULT_DATA.projects);
        if (DEFAULT_DATA.education.length > 0) await db.collection(EDUCATION_COLLECTION_NAME).insertMany(DEFAULT_DATA.education);
        if (DEFAULT_DATA.certificates.length > 0) await db.collection(CERTIFICATES_COLLECTION_NAME).insertMany(DEFAULT_DATA.certificates);
        if (DEFAULT_DATA.skills.length > 0) await db.collection(SKILLS_COLLECTION_NAME).insertMany(DEFAULT_DATA.skills.map(name => ({ name })));
        if (DEFAULT_DATA.tools.length > 0) await db.collection(TOOLS_COLLECTION_NAME).insertMany(DEFAULT_DATA.tools.map(name => ({ name })));
        console.log("Database seeded successfully.");
    } else {
        console.log("Database already initialized.");
    }
};

let isInitialized = false;
const ensureInitialized = async (db: Db) => {
    if (!isInitialized) {
        await initializeData(db);
        isInitialized = true;
    }
};

// --- PUBLIC DATA ACCESS FUNCTIONS ---

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        const db = await getDb();
        await ensureInitialized(db);

        const contentCollection = db.collection<PortfolioData>(CONTENT_COLLECTION_NAME);
        const mainContent = await contentCollection.findOne({ _id: MAIN_DOC_ID });

        const projects = await db.collection<Project>(PROJECTS_COLLECTION_NAME).find({}).toArray();
        const education = await db.collection<EducationItem>(EDUCATION_COLLECTION_NAME).find({}).toArray();
        const certificates = await db.collection<Certificate>(CERTIFICATES_COLLECTION_NAME).find({}).toArray();
        const skills = (await db.collection(SKILLS_COLLECTION_NAME).find({}, { projection: { name: 1, _id: 0 } }).toArray()).map(s => s.name);
        const tools = (await db.collection(TOOLS_COLLECTION_NAME).find({}, { projection: { name: 1, _id: 0 } }).toArray()).map(t => t.name);

        if (!mainContent) {
            console.error("Main content not found, returning default data.");
            return DEFAULT_DATA;
        }

        // Clean up the _id field from sub-documents
        const cleanDocs = (docs: WithId<any>[]) => docs.map(({ _id, ...rest }) => rest);

        return {
            name: mainContent.name,
            title: mainContent.title,
            about: mainContent.about,
            contact: mainContent.contact,
            cvUrl: mainContent.cvUrl,
            profilePictureUrl: mainContent.profilePictureUrl,
            projects: cleanDocs(projects),
            education: cleanDocs(education),
            certificates: cleanDocs(certificates),
            skills,
            tools,
        };
    } catch (error) {
        console.error("Failed to get portfolio data, returning default set:", error);
        return DEFAULT_DATA; // Fallback to default data on error
    }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    const client: MongoClient = await clientPromise;
    const session = client.startSession();

    try {
        await session.withTransaction(async () => {
            const db = client.db(DB_NAME);

            // 1. Update the singleton document with main content
            const { name, title, about, contact, cvUrl, profilePictureUrl } = data;
            await db.collection(CONTENT_COLLECTION_NAME).updateOne(
                { _id: MAIN_DOC_ID },
                { $set: { name, title, about, contact, cvUrl, profilePictureUrl } },
                { upsert: true, session }
            );

            // 2. Overwrite array-based collections
            const overwriteCollection = async (collectionName: string, items: any[], isSimpleArray = false) => {
                const collection = db.collection(collectionName);
                await collection.deleteMany({}, { session }); // Clear the collection
                if (items && items.length > 0) {
                    const documentsToInsert = isSimpleArray
                        ? items.map(name => ({ name }))
                        : items.map(item => {
                            // Ensure no unwanted _id or id fields are inserted
                            const { _id, id, ...rest } = item;
                            return rest;
                          });
                    if (documentsToInsert.length > 0) {
                       await collection.insertMany(documentsToInsert, { session });
                    }
                }
            };
            
            await overwriteCollection(PROJECTS_COLLECTION_NAME, data.projects);
            await overwriteCollection(EDUCATION_COLLECTION_NAME, data.education);
            await overwriteCollection(CERTIFICATES_COLLECTION_NAME, data.certificates);
            await overwriteCollection(SKILLS_COLLECTION_NAME, data.skills, true);
            await overwriteCollection(TOOLS_COLLECTION_NAME, data.tools, true);
        });
        console.log("Portfolio data updated successfully within a transaction.");
    } catch (error) {
        console.error('Error during MongoDB transaction:', error);
        throw new Error('Could not update portfolio data due to a database transaction error.');
    } finally {
        await session.endSession();
    }
};
