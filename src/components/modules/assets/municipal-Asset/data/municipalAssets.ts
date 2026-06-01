export interface MunicipalAsset {
  id: string;
  name: string;
  category: 'building' | 'land' | 'infrastructure' | 'movable';
  assetType: string;
  acqVal: number;
  curVal: number;
  dep: number;
  nbv: number;
  life: number;
  rem: number;
  condition: string;
  status: string;
  cust: string;
  ins: string;
  maint: string;
  remarks: string;
  loc: string;
  date: string;
  sub?: string;
  
  department?: any;
  ward?: any;
  zone?: any;
  valueLakhs?: any;
  location?: any;
  floors?: any;
  totalRooms?: any;
  constructionYear?: any;
  builtUpArea?: any;
  propertyTaxNumber?: any;
  upicId?: any;
  plotNumber?: any;
  rental?: any;
  usage?: any;
  area?: any;
  encroachment?: any;
  assetManager?: any;
  wardNumber?: any;
  ownerId?: any;
  surveyNumber?: any;
  city?: any;
  pincode?: any;
  carpetArea?: any;
  plinthArea?: any;
  totalFloors?: any;
  shopDetails?: any;
  totalShops?: any;
  occupiedShops?: any;
  vacantShops?: any;
  totalDemand?: number;
  totalCollection?: number;
  totalPending?: number;
  annualRent?: number;
  netBalance?: number;
  inChargeName?: any;
  inChargeDesignation?: any;
  inChargeContact?: any;
  inChargeEmail?: any;
  propertyNumber?: any;
  legacyId?: any;
  thumbnail?: any;
  images?: any;
  floorPlans?: any;
  latitude?: any;
  longitude?: any;
  health?: any;
  lastInspection?: any;
  marketValue?: any;
  governmentValuation?: any;
  propertyTax?: any;
  lastValuationDate?: any;
  landArea?: any;
}

export const municipalAssets: MunicipalAsset[] = [
  {
    id: 'LND-001',
    name: 'Shivaji Park Public Garden',
    category: 'land',
    assetType: 'Public Park/Garden',
    sub: 'Public Park/Garden',
    loc: 'Dadar West, Mumbai\nWard: Ward 195',
    date: '01-Jan-2010',
    acqVal: 1096153846,
    curVal: 2850000000,
    dep: 0,
    nbv: 1096153846,
    life: 999,
    rem: 983,
    condition: 'good',
    status: 'active',
    cust: 'Estate Officer\nParks & Gardens Dept.',
    ins: 'Insured\nPolicy:\nMUN/PROP/2025/0001\nExp: 31-Mar-2026',
    maint: 'Last: 2024-11-20\nNext: Scheduled',
    remarks: 'Public Park/Garden - Municipal Use'
  },
  {
    id: 'BLD-035',
    name: 'AMC Primary Marathi Boys School No. 7',
    category: 'building',
    assetType: 'School/Educational Institution',
    sub: 'School/Educational Institution',
    loc: 'Nehru Park Road, Akola\nWard: Ward 12',
    date: '05-Jun-2015',
    acqVal: 45000000,
    curVal: 62000000,
    dep: 0,
    nbv: 45000000,
    life: 50,
    rem: 39,
    condition: 'good',
    status: 'active',
    cust: 'Education Officer',
    ins: 'Insured',
    maint: 'Scheduled',
    remarks: 'Active Primary School',
    propertyNumber: 'BLD-035',
    wardNumber: 'Ward 12',
    zone: 'East Zone',
    floors: 2,
    totalRooms: 12,
    constructionYear: 2015,
    builtUpArea: 9500
  },
  {
    id: 'BLD-006A',
    name: 'AMC Municipal General Hospital',
    category: 'building',
    assetType: 'Hospital',
    sub: 'Hospital',
    loc: 'Main Hospital Road, Akola\nWard: Ward 8',
    date: '10-Mar-2018',
    acqVal: 95000000,
    curVal: 120000000,
    dep: 0,
    nbv: 95000000,
    life: 50,
    rem: 42,
    condition: 'excellent',
    status: 'active',
    cust: 'Chief Medical Officer',
    ins: 'Insured',
    maint: 'Scheduled',
    remarks: 'Main Municipal Hospital',
    propertyNumber: 'BLD-006A',
    wardNumber: 'Ward 8',
    zone: 'West Zone',
    floors: 3,
    totalRooms: 45,
    constructionYear: 2018,
    builtUpArea: 18000
  },
  {
    id: 'BLD-SHOP-001',
    name: 'AMC Shopping Complex Dadar',
    category: 'building',
    assetType: 'Municipal Commercial Complex',
    sub: 'Municipal Commercial Complex',
    loc: 'Senapati Bapat Marg, Dadar, Mumbai\nWard: Ward 195',
    date: '12-Apr-2012',
    acqVal: 180000000,
    curVal: 320000000,
    dep: 0,
    nbv: 180000000,
    life: 50,
    rem: 36,
    condition: 'good',
    status: 'active',
    cust: 'Market Superintendent',
    ins: 'Insured',
    maint: 'Scheduled',
    remarks: 'Multi-story shopping complex with active shops',
    propertyNumber: 'BLD-SHOP-001',
    wardNumber: 'Ward 195',
    zone: 'South Zone',
    floors: 3,
    totalRooms: 5,
    totalShops: 12,
    occupiedShops: 10,
    vacantShops: 2,
    constructionYear: 2012,
    builtUpArea: 30000,
    carpetArea: 26000,
    shopDetails: [
      {
        id: 'SHOP-001A',
        floorName: 'Ground Floor',
        shopNumber: 'G-01',
        shopName: 'Asha Provision Stores',
        builtUpArea: '350',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Ramesh Shah',
        renterMobile: '9820012345',
        demandRent: 25000,
        totalDemand: 300000,
        totalCollection: 275000,
        totalPending: 25000,
        balanceAmount: 25000,
        pendingRent: 25000,
        leaseFromDate: '2020-01-01',
        leaseToDate: '2025-01-01',
        condition: 'Good'
      },
      {
        id: 'SHOP-001B',
        floorName: 'Ground Floor',
        shopNumber: 'G-02',
        shopName: 'Pooja Sweet Mart',
        builtUpArea: '400',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Sanjay Gupta',
        renterMobile: '9819954321',
        demandRent: 30000,
        totalDemand: 360000,
        totalCollection: 360000,
        totalPending: 0,
        balanceAmount: 0,
        pendingRent: 0,
        leaseFromDate: '2021-06-15',
        leaseToDate: '2026-06-14',
        condition: 'Excellent'
      },
      {
        id: 'SHOP-001C',
        floorName: '1st Floor',
        shopNumber: 'F-01',
        shopName: 'Vikas Medical Hall',
        builtUpArea: '300',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Dr. Alok Mehta',
        renterMobile: '9930098765',
        demandRent: 22000,
        totalDemand: 264000,
        totalCollection: 220000,
        totalPending: 44000,
        balanceAmount: 44000,
        pendingRent: 44000,
        leaseFromDate: '2019-11-01',
        leaseToDate: '2024-10-31',
        condition: 'Good'
      },
      {
        id: 'SHOP-001D',
        floorName: '1st Floor',
        shopNumber: 'F-02',
        shopName: 'Vacant Shop Unit',
        builtUpArea: '350',
        occupancyStatus: 'Vacant',
        renterEnglishName: '',
        renterMobile: '',
        demandRent: 0,
        totalDemand: 0,
        totalCollection: 0,
        totalPending: 0,
        balanceAmount: 0,
        pendingRent: 0,
        leaseFromDate: '',
        leaseToDate: '',
        condition: 'Fair'
      },
      {
        id: 'SHOP-001E',
        floorName: '2nd Floor',
        shopNumber: 'S-01',
        shopName: 'Dynamic IT Solutions',
        builtUpArea: '500',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Vijay Kadam',
        renterMobile: '9869011223',
        demandRent: 35000,
        totalDemand: 420000,
        totalCollection: 350000,
        totalPending: 70000,
        balanceAmount: 70000,
        pendingRent: 70000,
        leaseFromDate: '2022-04-01',
        leaseToDate: '2027-03-31',
        condition: 'Good'
      },
      {
        id: 'SHOP-001F',
        floorName: '2nd Floor',
        shopNumber: 'S-02',
        shopName: 'Pioneer Gym & Fitness',
        builtUpArea: '600',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Anil Deshmukh',
        renterMobile: '9821102938',
        demandRent: 40000,
        totalDemand: 480000,
        totalCollection: 480000,
        totalPending: 0,
        balanceAmount: 0,
        pendingRent: 0,
        leaseFromDate: '2023-01-15',
        leaseToDate: '2028-01-14',
        condition: 'Good'
      },
      {
        id: 'SHOP-001G',
        floorName: 'Ground Floor',
        shopNumber: 'G-03',
        shopName: 'Universal Book Depot',
        builtUpArea: '320',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Mohan Sharma',
        renterMobile: '9769018472',
        demandRent: 23000,
        totalDemand: 276000,
        totalCollection: 250000,
        totalPending: 26000,
        balanceAmount: 26000,
        pendingRent: 26000,
        leaseFromDate: '2020-05-01',
        leaseToDate: '2025-04-30',
        condition: 'Good'
      },
      {
        id: 'SHOP-001H',
        floorName: '1st Floor',
        shopNumber: 'F-03',
        shopName: 'Apex Dental Care',
        builtUpArea: '420',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Dr. Smita Rao',
        renterMobile: '9833094821',
        demandRent: 28000,
        totalDemand: 336000,
        totalCollection: 336000,
        totalPending: 0,
        balanceAmount: 0,
        pendingRent: 0,
        leaseFromDate: '2021-09-01',
        leaseToDate: '2026-08-31',
        condition: 'Excellent'
      },
      {
        id: 'SHOP-001I',
        floorName: '2nd Floor',
        shopNumber: 'S-03',
        shopName: 'Gourmet Pizza Slice',
        builtUpArea: '380',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'David Dsouza',
        renterMobile: '9920194857',
        demandRent: 26000,
        totalDemand: 312000,
        totalCollection: 290000,
        totalPending: 22000,
        balanceAmount: 22000,
        pendingRent: 22000,
        leaseFromDate: '2022-10-01',
        leaseToDate: '2027-09-30',
        condition: 'Good'
      },
      {
        id: 'SHOP-001J',
        floorName: 'Ground Floor',
        shopNumber: 'G-04',
        shopName: 'Metro Salon & Spa',
        builtUpArea: '450',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Neha Sen',
        renterMobile: '9819028471',
        demandRent: 32000,
        totalDemand: 384000,
        totalCollection: 384000,
        totalPending: 0,
        balanceAmount: 0,
        pendingRent: 0,
        leaseFromDate: '2023-03-01',
        leaseToDate: '2028-02-29',
        condition: 'Excellent'
      },
      {
        id: 'SHOP-001K',
        floorName: '1st Floor',
        shopNumber: 'F-04',
        shopName: 'National Diagnostics',
        builtUpArea: '550',
        occupancyStatus: 'Occupied',
        renterEnglishName: 'Kunal Verma',
        renterMobile: '9867019283',
        demandRent: 38000,
        totalDemand: 456000,
        totalCollection: 400000,
        totalPending: 56000,
        balanceAmount: 56000,
        pendingRent: 56000,
        leaseFromDate: '2021-12-01',
        leaseToDate: '2026-11-30',
        condition: 'Good'
      },
      {
        id: 'SHOP-001L',
        floorName: '2nd Floor',
        shopNumber: 'S-04',
        shopName: 'Creative Design Studio',
        builtUpArea: '300',
        occupancyStatus: 'Vacant',
        renterEnglishName: '',
        renterMobile: '',
        demandRent: 0,
        totalDemand: 0,
        totalCollection: 0,
        totalPending: 0,
        balanceAmount: 0,
        pendingRent: 0,
        leaseFromDate: '',
        leaseToDate: '',
        condition: 'Fair'
      }
    ]
  }
];
