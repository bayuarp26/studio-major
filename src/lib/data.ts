import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate } from '@/lib/types';

const DB_NAME = 'portfolioDB';
const CONTENT_COLLECTION_NAME = 'content';
const PROJECT_COLLECTION_NAME = 'projects';
const SKILLS_COLLECTION_NAME = 'skills';
const EDUCATION_COLLECTION_NAME = 'education';
const CERTIFICATES_COLLECTION_NAME = 'certificates';
const DOC_ID = 'main';

// Define default data for the main content collection
const defaultMainData = {
    name: "Wahyu Pratomo",
    title: "Digital Marketing Specialist & SEO Analyst",
    about: "I'm a passionate Digital Marketing specialist with a knack for SEO and content strategy. I thrive on data-driven insights to boost online visibility and drive meaningful engagement. Let's connect and create something amazing!",
    cvUrl: "#",
    profilePictureUrl: "https://placehold.co/400x400.png",
    contact: {
        email: "mailto:wahyu.pratomo@example.com",
        linkedin: "https://linkedin.com/in/wahyu-pratomo"
    },
};

// Define default data for other collections
const defaultSkills: string[] = [
    "Digital Marketing Strategy",
    "SEO (Search Engine Optimization)",
    "Content Creation & Marketing",
    "Social Media Management",
    "Data Analysis",
    "Google Ads & Analytics"
];
const defaultProjects: Project[] = [
    {
        title: "Peningkatan SEO Situs E-commerce",
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "seo analytics",
        description: "Meningkatkan peringkat pencarian organik sebesar 40% dalam 6 bulan.",
        details: "Melakukan riset kata kunci, mengoptimalkan konten, dan membangun backlink berkualitas tinggi.",
        tags: ["SEO", "E-commerce", "Content Marketing"]
    },
    {
        title: "Kampanye Iklan Media Sosial",
        imageUrl: "https://placehold.co/600x400.png",
        imageHint: "social media",
        description: "Menghasilkan ROI 300% dari kampanye iklan berbayar di platform Meta.",
        details: "Menargetkan audiens yang tepat, membuat iklan yang menarik, dan menganalisis metrik kinerja.",
        tags: ["Social Media", "Advertising", "Meta Ads"]
    }
];
const defaultEducation: EducationItem[] = [
    {
        degree: "Sarjana Komunikasi",
        school: "Universitas Gadjah Mada",
        period: "2015 - 2019"
    }
];
const defaultCertificates: Certificate[] = [
    {
        name: "Google Analytics Individual Qualification",
        issuer: "Google",
        date: "2023",
        url: "#"
    },
    {
        name: "HubSpot Content Marketing Certification",
        issuer: "HubSpot Academy",
        date: "2022",
        url: "#"
    }
];

// Combine all defaults into a single object for cases where the full object is needed (e.g., error fallback)
const defaultPortfolioData: PortfolioData = {
    ...defaultMainData,
    skills: defaultSkills,
    projects: defaultProjects,
    education: defaultEducation,
    certificates: defaultCertificates
};

const getDb = async () => {
    const client = await clientPromise;
    return client.db(DB_NAME);
};

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        const db = await getDb();
        const contentCollection = db.collection(CONTENT_COLLECTION_NAME);
        const projectsCollection = db.collection(PROJECT_COLLECTION_NAME);
        const skillsCollection = db.collection(SKILLS_COLLECTION_NAME);
        const educationCollection = db.collection(EDUCATION_COLLECTION_NAME);
        const certificatesCollection = db.collection(CERTIFICATES_COLLECTION_NAME);
        
        let mainDataDoc = await contentCollection.findOne({ docId: DOC_ID });

        // Initialization logic if database is empty
        if (!mainDataDoc) {
            console.log('No data found in MongoDB. Initializing with default data.');
            
            await contentCollection.insertOne({ ...defaultMainData, docId: DOC_ID });
            
            if (defaultProjects.length > 0) await projectsCollection.insertMany(defaultProjects);
            if (defaultSkills.length > 0) await skillsCollection.insertMany(defaultSkills.map(name => ({ name })));
            if (defaultEducation.length > 0) await educationCollection.insertMany(defaultEducation);
            if (defaultCertificates.length > 0) await certificatesCollection.insertMany(defaultCertificates);
            
            mainDataDoc = await contentCollection.findOne({ docId: DOC_ID });
        }
        
        if (!mainDataDoc) {
             throw new Error('Failed to retrieve data after initialization.');
        }

        // Process main data, combining with defaults for safety
        const { _id, docId, ...dbMainData } = mainDataDoc;

        const mainData = {
            ...defaultMainData,
            ...dbMainData,
            contact: {
                ...defaultMainData.contact,
                ...(dbMainData.contact || {}),
            },
        };

        // Fetch all array data from respective collections
        const projectsFromDb = await projectsCollection.find({}).toArray();
        const projects = projectsFromDb.map(p => { const { _id, ...projectData } = p; return projectData as Project; });

        const skillsFromDb = await skillsCollection.find({}).toArray();
        const skills = skillsFromDb.map(s => s.name as string);

        const educationFromDb = await educationCollection.find({}).toArray();
        const education = educationFromDb.map(e => { const { _id, ...eduData } = e; return eduData as EducationItem; });

        const certificatesFromDb = await certificatesCollection.find({}).toArray();
        const certificates = certificatesFromDb.map(c => { const { _id, ...certData } = c; return certData as Certificate; });

        return { ...mainData, projects, skills, education, certificates };
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        // On error, return the default data to avoid crashing the app.
        return defaultPortfolioData;
    }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    try {
        const db = await getDb();
        const contentCollection = db.collection(CONTENT_COLLECTION_NAME);
        const projectsCollection = db.collection(PROJECT_COLLECTION_NAME);
        const skillsCollection = db.collection(SKILLS_COLLECTION_NAME);
        const educationCollection = db.collection(EDUCATION_COLLECTION_NAME);
        const certificatesCollection = db.collection(CERTIFICATES_COLLECTION_NAME);
        
        const { projects, skills, education, certificates, ...mainData } = data;

        // Update main content document, explicitly unsetting the array fields
        // to ensure they are not stored in the 'content' collection.
        await contentCollection.updateOne(
            { docId: DOC_ID },
            { 
                $set: mainData,
                $unset: {
                    projects: "",
                    skills: "",
                    education: "",
                    certificates: ""
                }
            },
            { upsert: true }
        );

        // For array collections, we clear and re-insert.
        await projectsCollection.deleteMany({});
        if (projects && projects.length > 0) {
            await projectsCollection.insertMany(projects);
        }

        await skillsCollection.deleteMany({});
        if (skills && skills.length > 0) {
            await skillsCollection.insertMany(skills.map(name => ({ name })));
        }

        await educationCollection.deleteMany({});
        if (education && education.length > 0) {
            await educationCollection.insertMany(education);
        }

        await certificatesCollection.deleteMany({});
        if (certificates && certificates.length > 0) {
            await certificatesCollection.insertMany(certificates);
        }

    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw new Error('Could not update portfolio data in MongoDB.');
    }
};
