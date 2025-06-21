
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import fs from 'fs';
import path from 'path';
import type { PortfolioData } from '@/lib/types';

const PORTFOLIO_COLLECTION = 'portfolio';
const PORTFOLIO_DOCUMENT_ID = 'main';
const docRef = doc(db, PORTFOLIO_COLLECTION, PORTFOLIO_DOCUMENT_ID);

// Helper to read from the JSON file as a fallback/seed
const readSeedData = (): PortfolioData => {
    const dataFilePath = path.join(process.cwd(), 'public', 'portfolio-data.json');
    try {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Fatal: Could not read seed data file 'portfolio-data.json'.", error);
        throw new Error("Could not read seed portfolio data file.");
    }
};

// Coerce skills to be string[] if they are objects
const processData = (data: PortfolioData): PortfolioData => {
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0 && typeof data.skills[0] === 'object' && data.skills[0] !== null) {
      data.skills = data.skills.map((skill: any) => String(skill.name || ''));
    }
    return data;
}

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return processData(docSnap.data() as PortfolioData);
        } else {
            console.log("No data in Firestore. Seeding from portfolio-data.json...");
            const seedData = readSeedData();
            await setDoc(docRef, seedData);
            console.log("Seeding successful.");
            return processData(seedData);
        }
    } catch (error) {
        console.error("Error fetching data from Firestore, falling back to seed file.", error);
        // Fallback to seed data if firestore connection fails
        return processData(readSeedData());
    }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<void> => {
    try {
        await setDoc(docRef, data);
    } catch (error) {
        console.error("Failed to update data in Firestore.", error);
        throw new Error("Could not update portfolio data in database.");
    }
};
