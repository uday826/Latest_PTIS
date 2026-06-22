import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Definitions } from '@/components/modules/assets/configuration/definitions/Definitions';
import type { Metadata } from 'next';
import type { AssetCategory, AssetType, AssetFieldDefinition } from '@/types/asset-type/definitions.types';
import type { AssetDocumentDefinitionDto } from '@/lib/api/asset/asset-document.service';
import { getDocumentDefinitions } from '@/lib/api/asset/asset-document.server.service';
import {
  getAssetCategoriesAction,
  getAssetTypesAction,
  getFieldDefinitionsAction
} from './action';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Asset Definitions | NTIS Configuration',
    description: 'Centralized Asset Field and Document Definitions',
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function sanitizeNumber(val: unknown, fallback = null): number | null {
  const num = parseInt(String(val));
  return isNaN(num) ? fallback : num;
}

export default async function DefinitionsPage({ searchParams }: PageProps): Promise<React.ReactElement> {
  const params = await searchParams;

  const categoryId = sanitizeNumber(params.categoryId);
  const typeId = sanitizeNumber(params.typeId);
  const viewAll = params.viewAll === 'true';

  // 1. Fetch all categories
  const categoriesRes = await getAssetCategoriesAction(1, 10);

  // 2. Fetch types (all types if viewAll is active, otherwise only for categoryId)
  const typesRes = viewAll
    ? await getAssetTypesAction(1, 10, null)
    : (categoryId
      ? await getAssetTypesAction(1, 10, categoryId)
      : { success: true, items: [], totalCount: 0 });

  // 3. Fetch field definitions (all field definitions if viewAll is active, otherwise for selected category & type)
  const fieldsRes = viewAll
    ? await getFieldDefinitionsAction(undefined, undefined, 1, 10)
    : ((categoryId && typeId)
      ? await getFieldDefinitionsAction(categoryId, typeId, 1, 10)
      : { success: true, items: [], totalCount: 0 });

  // 4. Fetch document definitions directly via server service (not via Server Action)
  const docDefsRes = categoryId
    ? await getDocumentDefinitions(categoryId, typeId ?? undefined)
    : null;

  const initialData = {
    categoryId: viewAll ? null : categoryId,
    typeId: viewAll ? null : typeId,
    viewAll,
    categoriesResult: {
      items: (categoriesRes.success && 'items' in categoriesRes ? categoriesRes.items : []).map(c => ({
        id: c.id,
        categoryName: c.categoryName,
        categoryCode: c.categoryCode,
        isActive: c.isActive,
      })) as AssetCategory[],
      totalCount: (categoriesRes.success && 'totalCount' in categoriesRes ? categoriesRes.totalCount : 0) as number,
    },
    typesResult: {
      items: (typesRes.success && 'items' in typesRes ? typesRes.items : []).map(t => ({
        id: t.id,
        typeName: t.typeName,
        typeCode: t.typeCode,
        categoryId: t.categoryId,
        isActive: t.isActive,
      })) as AssetType[],
      totalCount: (typesRes.success && 'totalCount' in typesRes ? typesRes.totalCount : 0) as number,
    },
    fieldsResult: {
      items: (fieldsRes.success && 'items' in fieldsRes ? fieldsRes.items : []).map(f => ({
        id: f.id,
        assetCategoryId: f.assetCategoryId,
        assetTypeId: f.assetTypeId,
        fieldCode: f.fieldCode,
        fieldName: f.fieldName,
        fieldLabel: f.fieldLabel,
        fieldType: f.fieldType,
        fieldGroup: f.fieldGroup,
        isRequired: f.isRequired,
        displayOrder: f.displayOrder,
        validationRules: f.validationRules,
        defaultValue: f.defaultValue,
        minValue: f.minValue,
        maxValue: f.maxValue,
        maxLength: f.maxLength,
        isActive: f.isActive,
      })) as AssetFieldDefinition[],
      totalCount: (fieldsRes.success && 'totalCount' in fieldsRes ? fieldsRes.totalCount : 0) as number,
    },
    docDefsResult: {
      items: (() => {
        if (!docDefsRes?.success || !docDefsRes.data) return [];
        // The server service returns data as unknown — normalize to array
        const raw = Array.isArray(docDefsRes.data)
          ? docDefsRes.data
          : (typeof docDefsRes.data === 'object' && docDefsRes.data !== null && Array.isArray((docDefsRes.data as Record<string, unknown>).items)
            ? (docDefsRes.data as Record<string, unknown>).items as unknown[]
            : []);
        return raw.map((d) => {
          const item = d as Record<string, unknown>;
          return {
            id: Number(item.id ?? item.Id ?? 0),
            assetCategoryId: Number(item.assetCategoryId ?? item.AssetCategoryId ?? 0),
            assetTypeId: item.assetTypeId != null ? Number(item.assetTypeId) : (item.AssetTypeId != null ? Number(item.AssetTypeId) : null),
            documentCode: String(item.documentCode ?? item.DocumentCode ?? ''),
            documentName: String(item.documentName ?? item.DocumentName ?? ''),
            description: item.description != null ? String(item.description) : (item.Description != null ? String(item.Description) : null),
            isRequired: Boolean(item.isRequired ?? item.IsRequired ?? false),
            maxFileSizeMB: Number(item.maxFileSizeMB ?? item.MaxFileSizeMB ?? 0),
            allowedExtensions: String(item.allowedExtensions ?? item.AllowedExtensions ?? ''),
            displayOrder: Number(item.displayOrder ?? item.DisplayOrder ?? 0),
          } satisfies AssetDocumentDefinitionDto;
        });
      })(),
    },
  };

  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>}>
      <Definitions initialData={initialData} />
    </Suspense>
  );
}
