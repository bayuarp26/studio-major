
import fs from 'fs';
import path from 'path';
import type { PortfolioData } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'public', 'portfolio-data.json');

// Helper to read from the JSON file
const readDataFromFile = (): PortfolioData => {
    try {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.warn("Warning: Could not read data file 'portfolio-data.json'. A new file will be created on save. Using default data for now.");
        // Fallback to a default structure if the file doesn't exist or is invalid
        return {
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
    }
};

// Helper to write to the JSON file
const writeDataToFile = (data: PortfolioData): void => {
    try {
        // Ensure the public directory exists
        fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing data file:', error);
        throw new Error('Could not write portfolio data to file.');
    }
};

// Coerce skills to be string[] if they are objects, ensuring data consistency.
const processData = (data: PortfolioData): PortfolioData => {
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0 && typeof data.skills[0] === 'object' && data.skills[0] !== null) {
      data.skills = data.skills.map((skill: any) => String(skill.name || ''));
    }
    return data;
}

export const getPortfolioData = async (): Promise<PortfolioData> => {
    const data = readDataFromFile();
    return processData(data);
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    writeDataToFile(data);
};
