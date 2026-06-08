"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Calculator, Building2, Activity } from "lucide-react";
import { Input } from "@/components/common";

interface InfrastructureValuationProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function InfrastructureValuation({ formData, onChange }: InfrastructureValuationProps) {
  const [constructionCostPerUnit, setConstructionCostPerUnit] = useState<string>("");
  const [totalReplacementCost, setTotalReplacementCost] = useState<number>(0);
  const [depreciation, setDepreciation] = useState<number>(0);
  const [currentAssetValue, setCurrentAssetValue] = useState<number>(0);

  const assetType: string = formData.assetType || "";

  let primaryMetric = 0;
  let primaryMetricLabel = "";
  let primaryMetricUnit = "";
  let secondaryMetric = 0;
  let secondaryMetricLabel = "";
  let secondaryMetricUnit = "";
  let totalArea = 0;
  let costUnitLabel = "";

  if (assetType === "Road") {
    const length = parseFloat(formData.roadTotalLength) || 0;
    const width = parseFloat(formData.roadAverageWidth) || 0;
    primaryMetric = length; primaryMetricLabel = "Total Length"; primaryMetricUnit = "m";
    secondaryMetric = width; secondaryMetricLabel = "Average Width"; secondaryMetricUnit = "m";
    totalArea = length * width;
    costUnitLabel = "Construction Cost per Meter (₹/m)";
  } else if (assetType.includes("Bridge") || assetType.includes("Subway")) {
    const length = parseFloat(formData.bridgeTotalLength) || 0;
    const width = parseFloat(formData.bridgeWidth) || 0;
    primaryMetric = length; primaryMetricLabel = "Total Length"; primaryMetricUnit = "m";
    secondaryMetric = width; secondaryMetricLabel = "Width"; secondaryMetricUnit = "m";
    totalArea = length * width;
    costUnitLabel = "Construction Cost per Meter (₹/m)";
  } else if (assetType.includes("Water Tank")) {
    const capacity = parseFloat(formData.capacityInLiters) || 0;
    primaryMetric = capacity; primaryMetricLabel = "Capacity"; primaryMetricUnit = "liters";
    secondaryMetric = capacity / 1000; secondaryMetricLabel = "Capacity (kL)"; secondaryMetricUnit = "kiloliters";
    costUnitLabel = "Construction Cost per Kiloliter (₹/kL)";
  }

  const currentYear = new Date().getFullYear();
  const constructionYear = parseInt(formData.yearOfConstruction) || currentYear;
  const assetAge = currentYear - constructionYear;

  useEffect(() => {
    if (constructionCostPerUnit) {
      let cost = 0;
      if (assetType.includes("Water Tank")) {
        cost = (primaryMetric / 1000) * parseFloat(constructionCostPerUnit);
      } else {
        cost = primaryMetric * parseFloat(constructionCostPerUnit);
      }
      setTotalReplacementCost(cost);
      // propagate to formData via synthetic event
      const synth = { target: { name: "totalReplacementCost", value: cost.toFixed(2) } } as React.ChangeEvent<HTMLInputElement>;
      onChange(synth);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryMetric, constructionCostPerUnit]);

  useEffect(() => {
    if (totalReplacementCost > 0 && assetAge > 0) {
      const rate = Math.min(assetAge * 2, 50) / 100;
      const dep = totalReplacementCost * rate;
      setDepreciation(dep);
      const current = totalReplacementCost - dep;
      setCurrentAssetValue(current);
      const dSynth = { target: { name: "depreciation", value: dep.toFixed(2) } } as React.ChangeEvent<HTMLInputElement>;
      onChange(dSynth);
      const cSynth = { target: { name: "currentAssetValue", value: current.toFixed(2) } } as React.ChangeEvent<HTMLInputElement>;
      onChange(cSynth);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalReplacementCost, assetAge]);

  const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const summaryCards = [
    { label: "Total Replacement Cost", value: totalReplacementCost, sub: "New Construction Cost", borderColor: "#9CC7F0", bg: "#EAF4FD", textColor: "#1E5AA8", Icon: Building2 },
    { label: "Depreciation", value: depreciation, sub: `Age-based (${assetAge} years)`, borderColor: "#FCA5A5", bg: "#FEF2F2", textColor: "#DC2626", Icon: TrendingUp },
    { label: "Current Asset Value", value: currentAssetValue, sub: "Present Market Value", borderColor: "#88C9A0", bg: "#D9F2E1", textColor: "#1E5A36", Icon: Activity },
  ];
  return (
    <div className="space-y-6 p-4 rounded-lg">
      {/* Summary Cards */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {summaryCards.map(({ label, value, sub, borderColor, bg, textColor, Icon }) => (
            <div key={label} className="p-2 bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-300"
              style={{ borderColor, boxShadow: `0 0 15px ${borderColor}66`, background: bg }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3 h-3" style={{ color: textColor }} />
                <h5 className="text-sm font-bold" style={{ color: textColor }}>{label}</h5>
              </div>
              <p className="text-base font-bold mb-1" style={{ fontFamily: "monospace", color: textColor }}>{fmt(value)}</p>
              <p className="text-xs text-gray-500 italic">{sub}</p>
            </div>
          ))}
        </div>

        {/* Total Bar */}
        <div className="mt-2 p-2 rounded-lg flex justify-between items-center border-2"
          style={{ background: "linear-gradient(135deg,#D9F2E1,#C3E8CF)", borderColor: "#88C9A0" }}>
          <span className="font-bold text-base" style={{ color: "#1a3a2e" }}>Total Current Asset Value</span>
          <span className="text-lg font-bold" style={{ fontFamily: "monospace", color: "#1E5A36" }}>{fmt(currentAssetValue)}</span>
        </div>
      </div>

      <div className="h-px my-1.5" style={{ background: "linear-gradient(to right, transparent, #D4C4A8, transparent)" }} />

      {/* Detailed Breakdown */}
      <div className="mb-3">
        <h4 className="text-base font-bold mb-2" style={{ color: "#1E5AA8" }}>Detailed Valuation Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Asset Metrics */}
          <div className="p-6 bg-white rounded-xl border-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderColor: "#9CC7F0", minHeight: "320px" }}>
            <div className="rounded-lg py-3 px-4 mb-5 flex items-center gap-2.5 border-2"
              style={{ background: "#EAF4FD", borderColor: "#9CC7F0" }}>
              <Calculator className="w-5 h-5" style={{ color: "#1E5AA8" }} />
              <h4 className="text-sm font-bold" style={{ color: "#1E5AA8" }}>A) Asset Metrics &amp; Construction Cost</h4>
            </div>
            <div className="space-y-3 mb-4">
              {primaryMetricLabel && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: "#EAF4FD", border: "1px solid #9CC7F0" }}>
                  <p className="text-xs text-gray-600 mb-1">{primaryMetricLabel}</p>
                  <p className="text-lg font-bold" style={{ color: "#1E5AA8" }}>
                    {primaryMetric > 0 ? `${primaryMetric.toLocaleString("en-IN", { minimumFractionDigits: 2 })} ${primaryMetricUnit}` : "Not Available"}
                  </p>
                </div>
              )}
              {secondaryMetricLabel && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: "#EAF4FD", border: "1px solid #9CC7F0" }}>
                  <p className="text-xs text-gray-600 mb-1">{secondaryMetricLabel}</p>
                  <p className="text-lg font-bold" style={{ color: "#1E5AA8" }}>
                    {secondaryMetric > 0 ? `${secondaryMetric.toLocaleString("en-IN", { minimumFractionDigits: 2 })} ${secondaryMetricUnit}` : "Not Available"}
                  </p>
                </div>
              )}
              {totalArea > 0 && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: "#EAF4FD", border: "1px solid #9CC7F0" }}>
                  <p className="text-xs text-gray-600 mb-1">Total Area</p>
                  <p className="text-lg font-bold" style={{ color: "#1E5AA8" }}>{totalArea.toLocaleString("en-IN", { minimumFractionDigits: 2 })} sq.m</p>
                </div>
              )}
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#EAF4FD", border: "1px solid #9CC7F0" }}>
                <p className="text-xs text-gray-600 mb-1">Asset Age</p>
                <p className="text-lg font-bold" style={{ color: "#1E5AA8" }}>{assetAge >= 0 ? `${assetAge} years` : "Not Available"}</p>
              </div>
            </div>
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                {costUnitLabel} <span className="text-red-500">*</span>
              </label>
              <input
                value={constructionCostPerUnit}
                onChange={(e) => setConstructionCostPerUnit(e.target.value)}
                placeholder="Enter rate"
                type="number"
                step="0.01"
                className="h-9 text-xs border border-gray-300 rounded-md px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="p-4 rounded-lg border-2" style={{ backgroundColor: "#D9F2E1", borderColor: "#88C9A0" }}>
              <p className="text-xs mb-2 font-semibold" style={{ color: "#2D7A4E" }}>Total Replacement Cost</p>
              <p className="text-xl font-bold" style={{ fontFamily: "monospace", color: "#1E5A36" }}>{fmt(totalReplacementCost)}</p>
              <p className="text-xs text-gray-600 mt-1.5 italic">Auto-calculated from metrics</p>
            </div>
          </div>

          {/* Card 2: Depreciation */}
          <div className="p-6 bg-white rounded-xl border-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderColor: "#9CC7F0", minHeight: "320px" }}>
            <div className="rounded-lg py-3 px-4 mb-5 flex items-center gap-2.5 border-2"
              style={{ background: "#EAF4FD", borderColor: "#9CC7F0" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "#1E5AA8" }} />
              <h4 className="text-sm font-bold" style={{ color: "#1E5AA8" }}>B) Depreciation &amp; Current Value</h4>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600">Depreciation (Age-based)</p>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}>
                    {assetAge} yrs @ 2% p.a.
                  </span>
                </div>
                <p className="text-lg font-bold" style={{ color: "#DC2626" }}>{fmt(depreciation)}</p>
                <p className="text-xs text-gray-500 mt-1">Max 50% depreciation applied</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Calculation Formula:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Replacement Cost: {fmt(totalReplacementCost)}</p>
                  <p>• Less: Depreciation: {fmt(depreciation)}</p>
                  <hr className="my-1 border-gray-300" />
                  <p className="font-bold text-green-700">• Current Value: {fmt(currentAssetValue)}</p>
                </div>
              </div>
              <div className="p-5 rounded-lg border-2" style={{ backgroundColor: "#D9F2E1", borderColor: "#88C9A0" }}>
                <p className="text-xs mb-2 font-semibold" style={{ color: "#2D7A4E" }}>Current Asset Value</p>
                <p className="text-2xl font-bold" style={{ fontFamily: "monospace", color: "#1E5A36" }}>{fmt(currentAssetValue)}</p>
                <p className="text-xs text-gray-600 mt-2 italic">Present Market Value after depreciation</p>
              </div>
              <div>
                <Input
                  label="Annual Maintenance Cost (₹)"
                  name="annualMaintenanceCost"
                  value={formData.annualMaintenanceCost || ""}
                  onChange={onChange}
                  placeholder="Enter annual maintenance cost"
                  type="number"
                />
                <p className="text-xs text-gray-500 mt-1">💡 Typical: 2-5% of current value</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
