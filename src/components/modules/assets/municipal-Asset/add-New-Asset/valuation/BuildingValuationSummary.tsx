"use client";

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

interface FloorItem {
  floor?: string;
  constructionYear?: string;
  assessmentYear?: string;
  constructionType?: string;
  natureTypeBuilding?: string;
  subtype?: string;
  noOfRooms?: string | number;
  carpetAreaSqFt?: string | number;
  carpetAreaSqM?: string | number;
  builtUpAreaSqFt?: string | number;
  builtUpAreaSqM?: string | number;
  sdrr?: string | number;
  baseValue?: string | number;
  floorFactorValue?: string | number;
  ageFactorValue?: string | number;
  ntbFactorValue?: string | number;
  useFactorValue?: string | number;
  finalCapitalValue?: string | number;
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

interface BuildingValuationSummaryProps {
  floors: FloorItem[];
  furnitureItems: InventoryItem[];
  itEquipmentItems: InventoryItem[];
  electronicFixtures: InventoryItem[];
  vehicles: InventoryItem[];
}

export function BuildingValuationSummary({
  floors,
  furnitureItems,
  itEquipmentItems,
  electronicFixtures,
  vehicles,
}: BuildingValuationSummaryProps) {
  const buildingCapitalValue = floors.reduce((sum, floor) => {
    const value = parseFloat(String(floor.finalCapitalValue || "0").replace(/,/g, ""));
    return sum + value;
  }, 0);

  const furnitureValue = furnitureItems.reduce((sum, i) => sum + (i.totalValue || 0), 0);
  const itEquipmentValue = itEquipmentItems.reduce((sum, i) => sum + (i.totalValue || 0), 0);
  const electronicFixturesValue = electronicFixtures.reduce((sum, i) => sum + (i.totalValue || 0), 0);
  const vehiclesValue = vehicles.reduce((sum, i) => sum + (i.totalValue || 0), 0);
  const grandTotalValue = buildingCapitalValue + furnitureValue + itEquipmentValue + electronicFixturesValue + vehiclesValue;
  const totalBuiltUpArea = floors.reduce((sum, floor) => sum + (parseFloat(String(floor.builtUpAreaSqFt || "0")) || 0), 0);

  const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  const summaryCards = [
    { label: "Building Capital Value (CV)", value: buildingCapitalValue, sub: "From Construction Details (C)" },
    { label: "Furniture Items Value", value: furnitureValue, sub: "From Furniture Inventory (A)" },
    { label: "IT Equipment Value", value: itEquipmentValue, sub: "From IT Equipment Inventory (B)" },
    { label: "Electronic Fixtures Value", value: electronicFixturesValue, sub: "From Electronic Fixtures Inventory (C)" },
    { label: "Vehicles Value", value: vehiclesValue, sub: "From Vehicles Inventory (D)" },
  ];

  const detailCards: Array<{ title: string; color: string; bg: string; textColor: string; rows: DetailRow[]; footer: string }> = [
    {
      title: "Building Valuation", color: "#93C5FD", bg: "#DBEAFE", textColor: "#1E40AF",
      rows: [
        { label: "Total Floors Count", value: `${floors.length} ${floors.length === 1 ? "Floor" : "Floors"}`, badge: "Auto" },
        { label: "Total Built-up Area", value: totalBuiltUpArea > 0 ? `${fmt(totalBuiltUpArea)} sq.ft` : "Not Available", badge: "Auto" },
        { label: "Total Capital Value (CV)", value: `₹ ${buildingCapitalValue > 0 ? fmt(buildingCapitalValue) : "0.00"}`, highlight: true, highlightBg: "#D1FAE5", highlightBorder: "#6EE7B7", highlightText: "#065F46" },
      ],
      footer: "ℹ️ Auto-calculated from Construction Details (Section C)",
    },
    {
      title: "🪑 A) Furniture Items", color: "#C4B5FD", bg: "#EDE9FE", textColor: "#6B21A8",
      rows: [
        { label: "Total Furniture Items Count", value: `${furnitureItems.length} ${furnitureItems.length === 1 ? "Item" : "Items"}` },
        { label: "Total Quantity (Units)", value: `${furnitureItems.reduce((s, i) => s + (i.quantity || 0), 0)} Units` },
        { label: "Total Furniture Value", value: `₹ ${fmt(furnitureValue)}`, highlight: true, highlightBg: "#F3E8FF", highlightBorder: "#C4B5FD", highlightText: "#6B21A8" },
      ],
      footer: "ℹ️ From Furniture Inventory (Part A)",
    },
    {
      title: "💻 B) IT Equipment", color: "#93C5FD", bg: "#DBEAFE", textColor: "#1E40AF",
      rows: [
        { label: "Total IT Equipment Count", value: `${itEquipmentItems.length} ${itEquipmentItems.length === 1 ? "Item" : "Items"}` },
        { label: "Total Quantity (Units)", value: `${itEquipmentItems.reduce((s, i) => s + (i.quantity || 0), 0)} Units` },
        { label: "Total IT Equipment Value", value: `₹ ${fmt(itEquipmentValue)}`, highlight: true, highlightBg: "#DBEAFE", highlightBorder: "#93C5FD", highlightText: "#1E40AF" },
      ],
      footer: "ℹ️ From IT Equipment Inventory (Part B)",
    },
    {
      title: "💡 C) Electronic Fixtures", color: "#6EE7B7", bg: "#D1FAE5", textColor: "#065F46",
      rows: [
        { label: "Total Electronic Fixtures Count", value: `${electronicFixtures.length} ${electronicFixtures.length === 1 ? "Item" : "Items"}` },
        { label: "Total Quantity (Units)", value: `${electronicFixtures.reduce((s, i) => s + (i.quantity || 0), 0)} Units` },
        { label: "Total Electronic Fixtures Value", value: `₹ ${fmt(electronicFixturesValue)}`, highlight: true, highlightBg: "#D1FAE5", highlightBorder: "#6EE7B7", highlightText: "#065F46" },
      ],
      footer: "ℹ️ From Electronic Fixtures Inventory (Part C)",
    },
    {
      title: "🚗 D) Vehicles", color: "#FCD34D", bg: "#FEF3C7", textColor: "#92400E",
      rows: [
        { label: "Total Vehicles Count", value: `${vehicles.length} ${vehicles.length === 1 ? "Vehicle" : "Vehicles"}` },
        { label: "Total Quantity (Units)", value: `${vehicles.reduce((s, i) => s + (i.quantity || 0), 0)} Units` },
        { label: "Total Vehicles Value", value: `₹ ${fmt(vehiclesValue)}`, highlight: true, highlightBg: "#FEF3C7", highlightBorder: "#FCD34D", highlightText: "#92400E" },
      ],
      footer: "ℹ️ From Vehicles Inventory (Part D)",
    },
  ];

  return (
    <div className="space-y-6 p-4 rounded-lg">
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

        {/* Grand Total */}
        <div className="mt-2 p-2.5 rounded-lg flex justify-between items-center border-2" style={{ background: "linear-gradient(135deg,#EFF6FF,#DBEAFE,#BFDBFE)", borderColor: "#93C5FD" }}>
          <span className="font-bold text-sm" style={{ color: "#1E40AF" }}>Grand Total Asset Value</span>
          <div className="px-3 py-1.5 rounded-md" style={{ background: "linear-gradient(135deg,#1E40AF,#1E3A8A)", border: "1.5px solid #1D4ED8" }}>
            <span className="text-lg font-bold" style={{ fontFamily: "monospace", color: "#FFFFFF" }}>₹ {fmt(grandTotalValue)}</span>
          </div>
        </div>
      </div>

      <div className="h-px my-4 bg-gray-300" />

      {/* Detail Cards */}
      <div className="mb-3">
        <h4 className="text-base font-bold mb-3" style={{ color: "#1E40AF" }}>Detailed Valuation Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {detailCards.map((card) => (
            <div key={card.title} className="p-3 bg-white rounded-lg border shadow-md hover:shadow-lg transition-shadow duration-300" style={{ borderColor: card.color }}>
              <div className="rounded-lg py-1.5 px-2.5 mb-3 flex items-center gap-2" style={{ backgroundColor: card.bg, borderLeft: `4px solid ${card.color}` }}>
                <h4 className="text-xs font-bold" style={{ color: card.textColor }}>{card.title}</h4>
              </div>
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
              <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">{card.footer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
