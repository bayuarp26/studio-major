
import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate } from '@/lib/types';
import { Collection, MongoClient } from 'mongodb';

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

let initializationPromise: Promise<void> | null = null;

const getDb = async () => {
    const client = await clientPromise;
    return client.db(DB_NAME);
};

const initializeDefaultData = async () => {
    // If initialization is already in progress, wait for it to complete.
    if (initializationPromise) {
      console.log("Initialization already in progress. Waiting...");
      return initializationPromise;
    }
  
    // Create a new promise to represent the initialization process.
    let resolvePromise: () => void;
    initializationPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
  
    try {
      console.log("Checking and initializing data if necessary.");
      const db = await getDb();
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);

      const ensureCollection = async (
        collectionName: string, 
        defaultData: any[], 
        isSimple: boolean = false
      ) => {
        if (!collectionNames.includes(collectionName)) {
            console.log(`Collection ${collectionName} does not exist. Creating and seeding...`);
            const collection = db.collection(collectionName);
            const dataToInsert = isSimple ? defaultData.map(name => ({ name })) : defaultData;
            if (dataToInsert.length > 0) {
                await collection.insertMany(dataToInsert);
            }
        }
      };

      const ensureSingletonDoc = async (collectionName: string, defaultDoc: any) => {
        if (!collectionNames.includes(collectionName)) {
            console.log(`Collection ${collectionName} does not exist. Creating and seeding...`);
            await db.collection(collectionName).insertOne({ docId: DOC_ID, ...defaultDoc });
        } else {
             const collection = db.collection(collectionName);
             const count = await collection.countDocuments({ docId: DOC_ID });
             if(count === 0) {
                console.log(`Singleton doc in ${collectionName} is missing. Seeding...`);
                await collection.insertOne({ docId: DOC_ID, ...defaultDoc });
             }
        }
      }
      
      await ensureSingletonDoc(CONTENT_COLLECTION_NAME, defaultMainData);
      await ensureSingletonDoc(PROFILE_SETTINGS_COLLECTION_NAME, defaultProfileSettings);
      
      await ensureCollection(PROJECT_COLLECTION_NAME, defaultProjects);
      await ensureCollection(EDUCATION_COLLECTION_NAME, defaultEducation);
      await ensureCollection(CERTIFICATES_COLLECTION_NAME, defaultCertificates);
      await ensureCollection(SKILLS_COLLECTION_NAME, defaultSkills, true);
      await ensureCollection(TOOLS_COLLECTION_NAME, defaultTools, true);
      
      console.log("Data initialization check complete.");
    } catch (error) {
      console.error("An unexpected error occurred during data initialization:", error);
      // Reset promise on error to allow retry on the next call.
      initializationPromise = null; 
      throw error; // Re-throw the error to be handled by the caller.
    } finally {
      // Once initialization is done (or failed), resolve the promise and clear it.
      resolvePromise!();
      initializationPromise = null;
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

        // Safely destructure with fallbacks to prevent errors if documents are missing
        const { _id: mainId, docId: mainDocId, ...mainData } = mainDataDoc || { contact: {} };
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
            ...defaultMainData,
            ...defaultProfileSettings,
            projects: defaultProjects,
            skills: defaultSkills,
            education: defaultEducation,
            certificates: defaultCertificates,
            tools: defaultTools,
        };
    }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    const client: MongoClient = await clientPromise;
    const session = client.startSession();

    try {
        await session.withTransaction(async () => {
            const db = client.db(DB_NAME);

            // 1. Update Singleton Documents (Name, Title, About, Contact, CV, etc.)
            const { name, title, about, contact, cvUrl, profilePictureUrl } = data;
            await db.collection(CONTENT_COLLECTION_NAME).updateOne(
                { docId: DOC_ID },
                { $set: { name, title, about, contact } },
                { upsert: true, session }
            );
            await db.collection(PROFILE_SETTINGS_COLLECTION_NAME).updateOne(
                { docId: DOC_ID },
                { $set: { cvUrl, profilePictureUrl } },
                { upsert: true, session }
            );

            // 2. Helper function to safely update a collection by replacing all its documents
            const updateCollection = async (collectionName: string, items: any[], isSimpleStringArray = false) => {
                const collection = db.collection(collectionName);
                await collection.deleteMany({}, { session });
                if (items && items.length > 0) {
                    const documentsToInsert = isSimpleStringArray
                        ? items.map(name => ({ name }))
                        // Ensure no _id or react-hook-form 'id' fields are carried over.
                        : items.map(item => {
                            const { _id, id, ...rest } = item;
                            return rest;
                          });
                    await collection.insertMany(documentsToInsert, { session });
                }
            };
            
            // 3. Update all array-based collections using the helper
            await updateCollection(PROJECT_COLLECTION_NAME, data.projects);
            await updateCollection(SKILLS_COLLECTION_NAME, data.skills, true);
            await updateCollection(EDUCATION_COLLECTION_NAME, data.education);
            await updateCollection(CERTIFICATES_COLLECTION_NAME, data.certificates);
            await updateCollection(TOOLS_COLLECTION_NAME, data.tools, true);
        });
    } catch (error) {
        console.error('Error during MongoDB transaction:', error);
        // Re-throw the error so the API route can catch it and send a 500 response
        throw new Error('Could not update portfolio data due to a database transaction error.');
    } finally {
        await session.endSession();
    }
};
