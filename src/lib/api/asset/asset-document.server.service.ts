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

export async function getDocumentsByAsset(assetId: number | string) {
  return apiClient.get<unknown>(`/AssetDocument/by-asset/${encodeURIComponent(String(assetId))}`);
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
  return apiClient.post<unknown>('/AssetDocument/upload', formData);
}

