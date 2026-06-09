"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
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
  updateFormData,
}: BuildingOwnershipDetailsSectionProps): React.JSX.Element {
  const [isMapOpen, setIsMapOpen] = React.useState(false);

  const handleMapSelect = (lat: string, lng: string) => {
    if (updateFormData) {
      updateFormData({ latitude: lat, longitude: lng });
    }
    setIsMapOpen(false);
  };

  return (
    <Card
      variant="bordered"
      padding="sm"
      className="shadow-sm border-slate-200/80 bg-white rounded-2xl"
    >
      <CardHeader className="flex items-center gap-2 border-b border-slate-100 pb-1.5 mb-2">
        <div className="bg-[#0f172a] p-1 rounded shadow-sm">
          <UserCheck className="size-3.5 text-white" />
        </div>
        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-widest">
          Ownership Details &amp; Address Details
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
        {/* Map Picker Modal */}
        <MapPicker
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onSelect={handleMapSelect}
          initialLat={formData.latitude}
          initialLng={formData.longitude}
        />

        <Select
          label="Owning Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          options={
            departments.map((d) => {
              const label = d.departmentName || `Department ${d.id}`;
              return { label, value: String(d.id), image: d.imageUrl };
            })
          }
          className="font-semibold text-sm"
          selectSize="sm"
          required
          error={showError("department") ? errors.department : undefined}
        />

        <div className="md:col-span-2 lg:col-span-2">
          <Input
            label="Asset Name"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            placeholder="e.g. Municipal Headquarters"
            className="h-8 text-[13px] font-semibold text-slate-800"
            required
            error={showError("assetName") ? errors.assetName : undefined}
          />
        </div>

        <Select
          label="Ownership Type"
          name="ownershipType"
          value={formData.ownershipType}
          onChange={handleChange}
          options={[
            { label: "Municipal", value: "municipal" },
            { label: "Leased", value: "leased" },
            { label: "Private/Rented", value: "private" },
          ]}
          className="font-semibold text-sm"
          selectSize="sm"
          required
          error={
            showError("ownershipType") ? errors.ownershipType : undefined
          }
        />

        <Input
          label="Locality"
          name="locality"
          value={formData.locality}
          onChange={handleChange}
          placeholder="Ramdas Peth"
          className="h-8 text-[13px]"
        />

        <Input
          label="Pin Code"
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
          placeholder="400001"
          maxLength={6}
          className="h-8 text-[13px]"
          required
          error={showError("pinCode") ? errors.pinCode : undefined}
        />

        <div className="md:col-span-2 lg:col-span-2">
          <Input
            label="Full Address"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            placeholder="Shivaji Chowk, Station Road"
            className="h-8 text-[13px]"
            required
            error={showError("fullAddress") ? errors.fullAddress : undefined}
          />
        </div>

        <Input
          label="In-Charge Name"
          name="inChargeName"
          value={formData.inChargeName}
          onChange={handleChange}
          placeholder="Rajesh Kumar"
          className="h-8 text-[13px]"
          required
          error={
            showError("inChargeName") ? errors.inChargeName : undefined
          }
        />

        <Input
          label="Designation"
          name="inChargeDesignation"
          value={formData.inChargeDesignation}
          onChange={handleChange}
          placeholder="Assistant Engineer"
          className="h-8 text-[13px]"
        />

        <Input
          label="Contact Number"
          name="inChargeMobile"
          value={formData.inChargeMobile}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          maxLength={10}
          type="tel"
          className="h-8 text-[13px]"
          required
          error={
            showError("inChargeMobile") ? errors.inChargeMobile : undefined
          }
        />

        <Input
          label="Email"
          name="inChargeEmail"
          value={formData.inChargeEmail}
          onChange={handleChange}
          placeholder="official@municipality.gov.in"
          type="email"
          className="h-8 text-[13px]"
          error={
            showError("inChargeEmail") ? errors.inChargeEmail : undefined
          }
        />

        <Input
          label="Latitude"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="e.g. 19.0760"
          className="h-8 text-[13px] font-mono"
          error={showError("latitude") ? errors.latitude : undefined}
        />

        <Input
          label="Longitude"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          placeholder="e.g. 72.8777"
          className="h-8 text-[13px] font-mono"
          error={showError("longitude") ? errors.longitude : undefined}
        />

        <div className="flex flex-col">
          <span className="mb-1.5 text-[13px] font-medium text-transparent select-none pointer-events-none">
            Action
          </span>
          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            className="h-8 w-full flex items-center justify-center gap-1.5 border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest shadow-sm cursor-pointer active:scale-98"
          >
            <MapIcon className="size-3.5 shrink-0" />
            <span className="truncate">Pick on Map</span>
          </button>
        </div>


      </CardContent>
    </Card>
  );
}
