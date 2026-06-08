import { z } from 'zod';
import { 
  SFM_NAME_MAX_LENGTH, 
  ASSET_CODE_MAX_LENGTH,
  FIELD_NAME_FORMAT_REGEX,
  CODE_FORMAT_REGEX,
  SCREEN_NAME_FORMAT_REGEX,
  SCREEN_CODE_FORMAT_REGEX,
  SECTION_CODE_FORMAT_REGEX,
  ROUTE_PATH_FORMAT_REGEX,
  COMPONENT_NAME_FORMAT_REGEX
} from './sfm-validation-rules';

/**
 * Base schema properties shared by all field types
 */
const baseFieldSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  fieldName: z
    .string()
    .min(1, 'fieldModal.errors.nameRequired')
    .regex(FIELD_NAME_FORMAT_REGEX, 'fieldModal.errors.nameFormat'),
  label: z
    .string()
    .min(1, 'fieldModal.errors.labelRequired')
    .max(SFM_NAME_MAX_LENGTH, 'fieldModal.errors.labelTooLong'),
  fieldLabelLocal: z.string().optional(),
  fieldCode: z
    .string()
    .min(1, 'fieldModal.errors.codeRequired')
    .max(ASSET_CODE_MAX_LENGTH, 'fieldModal.errors.codeTooLong')
    .regex(CODE_FORMAT_REGEX, 'fieldModal.errors.codeFormat'),
  fieldLabel: z.string().optional(),
  required: z.boolean().default(false),
  isRequired: z.boolean().optional(),
  order: z.number().int().min(1, 'fieldModal.errors.orderRequired'),
  displayOrder: z.number().optional(),
  isActive: z.boolean().default(true),
  createdDate: z.string().optional(),
  modifiedDate: z.string().optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  dependsOnFieldId: z.string().optional(),
  dependsOnFieldName: z.string().optional(),
  
  // Advanced Config
  dataType: z.string().optional(),
  controlType: z.string().optional(),
  columnSpan: z.number().optional(),
  isReadonly: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  isUnique: z.boolean().optional(),
  isSearchable: z.boolean().optional(),
  isFilterable: z.boolean().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  minValue: z.number().min(0, 'fieldModal.errors.minValueNonNegative').optional(),
  maxValue: z.number().min(0, 'fieldModal.errors.maxValueNonNegative').optional(),
  regexPattern: z.string().optional().refine(val => {
    if (!val) return true;
    try {
      new RegExp(val);
      return true;
    } catch {
      return false;
    }
  }, { message: 'fieldModal.errors.invalidRegex' }),
  validationMessage: z.string().optional(),
  
  // JSON Configs
  validationJson: z.string().optional().refine(val => {
    if (!val || val === '{}') return true;
    try { JSON.parse(val); return true; } catch { return false; }
  }, { message: 'fieldModal.errors.invalidJson' }),
  extraConfigJson: z.string().optional().refine(val => {
    if (!val || val === '{}') return true;
    try { JSON.parse(val); return true; } catch { return false; }
  }, { message: 'fieldModal.errors.invalidJson' }),
  staticOptionsJson: z.string().optional(),
  visibilityConditionJson: z.string().optional(),
  screenId: z.union([z.string(), z.number()]).optional().nullable(),
  sectionId: z.union([z.string(), z.number()]).optional().nullable(),

  // Options configuration (moved to base to avoid 'Unrecognized keys' error in strict schemas)
  optionsSource: z.enum(['manual', 'master']).optional(),
  masterKey: z.string().optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),

  // Complex Objects
  conditionalDisplay: z.array(z.any()).optional(),
  validationRules: z.array(z.any()).optional(),
});

/**
 * Zod Discriminated Union for Screen Field validation
 * Ensures that properties like 'masterKey' are only allowed for dropdowns
 */
export const screenFieldSchema = z.discriminatedUnion('fieldType', [
  // Text fields
  baseFieldSchema.extend({
    fieldType: z.enum(['text', 'textarea', 'email', 'phone']),
  }),
  // Number field
  baseFieldSchema.extend({
    fieldType: z.literal('number'),
  }).refine(data => {
    if (data.minValue !== undefined && data.maxValue !== undefined) {
      return data.maxValue > data.minValue;
    }
    return true;
  }, {
    message: 'fieldModal.errors.maxLessThanMin',
    path: ['maxValue'],
  }),
  // Date field
  baseFieldSchema.extend({
    fieldType: z.literal('date'),
  }),
  // Dropdown / Selection fields
  baseFieldSchema.extend({
    fieldType: z.enum(['dropdown', 'select', 'multiselect', 'radio']),
  }),
  // Checkbox field
  baseFieldSchema.extend({
    fieldType: z.literal('checkbox'),
  }),
  // File field
  baseFieldSchema.extend({
    fieldType: z.literal('file'),
    accept: z.string().optional(),
    allowMultiple: z.boolean().optional(),
    attachmentUrl: z.string().optional(),
    filePreview: z.string().optional(),
  }),
  // Button field
  baseFieldSchema.extend({
    fieldType: z.literal('button'),
    buttonAction: z.string().optional(),
    buttonStyle: z.enum(['primary', 'secondary', 'success', 'danger']).optional(),
  }),
], { message: 'fieldModal.errors.invalidType' });

/**
 * Zod schema for Screen Section validation
 */
export const screenSectionSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  sectionName: z
    .string()
    .min(1, 'sectionModal.errors.nameRequired')
    .max(SFM_NAME_MAX_LENGTH, 'sectionModal.errors.labelTooLong'),
  sectionCode: z
    .string()
    .min(1, 'sectionModal.errors.codeRequired')
    .max(ASSET_CODE_MAX_LENGTH, 'sectionModal.errors.codeTooLong')
    .regex(SECTION_CODE_FORMAT_REGEX, 'sectionModal.errors.codeFormat'),
  sectionNameLocal: z.string().optional(),
  label: z.string().optional(),
  sectionType: z.string().optional(),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  displayOrder: z.number().optional(),
  columnCount: z.number().int().min(1).max(4).optional(),
  isCollapsible: z.boolean().optional(),
  isDefaultExpanded: z.boolean().optional(),
  isCollapsedByDefault: z.boolean().optional(),
  isOptional: z.boolean().optional(),
  isRepeatable: z.boolean().optional(),
  isActive: z.boolean().default(true),
  conditionalDisplay: z.array(z.any()).optional(),
  fields: z.array(z.any()).optional(),
  sectionImage: z.string().optional(),
  sectionIcon: z.string().optional(),
  createdDate: z.string().optional(),
  modifiedDate: z.string().optional(),
  screenId: z.union([z.string(), z.number()]).optional().nullable(),
  parentSectionId: z.union([z.string(), z.number()]).optional().nullable(),
});
/**
 * Zod schema for Screen validation
 */
export const screenSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  screenName: z
    .string()
    .min(1, 'screenModal.errors.nameRequired')
    .max(50, 'screenModal.errors.nameTooLong')
    .regex(SCREEN_NAME_FORMAT_REGEX, 'screenModal.errors.nameFormat'),
  screenCode: z
    .string()
    .min(1, 'screenModal.errors.codeRequired')
    .max(50, 'screenModal.errors.codeTooLong')
    .regex(SCREEN_CODE_FORMAT_REGEX, 'screenModal.errors.codeFormat'),
  screenNameLocal: z.string().optional().nullable(),
  screenIcon: z.string().optional().nullable(),
  moduleId: z.union([z.string(), z.number()]).optional().nullable(),
  parentScreenId: z.union([z.string(), z.number()]).optional().nullable(),
  menuLevel: z.number().int().min(1, 'screenModal.errors.menuLevelMin').default(1),
  displayOrder: z.number().int().min(0, 'screenModal.errors.displayOrderMin').default(0),
  routePath: z.string().optional().nullable().refine(val => !val || ROUTE_PATH_FORMAT_REGEX.test(val), {
    message: 'screenModal.errors.routePathFormat',
  }),
  baseRoutePath: z.string().optional().nullable().refine(val => !val || ROUTE_PATH_FORMAT_REGEX.test(val), {
    message: 'screenModal.errors.baseRoutePathFormat',
  }),
  routeParamPattern: z.string().optional().nullable(),
  purpose: z.string().optional().nullable().refine(val => !val || val.length <= 255, {
    message: 'screenModal.errors.purposeTooLong',
  }),
  componentName: z.string().optional().nullable().refine(val => !val || COMPONENT_NAME_FORMAT_REGEX.test(val), {
    message: 'screenModal.errors.componentNameFormat',
  }),
  areaName: z.string().optional().nullable(),
  controllerName: z.string().optional().nullable(),
  actionName: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isMenuVisible: z.boolean().default(true),
  isAuthenticationRequired: z.boolean().default(true),
});

/**
 * Type inferred from the Screen Field schema
 */
export type ScreenFieldSchemaValues = z.infer<typeof screenFieldSchema>;

/**
 * Type inferred from the Screen Section schema
 */
export type ScreenSectionSchemaValues = z.infer<typeof screenSectionSchema>;

/**
 * Type inferred from the Screen schema
 */
export type ScreenSchemaValues = z.infer<typeof screenSchema>;
