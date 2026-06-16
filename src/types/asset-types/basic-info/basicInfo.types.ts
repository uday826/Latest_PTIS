import type { Ward } from "@/lib/api/asset/ward.service";
import type { Zone } from "@/lib/api/asset/zone.service";
import type { Department } from "@/lib/api/asset/department.service";
import type { Mouja } from "@/lib/api/asset/mouja.service";
import type { OwnershipType } from "@/lib/api/asset/ownership-type.service";
import type { ProcessedField } from "@/components/modules/assets/municipal-Asset/add-New-Asset/FieldRenderer";

export interface BasicInfoPageProps {
  wards?: Ward[];
  zones?: Zone[];
  departments?: Department[];
  moujas?: Mouja[];
  ownershipTypes?: OwnershipType[];
  prefetchedFields?: any[];
  subzones?: any[];
  useTypes?: any[];
}


export interface DynamicAttributesFormData {
  categoryId?: number;
  typeId?: number;
  category?: string;
  assetType?: string;
  attributes?: Record<string, string | number | boolean>;
}

export interface DynamicAttributesProps {
  formData: DynamicAttributesFormData;
  onAttributeChange: (name: string, value: string | number | boolean) => void;
  useApi?: boolean;
  prefetchedFields?: ProcessedField[];
}
