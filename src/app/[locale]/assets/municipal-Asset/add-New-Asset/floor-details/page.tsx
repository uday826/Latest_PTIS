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

  const [dropdownsRes, subUnitsRes, departmentsRes, floorsRes] = await Promise.all([
    fetchFloorDropdownOptions(),
    assetId > 0 ? getSubUnitsByAssetAction(assetId) : Promise.resolve({ success: true, data: [] }),
    fetchDepartmentsAction(),
    assetId > 0 ? fetchFloorsByAsset(assetId) : Promise.resolve({ success: true, data: [] }),
  ]);

  const dropdownOptions = dropdownsRes.success ? {
    ...dropdownsRes.data,
    departments: departmentsRes.success ? departmentsRes.data : []
  } : null;
  const initialSubUnits = subUnitsRes.success && Array.isArray(subUnitsRes.data) ? subUnitsRes.data : [];
  const initialFloors = floorsRes.success && Array.isArray(floorsRes.data) ? floorsRes.data : [];

  return <FloorDetailsPage dropdownOptions={dropdownOptions} initialSubUnits={initialSubUnits} initialFloors={initialFloors} />;
}
