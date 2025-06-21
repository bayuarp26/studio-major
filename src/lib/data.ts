import clientPromise from './mongodb';
import type { PortfolioData, Project } from '@/lib/types';

const DB_NAME = 'portfolioDB';
const CONTENT_COLLECTION_NAME = 'content';
const PROJECT_COLLECTION_NAME = 'projects';
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
    education: [],
    certificates: []
};

const getDb = async () => {
    const client = await clientPromise;
    return client.db(DB_NAME);
};

// Processes the main data document, excluding projects
const processData = (data: any): Omit<PortfolioData, 'projects'> => {
    const { _id, docId, projects, ...rest } = data;

    const processedData = {
        ...defaultPortfolioData,
        ...rest,
        contact: {
            ...defaultPortfolioData.contact,
            ...(rest.contact || {}),
        },
        skills: rest.skills || defaultPortfolioData.skills,
        education: rest.education || defaultPortfolioData.education,
        certificates: rest.certificates || defaultPortfolioData.certificates,
    };

    if (processedData.skills && Array.isArray(processedData.skills) && processedData.skills.length > 0 && typeof processedData.skills[0] === 'object' && processedData.skills[0] !== null) {
      processedData.skills = processedData.skills.map((skill: any) => String(skill.name || ''));
    }
    
    const { projects: _, ...mainData } = processedData;
    return mainData;
}

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        const db = await getDb();
        const contentCollection = db.collection(CONTENT_COLLECTION_NAME);
        const projectsCollection = db.collection(PROJECT_COLLECTION_NAME);
        
        let mainDataDoc = await contentCollection.findOne({ docId: DOC_ID });

        if (!mainDataDoc) {
            console.log('No data found in MongoDB. Initializing with default data.');
            const { projects: defaultProjects, ...defaultMainData } = defaultPortfolioData;
            
            await contentCollection.insertOne({ ...defaultMainData, docId: DOC_ID });
            
            if (defaultProjects.length > 0) {
                await projectsCollection.insertMany(defaultProjects);
            }
            mainDataDoc = await contentCollection.findOne({ docId: DOC_ID });
        }
        
        if (!mainDataDoc) {
             throw new Error('Failed to retrieve data after initialization.');
        }

        const mainData = processData(mainDataDoc);
        const projectsFromDb = await projectsCollection.find({}).toArray();
        const projects = projectsFromDb.map(p => {
            const { _id, ...projectData } = p;
            return projectData as Project;
        });

        return { ...mainData, projects };
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
        
        const { projects, ...mainData } = data;

        await contentCollection.updateOne(
            { docId: DOC_ID },
            { $set: mainData },
            { upsert: true }
        );

        await projectsCollection.deleteMany({});
        if (projects && projects.length > 0) {
            await projectsCollection.insertMany(projects);
        }

    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw new Error('Could not update portfolio data in MongoDB.');
    }
};
