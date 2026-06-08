"use client";
import React, { useState } from "react";
import { InventoryCategoryGroup } from "./FurnitureFixtureTypes";
import { inventoryMeta, formatCurrency } from "./FurnitureFixtureConstants";
import { ChevronDown, ChevronRight, TrendingDown, Hash } from "lucide-react";

interface Props {
  groups: InventoryCategoryGroup[];
  grandPurchase: number;
  grandCV: number;
}

export function InventoryCVGroupTable({ groups, grandPurchase, grandCV }: Props) {
  const [expandedBatches, setExpandedBatches] = useState<Record<number, boolean>>({});
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const toggleCat   = (t: string) => setExpandedCats(p => ({ ...p, [t]: !p[t] }));
  const toggleBatch = (id: number) => setExpandedBatches(p => ({ ...p, [id]: !p[id] }));

  const grandDep = grandPurchase - grandCV;
  if (!groups.length) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#BFD0E6] bg-white shadow-md">
      <div className="flex items-center gap-3 border-b border-[#D7E1EE] bg-[#F0F7FF] px-4 py-2.5">
        <TrendingDown className="h-4 w-4 text-blue-600 shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-blue-700">Category-wise CV & Individual Asset Register</h3>
          <p className="text-xs text-blue-500">Click any row to see all individual assets with their unique Asset Numbers</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[#D7E1EE] bg-[#F7FAFF] text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-2.5 text-left w-[260px]">Asset / Category</th>
              <th className="px-4 py-2.5 text-right">Units</th>
              <th className="px-4 py-2.5 text-right">Unit Value</th>
              <th className="px-4 py-2.5 text-right">Purchase Value</th>
              <th className="px-4 py-2.5 text-right">Depreciation</th>
              <th className="px-4 py-2.5 text-right text-blue-700 font-bold">CV (Current Value)</th>
              <th className="px-4 py-2.5 text-center">Assets</th>
            </tr>
          </thead>

          <tbody>
            {groups.map(group => {
              const meta   = inventoryMeta[group.inventoryType as keyof typeof inventoryMeta];
              const Icon   = meta?.icon;
              const catOpen = expandedCats[group.inventoryType];

              return (
                <React.Fragment key={group.inventoryType}>
                  <tr
                    className="cursor-pointer border-b-2 border-[#CBD8EA] bg-[#EEF4FF] hover:bg-blue-50 transition-colors"
                    onClick={() => toggleCat(group.inventoryType)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${meta?.badgeClassName ?? ""}`}>
                          {Icon && <Icon className="h-3.5 w-3.5" />}
                        </div>
                        <span className="font-bold text-slate-800">{group.label}</span>
                        <span className="text-xs text-slate-500">({group.totalBatches} {group.totalBatches === 1 ? "entry" : "entries"})</span>
                        {catOpen ? <ChevronDown className="h-3.5 w-3.5 text-blue-600 ml-auto" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400 ml-auto" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">
                      {group.totalUnits.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">—</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">
                      {formatCurrency(group.totalPurchaseValue)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600 font-medium">
                      −{formatCurrency(group.totalDepreciation)}
                      <div className="text-[10px] text-red-400">{group.depreciationPercent.toFixed(1)}% dep.</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-700 text-base">
                      {formatCurrency(group.totalCapitalValue)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                        {group.totalUnits} assets
                      </span>
                    </td>
                  </tr>

                  {catOpen && group.batches.map((batch) => {
                    const batchOpen = expandedBatches[batch.id];
                    const totalCV   = batch.totalCV ?? batch.total;
                    const dep       = batch.total - totalCV;
                    const hasUnits  = (batch.registeredUnits?.length ?? 0) > 0;

                    return (
                      <React.Fragment key={`batch-${batch.id}`}>
                        <tr
                          className={`border-b border-dashed border-[#D7E1EE] ${hasUnits ? "cursor-pointer hover:bg-slate-50" : ""} transition-colors`}
                          onClick={() => hasUnits && toggleBatch(batch.id)}
                        >
                          <td className="py-2.5 pl-12 pr-4">
                            <div className="flex items-center gap-2">
                              {hasUnits && (
                                batchOpen
                                  ? <ChevronDown className="h-3 w-3 text-blue-500 shrink-0" />
                                  : <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                              )}
                              <span className="font-medium text-slate-800">
                                {batch.itemName} — <span className="text-blue-700">{batch.modelName}</span>
                              </span>
                              {batch.invoice?.invoiceNumber && (
                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                                  {batch.invoice.invoiceNumber}
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 pl-5 text-[11px] text-slate-500">
                              {batch.condition} · Age {batch.ageInYears ?? 0}yr ·{" "}
                              {batch.depreciationRate !== undefined
                                ? `${(batch.depreciationRate * 100).toFixed(0)}%/yr dep.`
                                : ""}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-600">
                            <span className="font-semibold">{batch.quantity}</span> units
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-600">
                            {formatCurrency(batch.unitValue)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-600">
                            {formatCurrency(batch.total)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-red-500">
                            −{formatCurrency(dep)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-emerald-700">
                            {formatCurrency(totalCV)}
                            <div className="text-[10px] font-normal text-slate-400">
                              {formatCurrency(batch.unitCV ?? batch.unitValue)} × {batch.quantity}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {batch.isRegistered ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                ✓ Saved
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Pending</span>
                            )}
                          </td>
                        </tr>

                        {batchOpen && batch.registeredUnits?.map(unit => (
                          <tr key={`unit-${unit.assetId}`}
                              className="border-b border-dotted border-slate-200 bg-slate-50/70 text-xs">
                            <td className="py-2 pl-20 pr-4">
                              <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="font-mono font-bold text-slate-700">{unit.assetNo}</span>
                                <span className="text-slate-500">Unit {unit.unitNumber}</span>
                              </div>
                              <div className="pl-5 text-[10px] text-slate-400 mt-0.5">
                                AssetId: {unit.assetId}
                                {unit.serialNumber && ` · S/N: ${unit.serialNumber}`}
                                {unit.assetTag && ` · Tag: ${unit.assetTag}`}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right text-slate-500">1</td>
                            <td className="px-4 py-2 text-right text-slate-500">
                              {formatCurrency(unit.unitPurchaseValue)}
                            </td>
                            <td className="px-4 py-2 text-right text-slate-500">
                              {formatCurrency(unit.unitPurchaseValue)}
                            </td>
                            <td className="px-4 py-2 text-right text-red-400">
                              −{formatCurrency(unit.unitPurchaseValue - (unit.unitCapitalValue ?? unit.unitPurchaseValue))}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-emerald-600">
                              {formatCurrency(unit.unitCapitalValue ?? unit.unitPurchaseValue)}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                {unit.assetNo}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-[#1E40AF] bg-[#0F172A] text-white">
              <td className="px-4 py-3 font-bold">GRAND TOTAL</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-300">
                {groups.reduce((s, g) => s + g.totalUnits, 0).toLocaleString("en-IN")} assets
              </td>
              <td className="px-4 py-3 text-right text-slate-400">—</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-300">
                {formatCurrency(grandPurchase)}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-red-300">
                −{formatCurrency(grandDep)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-lg text-blue-300">
                {formatCurrency(grandCV)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
