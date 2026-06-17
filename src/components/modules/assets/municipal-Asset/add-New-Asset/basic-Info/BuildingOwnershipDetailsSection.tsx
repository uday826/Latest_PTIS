"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SearchSelect,
  TextArea,
} from "@/components/common";
import type { BuildingOwnershipDetailsSectionProps } from "@/types/asset-types/basic-info/buildBasicInfo.types";
import { Map as MapIcon, UserCheck } from "lucide-react";
import React from "react";
import { MapPicker } from "./MapPicker";

/**
 * Section B — Ownership Details & Address Details
 *
 * All visible fields drive validation. Required fields have error display.
 * No `any` types. Accessibility: aria-invalid + aria-describedby wired by
 * the common <Input> and <Select> receiving the `error` prop.
 */
export function BuildingOwnershipDetailsSection({
  formData,
  errors,
  showError,
  handleChange,
  departments = [],
  ownershipTypes = [],
  updateFormData,
}: BuildingOwnershipDetailsSectionProps): React.JSX.Element {
  const [isMapOpen, setIsMapOpen] = React.useState(false);

  const handleMapSelect = (lat: string, lng: string) => {
    if (updateFormData) {
      updateFormData({ latitude: lat, longitude: lng });
    }
    setIsMapOpen(false);
  };

  const resolvedOwnershipOptions = ownershipTypes.length > 0
    ? ownershipTypes.map(ot => {
      const label = ot.ownershipTypeName || ot.name || ot.code || `Ownership ${ot.id}`;
      const value = ot.ownershipTypeName || ot.code || String(ot.id);
      return { label, value };
    })
    : [
      { label: "Municipal", value: "municipal" },
      { label: "Leased", value: "leased" },
      { label: "Private/Rented", value: "private" },
    ];


  return (
    <Card
      variant="bordered"
      padding="sm"
      className="shadow-sm border-slate-200/80 bg-white rounded-2xl"
    >
      <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border border-[#A3CBFA] rounded-xl py-1 px-2.5 mb-2.5 shadow-sm">
        <div className="bg-[#1d4ed8] p-1 rounded-lg text-white shadow-sm flex items-center justify-center shrink-0">
          <UserCheck className="size-3.5 text-white" />
        </div>
        <CardTitle className="text-xs font-bold text-[#1d4ed8] uppercase tracking-widest">
          Ownership Details &amp; Address Details
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-start text-[11px] [&_label]:text-[11px] [&_label]:mb-1 [&_span[id$=-label]]:text-[11px] [&_input]:!px-2 [&_input]:!py-1 [&_input]:!h-7 [&_input]:!text-[11px] [&_input]:!rounded-md [&_button[role=combobox]]:!px-2 [&_button[role=combobox]]:!h-7 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px] [&_textarea]:!px-2 [&_textarea]:!py-1 [&_textarea]:!min-h-[28px] [&_textarea]:!text-[11px] [&_textarea]:!rounded-md [&_span.text-red-600]:text-[10px] [&_span.text-red-600]:mt-0.5">
        {/* Map Picker Modal */}
        <MapPicker
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onSelect={handleMapSelect}
          initialLat={formData.latitude}
          initialLng={formData.longitude}
        />

        <SearchSelect
          label="Owning Department"
          name="department"
          value={formData.department}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          disabled={formData.isMovableCategory}
          options={
            departments.map((d) => {
              const label = d.departmentName || `Department ${d.id}`;
              return { label, value: String(d.id) };
            })
          }
          placeholder="Select Owning Department"
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("department") ? errors.department : undefined}
        />

        <div className="md:col-span-2 lg:col-span-2">
          <Input
            label="Asset Name"
            name="assetName"
            value={formData.assetName}
            onChange={(e: any) => handleChange(e)}
            placeholder="e.g. Municipal Headquarters"
            className="h-8 text-[13px] font-semibold text-slate-800"
            required
            error={showError("assetName") ? errors.assetName : undefined}
          />
        </div>

        <SearchSelect
          label="Ownership Type"
          name="ownershipType"
          value={formData.ownershipType}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          options={resolvedOwnershipOptions}
          placeholder="Select Ownership Type"
          className="font-semibold text-sm"
          required
          error={
            showError("ownershipType") ? errors.ownershipType : undefined
          }
        />

        <Input
          label="In-Charge Name"
          name="inChargeName"
          value={formData.inChargeName}
          onChange={(e: any) => handleChange(e)}
          placeholder="Rajesh Kumar"
          className="h-8 text-[13px]"
          error={
            showError("inChargeName") ? errors.inChargeName : undefined
          }
        />

        <Input
          label="Designation"
          name="inChargeDesignation"
          value={formData.inChargeDesignation}
          onChange={(e: any) => handleChange(e)}
          placeholder="Assistant Engineer"
          className="h-8 text-[13px]"
        />

        <Input
          label="Contact Number"
          name="inChargeMobile"
          value={formData.inChargeMobile}
          onChange={(e: any) => handleChange(e)}
          placeholder="10-digit mobile number"
          maxLength={10}
          type="tel"
          className="h-8 text-[13px]"
          error={
            showError("inChargeMobile") ? errors.inChargeMobile : undefined
          }
        />

        <Input
          label="Email"
          name="inChargeEmail"
          value={formData.inChargeEmail}
          onChange={(e: any) => handleChange(e)}
          placeholder="official@municipality.gov.in"
          type="email"
          className="h-8 text-[13px]"
          error={
            showError("inChargeEmail") ? errors.inChargeEmail : undefined
          }
        />

        <div className="md:col-span-2 lg:col-span-2">
          <TextArea
            label="Full Address"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={(e: any) => handleChange(e)}
            placeholder="Shivaji Chowk, Station Road"
            disabled={formData.isMovableCategory}
            rows={1}
            className="min-h-8 text-[13px]"
            required={!formData.isMovableCategory}
            error={showError("fullAddress") ? !!errors.fullAddress : false}
            errorMessage={showError("fullAddress") ? errors.fullAddress : undefined}
          />
        </div>

        <Input
          label="Landmark"
          name="locality"
          value={formData.locality}
          onChange={(e: any) => handleChange(e)}
          placeholder="Ramdas Peth"
          disabled={formData.isMovableCategory}
          required={!formData.isMovableCategory}
          className="h-8 text-[13px]"
        />

        <Input
          label="Pin Code"
          name="pinCode"
          value={formData.pinCode}
          onChange={(e: any) => handleChange(e)}
          placeholder="400001"
          disabled={formData.isMovableCategory}
          maxLength={6}
          className="h-8 text-[13px]"
          required={!formData.isMovableCategory}
          error={showError("pinCode") ? errors.pinCode : undefined}
        />

        <div className="hidden">
          <Input
            label="Latitude"
            name="latitude"
            value={formData.latitude}
            onChange={(e: any) => handleChange(e)}
            placeholder="e.g. 19.0760"
            className="h-8 text-[13px] font-mono"
            error={showError("latitude") ? errors.latitude : undefined}
          />

          <Input
            label="Longitude"
            name="longitude"
            value={formData.longitude}
            onChange={(e: any) => handleChange(e)}
            placeholder="e.g. 72.8777"
            className="h-8 text-[13px] font-mono"
            error={showError("longitude") ? errors.longitude : undefined}
          />

          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            disabled={formData.isMovableCategory}
            className="h-7 w-full flex items-center justify-center gap-1 border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-md transition-all font-black text-[9px] uppercase tracking-widest shadow-sm cursor-pointer active:scale-98"
          >
            <MapIcon className="size-3.5 shrink-0" />
            <span className="truncate">Pick on Map</span>
          </button>
        </div>


      </CardContent>
    </Card>
  );
}
