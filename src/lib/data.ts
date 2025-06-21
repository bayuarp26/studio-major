import clientPromise from './mongodb';
import type { PortfolioData, Project, EducationItem, Certificate } from '@/lib/types';

const DB_NAME = 'portfolioDB';
const CONTENT_COLLECTION_NAME = 'content';
const PROJECT_COLLECTION_NAME = 'projects';
const SKILLS_COLLECTION_NAME = 'skills';
const EDUCATION_COLLECTION_NAME = 'education';
const CERTIFICATES_COLLECTION_NAME = 'certificates';
const DOC_ID = 'main';

const defaultPortfolioData: PortfolioData = {
    name: "Wahyu Pratomo",
    title: "Digital Marketing Specialist & SEO Analyst",
    about: "I'm a passionate Digital Marketing specialist with a knack for SEO and content strategy. I thrive on data-driven insights to boost online visibility and drive meaningful engagement. Let's connect and create something amazing!",
    cvUrl: "#",
    profilePictureUrl: "https://placehold.co/400x400.png",
    contact: {
        email: "mailto:wahyu.pratomo@example.com",
        linkedin: "https://linkedin.com/in/wahyu-pratomo"
    },
    skills: ["SEO Analysis", "Content Strategy", "Social Media Marketing", "Google Analytics", "Campaign Management"],
    projects: [
        {
            title: "Sample Project: Digital Campaign",
            imageUrl: "https://placehold.co/600x400.png",
            imageHint: "marketing campaign",
            description: "Managed a full-cycle digital marketing campaign, resulting in a 40% increase in lead generation.",
            details: "Strategy, content creation, ad spend management, and performance analysis.",
            tags: ["Marketing", "Lead Gen"]
        },
        {
            title: "Sample Project: SEO Overhaul",
            imageUrl: "https://placehold.co/600x400.png",
            imageHint: "website analytics",
            description: "Executed a complete SEO overhaul for a client website, improving organic search ranking for key terms.",
            details: "Keyword research, on-page optimization, backlink building, and technical SEO.",
            tags: ["SEO", "Analytics"]
        }
    ],
    education: [
        {
            degree: 'Bachelor of Economics',
            school: 'University of Gadjah Mada',
            period: '2015 - 2019'
        }
    ],
    certificates: [
        {
            name: 'Google Ads Search Certification',
            issuer: 'Google',
            date: 'Issued Jun 2023',
            url: 'https://linkedin.com'
        }
    ]
};

const getDb = async () => {
    const client = await clientPromise;
    return client.db(DB_NAME);
};

// Processes the main data document, excluding array-based content
const processMainData = (data: any): Omit<PortfolioData, 'projects' | 'skills' | 'education' | 'certificates'> => {
    const { _id, docId, ...rest } = data;

    // Separate default data for easier merging
    const { projects, skills, education, certificates, ...defaultMainData } = defaultPortfolioData;

    const processedData = {
        ...defaultMainData,
        ...rest,
        contact: {
            ...defaultMainData.contact,
            ...(rest.contact || {}),
        },
    };
    
    return processedData;
}

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
            const { projects, skills, education, certificates, ...defaultMainData } = defaultPortfolioData;
            
            await contentCollection.insertOne({ ...defaultMainData, docId: DOC_ID });
            
            if (projects.length > 0) await projectsCollection.insertMany(projects);
            if (skills.length > 0) await skillsCollection.insertMany(skills.map(name => ({ name })));
            if (education.length > 0) await educationCollection.insertMany(education);
            if (certificates.length > 0) await certificatesCollection.insertMany(certificates);
            
            mainDataDoc = await contentCollection.findOne({ docId: DOC_ID });
        }
        
        if (!mainDataDoc) {
             throw new Error('Failed to retrieve data after initialization.');
        }

        // Fetch all data from respective collections
        const mainData = processMainData(mainDataDoc);

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

        // Update main content document
        await contentCollection.updateOne(
            { docId: DOC_ID },
            { $set: mainData },
            { upsert: true }
        );

        // Update projects collection
        await projectsCollection.deleteMany({});
        if (projects && projects.length > 0) {
            await projectsCollection.insertMany(projects);
        }

        // Update skills collection
        await skillsCollection.deleteMany({});
        if (skills && skills.length > 0) {
            await skillsCollection.insertMany(skills.map(name => ({ name })));
        }

        // Update education collection
        await educationCollection.deleteMany({});
        if (education && education.length > 0) {
            await educationCollection.insertMany(education);
        }

        // Update certificates collection
        await certificatesCollection.deleteMany({});
        if (certificates && certificates.length > 0) {
            await certificatesCollection.insertMany(certificates);
        }

    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw new Error('Could not update portfolio data in MongoDB.');
    }
};
