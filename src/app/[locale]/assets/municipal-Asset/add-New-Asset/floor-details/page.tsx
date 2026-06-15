export const dynamic = "force-dynamic";

import FloorDetailsPage from "@/components/modules/assets/municipal-Asset/add-New-Asset/floor-details/FloorDetailsStep";
import { fetchFloorDropdownOptions, getSubUnitsByAssetAction, fetchDepartmentsAction, fetchFloorsByAsset } from "./actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const rawId = resolvedParams.id || resolvedParams.assetId;
  const assetId = rawId ? Number(rawId) : 0;

  const dropdownsRes = await fetchFloorDropdownOptions();
  const subUnitsRes = assetId > 0 ? await getSubUnitsByAssetAction(assetId) : { success: true, data: [] };
  const departmentsRes = await fetchDepartmentsAction();
  const floorsRes = assetId > 0 ? await fetchFloorsByAsset(assetId) : { success: true, data: [] };

  const dropdownOptions = dropdownsRes.success ? {
    ...dropdownsRes.data,
    departments: departmentsRes.success ? departmentsRes.data : []
  } : null;
  const initialSubUnits = subUnitsRes.success && Array.isArray(subUnitsRes.data) ? subUnitsRes.data : [];
  const initialFloors = floorsRes.success && Array.isArray(floorsRes.data) ? floorsRes.data : [];

  return <FloorDetailsPage dropdownOptions={dropdownOptions} initialSubUnits={initialSubUnits} initialFloors={initialFloors} />;
}
