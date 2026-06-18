"use client";

import { useTranslations } from "next-intl";
import {
  DollarSign,
  TrendingUp,
  Home,
  Armchair,
  Laptop,
  Lightbulb,
  Car,
  ChevronRight,
  Building,
  Package,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/common";

const COND_FACTORS: Record<string, number> = {
  "New":         1.00,
  "Excellent":   1.00,
  "Good":        0.85,
  "Fair":        0.65,
  "Poor":        0.40,
  "Working":     0.90,
  "Not Working": 0.10,
};

function calculateItemCV(item: any, categories: any[], conditions?: any[]) {
  const rawType = String(item.inventoryType ?? item.InventoryType ?? "").toLowerCase().trim();
  let normalizedKey = "furniture";
  if (rawType.includes("furniture") || rawType.includes("furn")) {
    normalizedKey = "furniture";
  } else if (rawType.includes("it-equipment") || rawType.includes("it_equipment") || rawType.includes("it-equip") || rawType === "it" || rawType.includes("computer")) {
    normalizedKey = "it-equipment";
  } else if (rawType.includes("electronic") || rawType.includes("elect") || rawType.includes("fixture")) {
    normalizedKey = "electronic-fixtures";
  } else if (rawType.includes("vehicle") || rawType.includes("veh") || rawType.includes("car")) {
    normalizedKey = "vehicle";
  } else {
    normalizedKey = rawType.replace(/[\s_]+/g, "-");
  }

  const keyToTypeName: Record<string, string> = {
    "furniture": "Furniture",
    "it-equipment": "IT Equipment",
    "electronic-fixtures": "Electronic Fixtures",
    "vehicle": "Vehicle"
  };
  const targetTypeName = keyToTypeName[normalizedKey] || normalizedKey;

  const cat = categories.find(
    (c) =>
      String(c.typeName).toLowerCase() === targetTypeName.toLowerCase() ||
      String(c.typeCode).toLowerCase() === targetTypeName.toLowerCase() ||
      (targetTypeName === "Electronic Fixtures" && String(c.typeName).toLowerCase() === "electronics")
  );
  const depRate = cat ? Number(cat.depreciationRate ?? 0.10) : 0.10;
  
  const condition = String(item.condition ?? item.Condition ?? "");
  const matchedCond = conditions?.find(
    (c) =>
      String(c.conditionName).toLowerCase() === condition.toLowerCase() &&
      c.inventoryItemCategoryId === cat?.id
  ) || conditions?.find(
    (c) => String(c.conditionName).toLowerCase() === condition.toLowerCase()
  );
  const condFactor = matchedCond ? Number(matchedCond.conditionFactor) : (COND_FACTORS[condition] ?? 0.75);
  
  const purchaseDate = item.purchaseDate ?? item.PurchaseDate ?? "";
  const purchYear = purchaseDate ? new Date(purchaseDate).getFullYear() : new Date().getFullYear();
  const ageInYears = Math.max(0, new Date().getFullYear() - purchYear);
  const depFactor = Math.max(0.10, 1 - depRate * ageInYears);
  
  const unitValue = Number(item.unitValue ?? item.UnitValue ?? 0);
  const quantity = Number(item.quantity ?? item.Quantity ?? 0);
  
  const unitCV = Math.round(unitValue * depFactor * condFactor * 100) / 100;
  const totalCV = Math.round(unitCV * quantity * 100) / 100;
  
  return totalCV;
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

interface BuildingValuationSummaryProps {
  floors: FloorItem[];
  rawInventories?: any[];
  categories?: any[];
  conditions?: any[];
  // Full building CV summary from POST /api/AssetCapitalValue/building/calculate-cv
  buildingCV?: any;
}

export function BuildingValuationSummary({
  floors,
  rawInventories = [],
  categories = [],
  conditions = [],
  buildingCV,
}: BuildingValuationSummaryProps) {
  const t = useTranslations("addAssetForm");

  // Primary source: totalBuildingCapitalValue from the /building/calculate-cv API response
  // This includes: building's own floor CVs + all child asset (flat/shop) CVs
  const cvFromAPI = Number(
    buildingCV?.totalBuildingCapitalValue ??
    buildingCV?.TotalBuildingCapitalValue ??
    0
  );

  // Fallback: sum from floors array (used when API CV is not available)
  const cvFromFloors = floors.reduce((sum, floor) => {
    const value = parseFloat(String(floor.finalCapitalValue || "0").replace(/,/g, ""));
    return sum + value;
  }, 0);

  // Use API value when available and > 0; otherwise fall back to floor-sum
  const buildingCapitalValue = cvFromAPI > 0 ? cvFromAPI : cvFromFloors;

  // Built-up area: from API or from floors
  const builtUpFromAPI = Number(
    buildingCV?.totalBuildingCarpetAreaSqMeter ??
    buildingCV?.TotalBuildingCarpetAreaSqMeter ??
    0
  ) * 10.764; // convert sq.m to sq.ft

  console.log("INSPECT CATEGORIES:", categories);
  const totalInventoryValue = rawInventories.reduce((sum, i) => {
    const val = calculateItemCV(i, categories, conditions);
    console.log("INSPECT ITEM DETAIL:", {
      name: i.itemName ?? i.ItemName,
      type: i.inventoryType ?? i.InventoryType,
      condition: i.condition ?? i.Condition,
      val,
      conditionsPassedCount: conditions.length,
      categoriesPassedCount: categories.length
    });
    return sum + val;
  }, 0);
  const grandTotalValue = buildingCapitalValue + totalInventoryValue;

  const totalBuiltUpAreaFromFloors = floors.reduce((sum, floor) => sum + (parseFloat(String(floor.builtUpAreaSqFt || "0")) || 0), 0);
  const totalBuiltUpArea = builtUpFromAPI > 0 ? builtUpFromAPI : totalBuiltUpAreaFromFloors;

  const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const categoryStyles: Record<string, { icon: string; color: string; bg: string; textColor: string; highlightBg: string; highlightBorder: string; highlightText: string }> = {
    "furniture": { icon: "🪑", color: "#C4B5FD", bg: "#EDE9FE", textColor: "#6B21A8", highlightBg: "#F3E8FF", highlightBorder: "#C4B5FD", highlightText: "#6B21A8" },
    "it-equipment": { icon: "💻", color: "#93C5FD", bg: "#DBEAFE", textColor: "#1E40AF", highlightBg: "#DBEAFE", highlightBorder: "#93C5FD", highlightText: "#1E40AF" },
    "electronic-fixtures": { icon: "💡", color: "#6EE7B7", bg: "#D1FAE5", textColor: "#065F46", highlightBg: "#D1FAE5", highlightBorder: "#6EE7B7", highlightText: "#065F46" },
    "vehicle": { icon: "🚗", color: "#FCD34D", bg: "#FEF3C7", textColor: "#92400E", highlightBg: "#FEF3C7", highlightBorder: "#FCD34D", highlightText: "#92400E" },
  };

  const fallbackStyle = { icon: "📦", color: "#CBD5E1", bg: "#F1F5F9", textColor: "#475569", highlightBg: "#F8FAFC", highlightBorder: "#E2E8F0", highlightText: "#475569" };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const dynamicCategoryCards = categories.map((cat, idx) => {
    let key = "furniture";
    const nameLower = (cat.typeName || "").toLowerCase();
    const codeLower = (cat.typeCode || "").toLowerCase();
    
    if (nameLower.includes("furniture") || nameLower.includes("furn") || codeLower.includes("fur")) {
      key = "furniture";
    } else if (nameLower.includes("it-equipment") || nameLower.includes("it_equipment") || nameLower.includes("it-equip") || nameLower === "it" || codeLower.includes("it") || nameLower.includes("computer")) {
      key = "it-equipment";
    } else if (nameLower.includes("electronic") || nameLower.includes("elect") || nameLower.includes("fixture") || codeLower.includes("elc")) {
      key = "electronic-fixtures";
    } else if (nameLower.includes("vehicle") || nameLower.includes("veh") || nameLower.includes("car") || codeLower.includes("veh")) {
      key = "vehicle";
    } else {
      key = (cat.typeCode || cat.typeName || "").toLowerCase().replace(/[\s_]+/g, "-");
    }

    const style = categoryStyles[key] || fallbackStyle;
    
    // Filter raw inventories belonging to this category
    const items = rawInventories.filter(item => {
      const itemType = (item.inventoryType ?? item.InventoryType ?? "").toLowerCase().replace(/[\s_]+/g, "-");
      const itemKey = itemType.includes("furniture") || itemType.includes("furn") ? "furniture"
                    : itemType.includes("it-equipment") || itemType.includes("it_equipment") || itemType.includes("it-equip") || itemType === "it" || itemType.includes("computer") ? "it-equipment"
                    : itemType.includes("electronic") || itemType.includes("elect") || itemType.includes("fixture") ? "electronic-fixtures"
                    : itemType.includes("vehicle") || itemType.includes("veh") || itemType.includes("car") ? "vehicle"
                    : itemType;
      return itemKey === key;
    });

    const totalCount = items.length;
    const totalQty = items.reduce((s, i) => s + Number(i.quantity ?? i.Quantity ?? 0), 0);
    const totalVal = items.reduce((s, i) => s + calculateItemCV(i, categories, conditions), 0);

    const prefix = idx < alphabet.length ? alphabet[idx] : String(idx + 1);

    return {
      title: `${style.icon} ${prefix}) ${cat.typeName}`,
      color: style.color,
      bg: style.bg,
      textColor: style.textColor,
      rows: [
        { label: t("valuation.inventory.countLabel", { category: cat.typeName }), value: t("valuation.inventory.itemsVal", { count: totalCount }) },
        { label: t("valuation.inventory.totalQty"), value: t("floorDetails.unitsCount", { count: totalQty }) },
        { label: t("valuation.inventory.valueLabel", { category: cat.typeName }), value: `₹ ${fmt(totalVal)}`, highlight: true, highlightBg: style.highlightBg, highlightBorder: style.highlightBorder, highlightText: style.highlightText },
      ]
    };
  });

  const detailCards = [
    {
      title: t("valuation.building.title"), color: "#93C5FD", bg: "#DBEAFE", textColor: "#1E40AF",
      rows: [
        { label: t("valuation.building.floorsCount"), value: t("valuation.building.floorsCountVal", { count: floors.length }) },
        { label: t("valuation.building.builtUpArea"), value: totalBuiltUpArea > 0 ? `${fmt(totalBuiltUpArea)} sq.ft` : t("valuation.building.notAvailable") },
        { label: t("valuation.building.capitalValue"), value: `₹ ${buildingCapitalValue > 0 ? fmt(buildingCapitalValue) : "0.00"}`, highlight: true, highlightBg: "#D1FAE5", highlightBorder: "#6EE7B7", highlightText: "#065F46" },
      ],
    },
    ...dynamicCategoryCards
  ];

  const dynamicSummaryCards = categories.map((cat, idx) => {
    let key = "furniture";
    const nameLower = (cat.typeName || "").toLowerCase();
    const codeLower = (cat.typeCode || "").toLowerCase();
    
    if (nameLower.includes("furniture") || nameLower.includes("furn") || codeLower.includes("fur")) {
      key = "furniture";
    } else if (nameLower.includes("it-equipment") || nameLower.includes("it_equipment") || nameLower.includes("it-equip") || nameLower === "it" || codeLower.includes("it") || nameLower.includes("computer")) {
      key = "it-equipment";
    } else if (nameLower.includes("electronic") || nameLower.includes("elect") || nameLower.includes("fixture") || codeLower.includes("elc")) {
      key = "electronic-fixtures";
    } else if (nameLower.includes("vehicle") || nameLower.includes("veh") || nameLower.includes("car") || codeLower.includes("veh")) {
      key = "vehicle";
    } else {
      key = (cat.typeCode || cat.typeName || "").toLowerCase().replace(/[\s_]+/g, "-");
    }

    const iconMap: Record<string, any> = {
      "furniture": Package,
      "it-equipment": Activity,
      "electronic-fixtures": Activity,
      "vehicle": Package,
    };
    const IconComponent = iconMap[key] || Package;

    // Filter raw inventories belonging to this category
    const items = rawInventories.filter(item => {
      const itemType = (item.inventoryType ?? item.InventoryType ?? "").toLowerCase().replace(/[\s_]+/g, "-");
      const itemKey = itemType.includes("furniture") || itemType.includes("furn") ? "furniture"
                    : itemType.includes("it-equipment") || itemType.includes("it_equipment") || itemType.includes("it-equip") || itemType === "it" || itemType.includes("computer") ? "it-equipment"
                    : itemType.includes("electronic") || itemType.includes("elect") || itemType.includes("fixture") ? "electronic-fixtures"
                    : itemType.includes("vehicle") || itemType.includes("veh") || itemType.includes("car") ? "vehicle"
                    : itemType;
      return itemKey === key;
    });

    const totalVal = items.reduce((s, i) => s + calculateItemCV(i, categories, conditions), 0);
    const prefix = idx < alphabet.length ? alphabet[idx] : String(idx + 1);

    const style = categoryStyles[key] || fallbackStyle;
    const title = `${style.icon} ${prefix}) ${cat.typeName}`;

    return {
      title,
      value: totalVal,
      icon: IconComponent,
      footer: `From ${cat.typeName} Inventory (${prefix})`
    };
  });

  const summaryCardsData = [
    {
      title: t("valuation.building.title"),
      value: buildingCapitalValue,
      icon: Building,
      footer: "From Construction Details (C)",
    },
    ...dynamicSummaryCards
  ];

  return (
    <div className="space-y-6 p-4 rounded-lg">
      {/* Asset Valuation Summary */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#1E40AF]">
          <DollarSign className="w-5 h-5 text-[#1E40AF]" />
          <h3 className="text-lg font-bold text-[#1E40AF]">{t("valuation.assetSummary.title") || "Asset Valuation Summary"}</h3>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
          <span>Final Asset Valuation Summary</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          {summaryCardsData.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card
                key={card.title}
                variant="bordered"
                padding="none"
                className="p-2 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 group"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
                  borderColor: '#BFDBFE',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.15), 0 2px 4px -1px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.borderColor = '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.15), 0 2px 4px -1px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
              >
                <CardContent>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div
                      className="p-1 rounded-md transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                        border: '1.5px solid #93C5FD',
                        boxShadow: '0 1px 2px rgba(59, 130, 246, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <IconComponent className="w-3.5 h-3.5" style={{ color: '#1E40AF' }} />
                    </div>
                    <h5
                      className="text-xs font-bold"
                      style={{
                        color: '#1E3A8A',
                        textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      {card.title}
                    </h5>
                  </div>
                 
                  <p
                    className="text-lg font-bold mb-1 transition-all duration-300"
                    style={{
                      fontFamily: 'monospace',
                      color: '#1E3A8A',
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    ₹ {card.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                 
                  <div className="flex items-center justify-between pt-1 border-t border-blue-100">
                    <p className="text-xs font-medium" style={{ color: '#60A5FA' }}>
                      {card.footer}
                    </p>
                    <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" style={{ color: '#60A5FA' }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="h-px my-4 bg-gray-200" />

      {/* Detail Cards */}
      <div className="mb-3">
        <h4 className="text-base font-bold mb-3" style={{ color: "#1E40AF" }}>{t("valuation.breakdown.title")}</h4>
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
                      </div>
                      <p className="text-sm font-bold" style={{ color: "#374151" }}>{row.value}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px my-4 bg-gray-300" />

      {/* Grand Total */}
      <div className="mt-4 p-2.5 rounded-lg flex justify-between items-center border-2" style={{ background: "linear-gradient(135deg,#EFF6FF,#DBEAFE,#BFDBFE)", borderColor: "#93C5FD" }}>
        <span className="font-bold text-sm" style={{ color: "#1E40AF" }}>{t("valuation.grandTotal")}</span>
        <div className="px-3 py-1.5 rounded-md" style={{ background: "linear-gradient(135deg,#1E40AF,#1E3A8A)", border: "1.5px solid #1D4ED8" }}>
          <span className="text-lg font-bold" style={{ fontFamily: "monospace", color: "#FFFFFF" }}>₹ {fmt(grandTotalValue)}</span>
        </div>
      </div>
    </div>
  );
}
