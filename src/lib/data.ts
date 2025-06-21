import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate } from '@/lib/types';

// Constants for database and collection names
const DB_NAME = 'portfolioDB';
const CONTENT_COLLECTION_NAME = 'content';
const PROFILE_SETTINGS_COLLECTION_NAME = 'profile_settings';
const PROJECT_COLLECTION_NAME = 'projects';
const SKILLS_COLLECTION_NAME = 'skills';
const EDUCATION_COLLECTION_NAME = 'education';
const CERTIFICATES_COLLECTION_NAME = 'certificates';
const TOOLS_COLLECTION_NAME = 'tools';
const DOC_ID = 'main'; // Use a consistent ID for singleton documents

// --- DEFAULT DATA ---
// This data is used to populate the database on the very first run.

const defaultMainData = {
    name: "Wahyu Pratomo",
    title: "Digital Marketing Specialist & SEO Analyst",
    about: "I'm a passionate Digital Marketing specialist with a knack for SEO and content strategy. I thrive on data-driven insights to boost online visibility and drive meaningful engagement. Let's connect and create something amazing!",
    contact: {
        email: "mailto:wahyu.pratomo@example.com",
        linkedin: "https://linkedin.com/in/wahyu-pratomo"
    },
};

const defaultProfileSettings = {
    cvUrl: "#",
    profilePictureUrl: "https://placehold.co/400x400.png",
};

const defaultProjects: Omit<Project, '_id'>[] = [
    {
        title: "Kampanye Harisenin.com",
        description: "Meningkatkan kesadaran merek dan akuisisi pelanggan untuk Harisenin.com melalui strategi media sosial yang komprehensif. Bertanggung jawab untuk meningkatkan copywriting, hook, dan desain konten yang menarik bagi audiens target.",
        details: "Tujuan: Meningkatkan kesadaran merek dan produk melalui media sosial.\nStrategi: Meningkatkan copywriting, hook, dan desain konten. Menarik audiens.\nHasil: Pertumbuhan follower (+30%), jangkauan brand (100.000+), engagement (5%+), leads baru (100+).",
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "marketing campaign",
        tags: ["Social Media", "Copywriting", "Content Strategy", "Campaign Management"]
    },
    {
        title: "Identitas Merek TEMA Coffee & Space",
        description: "Mengembangkan identitas merek yang kuat untuk TEMA Coffee & Space dengan melakukan analisis pasar mendalam dan riset audiens. Fokus pada penguatan posisi pasar dan pengembangan pesan yang resonan.",
        details: "Analisis Merek: Memperkuat posisi pasar TEMA.\nRiset Audiens: Menarik pelanggan baru.\nPengembangan Pesan: Meningkatkan kesadaran merek dan penjualan.",
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "brand design",
        tags: ["Branding", "Market Research", "Strategy"]
    },
    {
        title: "Analisis Media Sosial TukangSayur.co",
        description: "Melakukan analisis mendalam terhadap performa media sosial TukangSayur.co di platform Instagram. Memberikan rekomendasi strategis berdasarkan data untuk peningkatan engagement dan pertumbuhan.",
        details: "Analisis Competitor: Mengidentifikasi kekuatan dan kelemahan.\nAnalisis Konten: Menemukan format konten paling efektif.\nRekomendasi: Memberikan saran untuk optimasi strategi.",
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "data analytics",
        tags: ["Social Media Analysis", "Instagram", "Data Analytics"]
    }
];

const defaultEducation: Omit<EducationItem, '_id'>[] = [
    { degree: "S1 Ilmu Komunikasi", school: "Universitas Gadjah Mada", period: "2018 - 2022" }
];

const defaultCertificates: Omit<Certificate, '_id'>[] = [
    { name: "Google Analytics for Beginners", issuer: "Google", date: "Jan 2023", url: "#" }
];

const defaultSkills: string[] = [
    "Digital marketing", "Manajemen Proyek", "Ads Desain", "Kolaborasi Tim", 
    "SEO Specialist", "Social Media Specialist", "Content Ads Creation"
];

const defaultTools: string[] = [
  "Social Blade", "Canva", "Google Analytics", "Meta Business Suite", "Instagram Insights", "Figma"
];


// --- DATABASE FUNCTIONS ---

const getDb = async () => {
    const client = await clientPromise;
    return client.db(DB_NAME);
};

/**
 * Initializes the database with default data if it's empty.
 * This function is idempotent and safe to call on every data fetch.
 */
const initializeDefaultData = async () => {
    const db = await getDb();
    
    // An array of promises to run initialization checks in parallel
    const initPromises = [
        async () => {
            const collection = db.collection(CONTENT_COLLECTION_NAME);
            if (await collection.countDocuments() === 0) {
                await collection.insertOne({ docId: DOC_ID, ...defaultMainData });
            }
        },
        async () => {
            const collection = db.collection(PROFILE_SETTINGS_COLLECTION_NAME);
            if (await collection.countDocuments() === 0) {
                await collection.insertOne({ docId: DOC_ID, ...defaultProfileSettings });
            }
        },
        async () => {
            const collection = db.collection(PROJECT_COLLECTION_NAME);
            if (await collection.countDocuments() === 0) {
                await collection.insertMany(defaultProjects);
            }
        },
        async () => {
            const collection = db.collection(EDUCATION_COLLECTION_NAME);
            if (await collection.countDocuments() === 0) {
                await collection.insertMany(defaultEducation);
            }
        },
        async () => {
            const collection = db.collection(CERTIFICATES_COLLECTION_NAME);
            if (await collection.countDocuments() === 0) {
                await collection.insertMany(defaultCertificates);
            }
        },
        async () => {
            const collection = db.collection(SKILLS_COLLECTION_NAME);
            if (await collection.countDocuments() === 0) {
                await collection.insertMany(defaultSkills.map(name => ({ name })));
            }
        },
        async () => {
            const collection = db.collection(TOOLS_COLLECTION_NAME);
            if (await collection.countDocuments() === 0) {
                await collection.insertMany(defaultTools.map(name => ({ name })));
            }
        }
    ];
    
    try {
        // Wait for all initialization checks to complete
        await Promise.all(initPromises.map(p => p()));
    } catch (error) {
        console.error("Error during database initialization:", error);
        // We throw the error to be handled by the caller, which will prevent the app from crashing.
        throw new Error('Could not initialize database.');
    }
};

/**
 * Fetches all portfolio data from the database.
 * Ensures the database is initialized before fetching.
 */
export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        await initializeDefaultData();
        const db = await getDb();

        const mainDataDoc = await db.collection(CONTENT_COLLECTION_NAME).findOne({ docId: DOC_ID });
        const profileSettingsDoc = await db.collection(PROFILE_SETTINGS_COLLECTION_NAME).findOne({ docId: DOC_ID });
        
        // Fetch all documents from array-based collections
        const projectsFromDb = await db.collection(PROJECT_COLLECTION_NAME).find({}).toArray();
        const skillsFromDb = await db.collection(SKILLS_COLLECTION_NAME).find({}).toArray();
        const educationFromDb = await db.collection(EDUCATION_COLLECTION_NAME).find({}).toArray();
        const certificatesFromDb = await db.collection(CERTIFICATES_COLLECTION_NAME).find({}).toArray();
        const toolsFromDb = await db.collection(TOOLS_COLLECTION_NAME).find({}).toArray();

        // Destructure and remove MongoDB's internal _id and our docId
        const { _id: mainId, docId: mainDocId, ...mainData } = mainDataDoc || {};
        const { _id: profileId, docId: profileDocId, ...profileSettings } = profileSettingsDoc || {};

        // Assemble the final data object, providing defaults if data is missing
        return {
            name: mainData.name || defaultMainData.name,
            title: mainData.title || defaultMainData.title,
            about: mainData.about || defaultMainData.about,
            contact: { ...defaultMainData.contact, ...mainData.contact },
            cvUrl: profileSettings.cvUrl || defaultProfileSettings.cvUrl,
            profilePictureUrl: profileSettings.profilePictureUrl || defaultProfileSettings.profilePictureUrl,
            projects: projectsFromDb.map(({ _id, ...p }: any) => p as Project),
            skills: skillsFromDb.map((s: any) => s.name),
            education: educationFromDb.map(({ _id, ...e }: any) => e as EducationItem),
            certificates: certificatesFromDb.map(({ _id, ...c }: any) => c as Certificate),
            tools: toolsFromDb.map((t: any) => t.name),
        };
    } catch (error) {
        console.error("Failed to get portfolio data:", error);
        // In case of a failure, return the default data to prevent the app from crashing.
        return {
            name: "Wahyu Pratomo",
            title: "Digital Marketing Specialist & SEO Analyst",
            about: "I'm a passionate Digital Marketing specialist with a knack for SEO and content strategy. I thrive on data-driven insights to boost online visibility and drive meaningful engagement. Let's connect and create something amazing!",
            contact: {
                email: "mailto:wahyu.pratomo@example.com",
                linkedin: "https://linkedin.com/in/wahyu-pratomo"
            },
            cvUrl: "#",
            profilePictureUrl: "https://placehold.co/400x400.png",
            projects: defaultProjects,
            skills: defaultSkills,
            education: defaultEducation,
            certificates: defaultCertificates,
            tools: defaultTools,
        };
    }
};

/**
 * Updates the entire portfolio data in the database.
 * This uses a "replace all" strategy for simplicity.
 */
export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    try {
        const db = await getDb();
        const { projects, skills, education, certificates, tools, cvUrl, profilePictureUrl, ...mainData } = data;

        // Update single-document collections
        await db.collection(CONTENT_COLLECTION_NAME).updateOne(
            { docId: DOC_ID },
            { $set: mainData },
            { upsert: true } // Creates the document if it doesn't exist
        );

        await db.collection(PROFILE_SETTINGS_COLLECTION_NAME).updateOne(
            { docId: DOC_ID },
            { $set: { cvUrl, profilePictureUrl } },
            { upsert: true }
        );

        // Helper function for replacing all items in a collection
        const replaceCollection = async (collectionName: string, items: any[]) => {
            const collection = db.collection(collectionName);
            await collection.deleteMany({}); // Clear the collection
            if (items && items.length > 0) {
                // The data from the form is clean and does not have MongoDB's _id
                await collection.insertMany(items);
            }
        };
        
        // Helper for collections that just store a list of names
        const replaceSimpleCollection = async (collectionName: string, items: string[]) => {
            const collection = db.collection(collectionName);
            await collection.deleteMany({});
            if (items && items.length > 0) {
                await collection.insertMany(items.map(name => ({ name })));
            }
        };

        // Execute all updates
        await Promise.all([
            replaceCollection(PROJECT_COLLECTION_NAME, projects),
            replaceSimpleCollection(SKILLS_COLLECTION_NAME, skills),
            replaceCollection(EDUCATION_COLLECTION_NAME, education),
            replaceCollection(CERTIFICATES_COLLECTION_NAME, certificates),
            replaceSimpleCollection(TOOLS_COLLECTION_NAME, tools)
        ]);

    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw new Error('Could not update portfolio data in MongoDB.');
    }
};

    