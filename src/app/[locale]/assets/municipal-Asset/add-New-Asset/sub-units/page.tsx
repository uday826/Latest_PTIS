import { StandaloneSubUnitStep } from "@/components/modules/assets/municipal-Asset/add-New-Asset/sub-units/StandaloneSubUnitStep";
import { fetchSubUnitDropdowns } from "./actions";
import { getSubUnitsByAssetAction } from "../floor-details/actions";

export default async function SubUnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const rawId = resolvedParams.id || resolvedParams.assetId || resolvedParams.parentBuildingId;
  const parentBuildingId = rawId ? Number(rawId) : 0;

  const dropdownsRes = await fetchSubUnitDropdowns();
  const subUnitsRes = parentBuildingId > 0 ? await getSubUnitsByAssetAction(parentBuildingId) : { success: true, data: [] };

  const dropdownOptions = dropdownsRes.success ? dropdownsRes.data : {
    floorLevels: [],
    constructionTypes: [],
    useTypes: [],
    departments: []
  };
  const initialSubUnits = subUnitsRes.success && Array.isArray(subUnitsRes.data) ? subUnitsRes.data : [];

  return <StandaloneSubUnitStep dropdownOptions={dropdownOptions} initialSubUnits={initialSubUnits} />;
}
