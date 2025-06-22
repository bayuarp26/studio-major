
import { NextResponse } from 'next/server';
import { getPortfolioData, updatePortfolioData } from '@/lib/data';
import type { PortfolioData } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// GET handler to fetch current portfolio data
export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Failed to retrieve data: ${message}` }, { status: 500 });
  }
}

// POST handler to update portfolio data
export async function POST(request: Request) {
  try {
    const newData: PortfolioData = await request.json();
    
    // Basic validation to ensure we have a valid object
    if (!newData || typeof newData !== 'object' || !newData.name) {
        return NextResponse.json({ message: 'Invalid data format provided' }, { status: 400 });
    }

    await updatePortfolioData(newData);

    // Revalidate paths to ensure the main page and admin page show fresh data
    revalidatePath('/');
    revalidatePath('/admin');

    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
     console.error('POST Error in API Route:', error);
     const message = error instanceof Error ? error.message : 'An unknown error occurred during update';
     return NextResponse.json({ message: `Failed to update data: ${message}` }, { status: 500 });
  }
}

    