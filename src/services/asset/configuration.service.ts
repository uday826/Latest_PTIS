/**
 * Configuration Service
 * ---------------------
 * Centralized API client for Screen, Section, and Field master data.
 * All calls go to the real C# backend — no mock data, no localStorage.
 */

import { appConfig } from '@/config/app.config';
import type {
  ScreenConfig,
  ScreenGroupConfig,
  ScreenSection,
  ScreenField,
} from '@/types/asset.types';

const BASE_URL =
  typeof window !== 'undefined'
    ? (window.__RUNTIME_CONFIG__?.apiBaseUrl || appConfig.api.baseUrl || 'https://localhost:7293/api')
    : (process.env.NEXT_PUBLIC_API_BASE_URL || appConfig.api.baseUrl || 'https://localhost:7293/api');
const DEFAULT_PAGE_SIZE = 50;

type ZoneApiRecord = {
  id?: number | string;
  zoneNo?: string;
  description?: string;
  isActive?: boolean;
};

type WardApiRecord = {
  id?: number | string;
  wardNo?: string;
  description?: string;
  zoneId?: number | string | null;
  isActive?: boolean;
};

type AssetTypeApiRecord = {
  id?: number | string;
  typeName?: string;
  assetTypeName?: string;
  typeCode?: string;
  description?: string;
  assetCategoryId?: number | string | null;
  isActive?: boolean;
};


// ─── Simple In-Memory Cache ──────────────────────────────────────────────────
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}


// ─── Helpers ──────────────────────────────────────────────────────────────────
const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

/**
 * Centralized fetch with error handling. Throws on non-OK responses.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  useCache: boolean = false
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const cacheKey = `${options.method || 'GET'}:${url}`;

  if (useCache && options.method === 'GET' || (!options.method && useCache)) {
    const cached = getCachedData<T>(cacheKey);
    if (cached) return cached;
  }

  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  });


  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error(`[ConfigurationService] ${options.method || 'GET'} ${url} → ${res.status}`, errText);

    // Try to extract a user-friendly message from JSON error body
    let userMessage = `API Error ${res.status}`;
    try {
      const errJson = JSON.parse(errText);
      userMessage = errJson.message || errJson.title || errJson.error || userMessage;
    } catch {
      if (errText) userMessage = errText;
    }

    throw new Error(userMessage);
  }

  // 204 No Content (e.g., DELETE)
  if (res.status === 204) return undefined as unknown as T;

  const text = await res.text();
  try {
    const lastBrace = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
    const sanitized = lastBrace !== -1 ? text.substring(0, lastBrace + 1) : text;
    const data = JSON.parse(sanitized.trim());

    if (useCache && (options.method === 'GET' || !options.method)) {
      setCachedData(cacheKey, data);
    }

    return data;
  } catch (e) {
    console.error(`[ConfigurationService] JSON Parse Error at ${url}:`, e);
    if (text && !text.startsWith('{') && !text.startsWith('[')) {
      return { message: text } as unknown as T;
    }
    throw e;
  }
}


// ─── DTO Mappers ──────────────────────────────────────────────────────────────
// Maps the raw API response to the frontend ScreenConfig type.

const mapScreenFromApi = (s: any): ScreenConfig => ({
  id: s.id,
  screenName: s.screenName || '',
  screenCode: s.screenCode || '',
  screenNameLocal: s.screenNameLocal || '',
  screenIcon: s.screenIcon || '',
  moduleId: s.moduleId ?? null,
  parentScreenId: s.parentScreenId ?? null,
  isActive: s.isActive ?? true,
  isMenuVisible: s.isMenuVisible ?? true,
  isAuthenticationRequired: s.isAuthenticationRequired ?? true,
  displayOrder: s.displayOrder ?? 0,
  menuLevel: s.menuLevel ?? null,
  routePath: s.routePath || null,
  baseRoutePath: s.baseRoutePath || null,
  routeParamPattern: s.routeParamPattern || null,
  purpose: s.purpose || null,
  componentName: s.componentName || null,
  areaName: s.areaName || null,
  controllerName: s.controllerName || null,
  actionName: s.actionName || null,
  createdDate: s.createdDate || new Date().toISOString(),
  updatedDate: s.updatedDate || null,
  sections: [], // Sections are loaded separately
});

const mapSectionFromApi = (s: any): ScreenSection => ({
  id: String(s.id),
  sectionName: s.sectionName || '',
  sectionNameLocal: s.sectionNameLocal || '',
  sectionCode: s.sectionCode || '',
  label: s.sectionName || s.label || '',
  description: s.description || '',
  sectionType: s.sectionType || 'Form',
  order: s.displayOrder ?? s.order ?? 0,
  displayOrder: s.displayOrder ?? 0,
  columnCount: s.columnCount ?? 1,
  isCollapsible: s.isCollapsible ?? true,
  isDefaultExpanded: !(s.isCollapsedByDefault ?? false),
  isCollapsedByDefault: s.isCollapsedByDefault ?? false,
  isOptional: s.isOptional ?? false,
  isRepeatable: s.isRepeatable ?? false,
  isActive: s.isActive ?? true,
  screenId: s.screenId,
  parentSectionId: s.parentSectionId ?? undefined,
  createdDate: s.createdDate || new Date().toISOString(),
  modifiedDate: s.updatedDate || s.modifiedDate || undefined,
  fields: [], // Fields are loaded separately
});

const mapFieldFromApi = (f: any): ScreenField => ({
  id: String(f.id),
  fieldName: f.fieldName || '',
  label: f.fieldLabel || f.label || f.fieldName || '',
  fieldLabel: f.fieldLabel || '',
  fieldLabelLocal: f.fieldLabelLocal || '',
  fieldCode: f.fieldCode || '',
  placeholder: f.placeholder || '',
  fieldType: f.controlType || f.fieldType || 'text',
  controlType: f.controlType || '',
  dataType: f.dataType || 'string',
  required: f.isRequired ?? f.required ?? false,
  isRequired: f.isRequired ?? false,
  defaultValue: f.defaultValue || '',
  order: f.displayOrder ?? f.order ?? 0,
  displayOrder: f.displayOrder ?? 0,
  columnSpan: f.columnSpan ?? 1,
  isActive: f.isActive ?? true,
  isReadonly: f.isReadonly ?? false,
  isVisible: f.isVisible ?? true,
  isUnique: f.isUnique ?? false,
  isSearchable: f.isSearchable ?? true,
  isFilterable: f.isFilterable ?? true,
  minLength: f.minLength ?? 0,
  maxLength: f.maxLength ?? 0,
  minValue: f.minValue ?? 0,
  maxValue: f.maxValue ?? 0,
  regexPattern: f.regexPattern || '',
  validationMessage: f.validationMessage || '',
  screenId: f.screenId,
  sectionId: f.sectionId,
  createdDate: f.createdDate || new Date().toISOString(),
  modifiedDate: f.updatedDate || f.modifiedDate || undefined,
});

// ─── Screen → Create/Update DTO ──────────────────────────────────────────────
const buildScreenPayload = (screen: any, isUpdate: boolean) => {
  const payload: Record<string, any> = {
    screenName: screen.screenName || 'New Screen',
    screenCode: screen.screenCode || `SCR_${Date.now()}`,
    moduleId: screen.moduleId ? Number(screen.moduleId) : null,
    parentScreenId: screen.parentScreenId ? Number(screen.parentScreenId) : null,
    isActive: screen.isActive ?? true,
    displayOrder: Number(screen.displayOrder) || 1,
    isMenuVisible: screen.isMenuVisible ?? true,
    isAuthenticationRequired: screen.isAuthenticationRequired ?? true,
    menuLevel: screen.menuLevel ? Number(screen.menuLevel) : null,
    routePath: screen.routePath || null,
    baseRoutePath: screen.baseRoutePath || null,
    routeParamPattern: screen.routeParamPattern || null,
    purpose: screen.purpose || null,
    componentName: screen.componentName || null,
    areaName: screen.areaName || null,
    controllerName: screen.controllerName || null,
    actionName: screen.actionName || null,
  };

  // Optional text fields — only include if they have a value
  if (screen.screenNameLocal) payload.screenNameLocal = screen.screenNameLocal;
  if (screen.screenIcon) payload.screenIcon = screen.screenIcon;

  if (isUpdate) {
    payload.updatedBy = 0;
  } else {
    payload.createdBy = 0;
  }

  return payload;
};

// ─── Section → Create/Update DTO ─────────────────────────────────────────────
const buildSectionPayload = (section: any, isUpdate: boolean) => {
  const payload: Record<string, any> = {
    screenId: Number(section.screenId),
    sectionName: section.sectionName || section.label || 'Section',
    sectionNameLocal: section.sectionNameLocal || '',
    sectionCode: section.sectionCode || `SEC_${Date.now()}`,
    sectionType: section.sectionType || 'Form',
    description: section.description || '',
    displayOrder: Number(section.displayOrder || section.order) || 1,
    columnCount: Number(section.columnCount ?? 1),
    isActive: section.isActive ?? true,
    isOptional: section.isOptional ?? false,
    isCollapsible: section.isCollapsible ?? true,
    isCollapsedByDefault: section.isCollapsedByDefault ?? false,
    isRepeatable: section.isRepeatable ?? false,
    parentSectionId: section.parentSectionId ? Number(section.parentSectionId) : null,
  };

  if (isUpdate) {
    payload.id = Number(section.id);
    payload.updatedBy = 0;
  } else {
    payload.createdBy = 0;
  }

  return payload;
};

// ─── Field → Create/Update DTO ───────────────────────────────────────────────
const buildFieldPayload = (field: any, isUpdate: boolean) => {
  const payload: Record<string, any> = {
    screenId: Number(field.screenId),
    sectionId: Number(field.sectionId),
    fieldName: field.fieldName || 'Field',
    fieldLabel: field.label || field.fieldLabel || field.fieldName || 'Field',
    fieldLabelLocal: field.fieldLabelLocal || '',
    fieldCode: field.fieldCode || `FLD_${Date.now()}`,
    dataType: field.dataType || 'string',
    controlType: field.fieldType || field.controlType || 'text',
    placeholder: field.placeholder || '',
    defaultValue: field.defaultValue || '',
    displayOrder: Number(field.order || field.displayOrder) || 1,
    columnSpan: Number(field.columnSpan ?? 1),
    isActive: field.isActive ?? true,
    isRequired: field.required ?? field.isRequired ?? false,
    isReadonly: field.isReadonly ?? false,
    isVisible: field.isVisible ?? true,
    isUnique: field.isUnique ?? false,
    isSearchable: field.isSearchable ?? true,
    isFilterable: field.isFilterable ?? true,
    minLength: Number(field.minLength ?? 0),
    maxLength: Number(field.maxLength ?? 0),
    minValue: Number(field.minValue ?? 0),
    maxValue: Number(field.maxValue ?? 0),
    regexPattern: field.regexPattern || '',
    validationMessage: field.validationMessage || '',
  };

  if (isUpdate) {
    payload.id = Number(field.id);
    payload.updatedBy = 0;
  } else {
    payload.createdBy = 0;
  }

  return payload;
};

// ═════════════════════════════════════════════════════════════════════════════
// CONFIGURATION SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export const ConfigurationService = {

  // ── SCREEN ────────────────────────────────────────────────────────────────

  /** GET /api/Screen  — paginated list */
  async getScreenConfigs(
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<{ items: ScreenConfig[]; totalCount: number }> {
    try {
      const data = await apiFetch<any>(`/Screen?PageNumber=${page}&PageSize=${pageSize}`, {}, true);

      const list = Array.isArray(data) ? data : (data.items || []);
      return {
        items: list.map(mapScreenFromApi),
        totalCount: data.totalCount || list.length,
      };
    } catch {
      return { items: [], totalCount: 0 };
    }
  },

  /** GET /api/Screen/{id} */
  async getScreenById(id: string | number): Promise<ScreenConfig | null> {
    try {
      const data = await apiFetch<any>(`/Screen/${id}`, {}, true);

      return mapScreenFromApi(data);
    } catch {
      return null;
    }
  },

  /** POST or PUT /api/Screen */
  async saveScreen(screen: any): Promise<ScreenConfig> {
    const numericId = Number(screen.id);
    const isUpdate = !isNaN(numericId) && numericId > 0;
    const endpoint = isUpdate ? `/Screen/${numericId}` : `/Screen`;
    const payload = buildScreenPayload(screen, isUpdate);

    invalidateCache('/Screen');
    const data = await apiFetch<any>(endpoint, {

      method: isUpdate ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
    return mapScreenFromApi(data);
  },

  /** DELETE /api/Screen/{id} */
  async deleteScreen(id: string | number): Promise<void> {
    invalidateCache('/Screen');
    await apiFetch<void>(`/Screen/${id}`, { method: 'DELETE' });

  },

  /** Find screen by routePath */
  async getScreenByRoute(routePath: string): Promise<ScreenConfig | null> {
    try {
      const { items } = await this.getScreenConfigs(1, 100);
      const screen = items.find(
        s => s.routePath === routePath || s.baseRoutePath === routePath
      );
      if (!screen) return null;
      return this.getFullHydratedConfig(screen.id);
    } catch {
      return null;
    }
  },

  /** Fetch a screen with all its sections and fields hydrated */
  async getFullHydratedConfig(screenId: string | number): Promise<ScreenConfig | null> {
    try {
      const screen = await this.getScreenById(screenId);
      if (!screen) return null;

      const { items: sections } = await this.getSectionsByScreen(screenId, 1);
      const hydratedSections = await Promise.all(
        sections.map(async (section) => {
          const { items: fields } = await this.getFieldsBySection(section.id, 1);
          return { ...section, fields };
        })
      );

      return { ...screen, sections: hydratedSections };
    } catch {
      return null;
    }
  },

  // ── SECTION ───────────────────────────────────────────────────────────────

  /** GET /api/ScreenFormSectionMaster?ScreenId={screenId} */
  async getSectionsByScreen(
    screenId: string | number,
    page: number = 1,
    pageSize: number = 100
  ): Promise<{ items: ScreenSection[]; totalCount: number }> {
    if (!screenId) return { items: [], totalCount: 0 };
    try {
      const data = await apiFetch<any>(
        `/ScreenFormSectionMaster?ScreenId=${screenId}&PageNumber=${page}&PageSize=${pageSize}`,
        {},
        true
      );

      const list = Array.isArray(data) ? data : (data.items || []);
      return {
        items: list.map(mapSectionFromApi),
        totalCount: data.totalCount || list.length,
      };
    } catch {
      return { items: [], totalCount: 0 };
    }
  },

  /** POST or PUT /api/ScreenFormSectionMaster */
  async saveSection(section: any): Promise<ScreenSection> {
    const numericId = Number(section.id);
    const isUpdate = !isNaN(numericId) && numericId > 0;
    const endpoint = isUpdate
      ? `/ScreenFormSectionMaster/${numericId}`
      : `/ScreenFormSectionMaster`;
    const payload = buildSectionPayload(section, isUpdate);

    invalidateCache('/ScreenFormSectionMaster');
    const data = await apiFetch<any>(endpoint, {

      method: isUpdate ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
    return mapSectionFromApi(data);
  },

  /** DELETE /api/ScreenFormSectionMaster/{id} */
  async deleteSection(id: string | number): Promise<void> {
    invalidateCache('/ScreenFormSectionMaster');
    await apiFetch<void>(`/ScreenFormSectionMaster/${id}`, { method: 'DELETE' });

  },

  // ── FIELD ─────────────────────────────────────────────────────────────────

  /** GET /api/ScreenFormFieldMaster?SectionId={sectionId} */
  async getFieldsBySection(
    sectionId: string | number,
    page: number = 1,
    pageSize: number = 100
  ): Promise<{ items: ScreenField[]; totalCount: number }> {
    if (!sectionId) return { items: [], totalCount: 0 };
    try {
      const data = await apiFetch<any>(
        `/ScreenFormFieldMaster?SectionId=${sectionId}&PageNumber=${page}&PageSize=${pageSize}`,
        {},
        true
      );

      const list = Array.isArray(data) ? data : (data.items || []);
      return {
        items: list.map(mapFieldFromApi),
        totalCount: data.totalCount || list.length,
      };
    } catch {
      return { items: [], totalCount: 0 };
    }
  },

  /** POST or PUT /api/ScreenFormFieldMaster */
  async saveField(field: any): Promise<ScreenField> {
    const numericId = Number(field.id);
    const isUpdate = !isNaN(numericId) && numericId > 0;
    const endpoint = isUpdate
      ? `/ScreenFormFieldMaster/${numericId}`
      : `/ScreenFormFieldMaster`;
    const payload = buildFieldPayload(field, isUpdate);

    invalidateCache('/ScreenFormFieldMaster');
    const data = await apiFetch<any>(endpoint, {

      method: isUpdate ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
    return mapFieldFromApi(data);
  },

  /** DELETE /api/ScreenFormFieldMaster/{id} */
  async deleteField(id: string | number): Promise<void> {
    invalidateCache('/ScreenFormFieldMaster');
    await apiFetch<void>(`/ScreenFormFieldMaster/${id}`, { method: 'DELETE' });

  },

  // ── SCREEN GROUP ──────────────────────────────────────────────────────────

  /** GET /api/ScreenGroupMaster */
  async getGroups(): Promise<ScreenGroupConfig[]> {
    try {
      const data = await apiFetch<any>(`/ScreenGroupMaster`, {}, true);

      const list = Array.isArray(data) ? data : (data.items || []);
      return list.map((g: any) => ({
        id: g.id,
        name: g.groupName || g.name || '',
        order: g.displayOrder ?? g.order ?? 0,
        displayOrder: g.displayOrder ?? 0,
        isActive: g.isActive ?? true,
        createdDate: g.createdDate || undefined,
      }));
    } catch {
      return [];
    }
  },

  /** POST or PUT /api/ScreenGroupMaster */
  async saveGroup(group: any): Promise<any> {
    const numericId = Number(group.id);
    const isUpdate = !isNaN(numericId) && numericId > 0;
    const endpoint = isUpdate
      ? `/ScreenGroupMaster/${numericId}`
      : `/ScreenGroupMaster`;

    const payload: Record<string, any> = {
      groupName: group.groupName || group.name,
      displayOrder: Number(group.displayOrder || group.order || 0),
      isActive: group.isActive ?? true,
    };

    if (isUpdate) {
      payload.id = numericId;
      payload.updatedBy = 0;
    } else {
      payload.createdBy = 0;
    }

    invalidateCache('/ScreenGroupMaster');
    return apiFetch<any>(endpoint, {

      method: isUpdate ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** DELETE /api/ScreenGroupMaster/{id} */
  async deleteGroup(id: string | number): Promise<void> {
    invalidateCache('/ScreenGroupMaster');
    await apiFetch<void>(`/ScreenGroupMaster/${id}`, { method: 'DELETE' });

  },

  // ── TOGGLE HELPERS ────────────────────────────────────────────────────────

  async toggleScreenStatus(screen: any): Promise<ScreenConfig> {
    return this.saveScreen({ ...screen, isActive: !screen.isActive });
  },

  async toggleSectionStatus(section: any): Promise<ScreenSection> {
    return this.saveSection({ ...section, isActive: !section.isActive });
  },

  async toggleFieldStatus(field: any): Promise<ScreenField> {
    return this.saveField({ ...field, isActive: !field.isActive });
  },

  async toggleGroupStatus(group: any): Promise<any> {
    return this.saveGroup({ ...group, isActive: !group.isActive });
  },

  // ── ASSET MASTER ──────────────────────────────────────────────────────────

  /**
   * POST /api/AssetMaster — Create a new asset entry.
   *
   * Known top-level fields are mapped directly to the DTO.
   * All remaining dynamic form fields are serialized into `dynamicProperties` as JSON.
   */
  async saveAssetMaster(formData: Record<string, any>): Promise<any> {
    // ── Field Name → DTO Property mapping ──────────────────────────────────
    // Dynamic form fields have names like "AssetName", "Asset_Code" etc.
    // We normalize and map them to the exact DTO keys the backend expects.
    const DTO_FIELDS: Record<string, { key: string; type: 'string' | 'int' | 'float' | 'date' }> = {
      'assetcode': { key: 'assetCode', type: 'string' },
      'code': { key: 'assetCode', type: 'string' },
      'assettypeid': { key: 'assetTypeId', type: 'int' },
      'typeid': { key: 'assetTypeId', type: 'int' },
      'assettype': { key: 'assetTypeId', type: 'int' },
      'departmentid': { key: 'departmentId', type: 'int' },
      'department': { key: 'departmentId', type: 'int' },
      'name': { key: 'name', type: 'string' },
      'assetname': { key: 'name', type: 'string' },
      'namelocal': { key: 'nameLocal', type: 'string' },
      'localname': { key: 'nameLocal', type: 'string' },
      'assetnamelocal': { key: 'nameLocal', type: 'string' },
      'description': { key: 'description', type: 'string' },
      'assetdescription': { key: 'description', type: 'string' },
      'status': { key: 'status', type: 'int' },
      'assetstatus': { key: 'status', type: 'int' },
      'acquisitiondate': { key: 'acquisitionDate', type: 'date' },
      'purchasedate': { key: 'acquisitionDate', type: 'date' },
      'acquisitionvalue': { key: 'acquisitionValue', type: 'float' },
      'purchasevalue': { key: 'acquisitionValue', type: 'float' },
      'purchaseprice': { key: 'acquisitionValue', type: 'float' },
      'currentvalue': { key: 'currentValue', type: 'float' },
      'marketvalue': { key: 'currentValue', type: 'float' },
    };
    const normalize = (s: string) => s.toLowerCase().replace(/[_\s-]/g, '');

    // ── Build payload with ALL required defaults ───────────────────────────
    const payload: Record<string, any> = {
      isActive: true,
      createdBy: 1,
      assetCode: '',
      assetTypeId: 1,
      departmentId: 1,
      name: '',
      nameLocal: '',
      description: '',
      status: 1,
      acquisitionDate: new Date().toISOString(),
      acquisitionValue: 0,
      currentValue: 0,
      dynamicProperties: '{}',
    };

    const dynamicProps: Record<string, any> = {};
    const usedDtoKeys = new Set<string>();

    // Map form fields to DTO properties
    for (const [fieldName, value] of Object.entries(formData)) {
      if (value === undefined || value === null || value === '') continue;

      const normalized = normalize(fieldName);
      const match = DTO_FIELDS[normalized];

      if (match && !usedDtoKeys.has(match.key)) {
        let finalValue: any = value;
        let isValidMapping = true;

        switch (match.type) {
          case 'int':
            finalValue = parseInt(String(value), 10);
            if (isNaN(finalValue)) isValidMapping = false;
            break;
          case 'float':
            finalValue = parseFloat(String(value));
            if (isNaN(finalValue)) isValidMapping = false;
            break;
          case 'date':
            finalValue = new Date(String(value)).toISOString();
            if (finalValue.includes('Invalid')) isValidMapping = false;
            break;
          default:
            finalValue = String(value);
        }

        if (isValidMapping) {
          usedDtoKeys.add(match.key);
          payload[match.key] = finalValue;
        } else {
          // If it's not a valid number/date but was supposed to be, 
          // keep it as a dynamic property instead of sending 0/Invalid
          dynamicProps[fieldName] = value;
        }
      } else {
        dynamicProps[fieldName] = value;
      }
    }

    // Serialize remaining fields into dynamicProperties
    payload.dynamicProperties = JSON.stringify(dynamicProps);

    // Auto-generate assetCode if not provided
    if (!payload.assetCode) {
      const yr = new Date().getFullYear();
      const ts = Date.now().toString(36).toUpperCase();
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      payload.assetCode = `AST-${yr}-${ts}-${rand}`;
    }

    // Auto-generate name if not provided
    if (!payload.name) {
      payload.name = `Asset-${payload.assetCode}`;
    }

    // ── POST first (optimistic create) ─────────────────────────────────────
    const url = `${BASE_URL}/AssetMaster`;
    const postRes = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    // Success → return created record
    if (postRes.ok) {
      const text = await postRes.text();
      return text ? JSON.parse(text) : { success: true };
    }

    // Not a duplicate conflict → throw the error
    if (postRes.status !== 409) {
      const errText = await postRes.text().catch(() => '');
      let msg = `API Error ${postRes.status}`;
      try { msg = JSON.parse(errText).message || msg; } catch { }
      throw new Error(msg);
    }

    // ── 409: Duplicate detected → find existing record and PUT update ──────
    console.warn('[saveAssetMaster] 409 Conflict — searching for existing record to update...');

    // Normalize our search values
    const searchCode = (payload.assetCode || '').toLowerCase().trim();
    const searchName = (payload.name || '').toLowerCase().trim();
    const searchDesc = (payload.description || '').toLowerCase().trim();
    const searchLocal = (payload.nameLocal || '').toLowerCase().trim();

    // Fetch records
    const searchRes = await fetch(`${url}?PageSize=1000`, { headers: getHeaders() });
    const searchText = await searchRes.text();

    // Use the same sanitizer for the search results
    const lastBrace = Math.max(searchText.lastIndexOf('}'), searchText.lastIndexOf(']'));
    const sanitized = lastBrace !== -1 ? searchText.substring(0, lastBrace + 1) : searchText;
    const searchData = JSON.parse(sanitized.trim());

    const allRecords: any[] = Array.isArray(searchData) ? searchData : (searchData.items || searchData.data || []);

    // Perform extremely aggressive match
    const match = allRecords.find((r: any) => {
      const rCode = (r.assetCode || r.AssetCode || '').toLowerCase().trim();
      const rName = (r.name || r.Name || '').toLowerCase().trim();
      const rNameLocal = (r.nameLocal || r.NameLocal || '').toLowerCase().trim();
      const rDesc = (r.description || r.Description || '').toLowerCase().trim();

      return (searchCode && rCode === searchCode) ||
        (searchName && rName === searchName) ||
        (searchLocal && rNameLocal === searchLocal) ||
        (searchDesc && rDesc === searchDesc && rDesc !== '' && rDesc !== 'string');
    });

    if (!match || !match.id) {
      console.error('[saveAssetMaster] Deep match failed. Record count:', allRecords.length);
      throw new Error(`A record with similar details exists. Please try changing the Asset Name or Description.`);
    }

    console.log(`[saveAssetMaster] Match found! Updating record ID: ${match.id}`);

    // PUT update the found record
    const updatePayload = {
      ...payload,
      id: match.id,
      assetCode: match.assetCode, // Keep original code if name matched
      updatedBy: 1
    };
    delete (updatePayload as any).createdBy;

    const putRes = await fetch(`${url}/${match.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatePayload),
    });

    if (putRes.ok) {
      const text = await putRes.text();
      return text ? JSON.parse(text) : { success: true, updated: true };
    }

    const putErr = await putRes.text().catch(() => '');
    let putMsg = `Update failed (${putRes.status})`;
    try { putMsg = JSON.parse(putErr).message || putMsg; } catch { }
    throw new Error(putMsg);
  },

  /** GET /api/AssetMaster — List all assets */
  async getAssetMasters(page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE): Promise<{ items: any[]; totalCount: number }> {
    try {
      const data = await apiFetch<any>(`/AssetMaster?PageNumber=${page}&PageSize=${pageSize}`);
      const list = Array.isArray(data) ? data : (data.items || []);
      return {
        items: list,
        totalCount: data.totalCount || list.length,
      };
    } catch {
      return { items: [], totalCount: 0 };
    }
  },

  /** GET /api/AssetMaster filtered by category */
  async getAssetMastersByCategory(
    categoryId: number,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    search?: string,
    assetTypeId?: number | string | null,
    zoneId?: number | string | null,
    wardId?: number | string | null
  ): Promise<{ items: any[]; totalCount: number }> {
    if (!categoryId) {
      return { items: [], totalCount: 0 };
    }

    const params = new URLSearchParams({
      PageNumber: String(page),
      PageSize: String(pageSize),
      AssetCategoryId: String(categoryId),
    });

    if (search?.trim()) {
      params.set('SearchTerm', search.trim());
    }
    if (assetTypeId != null && assetTypeId !== '') {
      params.set('AssetTypeId', String(assetTypeId));
    }
    if (zoneId != null && zoneId !== '') {
      params.set('ZoneId', String(zoneId));
    }
    if (wardId != null && wardId !== '') {
      params.set('WardId', String(wardId));
    }

    try {
      const data = await apiFetch<any>(`/AssetMaster?${params.toString()}`);
      const list = Array.isArray(data) ? data : (data.items || []);
      return {
        items: list,
        totalCount: data.totalCount || list.length,
      };
    } catch {
      return { items: [], totalCount: 0 };
    }
  },

  async getZones(): Promise<{ id: number; label: string }[]> {
    const data = await apiFetch<{ items?: ZoneApiRecord[] } | ZoneApiRecord[]>(`/Zone?PageNumber=1&PageSize=-1`, {}, true);
    const list = Array.isArray(data) ? data : data.items || [];
    return list
      .filter((zone) => zone && zone.id != null)
      .map((zone) => ({
        id: Number(zone.id),
        label: `${zone.description || zone.zoneNo || `Zone ${zone.id}`}${zone.zoneNo ? ` (${zone.zoneNo})` : ''}`,
      }));
  },

  async getWards(): Promise<{ id: number; label: string; zoneId?: number }[]> {
    const data = await apiFetch<{ items?: WardApiRecord[] } | WardApiRecord[]>(`/Ward?PageNumber=1&PageSize=-1`, {}, true);
    const list = Array.isArray(data) ? data : data.items || [];
    return list
      .filter((ward) => ward && ward.id != null)
      .map((ward) => ({
        id: Number(ward.id),
        zoneId: ward.zoneId == null ? undefined : Number(ward.zoneId),
        label: `${ward.description || ward.wardNo || `Ward ${ward.id}`}${ward.wardNo ? ` (${ward.wardNo})` : ''}`,
      }));
  },

  async getAssetTypesByCategory(categoryId: number): Promise<{ id: number; label: string }[]> {
    if (!categoryId) return [];
    const data = await apiFetch<{ items?: AssetTypeApiRecord[] } | AssetTypeApiRecord[]>(
      `/AssetType?AssetCategoryId=${categoryId}&PageNumber=1&PageSize=-1`,
      {},
      true
    );
    const list = Array.isArray(data) ? data : data.items || [];
    return list
      .filter((type) => type && type.id != null)
      .map((type) => ({
        id: Number(type.id),
        label: type.typeName || type.assetTypeName || type.typeCode || `Type ${type.id}`,
      }));
  },
};
