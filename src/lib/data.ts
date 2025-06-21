
import clientPromise from './mongodb';
import type { PortfolioData, Project } from '@/lib/types';

const DB_NAME = 'portfolioDB';
const CONTENT_COLLECTION_NAME = 'content';
const PROJECT_COLLECTION_NAME = 'projects';
const SKILLS_COLLECTION_NAME = 'skills';
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
const defaultSkills: string[] = [];
const defaultProjects: Project[] = [];


// Combine all defaults into a single object for cases where the full object is needed (e.g., error fallback)
const defaultPortfolioData: PortfolioData = {
    ...defaultMainData,
    skills: defaultSkills,
    projects: defaultProjects,
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
        
        let mainDataDoc = await contentCollection.findOne({ docId: DOC_ID });

        // Initialization logic if database is empty
        if (!mainDataDoc) {
            console.log('No data found in MongoDB. Initializing with default data.');
            
            await contentCollection.insertOne({ ...defaultMainData, docId: DOC_ID });
            
            if (defaultProjects.length > 0) await projectsCollection.insertMany(defaultProjects);
            if (defaultSkills.length > 0) await skillsCollection.insertMany(defaultSkills.map(name => ({ name })));
            
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

        return { ...mainData, projects, skills };
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
        
        const { projects, skills, ...mainData } = data;

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
            await projectsCollection.insertMany(projects.map(({...p}) => p));
        }

        await skillsCollection.deleteMany({});
        if (skills && skills.length > 0) {
            await skillsCollection.insertMany(skills.map(name => ({ name })));
        }

    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw new Error('Could not update portfolio data in MongoDB.');
    }
};
