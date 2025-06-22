// This file is intentionally left empty as it's no longer needed.
// The form submission logic is now handled by a server action in src/lib/actions.ts.
// The GET endpoint is now handled by getPortfolioData in a server component.
import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/data';

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
