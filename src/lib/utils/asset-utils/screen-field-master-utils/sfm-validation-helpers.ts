import type { ScreenSection, ScreenConfig } from '@/types/asset-type/screenfieldmaster.types';
import { z } from 'zod';
import { 
  FIELD_NAME_CLEAN_REGEX 
} from './sfm-validation-rules';

/**
 * Screen Field Master Utilities
 * Contains logic for ID generation, validation, and type guards
 */

/* ================= CONVERSION HELPERS ================= */

/**
 * Converts a label string into a camelCase technical field name
 * e.g. "Asset Category" -> "assetCategory"
 */
export const toFieldName = (value: string): string => {
  return value
    .trim()
    .replace(FIELD_NAME_CLEAN_REGEX, '')
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};





/* ================= VALIDATION HELPERS ================= */



/**
 * Checks if a section name or code is already in use within a screen
 */
export const isDuplicateSection = (
  value: string,
  type: 'name' | 'code',
  currentSectionId: string | undefined,
  sections: ScreenSection[]
): boolean => {
  const normalizedValue = value.trim().toLowerCase();

  return sections.some(s => {
    if (String(s.id) === String(currentSectionId)) return false;
    const compareValue = type === 'name' ? s.sectionName : s.sectionCode;
    return compareValue?.trim().toLowerCase() === normalizedValue;
  });
};

/**
 * Checks if a screen name or code is already in use
 */
export const isDuplicateScreen = (
  value: string,
  type: 'name' | 'code',
  currentScreenId: string | number | undefined,
  screens: ScreenConfig[]
): boolean => {
  const normalizedValue = value.trim().toLowerCase();

  return screens.some(s => {
    if (String(s.id) === String(currentScreenId)) return false;
    const compareValue = type === 'name' ? s.screenName : s.screenCode;
    return compareValue?.trim().toLowerCase() === normalizedValue;
  });
};

/**
 * Formats Zod validation issues into a field errors object
 */
export const formatZodErrors = (
  issues: z.ZodIssue[],
  t: (key: string, options?: Record<string, string | number | Date>) => string
): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  issues.forEach(issue => {
    const path = issue.path[0] as string;
    fieldErrors[path] = t(issue.message, { max: 50 });
  });
  return fieldErrors;
};



