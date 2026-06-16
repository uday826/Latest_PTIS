"use client";

import { Card, CardContent, CardHeader, CardTitle, Input } from "@/components/common";
import { ReceiptText } from "lucide-react";
import React from "react";

interface TaxationDetailsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function TaxationDetails({ formData, onChange }: TaxationDetailsProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-amber-100 mt-2">
      <CardHeader className="flex items-center gap-2 border-b border-amber-50 pb-1.5 mb-2">
        <div className="bg-amber-600 p-1.5 rounded-lg">
          <ReceiptText className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          B) Taxation & Annual Charges
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Input
          label="Annual Property Tax (₹)"
          name="propertyTax"
          value={formData.propertyTax ?? ""}
          onChange={onChange}
          placeholder="0.00"
          type="number"
        />
        <Input
          label="Annual Water Tax (₹)"
          name="waterTax"
          value={formData.waterTax ?? ""}
          onChange={onChange}
          placeholder="0.00"
          type="number"
        />
        <Input
          label="Annual Maintenance Cost (₹)"
          name="maintenanceCost"
          value={formData.maintenanceCost ?? ""}
          onChange={onChange}
          placeholder="Estimated annual exp"
          type="number"
        />
        <Input
          label="Insurance Premium (₹)"
          name="insurancePremium"
          value={formData.insurancePremium ?? ""}
          onChange={onChange}
          placeholder="If insured"
          type="number"
        />
        <Input
          label="Last Paid Date (Tax)"
          name="taxLastPaidDate"
          value={formData.taxLastPaidDate ?? ""}
          onChange={onChange}
          type="date"
        />
      </CardContent>
    </Card>
  );
}
