import "server-only";

import { appConfig } from "@/config/app.config";
import { apiClient } from "@/services/api.service";
import { cookies } from "next/headers";
import type { AssetDocumentListItem } from "@/types/municipal-asset/detail-tabs.types";

const LOCAL_HTTPS_RE = /^https:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;
let relaxedTlsDispatcher: import("undici").Dispatcher | undefined;

interface ModuleLike {
  moduleName?: string;
  ModuleName?: string;
  moduleId?: number;
  ModuleId?: number;
}

interface UploadResponsePayload {
  success?: boolean;
  message?: string;
  error?: string;
  items?: unknown;
  data?: unknown;
  [key: string]: unknown;
}

export interface LeaseRentDetailsDocumentUploadResponseDto {
  assetDocumentId: number;
  assetId: number;
  moduleId: number;
  documentDefinitionId?: number;
  documentGuid?: string;
  coreDocumentId?: number;
  documentBindingId?: number;
  fileName: string;
  fileSizeBytes: number;
  storagePath?: string;
}

function unwrapApiPayload(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;
  const body = data as Record<string, unknown>;
  return body.items ?? body.Items ?? body.data ?? body.Data ?? body.result ?? body.Result ?? data;
}

function unwrapList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const payload = unwrapApiPayload(data);
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const body = payload as Record<string, unknown>;
  const candidates = [body.items, body.Items, body.data, body.Data, body.results, body.Results];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function pickFirstString(source: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function normalizeLeaseRentDocument(raw: unknown): AssetDocumentListItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  const title = pickFirstString(item, ["documentTitle", "DocumentTitle", "documentType", "DocumentType", "name", "Name"]);
  let normalizedTitle = title?.toLowerCase() || "";
  if (normalizedTitle.includes("aadhar") || normalizedTitle.includes("aadhaar")) {
    normalizedTitle = "aadhar";
  } else if (normalizedTitle.includes("pan")) {
    normalizedTitle = "pan";
  }
  if (normalizedTitle !== "aadhar" && normalizedTitle !== "pan") return null;

  const id = item.assetDocumentId ?? item.AssetDocumentId ?? item.documentId ?? item.DocumentId ?? item.id;
  if (typeof id !== "number" && typeof id !== "string") return null;

  const documentId = (item.documentId ?? item.DocumentId) as number | string | null | undefined;

  const fileName =
    pickFirstString(item, ["fileName", "FileName", "originalFileName", "OriginalFileName", "documentFileName", "DocumentFileName"]) ||
    `document-${id}`;

  return {
    id,
    documentId,
    assetId: (item.assetLeaseRentDetailsId ?? item.AssetLeaseRentDetailsId ?? item.assetId ?? item.AssetId) as number | string | null | undefined,
    name: normalizedTitle,
    fileName,
    contentType: pickFirstString(item, ["contentType", "ContentType", "mimeType", "MimeType"]),
    uploadedDate: pickFirstString(item, ["uploadedDate", "UploadedDate", "createdDate", "CreatedDate", "createdOn", "CreatedOn"]),
    fileSize: (item.fileSizeBytes ?? item.FileSizeBytes ?? item.fileSize ?? item.FileSize) as number | string | null | undefined,
    status: "Uploaded",
  };
}

function getBaseUrl(): string {
  const override = process.env.SERVER_API_BASE_URL?.trim();
  return (override ?? appConfig.api.baseUrl).replace(/\/+$/, "");
}

async function documentServerFetch(url: string, init: RequestInit): Promise<Response> {
  const useRelaxedTls =
    typeof window === "undefined" &&
    process.env.NODE_ENV === "development" &&
    process.env.NTIS_STRICT_LOCAL_TLS !== "1" &&
    LOCAL_HTTPS_RE.test(url);

  if (useRelaxedTls) {
    const undici = await import("undici");
    relaxedTlsDispatcher ??= new undici.Agent({ connect: { rejectUnauthorized: false } });
    return undici.fetch(url, {
      method: init.method,
      headers: init.headers,
      body: init.body === null ? undefined : init.body,
      signal: init.signal,
      dispatcher: relaxedTlsDispatcher,
    } as import("undici").RequestInit) as unknown as Promise<Response>;
  }

  return fetch(url, { ...init, cache: "no-store" });
}

async function getBinaryFetchHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { Accept: "*/*" };
  try {
    const store = await cookies();
    const token = store.get("auth_token")?.value;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const csrf = store.get("csrf_token")?.value;
    if (csrf) headers["X-CSRF-Token"] = csrf;
    const cookieStr = store
      .getAll()
      .filter((c) => /auth_token|refresh_token|session_id|csrf_token|\.AspNetCore\.Antiforgery/.test(c.name))
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    if (cookieStr) headers["Cookie"] = cookieStr;
  } catch {
    // Ignore cookie access errors in non-request contexts.
  }
  return headers;
}

export async function uploadLeaseRentDetailsDocument(formData: FormData): Promise<{
  success: boolean;
  data?: LeaseRentDetailsDocumentUploadResponseDto;
  error?: string;
  statusCode?: number;
}> {
  try {
    const { getModules } = await import("@/lib/api/configuration-settings/screenAccess/master-data.service");
    const modules = (await getModules()) as ModuleLike[];
    const assetManagement = modules.find((m) => {
      const mName = m.moduleName || m.ModuleName;
      return mName && mName.toLowerCase().includes("asset management");
    });

    if (assetManagement) {
      const dynId = assetManagement.moduleId || assetManagement.ModuleId || 0;
      if (dynId > 0 && formData.has("ModuleId")) {
        formData.set("ModuleId", dynId.toString());
      }
    }
  } catch (error) {
    console.error("Failed to dynamically resolve ModuleId at server service level", error);
  }

  try {
    const url = `${getBaseUrl()}/AssetDocument/upload/asset-lease-rent-details`;
    const headers = await getBinaryFetchHeaders();

    const response = await documentServerFetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const text = await response.text();
    let data: UploadResponsePayload = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok || data.success === false) {
      return {
        success: false,
        error: data.message || data.error || `Upload failed with status ${response.status}`,
        statusCode: response.status,
      };
    }

    return { success: true, data: (data.items || data.data || data) as LeaseRentDetailsDocumentUploadResponseDto };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to upload document" };
  }
}

export async function getLeaseRentDetailsDocuments(assetLeaseRentDetailsId: number | string): Promise<{
  documents: AssetDocumentListItem[];
  error: string | null;
}> {
  const response = await apiClient.get<unknown>(
    `/AssetDocument/by-asset-lease-rent-details/${encodeURIComponent(String(assetLeaseRentDetailsId))}`
  );

  if (!response.success) {
    return {
      documents: [],
      error: response.error || "Failed to load lease rent documents.",
    };
  }

  return {
    documents: unwrapList(response.data).map(normalizeLeaseRentDocument).filter(Boolean) as AssetDocumentListItem[],
    error: null,
  };
}

export async function replaceLeaseRentDetailsDocument(
  documentId: number | string,
  formData: FormData
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
}> {
  try {
    const url = `${getBaseUrl()}/AssetDocument/by-asset-lease-rent-details-document/${encodeURIComponent(String(documentId))}/file`;
    const headers = await getBinaryFetchHeaders();

    const response = await documentServerFetch(url, {
      method: "PUT",
      headers,
      body: formData,
    });

    const text = await response.text();
    let data: UploadResponsePayload = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok || data.success === false) {
      return {
        success: false,
        error: data.message || data.error || `Replacement failed with status ${response.status}`,
        statusCode: response.status,
      };
    }

    return { success: true, data: (data.items || data.data || data) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to replace document" };
  }
}
