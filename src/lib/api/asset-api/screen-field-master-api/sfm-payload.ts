import {
  CreateScreenPayload,
  UpdateScreenPayload,
  CreateSectionPayload,
  UpdateSectionPayload,
  CreateFieldPayload,
  UpdateFieldPayload,
  CreateGroupPayload,
  UpdateGroupPayload
} from '@/types/asset-type/screenfieldmaster.types';

// ─── Screen → Create/Update DTO ──────────────────────────────────────────────
export const buildScreenPayload = (screen: Record<string, unknown>, isUpdate: boolean, userId: number): CreateScreenPayload | UpdateScreenPayload => {
  const payload: Omit<CreateScreenPayload, 'createdBy'> = {
    screenName: String(screen.screenName || 'New Screen'),
    screenCode: String(screen.screenCode || `SCR_${Date.now()}`),
    moduleId: (screen.moduleId !== null && screen.moduleId !== undefined && screen.moduleId !== '') ? Number(screen.moduleId) : null,
    parentScreenId: (screen.parentScreenId !== null && screen.parentScreenId !== undefined && screen.parentScreenId !== '') ? Number(screen.parentScreenId) : null,
    isActive: Boolean(screen.isActive ?? true),
    displayOrder: (screen.displayOrder !== null && screen.displayOrder !== undefined) ? Number(screen.displayOrder) : 0,
    isMenuVisible: Boolean(screen.isMenuVisible ?? true),
    isAuthenticationRequired: Boolean(screen.isAuthenticationRequired ?? true),
    menuLevel: (screen.menuLevel !== null && screen.menuLevel !== undefined && screen.menuLevel !== '') ? Number(screen.menuLevel) : null,
    routePath: screen.routePath ? String(screen.routePath) : null,
    baseRoutePath: screen.baseRoutePath ? String(screen.baseRoutePath) : null,
    routeParamPattern: screen.routeParamPattern ? String(screen.routeParamPattern) : null,
    purpose: screen.purpose ? String(screen.purpose) : null,
    componentName: screen.componentName ? String(screen.componentName) : null,
    areaName: screen.areaName ? String(screen.areaName) : null,
    controllerName: screen.controllerName ? String(screen.controllerName) : null,
    actionName: screen.actionName ? String(screen.actionName) : null,
  };

  // Optional text fields — only include if they have a value
  if (screen.screenNameLocal) (payload as Record<string, unknown>).screenNameLocal = String(screen.screenNameLocal);
  if (screen.screenIcon) (payload as Record<string, unknown>).screenIcon = String(screen.screenIcon);

  if (isUpdate) {
    const updatePayload: UpdateScreenPayload = {
      ...payload,
      id: Number(screen.id),
      updatedBy: userId
    };
    return updatePayload;
  } else {
    const createPayload: CreateScreenPayload = {
      ...payload,
      createdBy: userId
    };
    return createPayload;
  }
};

// ─── Section → Create/Update DTO ─────────────────────────────────────────────
export const buildSectionPayload = (section: Record<string, unknown>, isUpdate: boolean, userId: number): CreateSectionPayload | UpdateSectionPayload => {
  const payload: Omit<CreateSectionPayload, 'createdBy'> = {
    screenId: Number(section.screenId),
    sectionName: String(section.sectionName || section.label || 'Section'),
    sectionNameLocal: section.sectionNameLocal ? String(section.sectionNameLocal) : '',
    sectionCode: String(section.sectionCode || `SEC_${Date.now()}`),
    sectionType: section.sectionType ? String(section.sectionType) : 'Form',
    description: section.description ? String(section.description) : '',
    displayOrder: Number(section.displayOrder ?? section.order ?? 0),
    columnCount: Number(section.columnCount ?? 1),
    isActive: Boolean(section.isActive ?? true),
    isOptional: Boolean(section.isOptional ?? false),
    isCollapsible: Boolean(section.isCollapsible ?? true),
    isCollapsedByDefault: Boolean(section.isCollapsedByDefault ?? false),
    isRepeatable: Boolean(section.isRepeatable ?? false),
    parentSectionId: (section.parentSectionId !== null && section.parentSectionId !== undefined && section.parentSectionId !== '') ? Number(section.parentSectionId) : null,
  };

  if (isUpdate) {
    const updatePayload: UpdateSectionPayload = {
      ...payload,
      id: Number(section.id),
      updatedBy: userId
    };
    return updatePayload;
  } else {
    const createPayload: CreateSectionPayload = {
      ...payload,
      createdBy: userId
    };
    return createPayload;
  }
};

// ─── Field → Create/Update DTO ───────────────────────────────────────────────
export const buildFieldPayload = (field: Record<string, unknown>, isUpdate: boolean, userId: number): CreateFieldPayload | UpdateFieldPayload => {
  const payload: Omit<CreateFieldPayload, 'createdBy'> = {
    screenId: Number(field.screenId),
    sectionId: Number(field.sectionId),
    fieldName: String(field.fieldName || 'Field'),
    fieldLabel: String(field.label || field.fieldLabel || field.fieldName || 'Field'),
    fieldLabelLocal: field.fieldLabelLocal ? String(field.fieldLabelLocal) : '',
    fieldCode: String(field.fieldCode || `FLD_${Date.now()}`),
    dataType: field.dataType ? String(field.dataType) : 'string',
    controlType: String(field.fieldType || field.controlType || 'text'),
    placeholder: String(field.placeholder ?? ''),
    defaultValue: String(field.defaultValue ?? ''),
    displayOrder: Number(field.displayOrder ?? field.order ?? 0),
    columnSpan: Number(field.columnSpan ?? 1),
    isActive: Boolean(field.isActive ?? true),
    isRequired: Boolean(field.required ?? field.isRequired ?? false),
    isReadonly: Boolean(field.isReadonly ?? false),
    isVisible: Boolean(field.isVisible ?? true),
    isUnique: Boolean(field.isUnique ?? false),
    isSearchable: Boolean(field.isSearchable ?? true),
    isFilterable: Boolean(field.isFilterable ?? true),
    minLength: Number(field.minLength ?? 0),
    maxLength: Number(field.maxLength ?? 0),
    minValue: Number(field.minValue ?? 0),
    maxValue: Number(field.maxValue ?? 0),
    regexPattern: field.regexPattern ? String(field.regexPattern) : '',
    validationMessage: field.validationMessage ? String(field.validationMessage) : '',
    validationJson: Array.isArray(field.validationRules) ? JSON.stringify(field.validationRules) : (field.validationJson ? String(field.validationJson) : '[]'),
    extraConfigJson: (() => {
      let base = {};
      try { base = JSON.parse(String(field.extraConfigJson || '{}')); } catch {}
      return JSON.stringify({
        ...base,
        optionsSource: field.optionsSource || 'manual',
        masterKey: field.masterKey || ''
      });
    })(),
    staticOptionsJson: Array.isArray(field.options) ? JSON.stringify(field.options) : (field.staticOptionsJson ? String(field.staticOptionsJson) : '[]'),
    visibilityConditionJson: Array.isArray(field.conditionalDisplay) ? JSON.stringify(field.conditionalDisplay) : (field.visibilityConditionJson ? String(field.visibilityConditionJson) : '[]'),
  };

  if (isUpdate) {
    const updatePayload: UpdateFieldPayload = {
      ...payload,
      id: Number(field.id),
      updatedBy: userId
    };
    return updatePayload;
  } else {
    const createPayload: CreateFieldPayload = {
      ...payload,
      createdBy: userId
    };
    return createPayload;
  }
};

// ─── Group → Create/Update DTO ───────────────────────────────────────────────
export const buildGroupPayload = (group: Record<string, unknown>, isUpdate: boolean, userId: number): CreateGroupPayload | UpdateGroupPayload => {
  const payload: Omit<CreateGroupPayload, 'createdBy'> = {
    groupName: String(group.groupName || group.name || 'New Group'),
    description: String(group.description || group.groupDescription || ''),
    displayOrder: Number(group.displayOrder ?? group.order ?? 0),
    isActive: Boolean(group.isActive ?? true),
  };

  if (isUpdate) {
    const updatePayload: UpdateGroupPayload = {
      ...payload,
      id: Number(group.id),
      updatedBy: userId
    };
    return updatePayload;
  } else {
    const createPayload: CreateGroupPayload = {
      ...payload,
      createdBy: userId
    };
    return createPayload;
  }
};
