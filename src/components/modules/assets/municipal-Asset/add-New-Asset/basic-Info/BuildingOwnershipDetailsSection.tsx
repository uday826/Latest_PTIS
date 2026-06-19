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
  Drawer,
} from "@/components/common";
import { useParams } from "next/navigation";
import type { BuildingOwnershipDetailsSectionProps, BuildingBasicInfoFormData } from "@/types/asset-types/basic-info/buildBasicInfo.types";
import { Map as MapIcon, UserCheck, ClipboardList, User, Calendar, Upload, X } from "lucide-react";
import React from "react";
import { MapPicker } from "./MapPicker";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

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
  const t = useTranslations("addAssetForm");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const leaseFields: Array<keyof BuildingBasicInfoFormData> = [
    "lessorName",
    "lessorMobile",
    "lessorEmail",
    "leaseStartDate",
    "leaseEndDate",
    "leaseAmount",
    "securityDeposit",
  ];
  const hasLeaseErrors = leaseFields.some((field) => showError(field));

  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [debouncedAssetName, setDebouncedAssetName] = React.useState(formData.assetName || "");
  const assetNameLocalRef = React.useRef((formData as any).assetNameLocal || "");
  assetNameLocalRef.current = (formData as any).assetNameLocal || "";

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAssetName(formData.assetName || "");
    }, 600);
    return () => clearTimeout(timer);
  }, [formData.assetName]);

  const updateFormDataRef = React.useRef(updateFormData);
  React.useEffect(() => {
    updateFormDataRef.current = updateFormData;
  }, [updateFormData]);

  React.useEffect(() => {
    if (!debouncedAssetName) return;

    let active = true;

    const translateName = async () => {
      const itc = locale === "hi" ? "hi-t-i0-und" : "mr-t-i0-und";
      try {
        const res = await fetch(
          `https://inputtools.google.com/request?text=${encodeURIComponent(
            debouncedAssetName
          )}&itc=${itc}&num=1`
        );
        const data = await res.json();
        if (!active) return;

        if (
          data &&
          data[0] === "SUCCESS" &&
          data[1] &&
          data[1][0] &&
          data[1][0][1] &&
          data[1][0][1][0]
        ) {
          const converted = data[1][0][1][0];
          if (converted !== assetNameLocalRef.current && updateFormDataRef.current) {
            updateFormDataRef.current({ assetNameLocal: converted });
          }
        }
      } catch (error) {
        console.error("Transliteration error:", error);
      }
    };

    translateName();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAssetName, locale, undefined]); // 'undefined' added to keep array size consistent with previous version for HMR

  const handleLocalNameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    if (/[a-zA-Z]/.test(val)) {
      const itc = locale === "hi" ? "hi-t-i0-und" : "mr-t-i0-und";
      try {
        const res = await fetch(
          `https://inputtools.google.com/request?text=${encodeURIComponent(val)}&itc=${itc}&num=1`
        );
        const data = await res.json();
        if (
          data &&
          data[0] === "SUCCESS" &&
          data[1] &&
          data[1][0] &&
          data[1][0][1] &&
          data[1][0][1][0]
        ) {
          const converted = data[1][0][1][0];
          if (updateFormData) {
            updateFormData({ assetNameLocal: converted });
          }
        }
      } catch (error) {
        console.error("Transliteration error:", error);
      }
    }
  };

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
      { label: t("basicInfo.ownershipDetails.ownershipTypeOptions.municipal"), value: "municipal" },
      { label: t("basicInfo.ownershipDetails.ownershipTypeOptions.leased"), value: "leased" },
      { label: t("basicInfo.ownershipDetails.ownershipTypeOptions.private"), value: "private" },
    ];


  return (
    <>
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
            {t("basicInfo.ownershipDetails.title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-start text-[11px] [&_label]:text-[11px] [&_label]:mb-1 [&_span[id$=-label]]:text-[11px] [&_input]:!px-2 [&_input]:!py-1 [&_input]:!h-7 [&_input]:!text-[11px] [&_input]:!rounded-md [&_button[role=combobox]]:!px-2 [&_button[role=combobox]]:!h-7 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px] [&_textarea]:!px-2 [&_textarea]:!py-1 [&_textarea]:!min-h-[28px] [&_textarea]:!text-[11px] [&_textarea]:!rounded-md [&_span.text-red-650]:text-[10px] [&_span.text-red-650]:mt-0.5">
          {/* Map Picker Modal */}
          <MapPicker
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            onSelect={handleMapSelect}
            initialLat={formData.latitude}
            initialLng={formData.longitude}
          />

          <SearchSelect
            label={t("basicInfo.ownershipDetails.owningDepartment")}
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
            placeholder={t("basicInfo.ownershipDetails.selectOwningDepartment")}
            className="font-semibold text-sm"
            required={!formData.isMovableCategory}
            error={showError("department") ? errors.department : undefined}
          />


          <div className="md:col-span-2 lg:col-span-2">
            <Input
              label={t("basicInfo.ownershipDetails.assetName")}
              name="assetName"
              value={formData.assetName}
              onChange={(e: any) => handleChange(e)}
              placeholder="e.g. Municipal Headquarters"
              maxLength={250}
              className="h-8 text-[13px] font-semibold text-slate-800"
              required
              error={showError("assetName") ? errors.assetName : undefined}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <Input
              label={t.has("basicInfo.ownershipDetails.assetNameLocal") ? t("basicInfo.ownershipDetails.assetNameLocal") : "Asset Local Name"}
              name="assetNameLocal"
              value={(formData as any).assetNameLocal || ""}
              onChange={(e: any) => handleChange(e)}
              onBlur={handleLocalNameBlur}
              placeholder={t.has("basicInfo.ownershipDetails.assetNameLocalPlaceholder") ? t("basicInfo.ownershipDetails.assetNameLocalPlaceholder") : "Enter local name"}
              maxLength={250}
              className="h-8 text-[13px] font-semibold text-slate-800"
              error={showError("assetNameLocal" as any) ? (errors as any).assetNameLocal : undefined}
            />
          </div>

          <SearchSelect
            label={t("basicInfo.ownershipDetails.ownershipType")}
            name="ownershipType"
            value={formData.ownershipType}
            onChange={(name, value) => handleChange({ target: { name, value } } as any)}
            options={resolvedOwnershipOptions}
            placeholder={t("basicInfo.ownershipDetails.selectOwnershipType")}
            className="font-semibold text-sm"
            required
            error={
              showError("ownershipType") ? errors.ownershipType : undefined
            }
          />

          <Input
            label={t("basicInfo.ownershipDetails.inChargeName")}
            name="inChargeName"
            value={formData.inChargeName}
            onChange={(e: any) => handleChange(e)}
            placeholder="Rajesh Kumar"
            maxLength={200}
            className="h-8 text-[13px]"
            error={
              showError("inChargeName") ? errors.inChargeName : undefined
            }
          />

          <Input
            label={t("basicInfo.ownershipDetails.designation")}
            name="inChargeDesignation"
            value={formData.inChargeDesignation}
            onChange={(e: any) => handleChange(e)}
            placeholder="Assistant Engineer"
            maxLength={100}
            className="h-8 text-[13px]"
            error={
              showError("inChargeDesignation") ? errors.inChargeDesignation : undefined
            }
          />

          <Input
            label={t("basicInfo.ownershipDetails.contactNumber")}
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
            label={t("basicInfo.ownershipDetails.email")}
            name="inChargeEmail"
            value={formData.inChargeEmail}
            onChange={(e: any) => handleChange(e)}
            placeholder="official@municipality.gov.in"
            type="email"
            maxLength={100}
            className="h-8 text-[13px]"
            error={
              showError("inChargeEmail") ? errors.inChargeEmail : undefined
            }
          />

          <div className="md:col-span-2 lg:col-span-2">
            <TextArea
              label={t("basicInfo.ownershipDetails.fullAddress")}
              name="fullAddress"
              value={formData.fullAddress}
              onChange={(e: any) => handleChange(e)}
              placeholder="Shivaji Chowk, Station Road"
              disabled={formData.isMovableCategory}
              maxLength={500}
              rows={1}
              className="min-h-8 text-[13px]"
              required={!formData.isMovableCategory}
              error={showError("fullAddress") ? !!errors.fullAddress : false}
              errorMessage={showError("fullAddress") ? errors.fullAddress : undefined}
            />
          </div>


          <Input
            label={t("basicInfo.ownershipDetails.landmark")}
            name="locality"
            value={formData.locality}
            onChange={(e: any) => handleChange(e)}
            placeholder="Ramdas Peth"
            disabled={formData.isMovableCategory}
            maxLength={200}
            className="h-8 text-[13px]"
          />
          <Input
            label={t("basicInfo.ownershipDetails.pinCode")}
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

          {formData.isMovableCategory && (
            <Select
              label="Is Rented?"
              name="isRented"
              value={formData.isRented || "No"}
              onChange={(e: any) => {
                const val = e.target.value;
                handleChange(e);
                if (val === "Yes") {
                  setIsDrawerOpen(true);
                } else {
                  if (updateFormData) {
                    updateFormData({
                      leaseStartDate: "",
                      leaseEndDate: "",
                      leaseAmount: "",
                      securityDeposit: "",
                      paymentFrequency: "Monthly",
                      lessorName: "",
                      lessorMobile: "",
                      lessorEmail: "",
                      lessorAddress: "",
                    });
                  }
                }
              }}
              options={[
                { label: "No", value: "No" },
                { label: "Yes", value: "Yes" }
              ]}
              className="font-semibold text-sm"
              selectSize="sm"
            />
          )}

          {formData.isMovableCategory && formData.isRented === "Yes" && (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-gray-700 select-none">&nbsp;</span>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className={`h-7 w-full flex items-center justify-center gap-1 border rounded-md transition-all font-black text-[9px] uppercase tracking-widest shadow-sm cursor-pointer active:scale-98 ${hasLeaseErrors
                  ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 animate-pulse"
                  : "bg-[#EDF5FF] text-[#1d4ed8] border-[#A3CBFA] hover:bg-[#1d4ed8] hover:text-white hover:border-[#1d4ed8]"
                  }`}
              >
                Fill Rent Details
              </button>
              {hasLeaseErrors && (
                <span className="text-[9px] text-red-600 font-bold uppercase tracking-wider mt-0.5">
                  Invalid lease details
                </span>
              )}
            </div>
          )}

          <div className="hidden">
            <Input
              label={t("basicInfo.ownershipDetails.latitude")}
              name="latitude"
              value={formData.latitude}
              onChange={(e: any) => handleChange(e)}
              placeholder="e.g. 19.0760"
              className="h-8 text-[13px] font-mono"
              error={showError("latitude") ? errors.latitude : undefined}
            />

            <Input
              label={t("basicInfo.ownershipDetails.longitude")}
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
              <span className="truncate">{t("basicInfo.ownershipDetails.pickOnMap")}</span>
            </button>
          </div>


        </CardContent>
      </Card>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-blue-900 uppercase tracking-wider">
                Lease &amp; Owner Details
              </div>
              <div className="text-[11px] text-slate-500">
                Provide lessor contact info and lease agreement terms.
              </div>
            </div>
          </div>
        }
        width="lg"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-all cursor-pointer active:scale-98"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all cursor-pointer active:scale-98"
            >
              Save Details
            </button>
          </div>
        }
      >
        <div className="p-5 space-y-4 text-[11px] [&_label]:text-[11px] [&_label]:mb-1 [&_input]:!px-2 [&_input]:!py-1 [&_input]:!h-8 [&_input]:!text-[11px] [&_input]:!rounded-md [&_button[role=combobox]]:!px-2 [&_button[role=combobox]]:!h-8 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px] [&_textarea]:!px-2 [&_textarea]:!py-1 [&_textarea]:!min-h-[60px] [&_textarea]:!text-[11px] [&_textarea]:!rounded-md [&_span.text-red-600]:text-[10px] [&_span.text-red-655]:mt-0.5">

          {/* Section 1: Lessor / Owner Details */}
          <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-[#1d4ed8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="size-3.5" />
              Lessor / Owner Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Lessor Name"
                name="lessorName"
                value={formData.lessorName || ""}
                onChange={(e: any) => handleChange(e)}
                placeholder="e.g. Ramesh Chandra"
                required
                error={showError("lessorName") ? errors.lessorName : undefined}
              />
              <Input
                label="Lessor Contact Number"
                name="lessorMobile"
                value={formData.lessorMobile || ""}
                onChange={(e: any) => handleChange(e)}
                placeholder="10-digit mobile number"
                maxLength={10}
                type="tel"
                required
                error={showError("lessorMobile") ? errors.lessorMobile : undefined}
              />
              <Input
                label="Lessor Email"
                name="lessorEmail"
                value={formData.lessorEmail || ""}
                onChange={(e: any) => handleChange(e)}
                placeholder="lessor@email.com"
                type="email"
                error={showError("lessorEmail") ? errors.lessorEmail : undefined}
              />
              <TextArea
                label="Lessor Full Address"
                name="lessorAddress"
                value={formData.lessorAddress || ""}
                onChange={(e: any) => handleChange(e)}
                placeholder="Enter lessor's permanent/contact address"
                rows={2}
              />
            </div>
          </div>

          {/* Section 2: Agreement Details */}
          <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-[#1d4ed8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Lease Agreement Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Lease Start Date"
                name="leaseStartDate"
                value={formData.leaseStartDate || ""}
                onChange={(e: any) => handleChange(e)}
                type="date"
                required
                error={showError("leaseStartDate") ? errors.leaseStartDate : undefined}
              />
              <Input
                label="Lease End Date"
                name="leaseEndDate"
                value={formData.leaseEndDate || ""}
                onChange={(e: any) => handleChange(e)}
                type="date"
                error={showError("leaseEndDate") ? errors.leaseEndDate : undefined}
              />
              <Input
                label="Monthly Lease Amount (₹)"
                name="leaseAmount"
                value={formData.leaseAmount || ""}
                onChange={(e: any) => handleChange(e)}
                placeholder="e.g. 15000"
                required
                error={showError("leaseAmount") ? errors.leaseAmount : undefined}
              />
              <Input
                label="Security Deposit (₹)"
                name="securityDeposit"
                value={formData.securityDeposit || ""}
                onChange={(e: any) => handleChange(e)}
                placeholder="e.g. 50000"
                error={showError("securityDeposit") ? errors.securityDeposit : undefined}
              />
              <Select
                label="Payment Frequency"
                name="paymentFrequency"
                value={formData.paymentFrequency || "Monthly"}
                onChange={(e: any) => handleChange(e)}
                options={[
                  { label: "Monthly", value: "Monthly" },
                  { label: "Quarterly", value: "Quarterly" },
                  { label: "Half-Yearly", value: "Half-Yearly" },
                  { label: "Yearly", value: "Yearly" }
                ]}
                selectSize="sm"
              />
            </div>
          </div>

        </div>
      </Drawer>
    </>
  );
}
