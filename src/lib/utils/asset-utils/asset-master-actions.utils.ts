'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { locales } from '@/i18n/config';
import { ApiError } from "@/lib/utils/api";
import { ActionResult } from '@/types/common.types';
import { getUserIdFromCookies } from '@/lib/utils/cookie';

/**
 * Shared logic for Asset Master server actions.
 * Reduces duplication and standardizes error handling and revalidation.
 */

interface ActionOptions<T> {
  action: (payload: T, userId: number) => Promise<unknown>;
  payload: T;
  revalidatePaths: string[];
  errorMessage: string;
}

export async function executeMasterAction<T>(options: ActionOptions<T>): Promise<ActionResult<void>> {
  const { action, payload, revalidatePaths, errorMessage } = options;
  
  try {
    const cookieStore = await cookies();
    const userId = getUserIdFromCookies(cookieStore);
    
    if (!userId) {
      return { success: false, error: "Unauthorized: User not authenticated", statusCode: 401 };
    }

    await action(payload, userId);

    // Revalidate paths for all locales
    for (const locale of locales) {
      revalidatePaths.forEach(path => {
        revalidatePath(`/${locale}/${path.replace(/^\//, '')}`, 'page');
      });
    }

    return { success: true, data: undefined };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return { success: false, error: error.responseText, statusCode: error.statusCode };
    }
    return { success: false, error: error instanceof Error ? error.message : errorMessage };
  }
}

export async function executeDeleteAction(
  deleteFn: (id: number, userId: number) => Promise<void>,
  id: number,
  revalidatePaths: string[]
): Promise<ActionResult<void>> {
  try {
    const cookieStore = await cookies();
    const userId = getUserIdFromCookies(cookieStore);

    if (!userId) {
      return { success: false, error: "Unauthorized: User not authenticated", statusCode: 401 };
    }

    await deleteFn(id, userId);

    // Revalidate paths for all locales
    for (const locale of locales) {
      revalidatePaths.forEach(path => {
        revalidatePath(`/${locale}/${path.replace(/^\//, '')}`, 'page');
      });
    }

    return { success: true, data: undefined };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return { success: false, error: error.responseText, statusCode: error.statusCode };
    }
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete record" };
  }
}
