import type { AssetDetailRecord } from './types';

export type DisplayField = {
  key: string;
  label: string;
  group: string;
  value: string;
  order: number;
};

function valueText(field: NonNullable<AssetDetailRecord['fieldValues']>[number]) {
  const value =
    field.textValue ??
    field.numberValue ??
    field.dateValue ??
    (field.booleanValue === null || field.booleanValue === undefined ? null : field.booleanValue ? 'Yes' : 'No');

  return value === null || value === undefined || value === '' ? '-' : String(value);
}

export function getGroupedDisplayFields(asset: AssetDetailRecord) {
  const definitions = asset.fieldDefinitions ?? [];
  const values = asset.fieldValues ?? [];
  const definitionByName = new Map(definitions.map((definition) => [definition.fieldName.toLowerCase(), definition]));

  const fields: DisplayField[] = values.map((field, index) => {
    const definition = definitionByName.get((field.fieldName || '').toLowerCase());
    return {
      key: String(field.id ?? field.fieldDefinitionId ?? field.fieldName ?? index),
      label: definition?.fieldLabel || field.fieldName || 'Field',
      group: definition?.fieldGroup || 'Additional Details',
      value: valueText(field),
      order: Number(definition?.displayOrder ?? index),
    };
  });

  return fields.reduce<Record<string, DisplayField[]>>((groups, field) => {
    groups[field.group] = groups[field.group] || [];
    groups[field.group].push(field);
    groups[field.group].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
    return groups;
  }, {});
}
