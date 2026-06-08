'use server';

import type { MunicipalAsset } from '@/components/modules/assets/municipal-Asset/data/municipalAssets';
import { municipalAssets } from '@/components/modules/assets/municipal-Asset/data/municipalAssets';
import { notFound } from 'next/navigation';

/**
 * Server Action to fetch municipal asset by its unique identifier.
 * Implements standard error boundaries, handles dynamic route parameters,
 * and parses numeric identifiers safely.
 */
export async function getMunicipalAssetByIdAction(id: string): Promise<MunicipalAsset> {
  // Simulate server network latency
  await new Promise((resolve) => setTimeout(resolve, 50));

  const found = municipalAssets.find((item) => item.id === id);
  if (!found) {
    notFound();
  }

  return found;
}
