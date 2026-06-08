"use client";

import React from "react";
import { Input } from "@/components/common";
import { Landmark, TrendingUp, Calculator, FileText, Cpu, Calendar, CheckCircle2, RefreshCw } from "lucide-react";

interface LandValuationProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  plotCV?: any;
}

export function LandValuation({ formData, onChange, plotCV }: LandValuationProps) {
  const landArea = parseFloat(formData.landArea) || 0;
  const rate = parseFloat(formData.landRate) || 0;
  const devCost = parseFloat(formData.developmentCost) || 0;
  const appreciation = parseFloat(formData.marketAppreciation) || 0;

  // Use calculated plot CV if available from the backend calculation engine
  const totalLandValue = plotCV ? plotCV.totalCapitalValue : (landArea * rate);
  const totalAssetValue = totalLandValue + devCost;
  const appreciationValue = (totalAssetValue * appreciation) / 100;
  const currentMarketValue = totalAssetValue + appreciationValue;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

  return (
    <div className="space-y-4">
      
      {/* 1. Stunning Land CV Calculation Engine Status Panel */}
      {plotCV && (
        <div 
          className="p-5 rounded-2xl border shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            borderColor: "#334155"
          }}
        >
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700/60 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
                  <Landmark className="w-5 h-5" />
                </span>
                <h3 className="text-base font-extrabold text-slate-100 uppercase tracking-wide">
                  {plotCV.assetName || "Open Land/Plot Asset"}
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-400">
                Asset Number: <span className="text-blue-400 font-mono">{plotCV.assetNo || formData.assetCode}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Badge */}
              <div 
                className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  plotCV.isFullyCalculated 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}
              >
                {plotCV.isFullyCalculated ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fully Calculated</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Pending Calculations</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calculation Status */}
            <div className="bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-xl flex items-start gap-2.5">
              <Cpu className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Plot Engine Status</p>
                <p className="text-xs font-semibold text-slate-200">
                  Calculated {plotCV.calculatedPlots} / {plotCV.totalPlots} Plots
                </p>
              </div>
            </div>

            {/* Last Calculation Time */}
            <div className="bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-xl flex items-start gap-2.5">
              <Calendar className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Last Recalculated</p>
                <p className="text-xs font-bold text-slate-200">
                  {plotCV.lastCVCalculationDate ? new Date(plotCV.lastCVCalculationDate).toLocaleString("en-IN") : "Just Now"}
                </p>
              </div>
            </div>

            {/* Total Area */}
            <div className="bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-xl flex items-start gap-2.5">
              <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Aggregate Area</p>
                <p className="text-xs font-black text-slate-200">{plotCV.totalPlotAreaSqMtr || landArea || 0} sq.mtr</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Plot-by-Plot Mathematical Breakdowns */}
      {plotCV && plotCV.plotDetails && plotCV.plotDetails.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="w-full flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Calculator className="w-4 h-4" />
              </span>
              <div className="text-left">
                <h4 className="text-sm font-black text-slate-800 font-extrabold uppercase tracking-wide">Plot CV Calculation Details</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Live calculation engine formulas for individual plots</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plotCV.plotDetails.map((plot: any, idx: number) => (
                <div 
                  key={plot.plotId || idx} 
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between transition-all hover:border-slate-200 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-100">
                        Plot ID: {plot.plotId || idx + 1}
                      </span>
                      <h5 className="text-sm font-extrabold text-slate-800 mt-1 uppercase tracking-wide">
                        {plot.openPlotType || "General Plot"}
                      </h5>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Submission Type: <span className="text-slate-600 font-semibold">{plot.openPlotSubmissionType || "Standard"}</span>
                      </p>
                    </div>

                    {plot.isCalculated ? (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Calculated
                      </span>
                    ) : (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-200/50 pt-2 pb-3 text-xs text-slate-600">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Plot Area</p>
                      <p className="font-extrabold text-slate-700">{plot.plotAreaSqMtr ? `${plot.plotAreaSqMtr} sq.mtr` : "0.00 sq.mtr"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Taxable Area</p>
                      <p className="font-extrabold text-slate-700">{plot.plotTaxableAreaSqMtr ? `${plot.plotTaxableAreaSqMtr} sq.mtr` : "0.00 sq.mtr"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Rate</p>
                      <p className="font-extrabold text-slate-700">₹ {plot.baseRate ? Number(plot.baseRate).toLocaleString("en-IN") : "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Engine Remarks</p>
                      <p className="font-semibold text-slate-500 truncate" title={plot.calculationMessage}>
                        {plot.calculationMessage || "Success"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Calculation Formula</p>
                    {plot.cvCalculationFormula ? (
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10.5px] font-mono text-emerald-400 tracking-tight leading-relaxed overflow-x-auto whitespace-pre">
                        {plot.cvCalculationFormula}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-400 tracking-tight">
                        CV = Base Rate × Area
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex justify-between items-center bg-slate-100 rounded-lg p-2 border border-slate-200/50">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Plot CV Total:</span>
                    <span className="text-xs font-black font-mono text-slate-800">
                      ₹ {plot.capitalValue ? Number(plot.capitalValue).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Valuation Form & Breakdown Panels */}
      <h3 className="text-sm font-bold text-slate-800 px-1 mt-2">Detailed Valuation Breakdown</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left Panel */}
        <div className="rounded-2xl border border-blue-100 bg-white p-2 shadow-sm">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 flex items-center gap-2 mb-2">
            <FileText className="size-4 text-blue-500" />
            <h4 className="font-semibold text-blue-800 text-sm">A) Land Details & Base Valuation</h4>
          </div>

          <div className="space-y-2">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Land Area</p>
                <p className="font-semibold text-slate-800">{plotCV?.totalPlotAreaSqMtr ?? formData.landArea ?? "Not Available"}</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">From Basic Info</span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
              <p className="text-xs text-slate-500 mb-1">Asset Age</p>
              <p className="font-semibold text-slate-800">{formData.assetAge || "16 years"}</p>
            </div>

            <div>
              <Input
                label="Land Rate per sq.m (₹/sq.m)"
                name="landRate"
                value={formData.landRate || ""}
                onChange={onChange}
                placeholder="Enter rate per sq.m"
                type="number"
                required
              />
              <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                <span className="text-xs">💡</span> Current market rate per square meter
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2 mt-2">
              <div className="flex items-center gap-2 text-emerald-800 mb-2">
                <span className="font-semibold text-sm">₹ Total Land Value</span>
              </div>
              <div className="text-xl font-bold text-slate-800 mb-1">{formatCurrency(totalLandValue)}</div>
              <div className="text-xs text-emerald-600/80 italic">Auto-calculated: Area × Rate per sq.m</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="rounded-2xl border border-blue-100 bg-white p-2 shadow-sm">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 flex items-center gap-2 mb-2">
            <TrendingUp className="size-4 text-blue-500" />
            <h4 className="font-semibold text-blue-800 text-sm">B) Development & Market Value</h4>
          </div>

          <div className="space-y-2">
            <div>
              <Input
                label="Development Cost (₹)"
                name="developmentCost"
                value={formData.developmentCost || ""}
                onChange={onChange}
                placeholder="Enter development cost"
                type="number"
              />
              <p className="text-xs text-slate-500 mt-1">Infrastructure, leveling, boundary wall, etc.</p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
              <p className="text-xs text-slate-500 mb-1">Total Asset Value</p>
              <p className="font-bold text-slate-800 text-base">{formatCurrency(totalAssetValue)}</p>
              <p className="text-[10px] text-slate-400 mt-1">Land Value + Development Cost</p>
            </div>

            <div>
              <Input
                label="Market Appreciation (%)"
                name="marketAppreciation"
                value={formData.marketAppreciation || ""}
                onChange={onChange}
                placeholder="Enter appreciation %"
                type="number"
              />
              <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                <span className="text-xs">💡</span> Typical: 5-15% based on location and market
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
              <p className="text-xs font-semibold text-slate-700 mb-2">Calculation Formula:</p>
              <div className="space-y-1 text-xs text-slate-600">
                <p>• Land Value: {formatCurrency(totalLandValue)}</p>
                <p>• Plus: Development Cost: {formatCurrency(devCost)}</p>
                <p>• Plus: Appreciation ({appreciation}%): {formatCurrency(appreciationValue)}</p>
                <p className="font-semibold text-slate-800 mt-2 border-t pt-2">
                  • Market Value: {formatCurrency(currentMarketValue)}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2">
              <div className="flex items-center gap-2 text-emerald-800 mb-2">
                <span className="font-semibold text-sm">Current Market Value</span>
              </div>
              <div className="text-xl font-bold text-slate-800 mb-1">{formatCurrency(currentMarketValue)}</div>
              <div className="text-xs text-emerald-600/80 italic">Present market value with appreciation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
