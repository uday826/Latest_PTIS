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

export async function uploadInventoryBatchDocument(formData: FormData) {
  try {
    if (!formData.has("ModuleId")) {
      formData.append("ModuleId", "2");
    }
  } catch (e) {
    console.error("Error setting ModuleId", e);
  }

  const url = `${getBaseUrl()}/AssetDocument/inventory-batch/upload`;
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
    let detailedErr = data.message || data.error || `Upload failed with status ${response.status}`;
    detailedErr += ` | RAW: ${JSON.stringify(data)}`;
    return { success: false, error: detailedErr, statusCode: response.status, data: data };
  }

  return { success: true, data: data };
}

export async function deleteInventoryBatchDocument(inventoryBatchId: number, deletedByUserId?: number) {
  let url = `/AssetDocument/inventory-batch/${inventoryBatchId}/document`;
  if (deletedByUserId) {
    url += `?deletedByUserId=${deletedByUserId}`;
  }
  return apiClient.delete<unknown>(url);
}

export async function getInventoryBatchDocuments(inventoryBatchId: number) {
  return apiClient.get<unknown>(`/AssetDocument/inventory-batch/${inventoryBatchId}/documents`);
}
