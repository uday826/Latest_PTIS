"use client";
import React, { useState } from "react";
import { InventoryCategoryGroup } from "./FurnitureFixtureTypes";
import { inventoryMeta, formatCurrency } from "./FurnitureFixtureConstants";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  groups: InventoryCategoryGroup[];
  grandPurchase: number;
  grandCV: number;
}

export function InventoryCVGroupTable({ groups, grandPurchase, grandCV }: Props) {
  const t = useTranslations("addAssetForm");
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const toggleCat = (t: string) => setExpandedCats(p => ({ ...p, [t]: !p[t] }));

  const grandDep = grandPurchase - grandCV;
  if (!groups.length) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#BFD0E6] bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-[#D7E1EE] bg-[#F7FAFF] text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-3 py-1.5 text-left w-[240px]">{t("inventory.columns.assetCategory")}</th>
              <th className="px-3 py-1.5 text-center">{t("inventory.columns.units")}</th>
              <th className="px-3 py-1.5 text-center">{t("inventory.columns.unitValue")}</th>
              <th className="px-3 py-1.5 text-center">{t("inventory.columns.purchaseValue")}</th>
              <th className="px-3 py-1.5 text-center">{t("inventory.columns.depreciation")}</th>
              <th className="px-3 py-1.5 text-center text-blue-700 font-bold">{t("inventory.columns.totalCv")}</th>
            </tr>
          </thead>

          <tbody>
            {groups.map(group => {
              const meta = inventoryMeta[group.inventoryType as keyof typeof inventoryMeta];
              const Icon = meta?.icon;
              const catOpen = expandedCats[group.inventoryType];

              return (
                <React.Fragment key={group.inventoryType}>
                  <tr
                    className="cursor-pointer border-b border-[#CBD8EA] bg-[#EEF4FF] hover:bg-blue-50 transition-colors"
                    onClick={() => toggleCat(group.inventoryType)}
                  >
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md ${meta?.badgeClassName ?? ""}`}>
                          {Icon && <Icon className="h-3 w-3" />}
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">{group.label}</span>
                        <span className="text-[10px] text-slate-500">({group.totalBatches} {group.totalBatches === 1 ? t("inventory.columns.entry") : t("inventory.columns.entries")})</span>
                        {catOpen ? <ChevronDown className="h-3 w-3 text-blue-600 ml-auto" /> : <ChevronRight className="h-3 w-3 text-slate-400 ml-auto" />}
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-center font-semibold text-slate-700">
                      {group.totalUnits.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-1.5 text-center text-slate-400">—</td>
                    <td className="px-3 py-1.5 text-center font-semibold text-slate-700">
                      {formatCurrency(group.totalPurchaseValue)}
                    </td>
                    <td className="px-3 py-1.5 text-center text-red-600 font-medium">
                      −{formatCurrency(group.totalDepreciation)}
                      <span className="text-[9px] text-red-400 ml-1">({group.depreciationPercent.toFixed(1)}%)</span>
                    </td>
                    <td className="px-3 py-1.5 text-center font-bold text-blue-700 text-xs">
                      {formatCurrency(group.totalCapitalValue)}
                    </td>
                  </tr>

                  {catOpen && group.batches.map((batch) => {
                    const totalCV = batch.totalCV ?? batch.total;
                    const dep = batch.total - totalCV;

                    return (
                      <React.Fragment key={`batch-${batch.id}`}>
                        <tr className="border-b border-dashed border-[#D7E1EE] bg-white transition-colors">
                          <td className="py-1 pl-8 pr-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-slate-800 text-[11px]">
                                {batch.itemName} — <span className="text-blue-700">{batch.modelName}</span>
                              </span>
                              {batch.invoice?.invoiceNumber && (
                                <span className="rounded bg-amber-100 px-1 py-0.2 text-[9px] font-medium text-amber-700">
                                  {batch.invoice.invoiceNumber}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 pl-1">
                              {batch.condition} · {t("inventory.columns.ageYrs", { age: batch.ageInYears ?? 0 })} ·{" "}
                              {batch.depreciationRate !== undefined
                                ? t("inventory.columns.depRatePercent", { percent: (batch.depreciationRate * 100).toFixed(0) })
                                : ""}
                            </div>
                          </td>
                          <td className="px-3 py-1 text-center font-semibold text-slate-600">
                            {batch.quantity.toLocaleString("en-IN")}
                          </td>
                          <td className="px-3 py-1 text-center text-slate-600">
                            {formatCurrency(batch.unitValue)}
                          </td>
                          <td className="px-3 py-1 text-center text-slate-600">
                            {formatCurrency(batch.total)}
                          </td>
                          <td className="px-3 py-1 text-center text-red-500">
                            −{formatCurrency(dep)}
                          </td>
                          <td className="px-3 py-1 text-center font-semibold text-emerald-700">
                            {formatCurrency(totalCV)}
                            <div className="text-[9px] font-normal text-slate-400">
                              {formatCurrency(batch.unitCV ?? batch.unitValue)} × {batch.quantity}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-[#1E40AF] bg-[#0F172A] text-white">
              <td className="px-3 py-1.5 font-bold text-[11px]">{t("inventory.columns.grandTotal")}</td>
              <td className="px-3 py-1.5 text-center font-semibold text-slate-300">
                {groups.reduce((s, g) => s + g.totalUnits, 0).toLocaleString("en-IN")}
              </td>
              <td className="px-3 py-1.5 text-center text-slate-400">—</td>
              <td className="px-3 py-1.5 text-center font-semibold text-slate-300">
                {formatCurrency(grandPurchase)}
              </td>
              <td className="px-3 py-1.5 text-center font-semibold text-red-300">
                −{formatCurrency(grandDep)}
              </td>
              <td className="px-3 py-1.5 text-center font-bold text-xs text-blue-300">
                {formatCurrency(grandCV)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
