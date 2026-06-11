"use client";

import { useAssetForm } from "../AssetFormContext";
import { UnitPoolPanel } from "./UnitPoolPanel";
import { DirectRoomRegistrationPanel } from "./DirectRoomRegistrationPanel";
import { MapPicker } from "../basic-Info/MapPicker";
import { useFloorAssetFlow } from "@/hooks/asset-hooks/floor-details/useFloorAssetFlow";

export default function FloorDetailsPage({ dropdownOptions: initialDropdownOptions }: { dropdownOptions?: any }) {
  const {
    dropdownOptions,
    isMapOpen, setIsMapOpen,
    handleMapSelect,
  } = useFloorAssetFlow(initialDropdownOptions);

  // NOTE: No registerSubmitHook here — UnitPoolPanel registers handleSaveAll as
  // the submit hook directly via its own useEffect. Registering a second hook here
  // would conflict and override UnitPoolPanel's save logic.
  const { formData } = useAssetForm();

  // If both flags are undefined, default to true for Unit Registration to maintain backward compatibility
  const showUnitRegistration = formData.allowUnitRegistration ?? true;
  const showRoomRegistration = formData.allowRoomRegistration ?? false;

  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* UnitPoolPanel registers handleSaveAll as the SAVE & NEXT submit hook */}
      {showUnitRegistration && <UnitPoolPanel dropdownOptions={dropdownOptions} />}

      {showRoomRegistration && <DirectRoomRegistrationPanel dropdownOptions={dropdownOptions} />}

      <MapPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={handleMapSelect}
        initialLat={formData.latitude}
        initialLng={formData.longitude}
      />
    </div>
  );
}
