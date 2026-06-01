import { ApiResponse } from "@/types/common.types";
import { appConfig } from "@/config/app.config";

interface BackendApiResponse<T> {
  success: boolean;
  message?: string;
  items?: T;
  data?: T;
}

export interface AssetDocumentDefinitionDto {
  id: number;
  assetCategoryId: number;
  assetTypeId: number | null;
  documentCode: string;
  documentName: string;
  description: string | null;
  isRequired: boolean;
  maxFileSizeMB: number;
  allowedExtensions: string;
  displayOrder: number;
}

export interface AssetDocumentDto {
  id: number;
  assetId: number;
  documentDefinitionId: number;
  floorDetailId: number | null;
  fileName: string;
  storedFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileExtension: string;
  documentTitle: string | null;
  documentDate: string | null;
  documentNumber: string | null;
  remarks: string | null;
  isVerified: boolean;
  verifiedBy: number | null;
  verifiedDate: string | null;
  verificationRemarks: string | null;
  createdDate: string;
  documentCode: string | null;
  documentName: string | null;
  documentGuid: string | null;
  coreDocumentId: number | null;
  documentBindingId: number | null;
}

export interface AssetDocumentUploadFormData {
  file: File;
  assetId: number;
  moduleId: number;
  documentDefinitionId: number;
  floorDetailId?: number;
  ownerUserId?: number;
  uploadedByUserId?: number;
  documentType?: string;
  documentTitle?: string;
  documentDate?: string;
  documentNumber?: string;
  remarks?: string;
  isPrimaryDocument?: boolean;
  bindingPurpose?: string;
}

export interface AssetDocumentUploadResponseDto {
  assetDocumentId: number;
  assetId: number;
  moduleId: number;
  documentDefinitionId: number;
  documentGuid: string;
  coreDocumentId: number;
  documentBindingId: number;
  fileName: string;
  fileSizeBytes: number;
  storagePath: string;
}

export interface FileMetadataItem {
  fileName?: string;
  documentDefinitionId: number;
  documentType?: string;
  documentTitle?: string;
  documentDate?: string;
  documentNumber?: string;
  remarks?: string;
  isPrimaryDocument?: boolean;
  bindingPurpose?: string;
}

export interface AssetDocumentBulkUploadFormData {
  files: File[];
  assetId: number;
  moduleId: number;
  floorDetailId?: number;
  ownerUserId?: number;
  uploadedByUserId?: number;
  fileMetadata?: FileMetadataItem[];
  documentDefinitionId?: number;
  documentType?: string;
  documentTitle?: string;
  documentDate?: string;
  documentNumber?: string;
  remarks?: string;
  isPrimaryDocument?: boolean;
  bindingPurpose?: string;
}

export interface BulkUploadFailureDto {
  fileName: string;
  errorMessage: string;
}

export interface AssetDocumentBulkUploadResponseDto {
  successCount: number;
  failureCount: number;
  successfulUploads: AssetDocumentUploadResponseDto[];
  failedUploads: BulkUploadFailureDto[];
}

const MODULE_ID_ASSET_DOCUMENT = 1004;
const BASE_URL =
  typeof window !== 'undefined'
    ? (window.__RUNTIME_CONFIG__?.apiBaseUrl || appConfig.api.baseUrl || 'https://localhost:7293/api')
    : (process.env.NEXT_PUBLIC_API_BASE_URL || appConfig.api.baseUrl || 'https://localhost:7293/api');

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, { ...options, cache: 'no-store' });
    const text = await response.text();
    let data: BackendApiResponse<T> | null = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {}
    }
    if (!response.ok) {
      return { success: false, message: data?.message || `${response.status}: ${response.statusText}`, statusCode: response.status };
    }
    return { success: true, data: data?.items ?? data?.data ?? (data as unknown as T), message: data?.message, statusCode: response.status };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Network error' };
  }
}

export const assetDocumentService = {
  getDefinitions: async (assetCategoryId: number, assetTypeId?: number): Promise<ApiResponse<AssetDocumentDefinitionDto[]>> => {
    const params = new URLSearchParams();
    params.append("assetCategoryId", assetCategoryId.toString());
    if (assetTypeId) params.append("assetTypeId", assetTypeId.toString());
    return apiRequest<AssetDocumentDefinitionDto[]>(`/AssetDocument/definitions?${params.toString()}`);
  },
  getByAssetId: async (assetId: number): Promise<ApiResponse<AssetDocumentDto[]>> => {
    return apiRequest<AssetDocumentDto[]>(`/AssetDocument/by-asset/${assetId}`);
  },
  getFileByAssetId: async (assetId: number): Promise<Blob> => {
    const response = await fetch(`${BASE_URL}/AssetDocument/by-asset/${assetId}/file`);
    if (!response.ok) throw new Error("Failed to download document");
    return response.blob();
  },
  upload: async (data: AssetDocumentUploadFormData): Promise<ApiResponse<AssetDocumentUploadResponseDto>> => {
    const formData = new FormData();
    formData.append("File", data.file);
    formData.append("AssetId", data.assetId.toString());
    formData.append("ModuleId", (data.moduleId || MODULE_ID_ASSET_DOCUMENT).toString());
    formData.append("DocumentDefinitionId", data.documentDefinitionId.toString());
    if (data.floorDetailId) formData.append("FloorDetailId", data.floorDetailId.toString());
    if (data.ownerUserId) formData.append("OwnerUserId", data.ownerUserId.toString());
    formData.append("UploadedByUserId", (data.uploadedByUserId || 1).toString());
    if (data.documentType) formData.append("DocumentType", data.documentType);
    if (data.documentTitle) formData.append("DocumentTitle", data.documentTitle);
    if (data.documentDate) formData.append("DocumentDate", data.documentDate);
    if (data.documentNumber) formData.append("DocumentNumber", data.documentNumber);
    if (data.remarks) formData.append("Remarks", data.remarks);
    if (data.isPrimaryDocument !== undefined) formData.append("IsPrimaryDocument", data.isPrimaryDocument.toString());
    if (data.bindingPurpose) formData.append("BindingPurpose", data.bindingPurpose);
    return apiRequest<AssetDocumentUploadResponseDto>("/AssetDocument/upload", { method: 'POST', body: formData });
  },
  uploadBulk: async (data: AssetDocumentBulkUploadFormData): Promise<ApiResponse<AssetDocumentBulkUploadResponseDto>> => {
    const formData = new FormData();
    data.files.forEach((file) => formData.append("Files", file));
    formData.append("AssetId", data.assetId.toString());
    formData.append("ModuleId", (data.moduleId || MODULE_ID_ASSET_DOCUMENT).toString());
    if (data.floorDetailId) formData.append("FloorDetailId", data.floorDetailId.toString());
    if (data.ownerUserId) formData.append("OwnerUserId", data.ownerUserId.toString());
    formData.append("UploadedByUserId", (data.uploadedByUserId || 1).toString());
    if (data.fileMetadata && data.fileMetadata.length > 0) {
      formData.append("FileMetadataJson", JSON.stringify(data.fileMetadata));
    } else {
      if (data.documentDefinitionId) formData.append("DocumentDefinitionId", data.documentDefinitionId.toString());
      if (data.documentType) formData.append("DocumentType", data.documentType);
      if (data.documentTitle) formData.append("DocumentTitle", data.documentTitle);
      if (data.documentDate) formData.append("DocumentDate", data.documentDate);
      if (data.documentNumber) formData.append("DocumentNumber", data.documentNumber);
      if (data.remarks) formData.append("Remarks", data.remarks);
      if (data.isPrimaryDocument !== undefined) formData.append("IsPrimaryDocument", data.isPrimaryDocument.toString());
      if (data.bindingPurpose) formData.append("BindingPurpose", data.bindingPurpose);
    }
    return apiRequest<AssetDocumentBulkUploadResponseDto>("/AssetDocument/upload/bulk", { method: 'POST', body: formData });
  },

  /**
   * Delete an uploaded document by ID
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiRequest<void>(
      `/AssetDocument/${id}`,
      { method: 'DELETE' }
    );
  },
};

export default assetDocumentService;
