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
import { departmentService } from "@/lib/api/asset/department.service";
import { moujaService } from "@/lib/api/asset/mouja.service";
import { wardService } from "@/lib/api/asset/ward.service";
import { zoneService } from "@/lib/api/asset/zone.service";
import { fetchBuildingFieldDefinitions } from "./actions";

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
  let prefetchedFields: any[] = [];
  let subzones: any[] = [];

  try {
    const [wardsRes, zonesRes, departmentsRes, moujasRes, fieldsRes, subzonesRes] = await Promise.all([
      wardService.getWards(),
      zoneService.getZones(),
      departmentService.getDepartments(),
      moujaService.getMoujas(),
      categoryId > 0 && typeId > 0
        ? fetchBuildingFieldDefinitions(categoryId, typeId)
        : Promise.resolve({ success: false as const, error: "Missing ids" }),
      zoneService.getSubZones(),
    ]);

    if (wardsRes.success && Array.isArray(wardsRes.data)) {
      wards = wardsRes.data;
    }
    if (zonesRes.success && Array.isArray(zonesRes.data)) {
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
  } catch (error) {
    console.error("⚠️ Failed to fetch master metadata from API on server:", error);
  }

  return (
    <BasicInfoPage 
      wards={wards} 
      zones={zones} 
      departments={departments}
      moujas={moujas}
      prefetchedFields={prefetchedFields} 
      subzones={subzones}
    />
  );
}
