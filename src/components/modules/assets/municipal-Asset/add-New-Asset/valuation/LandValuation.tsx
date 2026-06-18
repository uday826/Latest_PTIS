"use client";

import { useTranslations } from "next-intl";
import {
  DollarSign
} from "lucide-react";

interface DetailRow {
  label: string;
  value: string;
  badge?: string;
  highlight?: boolean;
  highlightBg?: string;
  highlightBorder?: string;
  highlightText?: string;
}

interface InventoryItem {
  id?: string;
  itemName?: string;
  equipmentName?: string;
  typeModel?: string;
  brandModel?: string;
  purchaseDate?: string;
  condition?: string;
  status?: string;
  quantity?: number;
  unitValue?: number;
  totalValue?: number;
  specifications?: string;
}

interface LandValuationProps {
  formData: any;
  plotCV?: any;
  furnitureItems?: InventoryItem[];
  itEquipmentItems?: InventoryItem[];
  electronicFixtures?: InventoryItem[];
  vehicles?: InventoryItem[];
}

export function LandValuation({
  formData,
  plotCV,
  furnitureItems = [],
  itEquipmentItems = [],
  electronicFixtures = [],
  vehicles = [],
}: LandValuationProps) {
  const t = useTranslations("addAssetForm");
  const landArea = parseFloat(formData.landArea) || 0;
  const rate = parseFloat(formData.landRate) || 0;

  // Core land CV from plotCV API or area * rate
  const totalLandValue = plotCV ? plotCV.totalCapitalValue : (landArea * rate);

  // Inventory totals
  const furnitureValue = furnitureItems.reduce((sum, i) => sum + (i.totalValue || 0), 0);
  const itEquipmentValue = itEquipmentItems.reduce((sum, i) => sum + (i.totalValue || 0), 0);
  const electronicFixturesValue = electronicFixtures.reduce((sum, i) => sum + (i.totalValue || 0), 0);
  const vehiclesValue = vehicles.reduce((sum, i) => sum + (i.totalValue || 0), 0);

  // Grand Total Asset Value (without additions)
  const grandTotalValue = totalLandValue + furnitureValue + itEquipmentValue + electronicFixturesValue + vehiclesValue;

  const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

  const summaryCards = [
    { label: t("valuation.land.capitalValue"), value: totalLandValue, sub: plotCV ? t("valuation.land.subPlotCv") : t("valuation.land.subAreaRates") },
    { label: t("valuation.inventory.furnitureValue"), value: furnitureValue, sub: t("valuation.inventory.subFurniture") },
    { label: t("valuation.inventory.itValue"), value: itEquipmentValue, sub: t("valuation.inventory.subIt") },
    { label: t("valuation.inventory.electronicValue"), value: electronicFixturesValue, sub: t("valuation.inventory.subElectronic") },
    { label: t("valuation.inventory.vehiclesValue"), value: vehiclesValue, sub: t("valuation.inventory.subVehicles") },
  ];

  const detailCards: Array<{ title: string; color: string; bg: string; textColor: string; rows: DetailRow[]; footer: string; isLandCard?: boolean }> = [
    {
      title: t("valuation.land.title"),
      color: "#93C5FD",
      bg: "#DBEAFE",
      textColor: "#1E40AF",
      isLandCard: true,
      rows: [],
      footer: t("valuation.land.footer"),
    },
    {
      title: `🪑 A) ${t("valuation.inventory.furnitureValue").replace(" Value", "")}`, color: "#C4B5FD", bg: "#EDE9FE", textColor: "#6B21A8",
      rows: [
        { label: t("valuation.inventory.totalFurnitureCount"), value: `${furnitureItems.length} ${furnitureItems.length === 1 ? t("valuation.inventory.itemsVal", { count: 1 }).split(" ")[1] : t("valuation.inventory.itemsVal", { count: 2 }).split(" ")[1]}` },
        { label: t("valuation.inventory.totalQty"), value: `${furnitureItems.reduce((s, i) => s + (i.quantity || 0), 0)} ${t("inventory.columns.unitsText")}` },
        { label: t("valuation.inventory.totalFurnitureValue"), value: `₹ ${fmt(furnitureValue)}`, highlight: true, highlightBg: "#F3E8FF", highlightBorder: "#C4B5FD", highlightText: "#6B21A8" },
      ],
      footer: t("valuation.inventory.footerFurniture"),
    },
    {
      title: `💻 B) ${t("valuation.inventory.itValue").replace(" Value", "")}`, color: "#93C5FD", bg: "#DBEAFE", textColor: "#1E40AF",
      rows: [
        { label: t("valuation.inventory.totalItCount"), value: `${itEquipmentItems.length} ${itEquipmentItems.length === 1 ? t("valuation.inventory.itemsVal", { count: 1 }).split(" ")[1] : t("valuation.inventory.itemsVal", { count: 2 }).split(" ")[1]}` },
        { label: t("valuation.inventory.totalQty"), value: `${itEquipmentItems.reduce((s, i) => s + (i.quantity || 0), 0)} ${t("inventory.columns.unitsText")}` },
        { label: t("valuation.inventory.totalItValue"), value: `₹ ${fmt(itEquipmentValue)}`, highlight: true, highlightBg: "#DBEAFE", highlightBorder: "#93C5FD", highlightText: "#1E40AF" },
      ],
      footer: t("valuation.inventory.footerIt"),
    },
    {
      title: `💡 C) ${t("valuation.inventory.electronicValue").replace(" Value", "")}`, color: "#6EE7B7", bg: "#D1FAE5", textColor: "#065F46",
      rows: [
        { label: t("valuation.inventory.totalElectronicCount"), value: `${electronicFixtures.length} ${electronicFixtures.length === 1 ? t("valuation.inventory.itemsVal", { count: 1 }).split(" ")[1] : t("valuation.inventory.itemsVal", { count: 2 }).split(" ")[1]}` },
        { label: t("valuation.inventory.totalQty"), value: `${electronicFixtures.reduce((s, i) => s + (i.quantity || 0), 0)} ${t("inventory.columns.unitsText")}` },
        { label: t("valuation.inventory.totalElectronicValue"), value: `₹ ${fmt(electronicFixturesValue)}`, highlight: true, highlightBg: "#D1FAE5", highlightBorder: "#6EE7B7", highlightText: "#065F46" },
      ],
      footer: t("valuation.inventory.footerElectronic"),
    },
    {
      title: `🚗 D) ${t("valuation.inventory.vehiclesValue").replace(" Value", "")}`, color: "#FCD34D", bg: "#FEF3C7", textColor: "#92400E",
      rows: [
        { label: t("valuation.inventory.totalVehiclesCount"), value: `${vehicles.length} ${vehicles.length === 1 ? t("valuation.inventory.itemsVal", { count: 1 }).split(" ")[1] : t("valuation.inventory.itemsVal", { count: 2 }).split(" ")[1]}` },
        { label: t("valuation.inventory.totalQty"), value: `${vehicles.reduce((s, i) => s + (i.quantity || 0), 0)} ${t("inventory.columns.unitsText")}` },
        { label: t("valuation.inventory.totalVehiclesValue"), value: `₹ ${fmt(vehiclesValue)}`, highlight: true, highlightBg: "#FEF3C7", highlightBorder: "#FCD34D", highlightText: "#92400E" },
      ],
      footer: t("valuation.inventory.footerVehicles"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 3. Summary Cards (Same as Building Category layout) */}
      <div className="mb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="p-3 rounded-xl border border-blue-100 bg-white shadow-sm"
              style={{ background: "linear-gradient(135deg,#FFFFFF 0%,#F0F9FF 100%)" }}
            >
              <h5 className="text-xs font-bold mb-1" style={{ color: "#1E3A8A" }}>{card.label}</h5>
              <p className="text-lg font-bold mb-1" style={{ fontFamily: "monospace", color: "#1E3A8A" }}>₹ {fmt(card.value)}</p>
              <div className="flex items-center justify-between pt-1 border-t border-blue-50">
                <p className="text-[10px] font-medium text-slate-400">
                  {card.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total Asset Value Banner */}
        <div className="mt-2 p-2.5 rounded-lg flex justify-between items-center border-2" style={{ background: "linear-gradient(135deg,#EFF6FF,#DBEAFE,#BFDBFE)", borderColor: "#93C5FD" }}>
          <span className="font-bold text-sm" style={{ color: "#1E40AF" }}>{t("valuation.grandTotal")}</span>
          <div className="px-3 py-1.5 rounded-md" style={{ background: "linear-gradient(135deg,#1E40AF,#1E3A8A)", border: "1.5px solid #1D4ED8" }}>
            <span className="text-lg font-bold" style={{ fontFamily: "monospace", color: "#FFFFFF" }}>₹ {fmt(grandTotalValue)}</span>
          </div>
        </div>
      </div>

      <div className="h-px my-4 bg-gray-300" />

      {/* 4. Detailed Breakdown Cards */}
      <div className="mb-3">
        <h4 className="text-base font-bold mb-3" style={{ color: "#1E40AF" }}>{t("valuation.breakdown.title")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {detailCards.map((card) => (
            <div key={card.title} className="p-3 bg-white rounded-lg border shadow-md hover:shadow-lg transition-shadow duration-300" style={{ borderColor: card.color }}>
              <div className="rounded-lg py-1.5 px-2.5 mb-3 flex items-center gap-2" style={{ backgroundColor: card.bg, borderLeft: `4px solid ${card.color}` }}>
                <h4 className="text-xs font-bold" style={{ color: card.textColor }}>{card.title}</h4>
              </div>

              {card.isLandCard ? (
                /* Land Valuation Card contains read-only values */
                <div className="space-y-3">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600">{t("valuation.land.totalArea")}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 font-medium">{t("valuation.land.auto")}</span>
                    </div>
                    <p className="text-sm font-bold" style={{ color: "#374151" }}>
                      {plotCV?.totalPlotAreaSqMtr ?? landArea ?? 0} {t("valuation.land.sqMtr")}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg border" style={{ backgroundColor: "#DBEAFE", borderColor: "#93C5FD" }}>
                    <p className="text-xs mb-1 flex items-center gap-1 font-semibold" style={{ color: "#1E40AF" }}>
                      <DollarSign className="w-3.5 h-3.5" />{t("valuation.land.capitalValue")}
                    </p>
                    <p className="text-sm font-bold" style={{ fontFamily: "monospace", color: "#1E40AF" }}>
                      {formatCurrency(totalLandValue)}
                    </p>
                  </div>
                </div>
              ) : (
                /* Inventory breakdown cards (Read-only) */
                <div className="space-y-2">
                  {card.rows.map((row) =>
                    row.highlight ? (
                      <div key={row.label} className="p-2 rounded-lg border" style={{ backgroundColor: row.highlightBg, borderColor: row.highlightBorder }}>
                        <p className="text-xs mb-1 flex items-center gap-1 font-semibold" style={{ color: row.highlightText }}>
                          <DollarSign className="w-3.5 h-3.5" />{row.label}
                        </p>
                        <p className="text-lg font-bold" style={{ fontFamily: "monospace", color: row.highlightText }}>{row.value}</p>
                      </div>
                    ) : (
                      <div key={row.label} className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-gray-600">{row.label}</p>
                          {row.badge && <span className="text-xs px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 font-medium">{row.badge}</span>}
                        </div>
                        <p className="text-sm font-bold" style={{ color: "#374151" }}>{row.value}</p>
                      </div>
                    )
                  )}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">{card.footer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
