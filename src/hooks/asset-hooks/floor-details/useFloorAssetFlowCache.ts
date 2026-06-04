import { NewFloorFormState, BulkGeneratorState } from "@/types/asset/floor-details.types";
import { ActionResult } from "@/types/common.types";
import { FloorStepData } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";

export const CURRENT_YEAR = new Date().getFullYear().toString();

export const DEFAULT_NEW_FLOOR: NewFloorFormState = {
  floor: "",
  conYear: CURRENT_YEAR,
  asstYear: CURRENT_YEAR,
  conType: "",
  useType: "",
  subUseType: "",
  rooms: 0,
  carpetAreaSqM: 0,
  builtUpAreaSqM: 0,
  baseValue: 0,
};

export const DEFAULT_BULK: BulkGeneratorState = {
  unitType: "",
  prefix: "FLAT-",
  startNum: 1,
  count: 1,
  areaSqFt: 0,
};

// Module-scoped caching and promise locks to prevent duplicate concurrent queries
export const cacheLock = {
  activeInitPromise: null as Promise<ActionResult<FloorStepData>> | null,
  cachedResult: null as ActionResult<FloorStepData> | null,
  cachedAssetId: null as number | null,
};

/**
 * Utility function to cleanly transform API database responses into front-end FloorEntry states.
 */
export function mapFloorsFromApi(floors: any): any[] {
  let floorsArray: any[] = [];
  if (Array.isArray(floors)) {
    floorsArray = floors;
  } else if (floors && Array.isArray(floors.items)) {
    floorsArray = floors.items;
  } else if (floors && Array.isArray(floors.data)) {
    floorsArray = floors.data;
  } else if (floors && Array.isArray(floors.result)) {
    floorsArray = floors.result;
  }

  return floorsArray.map((item: any) => ({
    id: item.id,
    checked: true,
    floor: String(item.floorId),
    conType: String(item.constructionTypeId),
    conYear: item.constructionYear,
    asstYear: item.assessmentYear,
    useType: String(item.typeOfUseId),
    subUseType: String(item.subTypeOfUseId),
    rooms: item.noOfRooms,
    carpetAreaSqFt: item.carpetAreaSqFeet,
    carpetAreaSqM: item.carpetAreaSqMeter,
    builtUpAreaSqFt: item.builtUpAreaSqFeet,
    builtUpAreaSqM: item.builtUpAreaSqMeter,
    baseValue: item.cvBaseRate || 0,
    floorFactor: `1.00 / ${Number(item.cvBaseRate || 0).toLocaleString()}`,
    ageFactor: item.cvAgeFactor || 1.0,
    units: [],
  }));
}

/**
 * Invalidates and clears the module-scoped dynamic floor data cache.
 * Must be invoked upon any mutative operations (Add, Update, Delete of floor or subunit levels).
 */
export function invalidateFloorCache() {
  cacheLock.cachedResult = null;
  cacheLock.cachedAssetId = null;
  cacheLock.activeInitPromise = null;
}
