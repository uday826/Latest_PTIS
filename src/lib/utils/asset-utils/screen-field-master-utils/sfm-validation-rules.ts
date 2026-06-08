import type { ScreenField } from '@/types/asset-type/screenfieldmaster.types';

/**
 * Asset Validation Rules
 * Contains regular expressions and constants for field and section validation
 */

// Field name should only contain alphanumeric characters
export const FIELD_NAME_CLEAN_REGEX = /[^a-zA-Z0-9 ]/g;

// Format validation regexes
export const FIELD_NAME_FORMAT_REGEX = /^[a-z][a-zA-Z0-9_-]*$/;
export const CODE_FORMAT_REGEX = /^[a-zA-Z0-9_-]+$/;
export const SCREEN_NAME_FORMAT_REGEX = /^[a-zA-Z0-9 _\u0900-\u097F-]+$/;
export const SCREEN_CODE_FORMAT_REGEX = /^[A-Z0-9_-]+$/;
export const SECTION_CODE_FORMAT_REGEX = /^[A-Z0-9_]+$/;
export const ROUTE_PATH_FORMAT_REGEX = /^\/.*/;
export const COMPONENT_NAME_FORMAT_REGEX = /^[A-Z][a-zA-Z0-9]*$/;

// Maximum length for field labels and section names
export const SFM_NAME_MAX_LENGTH = 50;
export const ASSET_CODE_MAX_LENGTH = 50;

/**
 * Check if a field name or code is duplicate within a list of fields
 */
export function checkDuplicateField(
  allFields: ScreenField[],
  name: string,
  code: string,
  currentFieldId?: string | number
) {
  const isDuplicateName = allFields.some((f: ScreenField) => 
    String(f.id) !== String(currentFieldId || '') && 
    f.fieldName.toLowerCase().trim() === name.toLowerCase().trim()
  );
  
  const isDuplicateCode = allFields.some((f: ScreenField) => 
    String(f.id) !== String(currentFieldId || '') && 
    f.fieldCode?.toUpperCase() === code?.toUpperCase()
  );

  return { isDuplicateName, isDuplicateCode };
}
