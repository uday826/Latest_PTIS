"use client";
import React, { useEffect, useState } from "react";
import { fetchFieldDefinitions } from "@/app/[locale]/asset/municipal-Asset/add-New-Asset/actions";
import { AssetFieldDefinition } from "@/lib/api/asset/asset-field-definition.service";
import { ApiResponse } from "@/types/common.types";

export interface ProcessedField {
  id: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  fieldGroup: string;
  isRequired: boolean;
  options?: string[];
}

export interface MergedFieldSection {
  title: string;
  fields: ProcessedField[];
}

/**
 * Groups dynamic fields by their section and merges sections that have 5 or fewer fields
 * to prevent cluttered layouts with too many small sections.
 */
export const groupAndMergeFields = (fields: ProcessedField[]): MergedFieldSection[] => {
  const originalSections: MergedFieldSection[] = [];
  fields.forEach((field) => {
    const groupName = field.fieldGroup || "General Specifications";
    let sec = originalSections.find((s) => s.title === groupName);
    if (!sec) {
      sec = { title: groupName, fields: [] };
      originalSections.push(sec);
    }
    sec.fields.push(field);
  });

  const merged: MergedFieldSection[] = [];
  for (const sec of originalSections) {
    if (merged.length === 0) {
      merged.push({ title: sec.title, fields: [...sec.fields] });
      continue;
    }

    const last = merged[merged.length - 1];
    // Merge if current section has 5 or fewer fields AND the last section isn't already too large (< 8 fields)
    if (sec.fields.length <= 5 && last.fields.length < 8) {
      last.fields.push(...sec.fields);
      if (last.title !== sec.title) {
        const parts = last.title.split("&").map((p) => p.trim());
        if (!parts.includes(sec.title)) {
          if (parts.length < 3) {
            last.title = `${last.title} & ${sec.title}`;
          } else if (!last.title.endsWith("& More Details")) {
            last.title = last.title.split("&")[0].trim() + " & More Details";
          }
        }
      }
    } else {
      merged.push({ title: sec.title, fields: [...sec.fields] });
    }
  }

  return merged;
};

/**
 * Safely parses field options which could be an array, a JSON string, or a comma-separated list.
 */
export const safeParseOptions = (options: any): string[] => {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map(opt => String(opt));
  }
  if (typeof options === "string") {
    const trimmed = options.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(opt => String(opt));
        }
      } catch (e) {
        // Fallback if parsing fails
      }
    }
    // Handle comma-separated strings
    return trimmed.split(",").map(opt => opt.trim()).filter(Boolean);
  }
  return [];
};

/**
 * Processes the raw field definitions payload into a structured format
 */
export const processFieldDefinitions = (data: ApiResponse<AssetFieldDefinition[]>): ProcessedField[] => {
  if (!data.success || !data.data) {
    console.error("Failed to process field definitions", data.error);
    return [];
  }

  return data.data.map((field) => ({
    id: field.id,
    fieldName: field.fieldName,
    fieldLabel: field.fieldLabel || field.fieldName,
    fieldType: field.fieldType,
    fieldGroup: field.fieldGroup || "General Specifications",
    isRequired: field.isRequired,
    options: safeParseOptions(field.options),
  }));
};

type FieldRendererProps = {
  categoryId: number;
  typeId: number;
};

const FieldRenderer: React.FC<FieldRendererProps> = ({ categoryId, typeId }) => {
  const [fields, setFields] = useState<ProcessedField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFields = async () => {
      setLoading(true);
      try {
        const rawFields = await fetchFieldDefinitions(categoryId, typeId);
        const fieldsArray = Array.isArray(rawFields) ? rawFields : [];
        
        // Robust filtering to handle potential API field naming variations (camelCase, PascalCase)
        const filteredFields = fieldsArray.filter((field: any) => {
          const rawCatId = field.assetCategoryId ?? field.categoryId ?? field.AssetCategoryId ?? field.Category ?? field.CategoryId;
          const rawTypeId = field.assetTypeId ?? field.typeId ?? field.AssetTypeId ?? field.Type ?? field.TypeId;
          
          if (rawCatId === undefined || rawCatId === null || rawTypeId === undefined || rawTypeId === null) {
            return true;
          }
          return Number(rawCatId) === Number(categoryId) && Number(rawTypeId) === Number(typeId);
        });

        const processedFields = processFieldDefinitions({ success: true, data: filteredFields });
        setFields(processedFields);
      } catch (error) {
        console.error("Error fetching or filtering field definitions", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId && typeId) {
      loadFields();
    }
  }, [categoryId, typeId]);

  const renderField = (field: ProcessedField) => {
    const hasOptions = Array.isArray(field.options) && field.options.length > 0;

    if (hasOptions) {
      return (
        <div key={field.id} className="flex flex-col">
          <label htmlFor={field.fieldName} className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
            {field.fieldLabel} {field.isRequired && <span className="text-red-500">*</span>}
          </label>
          <select
            id={field.fieldName}
            name={field.fieldName}
            required={field.isRequired}
            className="w-full h-10 px-3 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer font-medium text-slate-700"
          >
            <option value="">Select {field.fieldLabel}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    switch (field.fieldType?.toLowerCase()) {
      case "checkbox":
      case "boolean":
        return (
          <div key={field.id} className="flex items-center gap-2 h-10 pt-4">
            <input
              type="checkbox"
              id={field.fieldName}
              name={field.fieldName}
              className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
            />
            <label htmlFor={field.fieldName} className="text-xs font-bold text-slate-700 select-none cursor-pointer">
              {field.fieldLabel} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
          </div>
        );
      case "number":
        return (
          <div key={field.id} className="flex flex-col">
            <label htmlFor={field.fieldName} className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              {field.fieldLabel} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              id={field.fieldName}
              name={field.fieldName}
              required={field.isRequired}
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
              className="w-full h-10 px-3 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
            />
          </div>
        );
      case "text":
      default:
        return (
          <div key={field.id} className="flex flex-col">
            <label htmlFor={field.fieldName} className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              {field.fieldLabel} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              id={field.fieldName}
              name={field.fieldName}
              required={field.isRequired}
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
              className="w-full h-10 px-3 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full border-2 border-blue-100 border-t-blue-600 animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loading specifications form...</p>
        </div>
      </div>
    );
  }

  const mergedSections = groupAndMergeFields(fields);

  if (mergedSections.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 mt-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          No form specifications available for the selected category and type.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {mergedSections.map((section) => (
        <div key={section.title} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              {section.title}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {section.fields.map((field) => renderField(field))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FieldRenderer;