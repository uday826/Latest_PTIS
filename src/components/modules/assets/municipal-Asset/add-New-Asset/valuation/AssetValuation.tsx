"use client";

import React from "react";
import { Input, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { BadgeDollarSign } from "lucide-react";

interface AssetValuationProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function AssetValuation({ formData, onChange }: AssetValuationProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-emerald-100">
      <CardHeader className="flex items-center gap-2 border-b border-emerald-50 pb-1.5 mb-2">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <BadgeDollarSign className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          A) Asset Valuation Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Input
          label="Gross Value (₹)"
          name="grossValue"
          value={formData.grossValue}
          onChange={onChange}
          placeholder="Original Purchase Value"
          type="number"
          required
        />
        <Input
          label="Current Book Value (₹)"
          name="currentBookValue"
          value={formData.currentBookValue}
          onChange={onChange}
          placeholder="Value after Depreciation"
          type="number"
        />
        <Input
          label="Market Value (₹)"
          name="marketValue"
          value={formData.marketValue}
          onChange={onChange}
          placeholder="Fair Market Value"
          type="number"
        />
        <Input
          label="Capital Value (₹)"
          name="capitalValue"
          value={formData.capitalValue}
          onChange={onChange}
          placeholder="Final Recorded Value"
          type="number"
          readOnly
          className="bg-emerald-50 font-black text-emerald-700"
        />
        <Input
          label="Valuation Date"
          name="lastValuationDate"
          value={formData.lastValuationDate}
          onChange={onChange}
          type="date"
          required
        />
        <Input
          label="Valuation Report No."
          name="valuationReportNo"
          value={formData.valuationReportNo}
          onChange={onChange}
          placeholder="e.g. VAL/2024/005"
        />
      </CardContent>
    </Card>
  );
}
