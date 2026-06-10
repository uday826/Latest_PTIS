"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
} from "@/components/common";
import type { BuildingPropertyDetailsSectionProps } from "@/types/asset-types/basic-info/buildBasicInfo.types";
import { ClipboardList } from "lucide-react";
import React from "react";

/**
 * Section A — Property Number Details
 *
 * Displays read-only Asset Category & Type badges, Zone/Ward dropdowns,
 * Property Tax No (required), and Survey No.
 * Validation errors are wired via showError / errors props.
 */
export function BuildingPropertyDetailsSection({
  formData,
  errors,
  showError,
  handleChange,
  wards = [],
  zones = [],
  moujas = [],
  subzones = [],
  isLoadingSubzones = false,
  onMoujaChange,
}: BuildingPropertyDetailsSectionProps): React.JSX.Element {
  const isLand = formData.valuationType
    ? formData.valuationType === "LAND"
    : formData.category?.toLowerCase().includes("land");

  return (
    <Card
      variant="bordered"
      padding="sm"
      className="shadow-sm border-slate-200/80 bg-white rounded-2xl"
    >
      <CardHeader className="flex items-center gap-2 border-b border-slate-100 pb-1.5 mb-2">
        <div className="bg-[#0f172a] p-1 rounded shadow-sm">
          <ClipboardList className="size-3.5 text-white" />
        </div>
        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-widest">
          Asset Details
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
        {/* Asset Category — read-only */}
        <div className="flex flex-col">
          <span className="mb-1.5 text-[13px] font-medium text-gray-700">
            Asset Category
          </span>
          <div className="h-8 px-2 bg-slate-100 border border-slate-200 rounded-md text-[13px] text-slate-700 font-bold flex items-center">
            {formData.category}
          </div>
        </div>

        {/* Asset Type — read-only */}
        <div className="flex flex-col">
          <span className="mb-1.5 text-[13px] font-medium text-gray-700">
            Asset Type
          </span>
          <div className="h-8 px-2 bg-slate-100 border border-slate-200 rounded-md text-[13px] text-slate-700 font-bold flex items-center truncate">
            {formData.assetType || "—"}
          </div>
        </div>

        <Select
          label="Zone"
          name="zone"
          value={formData.zone}
          onChange={handleChange}
          options={
            zones && zones.length > 0
              ? zones.map((z) => {
                const label =
                  z.zoneName ||
                  z.ZoneName ||
                  z.zoneNo ||
                  `Zone ${z.id || ""}`;
                return { label, value: String(z.id) };
              })
              : [
                { label: "Zone 1", value: "1" },
                { label: "Zone 2", value: "2" },
                { label: "Zone 3", value: "3" },
                { label: "Zone 4", value: "4" },
                { label: "Zone 5", value: "5" },
              ]
          }
          className="font-semibold text-sm"
          selectSize="sm"
          required
          error={showError("zone") ? errors.zone : undefined}
        />

        <Select
          label="Ward"
          name="ward"
          value={formData.ward}
          onChange={handleChange}
          disabled={!formData.zone}
          options={
            wards && wards.length > 0
              ? wards
                .filter((w) => !formData.zone || w.zoneId == null || String(w.zoneId) === String(formData.zone))
                .map((w) => {
                  const label =
                    w.wardName ||
                    w.WardName ||
                    w.wardNo ||
                    `Ward ${w.id || ""}`;
                  return { label, value: String(w.id) };
                })
              : Array.from({ length: 20 }, (_, i) => ({
                label: `Ward ${i + 1}`,
                value: String(i + 1),
              }))
          }
          className="font-semibold text-sm"
          selectSize="sm"
          required
          error={showError("ward") ? errors.ward : undefined}
        />
        <Select
          label="Mouja"
          name="mouja"
          value={formData.mouja}
          onChange={(e) => {
            handleChange(e);
            if (onMoujaChange) {
              onMoujaChange(e.target.value);
            }
          }}
          options={
            moujas && moujas.length > 0
              ? moujas.map((m) => {
                const label = m.moujaName || `Mouja ${m.id}`;
                return { label, value: String(m.id) };
              })
              : []
          }
          className="font-semibold text-sm"
          selectSize="sm"
          required
          error={showError("mouja" as any) ? (errors as any).mouja : undefined}
        />
        <Select
          label="Subzone"
          name="subzone"
          value={formData.subzone}
          onChange={handleChange}
          disabled={!formData.mouja || isLoadingSubzones}
          options={
            subzones && subzones.length > 0
              ? subzones.map((s) => {
                const label =
                  s.subZoneName ||
                  s.SubZoneName ||
                  s.subZoneNo ||
                  s.SubZoneNo ||
                  s.name ||
                  `Subzone ${s.id || ""}`;
                return { label, value: String(s.id || s.subZoneNo || s.SubZoneNo || "") };
              })
              : []
          }
          className="font-semibold text-sm"
          selectSize="sm"
          required
          error={showError("subzone" as any) ? (errors as any).subzone : undefined}
        />






        <Input
          label={isLand ? "CSN No. / Survey Number" : "CSN No."}
          name="surveyNumber"
          value={formData.surveyNumber}
          onChange={handleChange}
          placeholder="e.g. CSN-123"
          className="h-8 text-[13px]"
          error={showError("surveyNumber") ? errors.surveyNumber : undefined}
        />

        <Input
          label="Property Tax No"
          name="propertyNumber"
          value={formData.propertyNumber}
          onChange={handleChange}
          placeholder="e.g. MC/WD15/2024/001"
          className="h-8 text-[13px]"
          required
          error={showError("propertyNumber") ? errors.propertyNumber : undefined}
        />

        <Select
          label="Asset Condition"
          name="condition"
          value={formData.condition || "Good"}
          onChange={handleChange}
          options={[
            { label: "Good", value: "Good" },
            { label: "Average", value: "Average" },
            { label: "Poor", value: "Poor" },
          ]}
          className="font-semibold text-sm"
          selectSize="sm"
        />

        <Select
          label="Is Revenue Generating?"
          name="isRevenueGenerating"
          value={formData.isRevenueGenerating || "No"}
          onChange={handleChange}
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          className="font-semibold text-sm"
          selectSize="sm"
        />

        {isLand && (
          <Input
            label="Total Land Area (Sq. Ft)"
            name="landArea"
            value={formData.landArea || ""}
            onChange={handleChange}
            placeholder="0.00"
            type="number"
            className="h-8 text-[13px]"
            required
            error={showError("landArea" as any) ? (errors as any).landArea : undefined}
          />
        )}
      </CardContent>
    </Card>
  );
}
