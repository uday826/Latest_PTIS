export const dynamic = "force-dynamic";

import FloorDetailsPage from "@/components/modules/assets/municipal-Asset/add-New-Asset/floor-details/FloorDetailsStep";
import { fetchFloorDropdownOptions } from "./actions";

export default async function Page() {
  const dropdownsRes = await fetchFloorDropdownOptions();
  const dropdownOptions = dropdownsRes.success ? dropdownsRes.data : null;

  return <FloorDetailsPage dropdownOptions={dropdownOptions} />;
}
