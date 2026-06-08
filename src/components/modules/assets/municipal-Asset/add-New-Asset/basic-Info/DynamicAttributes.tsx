"use client";

import { fetchCategories, fetchTypesByCategory } from "@/app/[locale]/assets/municipal-Asset/actions";
import { fetchFieldDefinitions } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { groupAndMergeFields, MergedFieldSection, ProcessedField, processFieldDefinitions } from "@/components/modules/assets/municipal-Asset/add-New-Asset/FieldRenderer";
import { ListPlus } from "lucide-react";
import React from "react";
import { DynamicFieldInput } from "./DynamicFieldInput";

import type { DynamicAttributesProps } from "@/types/asset-types/basic-info/basicInfo.types";

/**
 * DynamicAttributes Component
 * Renders dynamic, database-driven attributes based on category & type.
 * Hybrid SSR + Client fallback: utilizes fast server-side prefetchedFields on mount,
 * but dynamically loads new definitions when category/type dropdowns change.
 */
export function DynamicAttributes({
  formData,
  onAttributeChange,
  useApi = true,
  prefetchedFields = []
}: DynamicAttributesProps) {
  const [fields, setFields] = React.useState<ProcessedField[]>(prefetchedFields && prefetchedFields.length > 0 ? prefetchedFields : []);
  const [loading, setLoading] = React.useState(useApi && (!prefetchedFields || prefetchedFields.length === 0));

  // Keep track of the category & type that were hydrated from the server
  const hydratedRef = React.useRef({
    categoryId: prefetchedFields && prefetchedFields.length > 0 ? formData.categoryId : undefined,
    typeId: prefetchedFields && prefetchedFields.length > 0 ? formData.typeId : undefined,
  });

  // Auto-calculate land area if length and width change
  React.useEffect(() => {
    const rawLength = formData.attributes?.landLength ?? formData.attributes?.LandLength ?? "0";
    const rawWidth = formData.attributes?.landWidth ?? formData.attributes?.LandWidth ?? "0";
    const length = parseFloat(String(rawLength));
    const width = parseFloat(String(rawWidth));

    if (length > 0 && width > 0) {
      const calculatedArea = (length * width).toFixed(2);
      const currentArea = String(formData.attributes?.landArea ?? formData.attributes?.LandArea ?? "");
      if (currentArea !== calculatedArea) {
        onAttributeChange("landArea", calculatedArea);
        onAttributeChange("LandArea", calculatedArea);
      }
    }
  }, [
    formData.attributes?.landLength,
    formData.attributes?.LandLength,
    formData.attributes?.landWidth,
    formData.attributes?.LandWidth,
    onAttributeChange,
    formData.attributes?.landArea,
    formData.attributes?.LandArea
  ]);

  // Load fields dynamically if useApi is enabled
  React.useEffect(() => {
    if (!useApi) return;

    const catId = formData.categoryId;
    const typId = formData.typeId;

    // Check if the current client selections match the server preloaded values
    if (
      prefetchedFields &&
      prefetchedFields.length > 0 &&
      catId &&
      typId &&
      Number(catId) === Number(hydratedRef.current.categoryId) &&
      Number(typId) === Number(hydratedRef.current.typeId)
    ) {
      setFields(prefetchedFields);
      setLoading(false);
      return;
    }

    const resolveAndLoadFields = async () => {
      let resolvedCatId = catId;
      let resolvedTypId = typId;

      setLoading(true);
      try {
        const category = formData.category;
        const assetType = formData.assetType;

        // Fallback: if IDs are missing, resolve them dynamically from names
        if (!resolvedCatId && category) {
          const catRes = await fetchCategories();
          if (catRes.success && catRes.data) {
            const matchedCat = catRes.data.find(
              (c) =>
                c.categoryName === category ||
                c.categoryName.toLowerCase().replace(/\s+/g, "") === category.toLowerCase().replace(/\s+/g, "")
            );
            if (matchedCat) {
              resolvedCatId = matchedCat.id;

              if (!resolvedTypId && assetType) {
                const typesRes = await fetchTypesByCategory(matchedCat.id);
                if (typesRes.success && typesRes.data) {
                  const matchedType = typesRes.data.find(
                    (t) =>
                      t.typeName === assetType ||
                      (t.typeName && t.typeName.toLowerCase().replace(/\s+/g, "") === assetType.toLowerCase().replace(/\s+/g, "")) ||
                      (t.assetTypeName && t.assetTypeName.toLowerCase().replace(/\s+/g, "") === assetType.toLowerCase().replace(/\s+/g, ""))
                  );
                  if (matchedType) {
                    resolvedTypId = matchedType.id;
                  }
                }
              }
            }
          }
        }

        if (resolvedCatId && resolvedTypId) {
          const rawFields = await fetchFieldDefinitions(resolvedCatId, resolvedTypId);
          const fieldsArray = Array.isArray(rawFields) ? rawFields : [];

          // Robust filtering to handle potential API field variations
          const filteredFields = fieldsArray.filter((field: unknown) => {
            if (typeof field !== "object" || field === null) return false;
            const f = field as Record<string, unknown>;
            const rawCatId = f.assetCategoryId ?? f.categoryId ?? f.AssetCategoryId ?? f.Category ?? f.CategoryId;
            const rawTypeId = f.assetTypeId ?? f.typeId ?? f.AssetTypeId ?? f.Type ?? f.TypeId;

            if (rawCatId === undefined || rawCatId === null || rawTypeId === undefined || rawTypeId === null) {
              return true;
            }
            return Number(rawCatId) === Number(resolvedCatId) && Number(rawTypeId) === Number(resolvedTypId);
          });

          const processedFields = processFieldDefinitions({ success: true, data: filteredFields });
          setFields(processedFields);
        } else {
          setFields([]);
        }
      } catch (error) {
        console.error("Error resolving or fetching field definitions:", error);
      } finally {
        setLoading(false);
      }
    };

    resolveAndLoadFields();
  }, [formData.categoryId, formData.typeId, formData.category, formData.assetType, useApi]);

  // Loading indicator for API-based fields
  if (useApi && loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full border-2 border-blue-100 border-t-blue-600 animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loading dynamic fields...</p>
        </div>
      </div>
    );
  }

  const mergedSections = groupAndMergeFields(fields);

  if (mergedSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {mergedSections.map((section: MergedFieldSection) => (
        <Card key={section.title} variant="bordered" padding="sm" className="shadow-sm border-blue-100 bg-white">
          <CardHeader className="flex items-center gap-2 border-b border-slate-100 pb-1.5 mb-2">
            <div className="bg-[#0f172a] p-1 rounded shadow-sm">
              <ListPlus className="size-3.5 text-white" />
            </div>
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-widest">
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
              {[...section.fields]
                .sort((a, b) => {
                  const isABool = a.fieldType?.toLowerCase() === "checkbox" || a.fieldType?.toLowerCase() === "boolean";
                  const isBBool = b.fieldType?.toLowerCase() === "checkbox" || b.fieldType?.toLowerCase() === "boolean";
                  if (isABool && !isBBool) return 1;
                  if (!isABool && isBBool) return -1;
                  return 0;
                })
                .map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <DynamicFieldInput
                      field={field}
                      formData={formData}
                      onAttributeChange={onAttributeChange}
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
