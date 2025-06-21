
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

// --- DATABASE CONNECTION & HELPERS ---
let dbInstance: Db | null = null;
const getDb = async () => {
    if (dbInstance) return dbInstance;
    const client = await clientPromise;
    dbInstance = client.db(DB_NAME);
    return dbInstance;
};

// This function checks and creates a collection if it doesn't exist.
const ensureCollection = async (db: Db, collectionName: string) => {
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
        await db.createCollection(collectionName);
        console.log(`Collection '${collectionName}' created.`);
        return true; // Collection was created
    }
    return false; // Collection already existed
};

// This function populates a collection with default data only if it's empty.
const seedCollection = async <T>(collection: Collection<T>, data: T[]) => {
    const count = await collection.countDocuments();
    if (count === 0 && data.length > 0) {
        // @ts-ignore - InsertMany does not expect _id, but we need it for singleton
        await collection.insertMany(data);
        console.log(`Seeded collection '${collection.collectionName}' with ${data.length} documents.`);
    }
};

const initializeDefaultData = async (db: Db) => {
    console.log("Checking and initializing data if necessary.");
    try {
        // Ensure all collections exist
        await ensureCollection(db, USERS_COLLECTION_NAME);
        await ensureCollection(db, CONTENT_COLLECTION_NAME);
        await ensureCollection(db, PROJECTS_COLLECTION_NAME);
        await ensureCollection(db, EDUCATION_COLLECTION_NAME);
        await ensureCollection(db, CERTIFICATES_COLLECTION_NAME);
        await ensureCollection(db, SKILLS_COLLECTION_NAME);
        await ensureCollection(db, TOOLS_COLLECTION_NAME);

        // Seed data into collections if they are empty
        const usersCollection = db.collection<User>(USERS_COLLECTION_NAME);
        const adminUserCount = await usersCollection.countDocuments({ username: '085156453246' });
        if (adminUserCount === 0) {
            const hashedPassword = await bcrypt.hash('wahyu-58321', 10);
            await usersCollection.insertOne({
                username: '085156453246',
                password: hashedPassword
            });
            console.log("Default admin user created.");
        }

        const contentCollection = db.collection(CONTENT_COLLECTION_NAME);
        const mainContentCount = await contentCollection.countDocuments({ _id: MAIN_DOC_ID });
        if (mainContentCount === 0) {
            const { projects, education, certificates, skills, tools, ...mainContent } = DEFAULT_DATA;
            await contentCollection.insertOne({ _id: MAIN_DOC_ID, ...mainContent });
            console.log("Seeded main content.");
        }

        await seedCollection(db.collection(PROJECTS_COLLECTION_NAME), DEFAULT_DATA.projects);
        await seedCollection(db.collection(EDUCATION_COLLECTION_NAME), DEFAULT_DATA.education);
        await seedCollection(db.collection(CERTIFICATES_COLLECTION_NAME), DEFAULT_DATA.certificates);
        await seedCollection(db.collection(SKILLS_COLLECTION_NAME), DEFAULT_DATA.skills.map(name => ({ name })));
        await seedCollection(db.collection(TOOLS_COLLECTION_NAME), DEFAULT_DATA.tools.map(name => ({ name })));

        console.log("Database initialization check complete.");
    } catch (error) {
        console.error("An unexpected error occurred during data initialization:", error);
    }
};


// --- Initialization guard ---
let isInitialized = false;
const ensureInitialized = async () => {
    if (!isInitialized) {
        const db = await getDb();
        await initializeDefaultData(db);
        isInitialized = true;
    }
};

// --- PUBLIC DATA ACCESS FUNCTIONS ---

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        await ensureInitialized();
        const db = await getDb();

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
        return DEFAULT_DATA;
    }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    const client: MongoClient = await clientPromise;
    const session = client.startSession();

    try {
        console.log("Starting transaction to update portfolio data...");
        await session.withTransaction(async () => {
            const db = client.db(DB_NAME);

            const { name, title, about, contact, cvUrl, profilePictureUrl, projects, education, certificates, skills, tools } = data;

            // 1. Update the singleton main content document
            await db.collection(CONTENT_COLLECTION_NAME).updateOne(
                { _id: MAIN_DOC_ID },
                { $set: { name, title, about, contact, cvUrl, profilePictureUrl } },
                { upsert: true, session }
            );

            // 2. Helper to overwrite an entire collection
            const overwriteCollection = async (collectionName: string, items: any[], isSimpleArray = false) => {
                const collection = db.collection(collectionName);
                await collection.deleteMany({}, { session });
                if (items && items.length > 0) {
                    const documentsToInsert = isSimpleArray
                        ? items.map(name => ({ name }))
                        : items.map(item => {
                            const { _id, id, ...rest } = item; // Clean internal IDs
                            return rest;
                          });
                    if (documentsToInsert.length > 0) {
                       await collection.insertMany(documentsToInsert, { session });
                    }
                }
            };
            
            // 3. Overwrite each collection with new data
            await overwriteCollection(PROJECTS_COLLECTION_NAME, projects);
            await overwriteCollection(EDUCATION_COLLECTION_NAME, education);
            await overwriteCollection(CERTIFICATES_COLLECTION_NAME, certificates);
            await overwriteCollection(SKILLS_COLLECTION_NAME, skills, true);
            await overwriteCollection(TOOLS_COLLECTION_NAME, tools, true);
        });
        console.log("Transaction committed. Portfolio data updated successfully.");
    } catch (error) {
        console.error('Error during MongoDB transaction:', error);
        throw new Error('Could not update portfolio data due to a database transaction error.');
    } finally {
        await session.endSession();
        console.log("Transaction session ended.");
    }
};


export const getUser = async (username: string): Promise<WithId<User> | null> => {
    await ensureInitialized();
    const db = await getDb();
    return db.collection<User>(USERS_COLLECTION_NAME).findOne({ username });
};
