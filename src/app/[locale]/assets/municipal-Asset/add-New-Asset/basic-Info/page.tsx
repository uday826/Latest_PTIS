/**
 * Building Basic Info — Server Page
 *
 * This is a Server Component. It fetches field definitions for the selected
 * Building category + type from the URL searchParams, then passes the
 * pre-fetched data as props to the client component.
 *
 * The client component (BuildingBasicInfoStep) never needs to fire its own
 * fetch request — eliminating the useEffect + client-side fetch anti-pattern.
 */

import BasicInfoPage from "@/components/modules/assets/municipal-Asset/add-New-Asset/basic-Info/BasicInfoStep";
import { getCachedWards, getCachedZones, getCachedDepartments, getCachedMoujas, getCachedOwnershipTypes } from "@/lib/api/asset/cached-master-data";
import { fetchBuildingFieldDefinitions } from "./actions";
import { zoneService } from "@/lib/api/asset/zone.service";
import { getUseTypesPagedServer } from "@/lib/api/typeofuse.service";
import { getSubTypesPagedServer } from "@/lib/api/typeofusesubtype.service";

interface BuildingBasicInfoPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuildingBasicInfoPage({
  searchParams: _searchParams,
}: BuildingBasicInfoPageProps): Promise<React.JSX.Element> {
  const params = await _searchParams;
  const categoryId = Number(params.categoryId || params.CategoryId || 0);
  const typeId = Number(params.typeId || params.TypeId || 0);

  // Fetch wards, zones, departments, moujas, and field definitions concurrently on the server side — no client-side useEffects!
  let wards: any[] = [];
  let zones: any[] = [];
  let departments: any[] = [];
  let moujas: any[] = [];
  let ownershipTypes: any[] = [];
  let prefetchedFields: any[] = [];
  let subzones: any[] = [];
  let useTypes: any[] = [];
  let subUseTypes: any[] = [];

  try {
    // Fetch CONCURRENTLY to prevent overloading the backend latency-wise
    const [wardsRes, zonesRes, departmentsRes, moujasRes, subzonesRes, ownershipRes] = await Promise.all([
      getCachedWards(),
      getCachedZones(),
      getCachedDepartments(),
      getCachedMoujas(),
      zoneService.getSubZones(),
      getCachedOwnershipTypes()
    ]);

    const fieldsRes = categoryId > 0 && typeId > 0
      ? await fetchBuildingFieldDefinitions(categoryId, typeId)
      : { success: false as const, error: "Missing ids", data: [] };

    let useTypesRes: any = null;
    let subUseTypesRes: any = null;
    try {
      [useTypesRes, subUseTypesRes] = await Promise.all([
        getUseTypesPagedServer({ pageNumber: 1, pageSize: 1000 }),
        getSubTypesPagedServer({ pageNumber: 1, pageSize: 1000 })
      ]);
    } catch (utErr) {
      console.error("Failed to fetch use types or subtypes in server component:", utErr);
    }

    if (wardsRes?.success && Array.isArray(wardsRes.data)) {
      wards = wardsRes.data;
    }
    if (zonesRes?.success && Array.isArray(zonesRes.data)) {
      zones = zonesRes.data;
    }
    if (departmentsRes.success && Array.isArray(departmentsRes.data)) {
      departments = departmentsRes.data;
    }
    if (moujasRes.success && Array.isArray(moujasRes.data)) {
      moujas = moujasRes.data;
    }
    if (fieldsRes.success && Array.isArray(fieldsRes.data)) {
      prefetchedFields = fieldsRes.data;
    }
    if (subzonesRes.success && Array.isArray(subzonesRes.data)) {
      subzones = subzonesRes.data;
    }
    if (ownershipRes.success && Array.isArray(ownershipRes.data)) {
      ownershipTypes = ownershipRes.data;
    }
    if (useTypesRes && Array.isArray(useTypesRes.items)) {
      useTypes = useTypesRes.items;
    }
    if (subUseTypesRes && Array.isArray(subUseTypesRes.items)) {
      subUseTypes = subUseTypesRes.items;
    }
  } catch (error) {
    console.error("Error pre-fetching data in BuildingBasicInfoPage:", error);
  }

  return (
    <BasicInfoPage
      wards={wards}
      zones={zones}
      departments={departments}
      moujas={moujas}
      ownershipTypes={ownershipTypes}
      prefetchedFields={prefetchedFields}
      subzones={subzones}
      useTypes={useTypes}
      subUseTypes={subUseTypes}
    />
  );
}
