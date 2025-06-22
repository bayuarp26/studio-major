
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

const DEFAULT_DATA: PortfolioData = {
    name: "Wahyu Pratomo",
    title: "Digital Marketing Specialist & Web Developer",
    about: "Saya seorang spesialis pemasaran digital dengan hasrat untuk teknologi dan pengembangan web. Dengan pengalaman dalam SEO, SEM, dan media sosial, saya membantu merek mencapai potensi online mereka. Saya juga terampil dalam membangun situs web yang responsif dan ramah pengguna.",
    cvUrl: "#",
    profilePictureUrl: "https://placehold.co/400x400.png",
    contact: {
        email: "mailto:your.email@example.com",
        linkedin: "https://www.linkedin.com/in/your-profile/"
    },
    skills: ["SEO", "SEM", "Google Analytics", "Content Marketing", "React", "Next.js", "Node.js"],
    tools: ["Google Ads", "SEMrush", "Ahrefs", "Facebook Ads Manager", "Figma", "VS Code"],
    projects: [
        {
            title: "Optimasi SEO untuk E-Commerce",
            imageUrl: "https://placehold.co/600x400.png",
            imageHint: "seo analytics",
            description: "Meningkatkan peringkat pencarian organik sebesar 200% untuk klien e-commerce terkemuka.",
            details: "Melakukan riset kata kunci, optimasi on-page dan off-page, serta membangun backlink berkualitas.",
            tags: ["SEO", "E-commerce"]
        },
        {
            title: "Aplikasi Web Portofolio",
            imageUrl: "https://placehold.co/600x400.png",
            imageHint: "web development code",
            description: "Membangun aplikasi portofolio pribadi menggunakan Next.js dan Tailwind CSS.",
            details: "Fitur termasuk desain responsif, sistem manajemen konten (CMS) kustom, dan integrasi API.",
            tags: ["Next.js", "React", "Tailwind CSS"]
        }
    ],
    education: [
        {
            degree: "Sarjana Ilmu Komputer",
            school: "Universitas Teknologi",
            period: "2018 - 2022"
        }
    ],
    certificates: [
        {
            name: "Google Analytics Individual Qualification",
            issuer: "Google",
            date: "2023",
            url: "#"
        },
        {
            name: "Certified Full-Stack Web Developer",
            issuer: "Dicoding",
            date: "2022",
            url: "#"
        }
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
            tools: toolsDocs.map(t => s.name),
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
    
    // The incoming 'data' is now trusted to be a clean payload from AdminForm.tsx.
    const { projects, education, certificates, skills, tools, ...mainContentData } = data;
    
    const session = client.startSession();

    try {
        await session.withTransaction(async () => {
            // Update the main document with general info
            await db.collection(CONTENT_COLLECTION_NAME).updateOne(
                { _id: MAIN_DOC_ID },
                { $set: mainContentData },
                { upsert: true, session }
            );

            // Helper function to overwrite an entire collection with new data.
            // This is the most robust way to handle updates for these arrays.
            const overwriteCollection = async (collectionName: string, items: any[], isSimpleArray = false) => {
                const collection = db.collection(collectionName);
                await collection.deleteMany({}, { session });
                if (items && items.length > 0) {
                    const documentsToInsert = isSimpleArray 
                        ? items.map(name => ({ name })) 
                        : items.map(item => { return { ...item }; }); // Already clean from AdminForm

                    if (documentsToInsert.length > 0) {
                        await collection.insertMany(documentsToInsert, { session });
                    }
                }
            };
            
            // Overwrite each related collection with the new, clean data
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
    await ensureDbInitialized();
    const db = await getDb();
    return db.collection<User>(USERS_COLLECTION_NAME).findOne({ username });
};
