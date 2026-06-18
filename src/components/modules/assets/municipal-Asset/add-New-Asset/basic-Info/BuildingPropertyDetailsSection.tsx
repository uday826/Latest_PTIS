"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SearchSelect,
} from "@/components/common";
import type { BuildingPropertyDetailsSectionProps } from "@/types/asset-types/basic-info/buildBasicInfo.types";
import { Building } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

/**
 * Section A — Property Number Details
 *
 * Displays read-only Asset Category & Type badges, Zone/Ward dropdowns,
 * Property  No (required), and Survey No.
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
  useTypes = [],
  subUseTypes = [],
  isLoadingSubTypes = false,
}: BuildingPropertyDetailsSectionProps): React.JSX.Element {
  const t = useTranslations("addAssetForm");

  const isLand = formData.valuationType
    ? formData.valuationType === "LAND"
    : formData.category?.toLowerCase().includes("land");

  const isBuilding = formData.valuationType
    ? formData.valuationType === "BUILDING"
    : formData.category?.toLowerCase().includes("building") || (formData as any).hasFloorDetails === true;

  return (
    <Card
      variant="bordered"
      padding="sm"
      className="shadow-sm border-slate-200/80 bg-white rounded-2xl"
    >
      <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border border-[#A3CBFA] rounded-xl py-1 px-2.5 mb-2.5 shadow-sm">
        <div className="bg-[#1d4ed8] p-1 rounded-lg text-white shadow-sm flex items-center justify-center shrink-0">
          <Building className="size-3.5 text-white" />
        </div>
        <CardTitle className="text-xs font-bold text-[#1d4ed8] uppercase tracking-widest">
          {t("basicInfo.propertyDetails.title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-start text-[11px] [&_label]:text-[11px] [&_label]:mb-1 [&_span[id$=-label]]:text-[11px] [&_input]:!px-2 [&_input]:!py-1 [&_input]:!h-7 [&_input]:!text-[11px] [&_input]:!rounded-md [&_button[role=combobox]]:!px-2 [&_button[role=combobox]]:!h-7 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px] [&_span.text-red-600]:text-[10px] [&_span.text-red-600]:mt-0.5">
        {/* Asset Category — read-only */}
        <div className="flex flex-col">
          <span className="mb-1 text-[11px] font-medium text-gray-700">
            {t("basicInfo.propertyDetails.assetCategory")}
          </span>
          <div className="h-7 px-2 bg-slate-100 border border-slate-200 rounded-md text-[11px] text-slate-700 font-bold flex items-center">
            {formData.category}
          </div>
        </div>

        {/* Asset Type — read-only */}
        <div className="flex flex-col">
          <span className="mb-1 text-[11px] font-medium text-gray-700">
            {t("basicInfo.propertyDetails.assetType")}
          </span>
          <div className="h-7 px-2 bg-slate-100 border border-slate-200 rounded-md text-[11px] text-slate-700 font-bold flex items-center truncate">
            {formData.assetType || "—"}
          </div>
        </div>

        <SearchSelect
          label={t("basicInfo.propertyDetails.mouja")}
          name="mouja"
          value={formData.mouja}
          onChange={(name, value) => {
            handleChange({ target: { name, value } } as any);
            if (onMoujaChange) {
              onMoujaChange(value);
            }
          }}
          disabled={formData.isMovableCategory}
          options={
            moujas && moujas.length > 0
              ? moujas.map((m) => {
                const label = m.moujaName || `Mouja ${m.id}`;
                return { label, value: String(m.id) };
              })
              : []
          }
          placeholder={t("basicInfo.propertyDetails.selectMouja")}
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("mouja" as any) ? (errors as any).mouja : undefined}
        />

        <SearchSelect
          label={t("basicInfo.propertyDetails.zone")}
          name="zone"
          value={formData.zone}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          disabled={formData.isMovableCategory}
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
                { label: `${t("basicInfo.propertyDetails.zone")} 1`, value: "1" },
                { label: `${t("basicInfo.propertyDetails.zone")} 2`, value: "2" },
                { label: `${t("basicInfo.propertyDetails.zone")} 3`, value: "3" },
                { label: `${t("basicInfo.propertyDetails.zone")} 4`, value: "4" },
                { label: `${t("basicInfo.propertyDetails.zone")} 5`, value: "5" },
              ]
          }
          placeholder={t("basicInfo.propertyDetails.selectZone")}
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("zone") ? errors.zone : undefined}
        />

        <SearchSelect
          label={t("basicInfo.propertyDetails.ward")}
          name="ward"
          value={formData.ward}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          disabled={formData.isMovableCategory || !formData.zone}
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
          placeholder={t("basicInfo.propertyDetails.selectWard")}
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("ward") ? errors.ward : undefined}
        />

        <SearchSelect
          label={t("basicInfo.propertyDetails.subzone")}
          name="subzone"
          value={formData.subzone}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          disabled={formData.isMovableCategory || !formData.mouja || isLoadingSubzones}
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
          placeholder={t("basicInfo.propertyDetails.selectSubzone")}
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("subzone" as any) ? (errors as any).subzone : undefined}
        />

        <Input
          label={isLand ? t("basicInfo.propertyDetails.csnNoSurvey") : t("basicInfo.propertyDetails.csnNo")}
          name="surveyNumber"
          value={formData.surveyNumber}
          onChange={handleChange}
          placeholder="e.g. CSN-123"
          disabled={formData.isMovableCategory}
          className="h-8 text-[13px]"
          error={showError("surveyNumber") ? errors.surveyNumber : undefined}
        />

        <div className="hidden">
          <Input
            label={t("basicInfo.propertyDetails.propertyNo")}
            name="propertyNumber"
            value={formData.propertyNumber}
            onChange={handleChange}
            placeholder="e.g. MC/WD15/2024/001"
            className="h-8 text-[13px]"
            required
            error={showError("propertyNumber") ? errors.propertyNumber : undefined}
          />
        </div>

        <SearchSelect
          label={t("basicInfo.propertyDetails.assetCondition")}
          name="condition"
          value={formData.condition || "Good"}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          options={[
            { label: t("basicInfo.propertyDetails.conditions.good"), value: "Good" },
            { label: t("basicInfo.propertyDetails.conditions.average"), value: "Average" },
            { label: t("basicInfo.propertyDetails.conditions.poor"), value: "Poor" },
          ]}
          placeholder={t("basicInfo.propertyDetails.selectCondition")}
          className="font-semibold text-sm"
        />

        {
          (isLand || isBuilding) && (
            <>
              <Input
                label={t("basicInfo.propertyDetails.length")}
                name="length"
                value={(formData as any).length || ""}
                onChange={handleChange}
                placeholder="0.00"
                type="text"
                className="h-8 text-[13px]"
                required
                error={showError("length" as any) ? (errors as any).length : undefined}
              />
              <Input
                label={t("basicInfo.propertyDetails.width")}
                name="width"
                value={(formData as any).width || ""}
                onChange={handleChange}
                placeholder="0.00"
                type="text"
                className="h-8 text-[13px]"
                required
                error={showError("width" as any) ? (errors as any).width : undefined}
              />
              {isLand && (
                <>
                  <SearchSelect
                    label={t("basicInfo.propertyDetails.offsetOperation")}
                    name="offsetOp"
                    value={(formData as any).offsetOp || "Subtract"}
                    onChange={(name, value) => handleChange({ target: { name, value } } as any)}
                    options={[
                      { label: t("basicInfo.propertyDetails.offsetOps.add"), value: "Add" },
                      { label: t("basicInfo.propertyDetails.offsetOps.subtract"), value: "Subtract" },
                    ]}
                    placeholder={t("basicInfo.propertyDetails.selectOffsetOp")}
                    className="font-semibold text-sm"
                    required
                  />
                  <Input
                    label={t("basicInfo.propertyDetails.offset")}
                    name="offset"
                    value={(formData as any).offset || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    type="text"
                    className="h-8 text-[13px]"
                    required
                    error={showError("offset" as any) ? (errors as any).offset : undefined}
                  />
                </>
              )}
              <Input
                label={t("basicInfo.propertyDetails.totalArea")}
                name="landArea"
                value={formData.landArea || ""}
                onChange={handleChange}
                placeholder="0.00"
                type="text"
                readOnly
                className="h-8 text-[13px] bg-slate-50 cursor-not-allowed"
                required
                error={showError("landArea" as any) ? (errors as any).landArea : undefined}
              />
            </>
          )
        }

        {
          isLand && (
            <>
              <Input
                label={t("basicInfo.propertyDetails.plotNumber")}
                name="plotNumber"
                value={(formData as any).plotNumber || ""}
                onChange={handleChange}
                placeholder="e.g. 15"
                className="h-8 text-[13px]"
                required
                error={showError("plotNumber" as any) ? (errors as any).plotNumber : undefined}
              />
              <SearchSelect
                label={t("basicInfo.propertyDetails.typeOfUse")}
                name="typeOfUseId"
                value={(formData as any).typeOfUseId || ""}
                onChange={(name, value) => handleChange({ target: { name, value } } as any)}
                options={
                  useTypes && useTypes.length > 0
                    ? useTypes.map((ut) => ({
                      label: ut.description || ut.typeOfUseCode || `Use Type ${ut.typeOfUseId}`,
                      value: String(ut.typeOfUseId),
                    }))
                    : []
                }
                placeholder={t("basicInfo.propertyDetails.selectTypeOfUse")}
                className="font-semibold text-sm"
                required
                error={showError("typeOfUseId" as any) ? (errors as any).typeOfUseId : undefined}
              />
              <SearchSelect
                label={t("basicInfo.propertyDetails.subTypeOfUse")}
                name="subTypeOfUseId"
                value={(formData as any).subTypeOfUseId || ""}
                onChange={(name, value) => handleChange({ target: { name, value } } as any)}
                options={
                  subUseTypes && subUseTypes.length > 0
                    ? subUseTypes.map((sub) => ({
                      label: sub.description || `Sub Type ${sub.subTypeOfUseId}`,
                      value: String(sub.subTypeOfUseId),
                    }))
                    : []
                }
                placeholder={t("basicInfo.propertyDetails.selectSubTypeOfUse")}
                className="font-semibold text-sm"
                disabled={!(formData as any).typeOfUseId || isLoadingSubTypes}
                required
                error={showError("subTypeOfUseId" as any) ? (errors as any).subTypeOfUseId : undefined}
              />
            </>
          )
        }
      </CardContent >
    </Card >
  );
}
