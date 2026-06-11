import { appConfig } from "@/config/app.config";
import { cookies } from "next/headers";
import { apiClient } from "@/services/api.service";

const LOCAL_HTTPS_RE = /^https:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;
let relaxedTlsDispatcher: import("undici").Dispatcher | undefined;

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
  } catch { }
  return headers;
}

export async function getDocumentsByAsset(assetId: number | string, includeAdHoc = false, includeDefinitionBased = false) {
  let url = `/AssetDocument/by-asset/${encodeURIComponent(String(assetId))}`;
  const params = new URLSearchParams();
  if (includeAdHoc) params.append("includeAdHoc", "true");
  if (includeDefinitionBased) params.append("includeDefinitionBased", "true");
  const qs = params.toString();
  if (qs) url += `?${qs}`;
  return apiClient.get<unknown>(url);
}

export async function getPhotosAndPlansByAsset(assetId: number | string) {
  return apiClient.get<unknown>(`/AssetDocument/by-asset/${encodeURIComponent(String(assetId))}/photos-and-plans`);
}

export async function getDocumentFileRaw(assetDocumentId: number | string): Promise<Response> {
  const url = `${getBaseUrl()}/AssetDocument/by-asset-document/${encodeURIComponent(String(assetDocumentId))}/file`;
  const headers = await getBinaryFetchHeaders();
  return documentServerFetch(url, { method: "GET", headers });
}

export async function getDocumentDefinitions(assetCategoryId: number, assetTypeId?: number) {
  const params = new URLSearchParams();
  params.append("assetCategoryId", assetCategoryId.toString());
  if (assetTypeId) params.append("assetTypeId", assetTypeId.toString());
  return apiClient.get<unknown>(`/AssetDocument/definitions?${params.toString()}`);
}

export async function deleteDocument(id: number) {
  return apiClient.delete<unknown>(`/AssetDocument/${id}`);
}

export async function uploadDocument(formData: FormData) {
  try {
    const { getModules } = await import("@/lib/api/configuration-settings/screenAccess/master-data.service");
    const modules = await getModules();
    const assetManagement = modules.find((m: any) => {
      const mName = m.moduleName || m.ModuleName;
      return mName && mName.toLowerCase().includes("asset management");
    });
    
    if (assetManagement) {
      const dynId = assetManagement.moduleId || (assetManagement as any).ModuleId || 0;
      if (dynId > 0 && formData.has("ModuleId")) {
        formData.set("ModuleId", dynId.toString());
      }
    }
  } catch (e) {
    console.error("Failed to dynamically resolve ModuleId at server service level", e);
  }

  try {
    const url = `${getBaseUrl()}/AssetDocument/upload`;
    const headers = await getBinaryFetchHeaders();
    
    // Do NOT set Content-Type header so fetch automatically handles multipart boundary.
    const response = await documentServerFetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok || (data && data.success === false)) {
      return { 
        success: false, 
        error: data.message || data.error || `Upload failed with status ${response.status}`, 
        statusCode: response.status 
      };
    }

    return { success: true, data: data.items || data.data || data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to upload document" };
  }
}

export async function uploadBulkDocuments(formData: FormData) {
  try {
    const { getModules } = await import("@/lib/api/configuration-settings/screenAccess/master-data.service");
    const modules = await getModules();
    const assetManagement = modules.find((m: any) => {
      const mName = m.moduleName || m.ModuleName;
      return mName && mName.toLowerCase().includes("asset management");
    });
    
    if (assetManagement) {
      const dynId = assetManagement.moduleId || (assetManagement as any).ModuleId || 0;
      if (dynId > 0 && formData.has("ModuleId")) {
        formData.set("ModuleId", dynId.toString());
      }
    }
  } catch (e) {
    console.error("Failed to dynamically resolve ModuleId at server service level", e);
  }

  const url = `${getBaseUrl()}/AssetDocument/upload/bulk`;
  const headers = await getBinaryFetchHeaders();
  
  const response = await documentServerFetch(url, { 
    method: "POST", 
    headers, 
    body: formData 
  });
  
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok || (data && data.success === false)) {
    let detailedErr = data.message || data.error || `Bulk upload failed with status ${response.status}`;
    // If backend provided detailed failedUploads, append it to the error string
    if (data.failedUploads && Array.isArray(data.failedUploads) && data.failedUploads.length > 0) {
      detailedErr += ` | Details: ${data.failedUploads.map((f: any) => f.errorMessage).join(", ")}`;
    } else if (data.data && Array.isArray(data.data.failedUploads) && data.data.failedUploads.length > 0) {
      detailedErr += ` | Details: ${data.data.failedUploads.map((f: any) => f.errorMessage).join(", ")}`;
    } else {
      // Just dump the entire response object!
      detailedErr += ` | RAW: ${JSON.stringify(data)}`;
    }
    return { success: false, error: detailedErr, statusCode: response.status, data: data.items || data.data || data };
  }

  return { success: true, data: data.items || data.data || data };
}
