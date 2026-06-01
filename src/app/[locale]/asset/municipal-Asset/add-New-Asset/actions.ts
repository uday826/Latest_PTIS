"use server";

import { assetFieldDefinitionService } from "@/lib/api/asset/asset-field-definition.service";
import { AssetFieldDefinition } from "@/lib/api/asset/asset-field-definition.service";
import {
  getDocumentDefinitions,
  getDocumentsByAsset,
  deleteDocument,
  uploadDocument
} from "@/lib/api/asset/asset-document.server.service";
import { ApiResponse } from "@/types/common.types";

/**
 * Fetches field definitions based on selected category and type
 */
export const fetchFieldDefinitions = async (categoryId: number, typeId: number): Promise<AssetFieldDefinition[]> => {
  try {
    const response = await assetFieldDefinitionService.getFieldDefinitions(categoryId, typeId);
    if (response.success && response.data) {
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      const rawData = data as any;
      if (rawData.items && Array.isArray(rawData.items)) {
        return rawData.items;
      }
      if (rawData.data && Array.isArray(rawData.data)) {
        return rawData.data;
      }
      return [];
    } else {
      console.error("Failed to fetch field definitions", response.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching field definitions", error);
    return [];
  }
};

/**
 * Fetches document definitions based on selected category and type
 */
export const fetchDocumentDefinitionsAction = async (
  categoryId: number,
  typeId?: number
): Promise<ApiResponse<any>> => {
  try {
    const res = await getDocumentDefinitions(categoryId, typeId);
    if (res.success && res.data) {
      const raw = res.data as any;
      const arrayData = Array.isArray(raw) ? raw : (raw.items || raw.data || []);
      return { ...res, data: arrayData };
    }
    return res;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch document definitions" };
  }
};

/**
 * Fetches already uploaded documents for a given asset ID
 */
export const fetchUploadedDocumentsAction = async (
  assetId: number
): Promise<ApiResponse<any>> => {
  try {
    const res = await getDocumentsByAsset(assetId);
    if (res.success && res.data) {
      const raw = res.data as any;
      const arrayData = Array.isArray(raw) ? raw : (raw.items || raw.data || []);
      return { ...res, data: arrayData };
    }
    return res;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch uploaded documents" };
  }
};

/**
 * Deletes a document by ID
 */
export const deleteUploadedDocAction = async (
  docId: number
): Promise<ApiResponse<any>> => {
  try {
    return await deleteDocument(docId);
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete document" };
  }
};

/**
 * Uploads a document via multipart FormData
 */
export const uploadDocumentAction = async (
  formData: FormData
): Promise<ApiResponse<any>> => {
  try {
    return await uploadDocument(formData);
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to upload document" };
  }
};

