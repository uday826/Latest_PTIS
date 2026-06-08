import { ApiError } from '@/lib/utils/api';
import type {
  ScreenConfig,
  ScreenSection,
  ScreenField,
  ScreenGroupConfig,
} from '@/types/asset-type/screenfieldmaster.types';

export function isScreenShape(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  const id = Number(obj.id ?? obj.screenId);
  return Number.isFinite(id) && id > 0;
}

export function normalizeScreen(data: Record<string, unknown>): ScreenConfig {
  const id = Number(data.id ?? data.screenId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new ApiError(500, 'Invalid data received from server', `Invalid screen id: ${data.id ?? data.screenId}`);
  }
  return {
    id,
    screenName: String(data.screenName ?? ''),
    screenCode: String(data.screenCode ?? ''),
    screenNameLocal: String(data.screenNameLocal ?? ''),
    screenIcon: String(data.screenIcon ?? ''),
    description: String(data.description ?? ''),
    moduleId: (data.moduleId !== undefined && data.moduleId !== null) ? Number(data.moduleId) : null,
    parentScreenId: (data.parentScreenId !== undefined && data.parentScreenId !== null) ? Number(data.parentScreenId) : null,
    isActive: Boolean(data.isActive ?? true),
    isMenuVisible: Boolean(data.isMenuVisible ?? true),
    isAuthenticationRequired: Boolean(data.isAuthenticationRequired ?? true),
    displayOrder: Number(data.displayOrder ?? 0),
    menuLevel: (data.menuLevel !== null && data.menuLevel !== undefined) ? Number(data.menuLevel) : undefined,
    routePath: data.routePath ? String(data.routePath) : null,
    baseRoutePath: data.baseRoutePath ? String(data.baseRoutePath) : null,
    routeParamPattern: data.routeParamPattern ? String(data.routeParamPattern) : null,
    purpose: data.purpose ? String(data.purpose) : null,
    componentName: data.componentName ? String(data.componentName) : null,
    areaName: data.areaName ? String(data.areaName) : null,
    controllerName: data.controllerName ? String(data.controllerName) : null,
    actionName: data.actionName ? String(data.actionName) : null,
    createdDate: String(data.createdDate ?? new Date().toISOString()),
    updatedDate: data.updatedDate ? String(data.updatedDate) : null,
    sections: Array.isArray(data.sections) ? data.sections.map((s: unknown) => normalizeSection(s as Record<string, unknown>)) : [],
  };
}

export function isSectionShape(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.id !== undefined && obj.id !== null) || 
    (obj.sectionId !== undefined && obj.sectionId !== null) ||
    (obj.formSectionId !== undefined && obj.formSectionId !== null) ||
    (obj.sectionMasterId !== undefined && obj.sectionMasterId !== null)
  );
}

export function normalizeSection(data: Record<string, unknown>): ScreenSection {
  const id = String(data.id ?? data.sectionId ?? data.formSectionId ?? data.sectionMasterId ?? '');
  if (!id || id === 'undefined' || id === 'null') {
    throw new ApiError(500, 'Invalid data received from server', `Invalid section id: ${data.id ?? data.sectionId}`);
  }
  return {
    id,
    sectionName: String(data.sectionName ?? ''),
    sectionNameLocal: String(data.sectionNameLocal ?? ''),
    sectionCode: String(data.sectionCode ?? ''),
    label: String(data.sectionName ?? data.label ?? ''),
    description: String(data.description ?? ''),
    sectionType: String(data.sectionType ?? 'Form'),
    order: Number(data.displayOrder ?? data.order ?? 0),
    displayOrder: Number(data.displayOrder ?? 0),
    columnCount: Number(data.columnCount ?? 1),
    isCollapsible: Boolean(data.isCollapsible ?? true),
    isDefaultExpanded: !(data.isCollapsedByDefault ?? false),
    isCollapsedByDefault: Boolean(data.isCollapsedByDefault ?? false),
    isOptional: Boolean(data.isOptional ?? false),
    isRepeatable: Boolean(data.isRepeatable ?? false),
    isActive: Boolean(data.isActive ?? true),
    screenId: (data.screenId !== undefined && data.screenId !== null) ? Number(data.screenId) : 0,
    parentSectionId: (data.parentSectionId !== undefined && data.parentSectionId !== null) ? Number(data.parentSectionId) : undefined,
    createdDate: String(data.createdDate ?? new Date().toISOString()),
    modifiedDate: data.updatedDate || data.modifiedDate ? String(data.updatedDate || data.modifiedDate) : undefined,
    fields: Array.isArray(data.fields) ? data.fields.map((f: unknown) => normalizeField(f as Record<string, unknown>)) : [],
  };
}

export function isFieldShape(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.id !== undefined && obj.id !== null) || 
    (obj.fieldId !== undefined && obj.fieldId !== null) ||
    (obj.formFieldId !== undefined && obj.formFieldId !== null) ||
    (obj.fieldMasterId !== undefined && obj.fieldMasterId !== null)
  );
}

export function normalizeField(data: Record<string, unknown>): ScreenField {
  const id = String(data.id ?? data.fieldId ?? data.formFieldId ?? data.fieldMasterId ?? '');
  if (!id || id === 'undefined' || id === 'null') {
    throw new ApiError(500, 'Invalid data received from server', `Invalid field id: ${data.id ?? data.fieldId}`);
  }
  const staticOptionsJson = String(data.staticOptionsJson ?? '[]');
  const extraConfigJson = String(data.extraConfigJson ?? '{}');
  const visibilityConditionJson = String(data.visibilityConditionJson ?? '[]');
  const validationJson = String(data.validationJson ?? '{}');
  const rawType = String(data.fieldType ?? data.controlType ?? data.type ?? 'text');

  let options = [];
  try { options = JSON.parse(staticOptionsJson); } catch { }

  let extraConfig: { optionsSource?: string; masterKey?: string } = {};
  try { extraConfig = JSON.parse(extraConfigJson); } catch { }

  let conditionalDisplay = [];
  try { conditionalDisplay = JSON.parse(visibilityConditionJson); } catch { }

  let validationRules = [];
  try { 
    const parsed = JSON.parse(validationJson);
    validationRules = Array.isArray(parsed) ? parsed : [];
  } catch { }

  return {
    id,
    fieldName: String(data.fieldName ?? ''),
    label: String(data.fieldLabel ?? data.label ?? data.fieldName ?? ''),
    fieldLabel: String(data.fieldLabel ?? ''),
    fieldLabelLocal: String(data.fieldLabelLocal ?? ''),
    fieldCode: String(data.fieldCode ?? ''),
    placeholder: String(data.placeholder ?? ''),
    fieldType: rawType,
    controlType: String(data.controlType ?? ''),
    dataType: String(data.dataType ?? 'string'),
    required: Boolean(data.isRequired ?? data.required ?? false),
    isRequired: Boolean(data.isRequired ?? false),
    defaultValue: String(data.defaultValue ?? ''),
    order: Number(data.displayOrder ?? data.order ?? 0),
    displayOrder: Number(data.displayOrder ?? 0),
    columnSpan: Number(data.columnSpan ?? 1),
    isActive: Boolean(data.isActive ?? true),
    isReadonly: Boolean(data.isReadonly ?? false),
    isVisible: Boolean(data.isVisible ?? true),
    isUnique: Boolean(data.isUnique ?? false),
    isSearchable: Boolean(data.isSearchable ?? true),
    isFilterable: Boolean(data.isFilterable ?? true),
    minLength: Number(data.minLength ?? 0),
    maxLength: Number(data.maxLength ?? 0),
    minValue: Number(data.minValue ?? 0),
    maxValue: Number(data.maxValue ?? 0),
    regexPattern: String(data.regexPattern ?? ''),
    validationMessage: String(data.validationMessage ?? ''),
    validationJson,
    extraConfigJson,
    staticOptionsJson,
    visibilityConditionJson,
    options,
    optionsSource: extraConfig.optionsSource ?? 'manual',
    masterKey: extraConfig.masterKey ?? '',
    conditionalDisplay,
    validationRules,
    screenId: data.screenId as number | string,
    sectionId: data.sectionId as number | string,
    createdDate: String(data.createdDate ?? new Date().toISOString()),
    modifiedDate: data.updatedDate || data.modifiedDate ? String(data.updatedDate || data.modifiedDate) : undefined,
  } as unknown as ScreenField;
}

export function isScreenGroupShape(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return obj.id !== undefined && obj.id !== null;
}

export function normalizeScreenGroup(data: Record<string, unknown>): ScreenGroupConfig {
  const id = String(data.id);
  if (!id) {
    throw new ApiError(500, 'Invalid data received from server', `Invalid group id: ${data.id}`);
  }
  return {
    id: Number(id),
    name: String(data.groupName ?? data.name ?? ''),
    description: String(data.groupDescription ?? data.description ?? ''),
    order: Number(data.displayOrder ?? data.order ?? 0),
    displayOrder: Number(data.displayOrder ?? 0),
    isActive: Boolean(data.isActive ?? true),
    createdDate: data.createdDate ? String(data.createdDate) : undefined,
  };
}
