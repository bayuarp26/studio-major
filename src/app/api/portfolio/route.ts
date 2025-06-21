import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { PortfolioData } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'public', 'portfolio-data.json');

// Helper function to read data
const readData = (): PortfolioData => {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read portfolio data, file might not exist or is corrupted.', error);
    // This is a critical error, but we'll let the GET/POST handlers decide how to respond.
    throw new Error('Could not read portfolio data file.');
  }
};

// GET handler to fetch current portfolio data
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
        console.error('GET Error:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred while reading data' }, { status: 500 });
  }
}

// POST handler to update portfolio data
export async function POST(request: Request) {
  try {
    const newData: PortfolioData = await request.json();
    // Basic validation to ensure we're not writing an empty object
    if (!newData || !newData.name) {
        return NextResponse.json({ message: 'Invalid data provided' }, { status: 400 });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
     if (error instanceof Error) {
        console.error('POST Error:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred while writing data' }, { status: 500 });
  }
}
