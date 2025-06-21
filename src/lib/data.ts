
import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate } from '@/lib/types';

const DB_NAME = 'portfolioDB';
const CONTENT_COLLECTION_NAME = 'content';
const PROFILE_SETTINGS_COLLECTION_NAME = 'profile_settings';
const PROJECT_COLLECTION_NAME = 'projects';
const SKILLS_COLLECTION_NAME = 'skills';
const EDUCATION_COLLECTION_NAME = 'education';
const CERTIFICATES_COLLECTION_NAME = 'certificates';
const TOOLS_COLLECTION_NAME = 'tools';
const DOC_ID = 'main';

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

const defaultSkills: string[] = ["SEO", "Content Marketing", "Social Media Advertising", "Google Analytics", "Meta Ads"];
const defaultProjects: Project[] = [
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
        details: "Analisis Kompetitor: Mengidentifikasi kekuatan dan kelemahan.\nAnalisis Konten: Menemukan format konten paling efektif.\nRekomendasi: Memberikan saran untuk optimasi strategi.",
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "data analytics",
        tags: ["Social Media Analysis", "Instagram", "Data Analytics"]
    }
];
const defaultEducation: EducationItem[] = [
    { degree: "S1 Ilmu Komunikasi", school: "Universitas Gadjah Mada", period: "2018 - 2022" }
];
const defaultCertificates: Certificate[] = [
    { name: "Google Analytics for Beginners", issuer: "Google", date: "Jan 2023", url: "#" }
];
const defaultTools: string[] = [
  "Social Blade", "Canva", "Google Analytics", "Meta Business Suite", "Instagram Insights", "Figma"
];


const getDb = async () => {
    const client = await clientPromise;
    return client.db(DB_NAME);
};

const initializeDefaultData = async (db: any) => {
    console.log('Attempting to initialize default data.');
    try {
        await db.collection(CONTENT_COLLECTION_NAME).insertOne({ ...defaultMainData, docId: DOC_ID });
        console.log('Initialization started by this process.');
        
        await db.collection(PROFILE_SETTINGS_COLLECTION_NAME).insertOne({ ...defaultProfileSettings, docId: DOC_ID });
        if (defaultProjects.length > 0) await db.collection(PROJECT_COLLECTION_NAME).insertMany(defaultProjects.map(p => ({...p, tags: p.tags || []})));
        if (defaultSkills.length > 0) await db.collection(SKILLS_COLLECTION_NAME).insertMany(defaultSkills.map(name => ({ name })));
        if (defaultEducation.length > 0) await db.collection(EDUCATION_COLLECTION_NAME).insertMany(defaultEducation);
        if (defaultCertificates.length > 0) await db.collection(CERTIFICATES_COLLECTION_NAME).insertMany(defaultCertificates);
        if (defaultTools.length > 0) await db.collection(TOOLS_COLLECTION_NAME).insertMany(defaultTools.map(name => ({ name })));
        
        console.log('Default data initialization complete.');
    } catch (error: any) {
        if (error.code === 11000) { // E11000 is duplicate key error code
            console.log('Database already being initialized by another process. Skipping.');
        } else {
            console.error("An unexpected error occurred during data initialization:", error);
            throw error; // Re-throw other errors
        }
    }
};

export const getPortfolioData = async (): Promise<PortfolioData> => {
    const db = await getDb();
    
    // Check if the main content document exists. If not, assume DB is empty and initialize.
    let mainDataDoc = await db.collection(CONTENT_COLLECTION_NAME).findOne({ docId: DOC_ID });
    if (!mainDataDoc) {
        await initializeDefaultData(db);
        // After initialization attempt, try fetching the main document again.
        mainDataDoc = await db.collection(CONTENT_COLLECTION_NAME).findOne({ docId: DOC_ID });
    }
    
    // Fetch all data pieces from their respective collections.
    const profileSettingsDoc = await db.collection(PROFILE_SETTINGS_COLLECTION_NAME).findOne({ docId: DOC_ID });
    
    const projectsFromDb = await db.collection(PROJECT_COLLECTION_NAME).find({}).toArray();
    const skillsFromDb = await db.collection(SKILLS_COLLECTION_NAME).find({}).toArray();
    const educationFromDb = await db.collection(EDUCATION_COLLECTION_NAME).find({}).toArray();
    const certificatesFromDb = await db.collection(CERTIFICATES_COLLECTION_NAME).find({}).toArray();
    const toolsFromDb = await db.collection(TOOLS_COLLECTION_NAME).find({}).toArray();

    // Remove MongoDB's internal _id from documents before combining.
    const { _id: mainId, docId: mainDocId, ...mainData } = mainDataDoc || {};
    const { _id: profileId, docId: profileDocId, ...profileSettings } = profileSettingsDoc || {};

    // Assemble the final PortfolioData object, providing defaults if any data is missing.
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
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    try {
        const db = await getDb();
        const { projects, skills, education, certificates, tools, cvUrl, profilePictureUrl, ...mainData } = data;

        // Update the 'content' collection
        await db.collection(CONTENT_COLLECTION_NAME).updateOne(
            { docId: DOC_ID },
            { $set: mainData },
            { upsert: true }
        );

        // Update the 'profile_settings' collection
        await db.collection(PROFILE_SETTINGS_COLLECTION_NAME).updateOne(
            { docId: DOC_ID },
            { $set: { cvUrl, profilePictureUrl } },
            { upsert: true }
        );

        // A helper function to update collections of items
        const updateCollection = async (collectionName: string, items: any[]) => {
            const collection = db.collection(collectionName);
            await collection.deleteMany({});
            if (items && items.length > 0) {
                // Ensure no _id fields from form state are passed to MongoDB
                const itemsToInsert = items.map(({ _id, ...item }) => item);
                if (itemsToInsert.length > 0) {
                    await collection.insertMany(itemsToInsert);
                }
            }
        };
        
        // A helper function for collections where items are simple strings
        const updateSimpleCollection = async (collectionName: string, items: string[]) => {
            const collection = db.collection(collectionName);
            await collection.deleteMany({});
            if (items && items.length > 0) {
                const itemsToInsert = items.map(name => ({ name }));
                await collection.insertMany(itemsToInsert);
            }
        };

        // Update all item-based collections
        await updateCollection(PROJECT_COLLECTION_NAME, projects);
        await updateSimpleCollection(SKILLS_COLLECTION_NAME, skills);
        await updateCollection(EDUCATION_COLLECTION_NAME, education);
        await updateCollection(CERTIFICATES_COLLECTION_NAME, certificates);
        await updateSimpleCollection(TOOLS_COLLECTION_NAME, tools);

    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw new Error('Could not update portfolio data in MongoDB.');
    }
};
