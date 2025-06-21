import clientPromise from './mongodb';
import type { PortfolioData } from '@/lib/types';

const DB_NAME = 'portfolioDB';
const COLLECTION_NAME = 'content';
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
    projects: [],
    education: [],
    certificates: []
};

const getDb = async () => {
    const client = await clientPromise;
    return client.db(DB_NAME);
};

// Coerce skills to be string[] if they are objects, ensuring data consistency.
const processData = (data: any): PortfolioData => {
    // Remove the _id and docId fields from the returned object
    const { _id, docId, ...rest } = data;

    const processedData = {
        ...defaultPortfolioData,
        ...rest,
        contact: {
            ...defaultPortfolioData.contact,
            ...(rest.contact || {}),
        },
        skills: rest.skills || defaultPortfolioData.skills,
        projects: rest.projects || defaultPortfolioData.projects,
        education: rest.education || defaultPortfolioData.education,
        certificates: rest.certificates || defaultPortfolioData.certificates,
    };

    if (processedData.skills && Array.isArray(processedData.skills) && processedData.skills.length > 0 && typeof processedData.skills[0] === 'object' && processedData.skills[0] !== null) {
      processedData.skills = processedData.skills.map((skill: any) => String(skill.name || ''));
    }
    return processedData;
}

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        const db = await getDb();
        const collection = db.collection(COLLECTION_NAME);
        let data = await collection.findOne({ docId: DOC_ID });

        if (!data) {
            console.log('No data found in MongoDB. Initializing with default data.');
            await collection.insertOne({ ...defaultPortfolioData, docId: DOC_ID });
            data = await collection.findOne({ docId: DOC_ID });
        }
        
        if (!data) {
             // This should not happen if the insert was successful
             throw new Error('Failed to retrieve data after initialization.');
        }

        return processData(data);
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        // Fallback to default data in case of a connection error
        return defaultPortfolioData;
    }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    try {
        const db = await getDb();
        const collection = db.collection(COLLECTION_NAME);
        
        // Data to update, ensuring docId is not nested inside
        const dataToUpdate = { ...data };

        await collection.updateOne(
            { docId: DOC_ID },
            { $set: dataToUpdate },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw new Error('Could not update portfolio data in MongoDB.');
    }
};
