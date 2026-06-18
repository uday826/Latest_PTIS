"use client";

import { Card, CardContent, CardHeader, CardTitle, Input } from "@/components/common";
import { ReceiptText } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

interface TaxationDetailsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function TaxationDetails({ formData, onChange }: TaxationDetailsProps) {
  const t = useTranslations("addAssetForm");
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-amber-100 mt-2">
      <CardHeader className="flex items-center gap-2 border-b border-amber-50 pb-1.5 mb-2">
        <div className="bg-amber-600 p-1.5 rounded-lg">
          <ReceiptText className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          {t("valuation.taxation.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Input
          label={t("valuation.taxation.propertyTax")}
          name="propertyTax"
          value={formData.propertyTax ?? ""}
          onChange={onChange}
          placeholder="0.00"
          type="number"
        />
        <Input
          label={t("valuation.taxation.waterTax")}
          name="waterTax"
          value={formData.waterTax ?? ""}
          onChange={onChange}
          placeholder="0.00"
          type="number"
        />
        <Input
          label={t("valuation.taxation.maintenanceCost")}
          name="maintenanceCost"
          value={formData.maintenanceCost ?? ""}
          onChange={onChange}
          placeholder={t("valuation.taxation.maintenanceCostPlaceholder")}
          type="number"
        />
        <Input
          label={t("valuation.taxation.insurancePremium")}
          name="insurancePremium"
          value={formData.insurancePremium ?? ""}
          onChange={onChange}
          placeholder={t("valuation.taxation.insurancePremiumPlaceholder")}
          type="number"
        />
        <Input
          label={t("valuation.taxation.taxLastPaidDate")}
          name="taxLastPaidDate"
          value={formData.taxLastPaidDate ?? ""}
          onChange={onChange}
          type="date"
        />
      </CardContent>
    </Card>
  );
}
