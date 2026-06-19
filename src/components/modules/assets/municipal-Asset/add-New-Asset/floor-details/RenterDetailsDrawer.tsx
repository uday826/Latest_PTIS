"use client";

import { useState, useEffect } from "react";
import { X, Calendar, DollarSign, User } from "lucide-react";
import { Input, SearchSelect, Button } from "@/components/common";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface RenterDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  renterData: {
    renterNameEnglish: string;
    renterNameLocal: string;
    agreementDate: string;
    agreementFromDate: string;
    agreementToDate: string;
    rentMonthly: string | number;
    rentYearly: string | number;
    taxLiability: string;
  };
  onSave: (data: any) => void;
}

export function RenterDetailsDrawer({
  isOpen,
  onClose,
  renterData,
  onSave,
}: RenterDetailsDrawerProps) {
  const t = useTranslations("addAssetForm");

  // Local state for the form fields
  const [form, setForm] = useState({
    renterNameEnglish: "",
    renterNameLocal: "",
    agreementDate: "",
    agreementFromDate: "",
    agreementToDate: "",
    rentMonthly: "",
    rentYearly: "",
    taxLiability: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync prop data when drawer opens or prop data changes
  useEffect(() => {
    if (isOpen) {
      setForm({
        renterNameEnglish: renterData.renterNameEnglish || "",
        renterNameLocal: renterData.renterNameLocal || "",
        agreementDate: renterData.agreementDate ? renterData.agreementDate.substring(0, 10) : "",
        agreementFromDate: renterData.agreementFromDate ? renterData.agreementFromDate.substring(0, 10) : "",
        agreementToDate: renterData.agreementToDate ? renterData.agreementToDate.substring(0, 10) : "",
        rentMonthly: renterData.rentMonthly !== undefined && renterData.rentMonthly !== null ? String(renterData.rentMonthly) : "",
        rentYearly: renterData.rentYearly !== undefined && renterData.rentYearly !== null ? String(renterData.rentYearly) : "",
        taxLiability: renterData.taxLiability || "",
      });
      setErrors({});
    }
  }, [isOpen, renterData]);

  if (!isOpen) return null;

  const handleMonthlyRentChange = (val: string) => {
    const monthlyVal = val.replace(/[^\d.]/g, "");
    setForm((prev) => {
      const numericMonthly = parseFloat(monthlyVal);
      const calculatedYearly = !isNaN(numericMonthly) ? String(Math.round(numericMonthly * 12)) : "";
      return {
        ...prev,
        rentMonthly: monthlyVal,
        rentYearly: calculatedYearly,
      };
    });

    if (errors.rentMonthly) {
      setErrors((prev) => ({ ...prev, rentMonthly: "" }));
    }
  };

  const handleFieldChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!form.renterNameEnglish.trim()) {
      newErrors.renterNameEnglish = t("floorDetails.renterNameEnglishRequired") || "Please enter renter name in English";
    }
    if (!form.agreementDate) {
      newErrors.agreementDate = t("floorDetails.agreementDateRequired") || "Please select agreement date";
    }
    if (!form.agreementFromDate) {
      newErrors.agreementFromDate = t("floorDetails.agreementFromDateRequired") || "Please select agreement start date";
    }
    if (!form.agreementToDate) {
      newErrors.agreementToDate = t("floorDetails.agreementToDateRequired") || "Please select agreement end date";
    }
    if (!form.rentMonthly) {
      newErrors.rentMonthly = t("floorDetails.rentMonthlyRequired") || "Please enter monthly rent";
    }
    if (!form.taxLiability) {
      newErrors.taxLiability = t("floorDetails.taxLiabilityRequired") || "Please select tax liability";
    }

    if (form.agreementFromDate && form.agreementToDate) {
      const from = new Date(form.agreementFromDate);
      const to = new Date(form.agreementToDate);
      if (from > to) {
        newErrors.agreementToDate = "Agreement End Date must be after Agreement Start Date";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the validation errors in the form.");
      return;
    }

    // Call the parent save handler with form values
    onSave({
      renterNameEnglish: form.renterNameEnglish.trim(),
      renterNameLocal: form.renterNameLocal.trim(),
      agreementDate: form.agreementDate,
      agreementFromDate: form.agreementFromDate,
      agreementToDate: form.agreementToDate,
      rentMonthly: parseFloat(form.rentMonthly) || 0,
      rentYearly: parseFloat(form.rentYearly) || 0,
      taxLiability: form.taxLiability,
    });

    onClose();
  };

  const taxOptions = [
    { label: t("floorDetails.taxable") || "Taxable", value: "Taxable" },
    { label: t("floorDetails.nonTaxable") || "Non-Taxable", value: "NonTaxable" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer Body */}
      <div className="relative w-full max-w-2xl bg-slate-50 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 border-b border-blue-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <User className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                {t("floorDetails.renterDetailsTitle") || "Renter / Tenant Details"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-blue-700 rounded-lg text-blue-100 hover:text-white transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[11px] [&_label]:text-[11px] [&_label]:mb-1 [&_label]:!font-bold [&_span[id$=-label]]:text-[11px] [&_span[id$=-label]]:!font-bold [&_span.text-gray-700]:!font-bold [&_input]:!px-3 [&_input]:!py-1.5 [&_input]:!h-9 [&_input]:!text-[11px] [&_input]:!rounded-md [&_button[role=combobox]]:!px-3 [&_button[role=combobox]]:!h-9 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Renter Name English */}
            <div className="flex flex-col">
              <Input
                label={t("floorDetails.renterNameEnglish") || "Renter Name (English)"}
                required
                type="text"
                value={form.renterNameEnglish}
                onChange={(e) => handleFieldChange("renterNameEnglish", e.target.value)}
                error={errors.renterNameEnglish}
                placeholder="Enter renter name in English"
              />
            </div>

            {/* Renter Name Local */}
            <div className="flex flex-col">
              <Input
                label={t("floorDetails.renterNameLocal") || "Renter Name (Local Language)"}
                type="text"
                value={form.renterNameLocal}
                onChange={(e) => handleFieldChange("renterNameLocal", e.target.value)}
                error={errors.renterNameLocal}
                placeholder="Enter renter name in local language"
              />
            </div>

            {/* Agreement Date */}
            <div className="flex flex-col">
              <Input
                label={t("floorDetails.agreementDate") || "Agreement Date"}
                required
                type="date"
                value={form.agreementDate}
                onChange={(e) => handleFieldChange("agreementDate", e.target.value)}
                error={errors.agreementDate}
              />
            </div>

            {/* Tax Liability */}
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium text-gray-700">
                {t("floorDetails.taxLiability") || "Tax Liability"}
                <span className="text-red-500"> *</span>
              </label>
              <SearchSelect
                name="taxLiability"
                options={taxOptions}
                value={form.taxLiability}
                onChange={(name, val) => handleFieldChange("taxLiability", val)}
                placeholder="Select tax liability"
                error={errors.taxLiability}
              />
            </div>

            {/* Agreement From Date */}
            <div className="flex flex-col">
              <Input
                label={t("floorDetails.agreementFromDate") || "Agreement From Date"}
                required
                type="date"
                value={form.agreementFromDate}
                onChange={(e) => handleFieldChange("agreementFromDate", e.target.value)}
                error={errors.agreementFromDate}
              />
            </div>

            {/* Agreement To Date */}
            <div className="flex flex-col">
              <Input
                label={t("floorDetails.agreementToDate") || "Agreement To Date"}
                required
                type="date"
                value={form.agreementToDate}
                onChange={(e) => handleFieldChange("agreementToDate", e.target.value)}
                error={errors.agreementToDate}
              />
            </div>

            {/* Monthly Rent */}
            <div className="flex flex-col">
              <Input
                label={t("floorDetails.rentMonthly") || "Monthly Rent (₹)"}
                required
                type="text"
                value={form.rentMonthly}
                onChange={(e) => handleMonthlyRentChange(e.target.value)}
                error={errors.rentMonthly}
                placeholder="0.00"
              />
            </div>

            {/* Yearly Rent */}
            <div className="flex flex-col">
              <Input
                label={t("floorDetails.rentYearly") || "Yearly Rent (₹)"}
                type="text"
                value={form.rentYearly}
                onChange={(e) => handleFieldChange("rentYearly", e.target.value.replace(/[^\d.]/g, ""))}
                error={errors.rentYearly}
                placeholder="0.00"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            {t("floorDetails.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            className="px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md bg-blue-600 text-white"
          >
            {t("floorDetails.saveRenterDetails") || "Save Renter Details"}
          </Button>
        </div>

      </div>
    </div>
  );
}
