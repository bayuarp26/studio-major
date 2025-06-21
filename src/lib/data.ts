
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

const seedDefaultContent = async (db: Db) => {
    const contentCollection = db.collection(CONTENT_COLLECTION_NAME);
    const mainContentExists = await contentCollection.countDocuments({ _id: MAIN_DOC_ID }) > 0;

    if (!mainContentExists) {
        console.log("Main content not found, seeding default data...");
        const { projects, education, certificates, skills, tools, ...defaultMainContent } = DEFAULT_DATA;
        
        await contentCollection.insertOne({ _id: MAIN_DOC_ID, ...defaultMainContent });

        const populateIfEmpty = async (collectionName: string, items: any[], isSimpleArray = false) => {
            const collection = db.collection(collectionName);
            const count = await collection.countDocuments();
            if (count === 0 && items.length > 0) {
                const documentsToInsert = isSimpleArray ? items.map(name => ({ name })) : items.map(d => ({ ...d }));
                if (documentsToInsert.length > 0) {
                    await collection.insertMany(documentsToInsert);
                }
            }
        };

        await populateIfEmpty(PROJECTS_COLLECTION_NAME, projects);
        await populateIfEmpty(EDUCATION_COLLECTION_NAME, education);
        await populateIfEmpty(CERTIFICATES_COLLECTION_NAME, certificates);
        await populateIfEmpty(SKILLS_COLLECTION_NAME, skills, true);
        await populateIfEmpty(TOOLS_COLLECTION_NAME, tools, true);
        console.log("Default content seeded successfully.");
    }
};

const ensureDbInitialized = async () => {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            try {
                const db = await getDb();
                await seedAdminUser(db);
                await seedDefaultContent(db);
            } catch (error) {
                console.error("Critical error during database initialization:", error);
                initializationPromise = null; 
                throw error;
            }
        })();
    }
    return initializationPromise;
};

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
            projectsCollection.find({}).toArray(),
            educationCollection.find({}).toArray(),
            certificatesCollection.find({}).toArray(),
            skillsCollection.find({}).toArray(),
            toolsCollection.find({}).toArray(),
        ]);

        if (!mainContent) {
            console.error("Main content not found after initialization. Returning default data.");
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
            skills: skillsDocs.map(s => s.name),
            tools: toolsDocs.map(t => t.name),
        };
    } catch (error) {
        console.error("Failed to get portfolio data, returning default set:", error);
        return DEFAULT_DATA;
    }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    await ensureDbInitialized();
    const db = await getDb();
    const client = await clientPromise;
    
    // --- SERVER-SIDE DATA SANITIZATION ---
    // This is the definitive fix: we create clean data objects on the server,
    // ensuring no extraneous properties from the frontend (like react-hook-form's 'id')
    // are ever passed into the database transaction.
    
    const cleanProjects = (data.projects || []).map(p => ({
        title: p.title,
        imageUrl: p.imageUrl,
        imageHint: p.imageHint,
        description: p.description,
        details: p.details,
        tags: p.tags,
    }));

    const cleanEducation = (data.education || []).map(e => ({
        degree: e.degree,
        school: e.school,
        period: e.period,
    }));

    const cleanCertificates = (data.certificates || []).map(c => ({
        name: c.name,
        issuer: c.issuer,
        date: c.date,
        url: c.url,
    }));
    
    const mainContentData = {
        name: data.name,
        title: data.title,
        about: data.about,
        contact: data.contact,
        cvUrl: data.cvUrl,
        profilePictureUrl: data.profilePictureUrl,
    };
    
    const session = client.startSession();

    try {
        await session.withTransaction(async () => {
            await db.collection(CONTENT_COLLECTION_NAME).updateOne(
                { _id: MAIN_DOC_ID },
                { $set: mainContentData },
                { upsert: true, session }
            );

            const overwriteCollection = async (collection: Collection<any>, items: any[], isSimpleArray = false) => {
                await collection.deleteMany({}, { session });
                if (items.length > 0) {
                    const documentsToInsert = isSimpleArray ? items.map(name => ({ name })) : items;
                    await collection.insertMany(documentsToInsert, { session });
                }
            };
            
            await overwriteCollection(db.collection(PROJECTS_COLLECTION_NAME), cleanProjects);
            await overwriteCollection(db.collection(EDUCATION_COLLECTION_NAME), cleanEducation);
            await overwriteCollection(db.collection(CERTIFICATES_COLLECTION_NAME), cleanCertificates);
            await overwriteCollection(db.collection(SKILLS_COLLECTION_NAME), data.skills || [], true);
            await overwriteCollection(db.collection(TOOLS_COLLECTION_NAME), data.tools || [], true);
        });
    } catch (error) {
        console.error('Error during MongoDB transaction:', error);
        throw new Error('Could not update portfolio data due to a database transaction error.');
    } finally {
        await session.endSession();
    }
};

export const getUser = async (username: string): Promise<WithId<User> | null> => {
    await ensureDbInitialized();
    const db = await getDb();
    return db.collection<User>(USERS_COLLECTION_NAME).findOne({ username });
};
