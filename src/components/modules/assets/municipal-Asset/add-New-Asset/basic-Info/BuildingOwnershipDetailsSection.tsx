"use client";

import React from "react";
import { UserCheck, Map as MapIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
} from "@/components/common";
import type { BuildingOwnershipDetailsSectionProps } from "@/types/asset-types/basic-info/buildBasicInfo.types";
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
      <CardHeader className="flex items-center gap-2.5 border-b border-slate-100 pb-1.5 mb-2">
        <div className="bg-[#0f172a] p-1.5 rounded-lg shadow-sm">
          <UserCheck className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wide">
          B) Ownership Details &amp; Address Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Map Picker Modal */}
        <MapPicker
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onSelect={handleMapSelect}
          initialLat={formData.latitude}
          initialLng={formData.longitude}
        />

        {/* Row 1: Asset Name + Owning Department */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <Input
              label="Asset Name"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              placeholder="e.g. Municipal Headquarters"
              className="h-10 font-semibold text-slate-800"
              required
              error={showError("assetName") ? errors.assetName : undefined}
            />
          </div>

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
            className="font-semibold"
            required
            error={showError("department") ? errors.department : undefined}
          />
        </div>

        {/* Row 2: Full Address + Locality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <Input
              label="Full Address"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              placeholder="Shivaji Chowk, Station Road"
              className="h-10"
              required
              error={showError("fullAddress") ? errors.fullAddress : undefined}
            />
          </div>

          <Input
            label="Locality"
            name="locality"
            value={formData.locality}
            onChange={handleChange}
            placeholder="Ramdas Peth"
            className="h-10"
          />
        </div>

        {/* Row 3: Pin Code + Ownership Type + Operational Control + In-Charge Name */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <Input
            label="Pin Code"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            placeholder="400001"
            maxLength={6}
            className="h-10"
            error={showError("pinCode") ? errors.pinCode : undefined}
          />

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
            className="font-semibold"
            required
            error={
              showError("ownershipType") ? errors.ownershipType : undefined
            }
          />

          <Select
            label="Operational Control"
            name="operationalControl"
            value={formData.operationalControl}
            onChange={handleChange}
            options={[
              { label: "Self Managed", value: "self" },
              { label: "Outsourced", value: "outsourced" },
              { label: "Joint Venture", value: "jv" },
            ]}
            className="font-semibold"
          />

          <Input
            label="In-Charge Name"
            name="inChargeName"
            value={formData.inChargeName}
            onChange={handleChange}
            placeholder="Rajesh Kumar"
            className="h-10"
            required
            error={
              showError("inChargeName") ? errors.inChargeName : undefined
            }
          />
        </div>

        {/* Row 4: Designation + Contact Number + Email */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <Input
            label="Designation"
            name="inChargeDesignation"
            value={formData.inChargeDesignation}
            onChange={handleChange}
            placeholder="Assistant Engineer"
            className="h-10"
          />

          <Input
            label="Contact Number"
            name="inChargeMobile"
            value={formData.inChargeMobile}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            maxLength={10}
            type="tel"
            className="h-10"
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
            className="h-10"
            error={
              showError("inChargeEmail") ? errors.inChargeEmail : undefined
            }
          />
        </div>

        {/* Row 5: Latitude + Longitude + Map Picker Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-1">
          <Input
            label="Latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="e.g. 19.0760"
            className="h-10 font-mono"
            error={showError("latitude") ? errors.latitude : undefined}
          />

          <Input
            label="Longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="e.g. 72.8777"
            className="h-10 font-mono"
            error={showError("longitude") ? errors.longitude : undefined}
          />

          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            className="h-10 flex items-center justify-center gap-2 border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-sm cursor-pointer active:scale-98"
          >
            <MapIcon className="size-4" />
            Pick Coordinates from Map
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
