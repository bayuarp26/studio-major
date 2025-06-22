'use server';

import type { PortfolioData } from './types';
import { updatePortfolioData } from './data';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

/**
 * Server action to save the entire portfolio data.
 * @param data The clean portfolio data object.
 * @returns A promise that resolves to an object with success status and a message.
 */
export async function savePortfolioData(
  data: PortfolioData
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'Authentication required. Please log in again.' };
    }

    // The data is already cleaned in AdminForm.tsx before being passed here.
    // Now we can confidently update the database.
    await updatePortfolioData(data);

    // Revalidate paths to ensure the main page and admin page show fresh data
    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true, message: 'Portfolio updated successfully!' };
  } catch (error) {
    console.error('savePortfolioData Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update data: ${message}` };
  }
}
