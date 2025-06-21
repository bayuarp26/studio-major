
import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate } from '@/lib/types';
import { Collection } from 'mongodb';

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
        title: "Kampanye Pemasaran Digital",
        description: "Meningkatkan brand awareness dan akuisisi pelanggan untuk klien e-commerce melalui strategi media sosial dan SEO yang komprehensif.",
        details: "Meningkatkan lalu lintas organik sebesar 40% dalam 6 bulan. Menjalankan kampanye iklan berbayar yang menghasilkan ROI 300%. Mengelola anggaran bulanan sebesar $5.000.",
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "marketing campaign",
        tags: ["Digital Marketing", "SEO", "Social Media"]
    },
    {
        title: "Identitas Merek untuk Startup Kopi",
        description: "Mengembangkan identitas merek yang kuat untuk startup kopi lokal, termasuk desain logo, pedoman merek, dan strategi peluncuran.",
        details: "Melakukan analisis pasar dan riset audiens. Menciptakan pesan merek yang beresonansi dengan target pasar. Merancang semua materi agunan pemasaran.",
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "brand design",
        tags: ["Branding", "Market Research", "Strategy"]
    },
    {
        title: "Analisis Media Sosial",
        description: "Melakukan analisis mendalam terhadap kinerja media sosial untuk klien teknologi, memberikan wawasan dan rekomendasi yang dapat ditindaklanjuti.",
        details: "Menganalisis metrik keterlibatan di berbagai platform. Mengidentifikasi tren konten dan demografi audiens. Memberikan laporan bulanan dengan saran untuk perbaikan.",
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

// A flag to ensure initialization only runs once per server instance.
let isInitialized = false;

const initializeDefaultData = async () => {
    if (isInitialized) {
        return;
    }
    console.log("Checking and initializing data if necessary.");

    const db = await getDb();

    // Helper to initialize a collection with default data if it's empty
    const ensureCollection = async (collection: Collection, defaultData: any[], isSimple: boolean = false) => {
        const count = await collection.countDocuments();
        if (count === 0) {
            console.log(`Collection ${collection.collectionName} is empty. Seeding with default data.`);
            if (isSimple) {
                await collection.insertMany(defaultData.map(name => ({ name })));
            } else {
                await collection.insertMany(defaultData);
            }
        }
    };
    
    try {
        // Singleton collections check
        const contentCollection = db.collection(CONTENT_COLLECTION_NAME);
        if (await contentCollection.countDocuments() === 0) {
            await contentCollection.insertOne({ docId: DOC_ID, ...defaultMainData });
        }
        
        const profileCollection = db.collection(PROFILE_SETTINGS_COLLECTION_NAME);
        if (await profileCollection.countDocuments() === 0) {
            await profileCollection.insertOne({ docId: DOC_ID, ...defaultProfileSettings });
        }

        // Array-based collections check
        await ensureCollection(db.collection(PROJECT_COLLECTION_NAME), defaultProjects);
        await ensureCollection(db.collection(EDUCATION_COLLECTION_NAME), defaultEducation);
        await ensureCollection(db.collection(CERTIFICATES_COLLECTION_NAME), defaultCertificates);
        await ensureCollection(db.collection(SKILLS_COLLECTION_NAME), defaultSkills, true);
        await ensureCollection(db.collection(TOOLS_COLLECTION_NAME), defaultTools, true);

        isInitialized = true;
        console.log("Data initialization check complete.");
    } catch (error) {
        console.error("An unexpected error occurred during data initialization:", error);
        // Do not re-throw here, as it can crash the server start-up.
        // The getPortfolioData function will handle returning default data.
    }
};

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        await initializeDefaultData();
        const db = await getDb();

        const mainDataDoc = await db.collection(CONTENT_COLLECTION_NAME).findOne({ docId: DOC_ID });
        const profileSettingsDoc = await db.collection(PROFILE_SETTINGS_COLLECTION_NAME).findOne({ docId: DOC_ID });
        
        const projectsFromDb = await db.collection(PROJECT_COLLECTION_NAME).find({}).toArray();
        const skillsFromDb = await db.collection(SKILLS_COLLECTION_NAME).find({}).toArray();
        const educationFromDb = await db.collection(EDUCATION_COLLECTION_NAME).find({}).toArray();
        const certificatesFromDb = await db.collection(CERTIFICATES_COLLECTION_NAME).find({}).toArray();
        const toolsFromDb = await db.collection(TOOLS_COLLECTION_NAME).find({}).toArray();

        const { _id: mainId, docId: mainDocId, ...mainData } = mainDataDoc || {};
        const { _id: profileId, docId: profileDocId, ...profileSettings } = profileSettingsDoc || {};

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
        console.error("Failed to get portfolio data, returning default set:", error);
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

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    try {
        const db = await getDb();
        const { projects, skills, education, certificates, tools, cvUrl, profilePictureUrl, ...mainData } = data;

        // Helper to replace all documents in a collection.
        const replaceCollection = async (collectionName: string, items: any[], isSimple: boolean = false) => {
            const collection = db.collection(collectionName);
            await collection.deleteMany({});
            if (items && items.length > 0) {
                const itemsToInsert = isSimple ? items.map(name => ({ name })) : items;
                await collection.insertMany(itemsToInsert);
            }
        };

        // Update singleton documents first
        await db.collection(CONTENT_COLLECTION_NAME).updateOne(
            { docId: DOC_ID },
            { $set: {name: mainData.name, title: mainData.title, about: mainData.about, contact: mainData.contact} },
            { upsert: true }
        );

        await db.collection(PROFILE_SETTINGS_COLLECTION_NAME).updateOne(
            { docId: DOC_ID },
            { $set: { cvUrl, profilePictureUrl } },
            { upsert: true }
        );

        // Update array-based collections sequentially to avoid race conditions
        await replaceCollection(PROJECT_COLLECTION_NAME, projects);
        await replaceCollection(SKILLS_COLLECTION_NAME, skills, true);
        await replaceCollection(EDUCATION_COLLECTION_NAME, education);
        await replaceCollection(CERTIFICATES_COLLECTION_NAME, certificates);
        await replaceCollection(TOOLS_COLLECTION_NAME, tools, true);

    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw new Error('Could not update portfolio data in MongoDB.');
    }
};
