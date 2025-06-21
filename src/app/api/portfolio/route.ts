
import { NextResponse } from 'next/server';
import { getPortfolioData, updatePortfolioData } from '@/lib/data';
import type { PortfolioData } from '@/lib/types';

// GET handler to fetch current portfolio data
export async function GET() {
  try {
    const data = await getPortfolioData();
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
    await updatePortfolioData(newData);
    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
     if (error instanceof Error) {
        console.error('POST Error:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred while writing data' }, { status: 500 });
  }
}
