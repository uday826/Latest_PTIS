"use server";

import { revalidatePath } from "next/cache";
import { createEmptyMasterData } from "@/config/asset.config";
import type {
  MasterDataConfig,
  MasterDataRecord,
} from "@/types/asset.types";

// ─── Simulated Server Store (for master-data configuration CRUDs) ───
let _serverStore: MasterDataConfig | null = null;

function getServerStore(): MasterDataConfig {
  if (!_serverStore) {
    _serverStore = createEmptyMasterData();
  }
  return _serverStore;
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMasterData(): Promise<{
  success: boolean;
  data?: MasterDataConfig;
  error?: string;
}> {
  try {
    await delay(400);
    const data = getServerStore();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to load master data from server.' };
  }
}

export async function createMasterRecord(
  key: keyof MasterDataConfig,
  record: Omit<MasterDataRecord, 'id' | 'createdDate'>
): Promise<{ success: boolean; data?: MasterDataRecord; error?: string }> {
  try {
    await delay(500);
    const store = getServerStore();
    const current = store[key] || [];
    const maxId = current.reduce((max, item) => Math.max(max, item.id), 0);
    const code = record.code?.trim() || `${String(key).toUpperCase()}-${maxId + 1}`;
    const name = record.name?.trim() || code;
    const newRecord: MasterDataRecord = {
      isActive: true,
      ...record,
      code,
      name,
      id: maxId + 1,
      createdDate: new Date().toISOString(),
    };
    _serverStore = { ...store, [key]: [...current, newRecord] };
    revalidatePath('/asset');
    return { success: true, data: newRecord };
  } catch (error) {
    return { success: false, error: 'Failed to create record.' };
  }
}

export async function updateMasterRecord(
  key: keyof MasterDataConfig,
  id: number,
  updates: Partial<MasterDataRecord>
): Promise<{ success: boolean; data?: MasterDataRecord; error?: string }> {
  try {
    await delay(500);
    const store = getServerStore();
    const current = store[key] || [];
    let updated: MasterDataRecord | null = null;
    _serverStore = {
      ...store,
      [key]: current.map((item) => {
        if (item.id !== id) return item;
        updated = { ...item, ...updates, modifiedDate: new Date().toISOString() };
        return updated;
      }),
    };
    if (!updated) return { success: false, error: `Record with id=${id} not found.` };
    revalidatePath('/asset');
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: 'Failed to update record.' };
  }
}

export async function deleteMasterRecord(
  key: keyof MasterDataConfig,
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await delay(400);
    const store = getServerStore();
    const current = store[key] || [];
    _serverStore = {
      ...store,
      [key]: current.filter((item) => item.id !== id),
    };
    revalidatePath('/asset');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete record.' };
  }
}

export async function toggleMasterRecordStatus(
  key: keyof MasterDataConfig,
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await delay(300);
    const store = getServerStore();
    const current = store[key] || [];
    _serverStore = {
      ...store,
      [key]: current.map((item) =>
        item.id === id
          ? { ...item, isActive: !item.isActive, modifiedDate: new Date().toISOString() }
          : item
      ),
    };
    revalidatePath('/asset');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to toggle status.' };
  }
}
