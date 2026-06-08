"use client";

import { Card, CardContent, CardHeader, CardTitle, Select } from "@/components/common";
import { Landmark } from "lucide-react";

import type { Department } from "@/lib/api/asset/department.service";
import type { Ward } from "@/lib/api/asset/ward.service";
import type { Zone } from "@/lib/api/asset/zone.service";
import { AssetWizardStepProps } from "@/types/asset-types/basic-info/asset-wizard.types";
import { useAssetForm } from "../AssetFormContext";

export interface AssetJurisdictionProps extends AssetWizardStepProps {
  wards?: Ward[];
  zones?: Zone[];
  departments?: Department[];
}

export function AssetJurisdiction({
  formData,
  onChange,
  wards = [],
  zones = [],
  departments = [],
}: AssetJurisdictionProps) {
  const { errors, submittedOnce } = useAssetForm();

  const showError = (field: string) => {
    return !!((submittedOnce || formData[field]) && errors?.[field]);
  };

  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-emerald-100 mt-2">
      <CardHeader className="flex items-center gap-2 border-b border-emerald-50 pb-1.5 mb-2">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <Landmark className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          B) Jurisdiction &amp; Administration
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Select
          label="Authority"
          name="authorityId"
          value={formData.authorityId}
          onChange={onChange}
          required
          options={[
            { label: "ULB (Municipal Council)", value: "ULB" },
            { label: "MIDC", value: "MIDC" },
            { label: "CIDCO", value: "CIDCO" },
          ]}
          error={showError("authorityId") ? errors?.authorityId : undefined}
        />
        <Select
          label="Organization / Office"
          name="organizationId"
          value={formData.organizationId}
          onChange={onChange}
          required
          options={[
            { label: "Main Headquarters", value: "HQ" },
            { label: "Divisional Office - North", value: "DIV_NORTH" },
            { label: "Divisional Office - South", value: "DIV_SOUTH" },
          ]}
          error={showError("organizationId") ? errors?.organizationId : undefined}
        />
        <Select
          label="Owning Department"
          name="departmentId"
          value={formData.departmentId}
          onChange={onChange}
          required
          options={
            departments.map((d) => {
              const label = d.departmentName || `Department ${d.id}`;
              return { label, value: String(d.id), image: d.imageUrl };
            })
          }
          error={showError("departmentId") ? errors?.departmentId : undefined}
        />
        <Select
          label="Zone (Location Node)"
          name="zoneId"
          value={formData.zoneId}
          onChange={onChange}
          required
          options={
            zones.map((z) => {
              const label =
                z.zoneName ||
                z.ZoneName ||
                z.zoneNo ||
                `Zone ${z.id || ""}`;
              return { label, value: String(z.id) };
            })
          }
          error={showError("zoneId") ? errors?.zoneId : undefined}
        />
        <Select
          label="Ward (Location Node)"
          name="wardId"
          value={formData.wardId}
          onChange={onChange}
          disabled={!formData.zoneId}
          required
          options={
            wards
              .filter((w) => !formData.zoneId || w.zoneId == null || String(w.zoneId) === String(formData.zoneId))
              .map((w) => {
                const label =
                  w.wardName ||
                  w.WardName ||
                  w.wardNo ||
                  `Ward ${w.id || ""}`;
                return { label, value: String(w.id) };
              })
          }
          error={showError("wardId") ? errors?.wardId : undefined}
        />
        <Select
          label="Operational Control"
          name="operationalControl"
          value={formData.operationalControl}
          onChange={onChange}
          options={[
            { label: "Self Managed", value: "self" },
            { label: "Outsourced / Contract", value: "outsourced" },
            { label: "Leased Out", value: "leased" },
          ]}
        />
      </CardContent>
    </Card>
  );
}
