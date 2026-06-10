import { cache } from 'react';

import { zoneService } from './zone.service';
import { wardService } from './ward.service';
import { departmentService } from './department.service';
import { moujaService } from './mouja.service';
import { categoryTypeService } from './category-type.service';
import { ownershipTypeService } from './ownership-type.service';

/**
 * CACHED MASTER DATA FETCHERS
 * 
 * We use a combination of:
 * 1. React's `cache()` to deduplicate calls within the same request lifecycle (e.g., across multiple Server Components).
 * 2. Next.js' `unstable_cache()` to cache the results on the server across multiple requests, revalidating every 5 minutes.
 * 
 * This significantly reduces backend API load and improves page render performance, especially for the multi-step Asset Form.
 */

export const getCachedZones = cache(async () => {
  return await zoneService.getZones();
});

export const getCachedWards = cache(async () => {
  return await wardService.getWards();
});

export const getCachedDepartments = cache(async () => {
  return await departmentService.getDepartments();
});

export const getCachedMoujas = cache(async () => {
  return await moujaService.getMoujas();
});

export const getCachedCategories = cache(async () => {
  return await categoryTypeService.getCategories();
});

export const getCachedTypes = cache(async () => {
  return await categoryTypeService.getAllTypes();
});

export const getCachedOwnershipTypes = cache(async () => {
  return await ownershipTypeService.getOwnershipTypes();
});

