"use client";

import { Card, CardContent, CardHeader, CardTitle, Input } from "@/components/common";
import { BadgeDollarSign } from "lucide-react";
import React from "react";

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
          value={formData.grossValue ?? ""}
          onChange={onChange}
          placeholder="Original Purchase Value"
          type="number"
          required
        />
        {formData.isMovableCategory && (
          <>
            <Input
              label="Purchase Date"
              name="purchaseDate"
              value={formData.purchaseDate ? String(formData.purchaseDate).split("T")[0] : ""}
              onChange={onChange}
              type="date"
              required
            />
            <Input
              label="Depreciation Rate (%)"
              name="depreciationRate"
              value={formData.depreciationRate ?? ""}
              onChange={onChange}
              placeholder="e.g. 10"
              type="number"
              required
            />
            <div className="flex flex-col">
              <span className="mb-1.5 text-sm font-medium text-gray-700">
                Asset Condition
              </span>
              <div className="h-10 px-3 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-bold flex items-center">
                {formData.condition || "Good"}
              </div>
            </div>
          </>
        )}
        <Input
          label="Current Book Value (₹)"
          name="currentBookValue"
          value={formData.currentBookValue ?? ""}
          onChange={onChange}
          placeholder="Value after Depreciation"
          type="number"
          readOnly={formData.isMovableCategory}
          className={formData.isMovableCategory ? "bg-slate-50 cursor-not-allowed text-slate-600" : ""}
        />
        <Input
          label="Market Value (₹)"
          name="marketValue"
          value={formData.marketValue ?? ""}
          onChange={onChange}
          placeholder="Fair Market Value"
          type="number"
          readOnly={formData.isMovableCategory}
          className={formData.isMovableCategory ? "bg-slate-50 cursor-not-allowed text-slate-600" : ""}
        />
        <Input
          label="Capital Value (₹)"
          name="capitalValue"
          value={formData.capitalValue ?? ""}
          onChange={onChange}
          placeholder="Final Recorded Value"
          type="number"
          readOnly
          className="bg-emerald-50 font-black text-emerald-700"
        />
        {/* <Input
          label="Valuation Date"
          name="lastValuationDate"
          value={formData.lastValuationDate ?? ""}
          onChange={onChange}
          type="date"
          required
        />
        <Input
          label="Valuation Report No."
          name="valuationReportNo"
          value={formData.valuationReportNo ?? ""}
          onChange={onChange}
          placeholder="e.g. VAL/2024/005"
        /> */}
      </CardContent>
    </Card>
  );
}
