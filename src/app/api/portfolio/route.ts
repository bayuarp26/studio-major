import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/data';

// GET handler to fetch current portfolio data, used by the admin page for initial load.
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
