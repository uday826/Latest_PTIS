import { StandaloneSubUnitStep } from "@/components/modules/assets/municipal-Asset/add-New-Asset/sub-units/StandaloneSubUnitStep";
import { fetchSubUnitDropdowns } from "./actions";

export default async function SubUnitsPage() {
  const dropdownsRes = await fetchSubUnitDropdowns();
  
  const dropdownOptions = dropdownsRes.success ? dropdownsRes.data : {
    floorLevels: [],
    constructionTypes: [],
    useTypes: [],
    departments: []
  };

  return <StandaloneSubUnitStep dropdownOptions={dropdownOptions} />;
}
