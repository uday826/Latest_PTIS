"use client";

import { Card, CardContent, CardHeader, CardTitle, Input } from "@/components/common";
import { UserCheck } from "lucide-react";

import { AssetWizardStepProps } from "@/types/asset-types/basic-info/asset-wizard.types";
import { useAssetForm } from "../AssetFormContext";

export function AssetContact({ formData, onChange }: AssetWizardStepProps) {
  const { errors, submittedOnce } = useAssetForm();

  const showError = (field: string) => {
    return !!((submittedOnce || formData[field]) && errors?.[field]);
  };

  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-amber-100 mt-2">
      <CardHeader className="flex items-center gap-2 border-b border-amber-50 pb-1.5 mb-2">
        <div className="bg-amber-600 p-1.5 rounded-lg">
          <UserCheck className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          C) In-Charge / Contact Person Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Input
          label="Name of In-Charge"
          name="inChargeName"
          value={formData.inChargeName}
          onChange={onChange}
          placeholder="e.g. Mr. Rajesh Sharma"
          error={showError("inChargeName") ? errors?.inChargeName : undefined}
        />
        <Input
          label="Designation"
          name="inChargeDesignation"
          value={formData.inChargeDesignation}
          onChange={onChange}
          placeholder="e.g. Executive Engineer"
          required
          error={showError("inChargeDesignation") ? errors?.inChargeDesignation : undefined}
        />
        <Input
          label="Mobile Number"
          name="inChargeMobile"
          value={formData.inChargeMobile}
          onChange={onChange}
          placeholder="10-digit mobile number"
          type="tel"
          maxLength={10}
          error={showError("inChargeMobile") ? errors?.inChargeMobile : undefined}
        />
        <Input
          label="Email Address"
          name="inChargeEmail"
          value={formData.inChargeEmail}
          onChange={onChange}
          placeholder="official@municipality.gov.in"
          type="email"
          error={showError("inChargeEmail") ? errors?.inChargeEmail : undefined}
        />
        <Input
          label="Office Extension"
          name="officeExtension"
          value={formData.officeExtension}
          onChange={onChange}
          placeholder="e.g. 104"
        />
      </CardContent>
    </Card>
  );
}
