import { Armchair, Car, Cpu, LampDesk } from "lucide-react";
import { InventoryForm, InventoryRow, InventoryType, InvoiceForm, TypeMeta } from "./FurnitureFixtureTypes";
export const PAGE_SIZE = 8;

export const typeOptions = [
  { label: "Furniture", value: "furniture" },
  { label: "IT Equipment", value: "it-equipment" },
  { label: "Electronic Fixtures", value: "electronic-fixtures" },
  { label: "Vehicle", value: "vehicle" },
];

export const conditionMap: Record<InventoryType, any[]> = {
  furniture: [
    { label: "Excellent", value: "Excellent" },
    { label: "Good", value: "Good" },
    { label: "Fair", value: "Fair" },
    { label: "Poor", value: "Poor" },
  ],
  "it-equipment": [
    { label: "Working", value: "Working" },
    { label: "Not Working", value: "Not Working" },
  ],
  "electronic-fixtures": [
    { label: "Working", value: "Working" },
    { label: "Not Working", value: "Not Working" },
  ],
  vehicle: [
    { label: "Excellent", value: "Excellent" },
    { label: "Good", value: "Good" },
    { label: "Fair", value: "Fair" },
    { label: "Poor", value: "Poor" },
  ],
};

export const invoiceModeOptions = [
  { label: "Upload New Invoice", value: "upload" },
  { label: "Use Existing Invoice", value: "reuse" },
];

export const inventoryMeta: Record<InventoryType, TypeMeta> = {
  furniture: {
    label: "Furniture",
    icon: Armchair,
    cardRing: "border-l-4 border-l-violet-500",
    badgeClassName: "bg-violet-50 text-violet-700 border-violet-200",
    names: [
      { label: "Office Tables", value: "Office Tables" },
      { label: "Chairs (Executive)", value: "Chairs (Executive)" },
      { label: "Chairs (Staff)", value: "Chairs (Staff)" },
      { label: "Filing Cabinets", value: "Filing Cabinets" },
      { label: "Reception Desk", value: "Reception Desk" },
    ],
    modelMap: {
      "Office Tables": [
        { label: "Wooden", value: "Wooden" },
        { label: "Steel", value: "Steel" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Chairs (Executive)": [
        { label: "Ergonomic", value: "Ergonomic" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Chairs (Staff)": [
        { label: "Mesh Back", value: "Mesh Back" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Filing Cabinets": [
        { label: "4-Drawer Steel", value: "4-Drawer Steel" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Reception Desk": [
        { label: "Modular", value: "Modular" },
        { label: "Laminated", value: "Laminated" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
    },
  },

  "it-equipment": {
    label: "IT Equipment",
    icon: Cpu,
    cardRing: "border-l-4 border-l-blue-500",
    badgeClassName: "bg-blue-50 text-blue-700 border-blue-200",
    names: [
      { label: "Desktop Computers", value: "Desktop Computers" },
      { label: "Laptops", value: "Laptops" },
      { label: "Printers", value: "Printers" },
      { label: "Scanners", value: "Scanners" },
      { label: "UPS Systems", value: "UPS Systems" },
      { label: "Biometric Devices", value: "Biometric Devices" },
      { label: "CCTV Systems", value: "CCTV Systems" },
    ],
    modelMap: {
      "Desktop Computers": [
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Laptops: [
        { label: "Lenovo ThinkPad", value: "Lenovo ThinkPad" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Printers: [
        { label: "HP LaserJet", value: "HP LaserJet" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Scanners: [
        { label: "Canon CanoScan", value: "Canon CanoScan" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "UPS Systems": [
        { label: "APC Back-UPS", value: "APC Back-UPS" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Biometric Devices": [
        { label: "ZKTeco MB360", value: "ZKTeco MB360" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "CCTV Systems": [
        { label: "Hikvision DS Series", value: "Hikvision DS Series" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
    },
  },

  "electronic-fixtures": {
    label: "Electronic Fixtures",
    icon: LampDesk,
    cardRing: "border-l-4 border-l-emerald-500",
    badgeClassName: "bg-emerald-50 text-emerald-700 border-emerald-200",
    names: [
      { label: "Air Conditioners", value: "Air Conditioners" },
      { label: "Ceiling Fans", value: "Ceiling Fans" },
      { label: "Water Heaters", value: "Water Heaters" },
      { label: "LED Lights", value: "LED Lights" },
      { label: "Tube Lights", value: "Tube Lights" },
      { label: "Water Coolers", value: "Water Coolers" },
      { label: "Water Purifiers", value: "Water Purifiers" },
      { label: "Photocopier Machines", value: "Photocopier Machines" },
      { label: "Electric Kettles", value: "Electric Kettles" },
      { label: "Microwave Ovens", value: "Microwave Ovens" },
      { label: "Refrigerators", value: "Refrigerators" },
    ],
    modelMap: {
      "Air Conditioners": [
        { label: "Daikin Split AC", value: "Daikin Split AC" },
        { label: "LG Inverter", value: "LG Inverter" },
        { label: "Voltas", value: "Voltas" },
        { label: "Blue Star", value: "Blue Star" },
        { label: "Hitachi", value: "Hitachi" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Ceiling Fans": [
        { label: "Crompton", value: "Crompton" },
        { label: "Havells", value: "Havells" },
        { label: "Usha", value: "Usha" },
        { label: "Orient", value: "Orient" },
        { label: "Bajaj", value: "Bajaj" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Water Heaters": [
        { label: "Racold", value: "Racold" },
        { label: "AO Smith", value: "AO Smith" },
        { label: "Bajaj", value: "Bajaj" },
        { label: "Havells", value: "Havells" },
        { label: "V-Guard", value: "V-Guard" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "LED Lights": [
        { label: "Philips", value: "Philips" },
        { label: "Syska", value: "Syska" },
        { label: "Crompton", value: "Crompton" },
        { label: "Bajaj", value: "Bajaj" },
        { label: "Havells", value: "Havells" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Tube Lights": [
        { label: "Philips T5", value: "Philips T5" },
        { label: "Bajaj Batten", value: "Bajaj Batten" },
        { label: "Crompton", value: "Crompton" },
        { label: "Wipro", value: "Wipro" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Water Coolers": [
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Water Purifiers": [
        { label: "Kent", value: "Kent" },
        { label: "Aquaguard", value: "Aquaguard" },
        { label: "Pureit", value: "Pureit" },
        { label: "Livpure", value: "Livpure" },
        { label: "AO Smith", value: "AO Smith" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Photocopier Machines": [
        { label: "Xerox", value: "Xerox" },
        { label: "Canon", value: "Canon" },
        { label: "Ricoh", value: "Ricoh" },
        { label: "Konica Minolta", value: "Konica Minolta" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Electric Kettles": [
        { label: "Voltas", value: "Voltas" },
        { label: "Blue Star", value: "Blue Star" },
        { label: "Kenstar", value: "Kenstar" },
        { label: "Usha", value: "Usha" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Microwave Ovens": [
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Refrigerators: [
        { label: "LG", value: "LG" },
        { label: "Samsung", value: "Samsung" },
        { label: "Whirlpool", value: "Whirlpool" },
        { label: "Godrej", value: "Godrej" },
        { label: "Haier", value: "Haier" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
    },
  },

  vehicle: {
    label: "Vehicle",
    icon: Car,
    cardRing: "border-l-4 border-l-amber-500",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200",
    names: [
      { label: "Car", value: "Car" },
      { label: "Van", value: "Van" },
      { label: "Motorcycle", value: "Motorcycle" },
      { label: "Bicycle", value: "Bicycle" },
      { label: "Bus", value: "Bus" },
      { label: "Ambulance", value: "Ambulance" },
      { label: "Staff Vehicle", value: "Staff Vehicle" },
    ],
    modelMap: {
      Car: [
        { label: "Maruti Suzuki", value: "Maruti Suzuki" },
        { label: "Hyundai", value: "Hyundai" },
        { label: "Tata Motors", value: "Tata Motors" },
        { label: "Mahindra", value: "Mahindra" },
        { label: "Honda", value: "Honda" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Van: [
        { label: "Maruti Eeco", value: "Maruti Eeco" },
        { label: "Tata Winger", value: "Tata Winger" },
        { label: "Force Traveller", value: "Force Traveller" },
        { label: "Mahindra Supro", value: "Mahindra Supro" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Motorcycle: [
        { label: "Hero", value: "Hero" },
        { label: "Bajaj", value: "Bajaj" },
        { label: "TVS", value: "TVS" },
        { label: "Honda", value: "Honda" },
        { label: "Royal Enfield", value: "Royal Enfield" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Bicycle: [
        { label: "Hero", value: "Hero" },
        { label: "Atlas", value: "Atlas" },
        { label: "Hercules", value: "Hercules" },
        { label: "BSA", value: "BSA" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Bus: [
        { label: "Tata Starbus", value: "Tata Starbus" },
        { label: "Ashok Leyland", value: "Ashok Leyland" },
        { label: "Eicher", value: "Eicher" },
        { label: "BharatBenz", value: "BharatBenz" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Ambulance: [
        { label: "Tata Winger Ambulance", value: "Tata Winger Ambulance" },
        { label: "Force Traveller Ambulance", value: "Force Traveller Ambulance" },
        { label: "Mahindra", value: "Mahindra" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Staff Vehicle": [
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
    },
  },
};

export const initialRows: InventoryRow[] = [];

export const emptyForm = (): InventoryForm => ({
  type: "",
  itemName: "",
  modelName: "",
  specifications: "",
  purchaseDate: "",
  condition: "",
  quantity: "",
  unitValue: "",
  photoName: "",
  photoUrl: "",
  owningDepartment: "",
});

export const emptyInvoiceForm = (): InvoiceForm => ({
  invoiceMode: "upload",
  existingInvoiceKey: "",
  invoiceNumber: "",
  invoiceDate: "",
  invoiceFileName: "",
});

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("INR", "₹");
}
