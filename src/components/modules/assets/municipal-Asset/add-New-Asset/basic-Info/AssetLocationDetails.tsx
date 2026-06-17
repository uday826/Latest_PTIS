"use client";

import { Card, CardContent, CardHeader, CardTitle, Input, TextArea } from "@/components/common";
import { Map as MapIcon, MapPin, Ruler } from "lucide-react";
import React from "react";
import { useAssetForm } from "../AssetFormContext";
import { MapPicker } from "./MapPicker";

import { AssetWizardStepProps } from "@/types/asset-types/basic-info/asset-wizard.types";

export function AssetLocationDetails({ formData, onChange }: AssetWizardStepProps) {
  const { updateFormData, handleToggleChange, errors, submittedOnce } = useAssetForm();
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  // DB-flag driven — no string matching on category names
  const isLand    = formData.valuationType ? formData.valuationType === "LAND"    : (!formData.hasFloorDetails && !formData.isMovableCategory);
  const isMovable = formData.valuationType ? formData.valuationType === "MOVABLE" : formData.isMovableCategory === true;
  const showGeo   = !isMovable;

  const showError = (field: string) => {
    return !!((submittedOnce || formData[field as keyof typeof formData]) && errors?.[field]);
  };

  const handleMapSelect = (lat: string, lng: string) => {
    updateFormData({ latitude: lat, longitude: lng });
    setIsMapOpen(false);
  };

  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-violet-100 mt-2">
      <CardHeader className="flex items-center gap-2 border-b border-violet-50 pb-1.5 mb-2">
        <div className="bg-violet-600 p-1.5 rounded-lg">
          <MapPin className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          D) Location & Address Details
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

        {isLand && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 p-3 bg-violet-50/50 rounded-xl border border-violet-100 mb-2 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 col-span-full mb-1">
              <Ruler className="size-3.5 text-violet-600" />
              <span className="text-[11px] font-black text-violet-800 uppercase tracking-tighter">Land Specifications</span>
            </div>
            <Input
              label="Survey Number"
              name="surveyNumber"
              value={formData.surveyNumber}
              onChange={onChange}
              placeholder="e.g. 124/A/1"
              required
              error={showError("surveyNumber") ? errors?.surveyNumber : undefined}
            />
            <Input
              label="Plot Number"
              name="plotNumber"
              value={formData.plotNumber}
              onChange={onChange}
              placeholder="e.g. 45"
            />
            <Input
              label="Length (Mtr)"
              name="length"
              value={formData.length || ""}
              onChange={onChange}
              placeholder="0.00"
              type="number"
              required
              error={showError("length") ? errors?.length : undefined}
            />
            <Input
              label="Width (Mtr)"
              name="width"
              value={formData.width || ""}
              onChange={onChange}
              placeholder="0.00"
              type="number"
              required
              error={showError("width") ? errors?.width : undefined}
            />
            <Input
              label="Total Land Area (Sq. Mtr)"
              name="landArea"
              value={formData.landArea}
              onChange={onChange}
              placeholder="0.00"
              type="number"
              required
              error={showError("landArea") ? errors?.landArea : undefined}
            />
          </div>
        )}

        {formData.parentAssetId && (
          <div className="p-2 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between gap-2 mb-2 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
                <MapPin className="size-4 text-white" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-emerald-800 uppercase tracking-tighter">Location Inheritance Available</h4>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Sync address and coordinates from Parent Asset</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!!formData.inheritLocation}
                onChange={(e) => handleToggleChange("inheritLocation", e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner group-hover:ring-4 group-hover:ring-emerald-50" />
              <span className="ml-3 text-[10px] font-black text-slate-700 uppercase tracking-widest">Inherit</span>
            </label>
          </div>
        )}

        <div className={`space-y-2 transition-all duration-500 ${formData.inheritLocation ? "opacity-60 pointer-events-none grayscale-[0.5]" : ""}`}>
          <TextArea
            label="Full Postal Address"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={(e: any) => onChange(e)}
            placeholder="Detailed street address, building name, etc."
            required
            rows={2}
            disabled={!!formData.inheritLocation}
            error={showError("fullAddress") ? !!errors?.fullAddress : false}
            errorMessage={showError("fullAddress") ? errors?.fullAddress : undefined}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <Input
              label="Locality / Area"
              name="locality"
              value={formData.locality}
              onChange={onChange}
              placeholder="e.g. Shivaji Nagar"
              disabled={!!formData.inheritLocation}
            />
            <Input
              label="Landmark"
              name="landmark"
              value={formData.landmark}
              onChange={onChange}
              placeholder="e.g. Opposite Central Bus Stand"
              disabled={!!formData.inheritLocation}
            />
            <Input
              label="Pin Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={onChange}
              placeholder="6-digit code"
              maxLength={6}
              disabled={!!formData.inheritLocation}
              error={showError("pinCode") ? errors?.pinCode : undefined}
            />
            {showGeo && (
              <>
                <div className="relative">
                  <Input
                    label="Latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={onChange}
                    placeholder="e.g. 19.0760"
                    disabled={!!formData.inheritLocation}
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={onChange}
                    placeholder="e.g. 72.8777"
                    disabled={!!formData.inheritLocation}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    disabled={!!formData.inheritLocation}
                    className={`w-full h-10 flex items-center justify-center gap-2 border rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-sm ${formData.inheritLocation
                        ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                      }`}
                  >
                    <MapIcon className="size-4" />
                    Pick from Map
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
