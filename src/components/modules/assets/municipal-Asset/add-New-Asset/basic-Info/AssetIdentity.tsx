"use client";

import React from "react";
import { Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { ClipboardList } from "lucide-react";

import { AssetWizardStepProps } from "@/types/asset-types/basic-info/asset-wizard.types";
import { useAssetForm } from "../AssetFormContext";

export function AssetIdentity({ formData, onChange }: AssetWizardStepProps) {
  const { errors, submittedOnce } = useAssetForm();

  const showError = (field: string) => {
    return !!((submittedOnce || formData[field]) && errors?.[field]);
  };

  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-blue-100">
      <CardHeader className="flex items-center gap-2 border-b border-blue-50 pb-1.5 mb-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <ClipboardList className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          A) Asset Identity Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          <Input
            label="Asset Name"
            name="assetName"
            value={formData.assetName}
            onChange={onChange}
            placeholder="e.g. Town Hall Headquarters"
            required
            error={showError("assetName") ? errors?.assetName : undefined}
          />

          <Input
            label="Asset No"
            name="assetNo"
            value={formData.assetNo}
            onChange={onChange}
            placeholder="e.g. MC/W12/P45"
          />

          <Select
            label="Asset Status"
            name="status"
            value={formData.status || "Active"}
            onChange={onChange}
            options={[
              { label: "Active", value: "Active" },
              { label: "In-Active", value: "Inactive" },
              { label: "Under Maintenance", value: "UnderMaintenance" },
              { label: "Disposed", value: "Disposed" },
            ]}
          />

          <Select
            label="Asset Condition"
            name="condition"
            value={formData.condition || "Good"}
            onChange={onChange}
            options={[
              { label: "Good", value: "Good" },
              { label: "Average", value: "Average" },
              { label: "Poor", value: "Poor" },
            ]}
          />

          <Select
            label="Is Revenue Generating?"
            name="isRevenueGenerating"
            value={formData.isRevenueGenerating || "No"}
            onChange={onChange}
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
          />

          <div className="col-span-full mt-2 p-2 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                <div className={`size-3 rounded-full ${formData.parentAssetId ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Hierarchy Linkage</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Register this asset under a Parent Asset</p>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <Select
                label=""
                name="parentAssetId"
                value={formData.parentAssetId || ""}
                onChange={onChange}
                options={[
                  { label: "--- No Parent (Standalone) ---", value: "" },
                  { label: "Main Municipal Building (ADM-001)", value: "1" },
                  { label: "Zone 4 Office Complex (ADM-042)", value: "2" },
                  { label: "Central Warehouse (WH-09)", value: "3" },
                ]}
                className="bg-white"
              />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">Asset Description</label>
          <textarea
            name="assetDescription"
            value={formData.assetDescription || ""}
            onChange={onChange as any}
            className="w-full min-h-[80px] p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter detailed description of the asset..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
