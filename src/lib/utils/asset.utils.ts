import { ScreenItem, ScreenConfig, ScreenSection, ScreenField, ConditionalRule } from '@/types/asset.types';
import { MasterDataRecord } from '@/types/asset.types';

/* =============================================================================
   ID GENERATORS
   ============================================================================= */

export const generateFieldId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `field_${timestamp}_${random}`;
};

export const generateSectionId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `section_${timestamp}_${random}`;
};

export const generateScreenId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `screen_${timestamp}_${random}`;
};

export const generateGroupId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `group_${timestamp}_${random}`;
};

/* =============================================================================
   ASSET ACCESS & CATALOG
   ============================================================================= */

export const PROJECT_SCREEN_CATALOG: ScreenItem[] = [
  { screenCode: "asset_dash", screenPath: "/dashboard" },
  { screenCode: "map_viewer", screenPath: "/map-viewer" },
  { screenCode: "revenue", screenPath: "/payment-management" },
  { screenCode: "configuration", screenPath: "/configuration" }
];

export const SCREEN_MASTER_CHANGE_EVENT = 'screen_master_change';
export const ACCESS_PROFILE_CHANGE_EVENT = 'access_profile_change';

export function loadScreenMaster(catalog: ScreenItem[]): ScreenItem[] {
  return catalog || [];
}

export function loadAccessProfiles(profiles?: any[]) {
  return profiles || [];
}

export function getAllowedScreenPaths({ screens }: { userId?: string, userRole?: string, screens: ScreenItem[], profiles?: any[] }): Set<string> {
  return new Set(screens.map((s) => s.screenPath));
}

/* =============================================================================
   FIELD ID MIGRATION
   ============================================================================= */

/**
 * Migrates field IDs from old numbered format to new descriptive format
 * Old: field_a_001, field_b_002, etc.
 * New: field_category, field_assetType, etc. (based on fieldName)
 */
export const migrateFieldIds = (screenConfig: ScreenConfig): ScreenConfig => {
  const idMapping: Record<string, string> = {};

  // First pass: Create the mapping
  screenConfig.sections.forEach((section: ScreenSection) => {
    section.fields.forEach((field: ScreenField) => {
      const newId = `field_${field.fieldName}`;
      idMapping[field.id] = newId;
    });
  });

  // Second pass: Update all field IDs and conditional display references
  const migratedConfig: ScreenConfig = {
    ...screenConfig,
    sections: screenConfig.sections.map((section: ScreenSection) => ({
      ...section,
      conditionalDisplay: section.conditionalDisplay?.map((rule: ConditionalRule) => ({
        ...rule,
        fieldId: idMapping[rule.fieldId] || rule.fieldId,
      })),
      fields: section.fields.map((field: ScreenField) => ({
        ...field,
        id: idMapping[field.id] || field.id,
        conditionalDisplay: field.conditionalDisplay?.map((rule: ConditionalRule) => ({
          ...rule,
          fieldId: idMapping[rule.fieldId] || rule.fieldId,
        })),
      })),
    })),
  };

  return migratedConfig;
};

/**
 * Check if a screen config uses old numbered IDs
 */
export const needsMigration = (screenConfig: ScreenConfig): boolean => {
  return screenConfig.sections.some((section) =>
    section.fields.some((field) => {
      return /^field_[a-z]+_\d+[a-z]?$/.test(field.id);
    })
  );
};

/**
 * Migrate all screen configurations
 */
export const migrateAllScreenConfigs = (
  configs: ScreenConfig[]
): ScreenConfig[] => {
  return configs.map((config) => {
    if (needsMigration(config)) {
      console.log(`Migrating screen config: ${config.screenName}`);
      return migrateFieldIds(config);
    }
    return config;
  });
};

/* =============================================================================
   MASTER DATA UTILS
   ============================================================================= */

/**
 * Infers the asset category based on keywords in the name or description.
 */
export const inferAssetTypeCategory = (
  record: Pick<MasterDataRecord, 'name' | 'description'>,
  availableCategories: string[]
): string | undefined => {
  const searchable = `${record.name} ${record.description || ''}`.toLowerCase();
  const categoryKeywordMap: Array<{ category: string; keywords: string[] }> = [
    {
      category: 'Building',
      keywords: ['building', 'office', 'complex', 'market', 'quarters', 'housing', 'hall', 'school', 'hospital', 'ward office', 'library', 'fire station', 'sports complex', 'toilet', 'residential', 'commercial building', 'public housing', 'community hall'],
    },
    {
      category: 'Land',
      keywords: ['land', 'plot', 'garden', 'park', 'vacant', 'playground', 'open ground', 'reserved', 'parking plot', 'burial', 'crematorium'],
    },
    {
      category: 'Infrastructure',
      keywords: ['road', 'bridge', 'water tank', 'drainage', 'street light', 'water supply', 'supply line', 'sewage', 'well', 'bus stop', 'shelter', 'subway', 'utility', 'infrastructure'],
    },
    {
      category: 'Movable',
      keywords: ['vehicle', 'machinery', 'equipment', 'furniture', 'computer', 'tool', 'it equipment', 'monitor', 'generator', 'mobile', 'movable'],
    },
  ];

  for (const { category, keywords } of categoryKeywordMap) {
    if (availableCategories.includes(category) && keywords.some((kw) => searchable.includes(kw))) {
      return category;
    }
  }

  return availableCategories.find((c) => c.toLowerCase() === record.name.toLowerCase());
};

/* =============================================================================
   SCREEN CONFIG STORAGE
   ============================================================================= */

const STORAGE_KEY = 'mc_ems_dynamic_screen_configs';
const MIGRATION_VERSION_KEY = 'mc_ems_field_id_migration_version';
const CURRENT_MIGRATION_VERSION = '1.0.0';

const LEGACY_LAND_PROPERTY_NUMBER_FIELDS = new Set([
  'name',
  'plotNumber',
  'ctsNumber',
  'totalArea',
]);

const LEGACY_OWNERSHIP_LOCATION_FIELDS = new Set([
  'pincode',
  'latitude',
  'longitude',
]);

const getFieldStorageKey = <T extends { id?: string; fieldName: string }>(field: T, index: number): string => {
  if (field.id) {
    return `id:${field.id}`;
  }
  return `name:${field.fieldName || 'field'}:${index}`;
};

const normalizeFields = <T extends { id?: string; fieldName: string; createdDate?: string; modifiedDate?: string }>(fields: T[]): T[] => {
  const ordered = new Map<string, { field: T; order: number; timestamp: number }>();

  fields.forEach((field, index) => {
    const key = getFieldStorageKey(field, index);
    const timestamp = new Date(field.modifiedDate || field.createdDate || 0).getTime() || 0;
    const existing = ordered.get(key);

    if (!existing) {
      ordered.set(key, { field, order: index, timestamp });
      return;
    }

    if (timestamp > existing.timestamp || (timestamp === existing.timestamp && index > existing.order)) {
      ordered.set(key, {
        field: { ...existing.field, ...field },
        order: existing.order,
        timestamp,
      });
    }
  });

  return Array.from(ordered.values())
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.field);
};

const normalizeScreenConfig = (config: ScreenConfig): ScreenConfig => ({
  ...config,
  sections: config.sections.map((section) => ({
    ...section,
    fields: normalizeFields(section.fields),
  })),
});

export const SCREEN_CONFIG_CHANGE_EVENT = 'screenConfigChange';

export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const defaultConfigs: ScreenConfig[] = [];
    const migratedConfigs = migrateAllScreenConfigs(defaultConfigs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedConfigs));
    localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION);
  }
};

const mergeDefaultConfigs = (storedConfigs: ScreenConfig[]): ScreenConfig[] => {
  const defaults: ScreenConfig[] = [];
  const byName = new Map<string, ScreenConfig>();

  const sanitizeAddAssetLandSection = (config: ScreenConfig): ScreenConfig => {
    if (config.screenName !== 'AddNewMunicipalAsset') return config;
    return {
      ...config,
      sections: config.sections.map(section => {
        if (section.sectionName !== 'propertyNumberDetails' && section.sectionName !== 'ownershipLocationDetails') return section;
        const legacyFields = section.sectionName === 'propertyNumberDetails' ? LEGACY_LAND_PROPERTY_NUMBER_FIELDS : LEGACY_OWNERSHIP_LOCATION_FIELDS;
        return {
          ...section,
          fields: normalizeFields(section.fields.filter(field => !legacyFields.has(field.fieldName) && (!field.id || !legacyFields.has(field.id)))),
        };
      }),
    };
  };

  storedConfigs.forEach(config => {
    byName.set(config.screenName, normalizeScreenConfig(sanitizeAddAssetLandSection(config)));
  });

  defaults.forEach(defaultConfig => {
    const sanitizedDefaultConfig = sanitizeAddAssetLandSection(defaultConfig);
    const existingConfig = byName.get(defaultConfig.screenName);

    if (!existingConfig) {
      byName.set(defaultConfig.screenName, {
        ...sanitizedDefaultConfig,
        sections: sanitizedDefaultConfig.sections.map(section => ({
          ...section,
          fields: normalizeFields(section.fields),
        })),
      });
      return;
    }

    const sectionsByName = new Map(existingConfig.sections.map(section => [section.sectionName, section]));

    sanitizedDefaultConfig.sections.forEach(defaultSection => {
      const existingSection = sectionsByName.get(defaultSection.sectionName);
      if (!existingSection) {
        sectionsByName.set(defaultSection.sectionName, defaultSection);
        return;
      }

      const existingFieldsByKey = new Map(
        existingSection.fields.map((field, index) => [getFieldStorageKey(field, index), field])
      );

      const mergedFields = defaultSection.fields.map((defaultField, defaultIndex) => {
        const existingField = existingFieldsByKey.get(getFieldStorageKey(defaultField, defaultIndex));
        if (!existingField) return defaultField;
        const mergedField = { ...defaultField, ...existingField };
        Object.entries(defaultField).forEach(([key, value]) => {
          if (mergedField[key as keyof typeof mergedField] === undefined) {
            (mergedField as Record<string, unknown>)[key] = value;
          }
        });
        return mergedField;
      });

      existingSection.fields.forEach((existingField, existingIndex) => {
        const key = getFieldStorageKey(existingField, existingIndex);
        if (!defaultSection.fields.some((df, di) => getFieldStorageKey(df, di) === key)) {
          mergedFields.push(existingField);
        }
      });

      sectionsByName.set(defaultSection.sectionName, {
        ...defaultSection,
        ...existingSection,
        fields: normalizeFields(mergedFields),
      });
    });

    byName.set(defaultConfig.screenName, {
      ...sanitizedDefaultConfig,
      ...existingConfig,
      sections: Array.from(sectionsByName.values()).map(section => ({
        ...section,
        fields: normalizeFields(section.fields),
      })),
    });
  });

  return Array.from(byName.values());
};

export const loadAllScreenConfigs = (): ScreenConfig[] => {
  if (typeof window === 'undefined') return migrateAllScreenConfigs([]);
  try {
    initializeStorage();
    const stored = localStorage.getItem(STORAGE_KEY);
    const migrationVersion = localStorage.getItem(MIGRATION_VERSION_KEY);
    
    if (stored) {
      let configs = JSON.parse(stored);
      configs = mergeDefaultConfigs(configs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
      
      if (migrationVersion !== CURRENT_MIGRATION_VERSION || configs.some((c: ScreenConfig) => needsMigration(c))) {
        configs = migrateAllScreenConfigs(configs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
        localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION);
      }
      return configs;
    }
  } catch (error) {
    console.error('Error loading screen configs:', error);
  }
  return migrateAllScreenConfigs([]);
};

export const saveAllScreenConfigs = (configs: ScreenConfig[]): void => {
  if (typeof window === 'undefined') return;
  try {
    const normalizedConfigs = configs.map((config) => normalizeScreenConfig(config));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedConfigs));
    window.dispatchEvent(new CustomEvent(SCREEN_CONFIG_CHANGE_EVENT, { detail: normalizedConfigs }));
  } catch (error) {
    console.error('Error saving screen configs:', error);
  }
};

export const loadScreenConfigById = (screenId: string): ScreenConfig | null => {
  const allConfigs = loadAllScreenConfigs();
  return allConfigs.find(config => String(config.id) === String(screenId)) || null;
};

export const loadScreenConfigByName = (screenName: string): ScreenConfig | null => {
  const allConfigs = loadAllScreenConfigs();
  return allConfigs.find(config => config.screenName === screenName) || null;
};

export const getDefaultScreenConfigs = (): ScreenConfig[] => {
  return migrateAllScreenConfigs([]);
};

export const updateScreenConfig = (screenId: string, updatedConfig: ScreenConfig): void => {
  const allConfigs = loadAllScreenConfigs();
  const index = allConfigs.findIndex(config => String(config.id) === String(screenId));
  if (index !== -1) {
    allConfigs[index] = { ...updatedConfig, modifiedDate: new Date().toISOString() };
    saveAllScreenConfigs(allConfigs);
  }
};

export const addScreenConfig = (newConfig: ScreenConfig): void => {
  const allConfigs = loadAllScreenConfigs();
  allConfigs.push({ ...newConfig, createdDate: new Date().toISOString() });
  saveAllScreenConfigs(allConfigs);
};

export const deleteScreenConfig = (screenId: string): void => {
  const allConfigs = loadAllScreenConfigs();
  const filtered = allConfigs.filter(config => String(config.id) !== String(screenId));
  saveAllScreenConfigs(filtered);
};

export const subscribeToConfigChanges = (callback: (configs: ScreenConfig[]) => void): () => void => {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: CustomEvent) => callback(event.detail);
  window.addEventListener(SCREEN_CONFIG_CHANGE_EVENT, handler as EventListener);
  return () => window.removeEventListener(SCREEN_CONFIG_CHANGE_EVENT, handler as EventListener);
};

export const resetToDefaults = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  initializeStorage();
  const configs = loadAllScreenConfigs();
  window.dispatchEvent(new CustomEvent(SCREEN_CONFIG_CHANGE_EVENT, { detail: configs }));
};

export const exportConfigs = (): string => {
  const configs = loadAllScreenConfigs();
  return JSON.stringify(configs, null, 2);
};

export const importConfigs = (jsonString: string): boolean => {
  try {
    const configs = JSON.parse(jsonString);
    if (Array.isArray(configs)) {
      saveAllScreenConfigs(configs);
      return true;
    }
  } catch (error) {
    console.error('Error importing configs:', error);
  }
  return false;
};
