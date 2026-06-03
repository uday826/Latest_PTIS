// Asset Detail View Mock Data - Municipal Estate Management System

// Keep only 2-3 demo images
export const demoBuildingImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800";
export const demoLandImage = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800";
export const demoFloorPlanImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800";

// Re-map all old mock images to use our 3 demo images
export const eastZoneOfficeImage = demoBuildingImage;
export const schoolBLD035AImage = demoBuildingImage;
export const schoolBLD035AFloorPlan = demoFloorPlanImage;
export const schoolBLD035BImage = demoBuildingImage;
export const schoolBLD035CImage = demoBuildingImage;
export const schoolBLD035DImage = demoBuildingImage;
export const schoolBLD035EImage = demoBuildingImage;

export const kodwadaGroundFirstFloor = demoFloorPlanImage;
export const kodwadaBasementFloor = demoFloorPlanImage;
export const kodwada2ndFloor = demoFloorPlanImage;
export const kodwadaShopFloorPlan = demoFloorPlanImage;

export const officeBLDOFF001Image = demoBuildingImage;
export const officeBLDOFF002Image = demoBuildingImage;
export const officeBLDOFF003Image1 = demoBuildingImage;
export const officeBLDOFF003Image2 = demoBuildingImage;
export const officeBLDOFF004Image1 = demoBuildingImage;
export const officeBLDOFF004Image2 = demoBuildingImage;
export const officeBLDOFF005Image = demoBuildingImage;
export const officeBLDOFF006Image = demoBuildingImage;

export const hospitalBLD006BImage = demoBuildingImage;
export const hospitalBLD006CImage = demoBuildingImage;
export const hospitalBLD006CFloorPlan = demoFloorPlanImage;
export const hospitalBLD006DFloorPlan = demoFloorPlanImage;

export const shopBLDSHOP001Image = demoBuildingImage;
export const shopBLDSHOP001FloorPlan = demoFloorPlanImage;
export const shopBLDSHOP002Image = demoBuildingImage;
export const shopBLDSHOP002FloorPlan = demoFloorPlanImage;
export const shopBLDSHOP003Image = demoBuildingImage;
export const shopBLDSHOP003FloorPlan = demoFloorPlanImage;
export const shopBLDSHOP004Image = demoBuildingImage;
export const shopBLDSHOP004FloorPlan = demoFloorPlanImage;

export const surveyFormPage1 = demoFloorPlanImage;
export const surveyFormPage2 = demoFloorPlanImage;

// Asset thumbnails - use building or land demo image
export const assetThumbnails: Record<string, string> = {
  'BLD-001': demoBuildingImage,
  'BLD-002': demoBuildingImage,
  'BLD-003': demoBuildingImage,
  'BLD-004': demoBuildingImage,
  'BLD-005': demoBuildingImage,
  'LND-001': demoLandImage,
  'LND-002': demoLandImage,
  'INF-001': demoBuildingImage,
  'INF-002': demoBuildingImage,
  'MOV-001': demoBuildingImage,
};

export const buildingPlan = demoFloorPlanImage;

// WhatsApp style gallery using ONLY the demo images
export const assetImages: Record<string, string[]> = {
  'BLD-001': [demoBuildingImage],
  'BLD-ZO-01': [demoBuildingImage],
  'BLD-002': [demoBuildingImage],
  'BLD-003': [demoBuildingImage],
  'BLD-004': [demoBuildingImage],
  'BLD-005': [demoBuildingImage],
  'LND-001': [demoLandImage],
  'LND-002': [demoLandImage],
  'INF-001': [demoBuildingImage],
  'INF-002': [demoBuildingImage],
  'MOV-001': [demoBuildingImage],
};

export const floorPlanImages: Record<string, string[]> = {
  'BLD-001': [demoFloorPlanImage],
  'BLD-002': [demoFloorPlanImage],
  'BLD-003': [demoFloorPlanImage],
  'BLD-004': [demoFloorPlanImage],
  'BLD-005': [demoFloorPlanImage],
  'PUB-BLD-SHOP-003': [demoFloorPlanImage],
};

export const ownershipDocuments = [
  { name: '7/12 Extract', type: 'PDF', size: '2.4 MB', uploadDate: '2024-05-15', url: '#' },
  { name: 'Property Card', type: 'PDF', size: '1.8 MB', uploadDate: '2024-05-15', url: '#' },
  { name: 'Allotment Resolution', type: 'PDF', size: '890 KB', uploadDate: '2022-03-10', url: '#' },
  { name: 'Sale Deed', type: 'PDF', size: '1.2 MB', uploadDate: '1995-06-20', url: '#' },
  { name: 'Lease Agreement', type: 'PDF', size: '950 KB', uploadDate: '2010-01-15', url: '#' },
  { name: 'Encumbrance Certificate', type: 'PDF', size: '780 KB', uploadDate: '2024-11-05', url: '#' },
  { name: 'Title Deed', type: 'PDF', size: '1.5 MB', uploadDate: '1995-06-20', url: '#' },
  { name: 'Stamp Duty Receipts', type: 'PDF', size: '650 KB', uploadDate: '1995-06-25', url: '#' },
];

export const planningDocuments = [
  { name: 'Asset Photo Plan', type: 'PDF', size: '5.2 MB', uploadDate: '2021-08-20', url: '#', status: 'Verified' },
  { name: 'Sanctioned Plan', type: 'PDF', size: '4.8 MB', uploadDate: '2021-08-20', url: '#', status: 'Verified' },
  { name: 'DP/Zoning Compliance Certificate', type: 'PDF', size: '1.1 MB', uploadDate: '2021-07-15', url: '#', status: 'Verified' },
  { name: 'Building Completion Certificate', type: 'PDF', size: '1.2 MB', uploadDate: '2022-06-15', url: '#', status: 'Verified' },
  { name: 'Occupancy Certificate', type: 'PDF', size: '1.5 MB', uploadDate: '2023-01-10', url: '#', status: 'Verified' },
  { name: 'Environmental Clearance', type: 'PDF', size: '2.3 MB', uploadDate: '2021-05-10', url: '#', status: 'Verified' },
  { name: 'Fire Safety Certificate', type: 'PDF', size: '1.8 MB', uploadDate: '2023-03-15', url: '#', status: 'Verified' },
  { name: 'Disaster Compliance Certificate', type: 'PDF', size: '1.4 MB', uploadDate: '2023-02-20', url: '#', status: 'Verified' },
];

export const baseBuildingData = {
  // Legal
  surveyNumber: 'SN-245/3B',
  plotNumber: 'Plot No. 15',
  ctsNumber: 'CTS 1234/A',
  propertyCardNumber: 'PC/2022/4567',
  extract712: 'Available',
  indexII: 'Index-II-2022-456',
  allotmentResolution: 'Resolution No. MC/2021/89',
  encroachmentStatus: 'No',

  // Ownership & Legal Metadata
  registeredOwner: 'Akola Municipal Corporation',
  ownershipType: 'Government Property - Municipal Corporation',
  titleValidity: 'Perpetual - No Expiry',
  encumbrances: 'None',
  propertyPIN: 'PIN-MH-AMC-2022-4567',
  legalStatus: 'Clear',

  // Planning
  sanctionedPlanNumber: 'BP/2021/3456',
  sanctioningAuthority: 'MC Planning Dept.',
  sanctionDate: '2021-08-15',
  dpReservation: 'Public & Semi-Public (PSP)',
  useAsPerDP: 'Public Health',
  commencementCert: 'CC/2021/789',
  occupancyCert: 'OC/2023/234',

  // Enhanced Planning & Approvals
  approvalStatus: 'Approved',
  sanctionOfficer: 'Shri Rajesh Kumar, Town Planner',
  buildingPermissionExpiry: '2025-08-15',
  zoningCompliance: 'Compliant',
  landUseCategory: 'Public Health & Medical',
  planningStatus: 'Approved',
  complianceStatus: 'No Issues',

  // Physical
  constructionType: 'RCC Frame Structure',
  numberOfFloors: 3,
  totalFloors: 3,
  builtupArea: 2450, // sq.m
  builtUpArea: 2450, // sq.m
  carpetArea: 2100, // sq.m
  groundFloor: 850,
  firstFloor: 800,
  secondFloor: 800,
  totalArea: 2450, // sum of all floors
  numberOfRooms: 15, // 15 Wards for KEM Hospital

  // Structure details
  structureType: 'RCC Frame',
  foundationType: 'Raft Foundation',
  roofingType: 'RCC Slab',

  // Structural Characteristics
  structuralSystem: 'Reinforced Concrete Frame',
  loadBearingType: 'Frame Structure',
  seismicZone: 'Zone III',
  designLife: '75 years',
  fireResistanceRating: '2 Hours',
  plinthHeight: '1.2 meters',

  // Building Envelope & Materials
  externalWallMaterial: 'Brick Masonry with Plaster',
  internalPartitionType: 'Brick Masonry',
  roofType: 'RCC Flat Roof',
  flooringType: 'Vitrified Tiles',
  doorsWindows: 'Aluminum Frames with Glass',

  // Utilities & Services
  powerSupplyType: 'Municipal Grid + DG Backup',
  dgSetCapacity: '500 KVA',
  waterSupplySource: 'Municipal + Bore Well',
  sewageSystem: 'Connected to Municipal Sewer',
  fireFightingSystem: 'Hydrant System + Sprinklers',
  elevatorsCount: 2,

  // Safety & Compliance
  fireSafetyCompliance: 'Compliant',
  electricalSafetyStatus: 'Inspected on 2024-11-10',
  structuralStabilityCert: 'Valid until 2026-03-15',

  // Usage
  currentUse: 'Municipal Dispensary',
  occupancyType: 'Self-occupied',
  occupierName: 'Health Department',
  departmentOccupying: 'Health Department - Municipal Dispensary',
  occupancyRate: '85%',
  operationalHours: '24x7 (Emergency Services)',

  // Maintenance
  lastMaintenanceDate: '2024-11-10',
  lastMaintenanceType: 'Electrical Safety Inspection',
  nextMaintenanceDate: '2025-01-15',
  nextMaintenanceType: 'Painting & Plastering',

  // Timeline data
  timeline: [
    { year: 1995, event: 'Construction Completed', type: 'construction' },
    { year: 2005, event: 'First Major Renovation', type: 'renovation' },
    { year: 2012, event: 'Major Maintenance - Structural Repair', type: 'maintenance' },
    { year: 2018, event: 'Revaluation - ₹350 Cr', type: 'valuation' },
    { year: 2023, event: 'Latest Revaluation - ₹380 Cr', type: 'valuation' }
  ],

  // Valuation calculations
  landArea: 1200, // sq.m
  landRate: 8500, // per sq.m
  baseConstructionRate: 9500, // per sq.m for new construction

  // Property tax info (for depreciation calc)
  propertyTaxRate: 0.05, // 5% of capital value annually

  // Valuation metadata
  valuationMethod: 'Depreciation Method (SLM)',
  buildingRateSource: 'PWD Schedule of Rates 2024',
  landRateSource: 'Ready Reckoner Rates 2024',
  landRateYear: '2024',
  landValuationBasis: 'Market Value as per Ready Reckoner',
  depreciationBasis: 'Straight Line Method (SLM)',
  remainingUsefulLife: '46 years (of 75 years design life)',
  capitalValueType: 'Book Value (After Depreciation)',
  taxAuthority: 'Akola Municipal Corporation',
  lastTaxAssessmentYear: '2024-25',

  // Valuation governance
  valuedBy: 'Shri Anil Patil, Licensed Valuer',
  verifiedBy: 'Chief Engineer, AMC',
  lastValuationUpdate: '2024-12-01',
  valuationYear: 2024,
};

export function getBuildingData(asset: any) {
  if (asset.category !== 'building') return null;
  return {
    ...baseBuildingData,
  };
}

export function getLandData(asset: any) {
  if (asset.category !== 'land') return null;
  return {
    // Legal
    surveyNumber: `SN-${Math.floor(Math.random() * 900 + 100)}/${Math.floor(Math.random() * 10)}A`,
    plotNumber: `Plot No. ${Math.floor(Math.random() * 500 + 1)}`,
    ctsNumber: `CTS ${Math.floor(Math.random() * 9000 + 1000)}/A`,
    propertyCardNumber: `PC/2023/${Math.floor(Math.random() * 9000 + 1000)}`,
    extract712: 'Available',
    indexII: `Index-II-2023-${Math.floor(Math.random() * 900 + 100)}`,
    allotmentResolution: 'Resolution No. MC/2020/156',

    // Planning
    dpReservation: (asset.assetType as string) === 'Public Park/Garden' ? 'Recreation Ground (RG)' :
      (asset.assetType as string) === 'Weekly Market Land' ? 'Weekly Market (WM)' :
        (asset.assetType as string) === 'Playground/Sports Ground' ? 'Play Ground (PG)' :
          (asset.assetType as string) === 'Parking Land' ? 'Parking (P)' :
            (asset.assetType as string) === 'Reserved Land (DP)' ? 'Reserved Land (R)' :
              'Public Purpose (PP)',
    layoutPlanNumber: `LP/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000 + 1000)}`,
    layoutSanctionDate: '2020-03-15',
    sanctioningAuthority: 'MC Town Planning Dept.',
    useAsPerDP: asset.assetType,

    // Physical Details
    totalArea: asset.area || 10000, // sq.m
    boundaryType: asset.assetType.includes('Market') || asset.assetType.includes('Parking') ? 'Compound Wall' : 'Chain Link Fencing',
    boundaryLength: Math.floor((asset.area || 10000) / 25), // Approximate perimeter
    gateType: 'MS Gate with Brick Pillars',
    numberOfGates: asset.assetType.includes('Park') || asset.assetType.includes('Sports') ? 3 : 2,
    soilType: 'Black Cotton Soil',
    topography: 'Level',
    drainage: 'Storm Water Drain Connected',

    // Amenities
    amenities: (asset.assetType as string) === 'Public Park/Garden' ? ['Walking Track', 'Benches', 'Lighting', 'Water Fountain', 'Children Play Area'] :
      (asset.assetType as string) === 'Playground/Sports Ground' ? ['Cricket Pitch', 'Football Ground', 'Changing Rooms', 'Drinking Water', 'Floodlights'] :
        asset.assetType.includes('Market') ? ['Vendor Stalls', 'Covered Area', 'Water Supply', 'Drainage', 'Toilets'] :
          (asset.assetType as string) === 'Parking Land' ? ['Paved Surface', 'Lighting', 'Entry/Exit Barriers', 'Security Cabin'] :
            ['Basic Infrastructure'],

    // Valuation (Ready Reckoner)
    readyReckonerRate: asset.assetType.includes('Market') ? 38500 : // High value for market land
      (asset.assetType as string) === 'Public Park/Garden' ? 25000 :
        (asset.assetType as string) === 'Playground/Sports Ground' ? 22000 :
          (asset.assetType as string) === 'Parking Land' ? 30000 :
            18500, // Default for reserved/open plots

    // Location factors affecting valuation
    locationFactor: asset.zone?.includes('South') || asset.zone?.includes('Central') ? 1.3 : // Premium location
      asset.zone?.includes('Western') ? 1.15 :
        1.0, // Suburban areas

    // Development status
    developmentStatus: asset.usage === 'Under Development' ? 'Under Development' :
      asset.usage === 'Reserved' ? 'Reserved for Future Use' :
        'Fully Developed',

    // Corner plot premium
    isCornerPlot: Math.random() > 0.7,
    cornerPremium: 0.10, // 10% premium for corner plots
  };
}

export function getMovableData(asset: any) {
  if (asset.category !== 'movable') return null;
  return {
    // Manufacturing & Product Details
    manufacturingDate: asset.constructionYear ? `01-01-${asset.constructionYear}` : '2020-01-01',
    registrationNumber: asset.name?.includes('MH-01') ? asset.name.split(' - ')[1] : `MH-01-XX-${Math.floor(Math.random() * 9000 + 1000)}`,
    productID: asset.assetType?.includes('Vehicle') || asset.assetType?.includes('Engine') || asset.assetType?.includes('Ambulance') || asset.assetType?.includes('JCB') ?
      `VIN${Math.random().toString(36).substring(2, 15).toUpperCase()}` :
      `PROD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,

    // Warranty & Purchase
    purchaseDate: asset.constructionYear ? `15-03-${asset.constructionYear}` : '2020-03-15',
    purchaseCost: (asset.valueLakhs || 0) * 100000, // Convert lakhs to rupees
    warrantyYears: asset.constructionYear && (new Date().getFullYear() - asset.constructionYear) < 3 ? 5 : 0,
    warrantyExpiry: asset.constructionYear ? `15-03-${asset.constructionYear + 5}` : '2025-03-15',
    isUnderWarranty: asset.constructionYear ? (new Date().getFullYear() - asset.constructionYear) < 5 : false,

    // Possession & Assignment
    assignedTo: asset.assetManager?.name || 'Municipal Store',
    assignedDesignation: asset.assetManager?.designation || 'Store Incharge',
    assignedDepartment: asset.department || 'General',

    // Vehicle-specific details (if applicable)
    ...(asset.assetType?.includes('Vehicle') || asset.assetType?.includes('Engine') || asset.assetType?.includes('Ambulance') || asset.assetType?.includes('Car') || asset.assetType?.includes('Truck') || asset.assetType?.includes('JCB') || asset.assetType?.includes('Towing') ? {
      make: asset.assetType.includes('Garbage') ? 'Tata' :
        asset.assetType.includes('Ambulance') ? 'Force Motors' :
          asset.assetType.includes('Fire') ? 'Ashok Leyland' :
            asset.assetType.includes('JCB') ? 'JCB' :
              asset.assetType.includes('Towing') ? 'Mahindra' :
                asset.assetType.includes('Sweeping') ? 'Dulevo' :
                  asset.assetType.includes('Officer Car') ? 'Toyota' :
                    'Tata',
      model: asset.assetType.includes('Garbage') ? 'LPK 2518' :
        asset.assetType.includes('Ambulance') ? 'Traveller 2850' :
          asset.assetType.includes('Fire') ? 'Viking 4825' :
            asset.assetType.includes('JCB') ? '3DX Super ecoXcellence' :
              asset.assetType.includes('Towing') ? 'Bolero Camper' :
                asset.assetType.includes('Sweeping') ? '200 Quattro' :
                  asset.assetType.includes('Officer Car') ? 'Fortuner' :
                    'Municipal Truck',
      fuelType: asset.assetType.includes('Officer Car') ? 'Diesel' :
        asset.assetType.includes('Sweeping') || asset.assetType.includes('JCB') ? 'Diesel' :
          'Diesel/CNG',
      engineNumber: `ENG${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      chassisNumber: `CHS${Math.random().toString(36).substring(2, 15).toUpperCase()}`,

      // Certificates
      registrationValidity: `31-12-${new Date().getFullYear() + 15}`,
      pollutionCertValidity: `30-06-${new Date().getFullYear() + 1}`,
      fitnessCertValidity: `31-12-${new Date().getFullYear() + 1}`,
      insuranceValidity: `15-04-${new Date().getFullYear() + 1}`,
      insuranceProvider: 'Oriental Insurance Co. Ltd.',
      insurancePolicyNo: `OIC/2024/${Math.floor(Math.random() * 900000 + 100000)}`,
    } : {}),

    // Depreciation calculation
    age: asset.constructionYear ? new Date().getFullYear() - asset.constructionYear : 0,
    depreciationRate: (() => {
      const age = asset.constructionYear ? new Date().getFullYear() - asset.constructionYear : 0;
      if (age <= 1) return 0.15; // 15% for first year
      else if (age <= 2) return 0.20; // 20% cumulative
      else if (age <= 3) return 0.30;
      else if (age <= 5) return 0.40;
      else if (age <= 8) return 0.50;
      else return 0.60; // 60% max depreciation
    })(),
  };
}

export function getLandValuation(landData: any, asset: any) {
  if (!landData) return null;
  const baseArea = landData.totalArea;
  const rrRate = landData.readyReckonerRate;

  // Base land value
  const baseValue = baseArea * rrRate;

  // Location adjustment
  const locationAdjustedValue = baseValue * landData.locationFactor;

  // Corner plot premium
  const cornerAdjustment = landData.isCornerPlot ? locationAdjustedValue * landData.cornerPremium : 0;

  // Development status adjustment
  let developmentAdjustment = 0;
  if (landData.developmentStatus === 'Under Development') {
    developmentAdjustment = -locationAdjustedValue * 0.15; // -15% for under development
  } else if (landData.developmentStatus === 'Fully Developed') {
    developmentAdjustment = locationAdjustedValue * 0.05; // +5% for developed land with amenities
  }

  // Encroachment penalty
  const encroachmentPenalty = asset?.encroachment?.hasEncroachment ?
    -locationAdjustedValue * 0.20 : 0; // -20% if encroached

  // Total capital value
  const totalValue = locationAdjustedValue + cornerAdjustment + developmentAdjustment + encroachmentPenalty;

  return {
    baseArea,
    rrRate,
    baseValue,
    locationFactor: landData.locationFactor,
    locationAdjustedValue,
    isCornerPlot: landData.isCornerPlot,
    cornerAdjustment,
    developmentStatus: landData.developmentStatus,
    developmentAdjustment,
    hasEncroachment: asset?.encroachment?.hasEncroachment || false,
    encroachmentPenalty,
    totalValue,
  };
}

export function getMovableValuation(movableData: any) {
  if (!movableData) return null;
  const purchaseCost = movableData.purchaseCost;
  const age = movableData.age;
  const depRate = movableData.depreciationRate;

  // Written Down Value (WDV) method
  const depreciationAmount = purchaseCost * depRate;
  const currentValue = purchaseCost - depreciationAmount;

  // Scrap value (10% of original cost)
  const scrapValue = purchaseCost * 0.10;
  const bookValue = Math.max(currentValue, scrapValue);

  return {
    purchaseCost,
    age,
    depreciationRate: depRate,
    depreciationAmount,
    currentValue,
    scrapValue,
    bookValue,
  };
}

export function getBuildingValuation(asset: any, buildingData: any, buildingAge: number | null) {
  if (!buildingData) return { floors: [], buildingCapitalValue: 0 };

  const isCommercialComplex = asset.category === 'building' && asset.assetType === 'Municipal Commercial Complex';
  const buildingUseLabel = isCommercialComplex ? 'Commercial' : 'Building';
  const buildingSubtypeLabel = isCommercialComplex ? 'Shops' : (asset.assetType || 'Building Use');

  const floorCount = asset.floors || buildingData?.numberOfFloors || 2;
  const totalBuiltUpArea = asset.builtUpArea || 28600;
  
  const builtUpPerFloor = Math.round(totalBuiltUpArea / floorCount);
  const carpetPerFloor = Math.round(builtUpPerFloor * 0.9);
  
  const sdrrRate = 42000;
  const ageFactor = 0.85;
  const ntbFactor = 1.1;
  const useFactor = 1.2;

  const floorNames = [
    'Ground Floor',
    'First Floor',
    'Second Floor',
    'Third Floor',
    'Fourth Floor',
    'Fifth Floor',
    'Sixth Floor',
    'Seventh Floor',
    'Eighth Floor',
    'Ninth Floor',
    'Tenth Floor'
  ];

  const floors = Array.from({ length: floorCount }).map((_, index) => {
    let floorFactor = 1.0;
    if (index === 1) floorFactor = 0.95;
    else if (index > 1) floorFactor = 0.90;

    const baseValue = builtUpPerFloor * sdrrRate;
    const finalCapitalValue = baseValue * floorFactor * ageFactor * ntbFactor * useFactor;

    return {
      floor: floorNames[index] || `Floor ${index}`,
      constructionYear: asset.constructionYear || 2012,
      assessmentYear: asset.constructionYear || 2012,
      constructionType: 'RCC',
      natureTypeBuilding: buildingUseLabel,
      subtype: buildingSubtypeLabel,
      noOfRooms: isCommercialComplex ? (index === 0 ? 32 : 36) : (asset.totalRooms || (index === 0 ? 12 : 14)),
      carpetAreaSqFt: String(carpetPerFloor),
      carpetAreaSqM: String(Math.round(carpetPerFloor * 0.092903)),
      builtUpAreaSqFt: String(builtUpPerFloor),
      builtUpAreaSqM: String(Math.round(builtUpPerFloor * 0.092903)),
      sdrr: String(sdrrRate),
      baseValue: baseValue,
      floorFactorValue: floorFactor.toFixed(2),
      ageFactorValue: ageFactor.toFixed(2),
      ntbFactorValue: ntbFactor.toFixed(2),
      useFactorValue: useFactor.toFixed(2),
      finalCapitalValue: finalCapitalValue
    };
  });

  const buildingCapitalValue = floors.reduce((sum, f) => sum + f.finalCapitalValue, 0);

  return {
    floors,
    buildingCapitalValue
  };
}

export const legalFallbackDetails: Record<string, any> = {
  'BLD-035': {
    // A) Building Legal Details
    sanctionedPlanNumber: 'BP/2021/3456',
    sanctionDate: '2021-08-15',
    completionCertificateNumber: 'CC/2022/789',
    completionCertificateDate: '2022-06-15',
    occupancyCert: 'OC/2023/234',
    occupancyCertDate: '2023-01-10',
    emergencyExitAvailable: true,
    structuralRiskIdentified: false,
    fireSafetyAvailable: true,
    liftAvailable: false,
    buildingCondition: 'Good - Well Maintained',
    legalRemarks: 'Clear title and ownership. DP zoning compliance certificate is verified by AMC Town Planning Department.',

    // B) Social Details & Water Connection Details
    waterConnectionAvailable: true,
    waterMeterNumber: 'WM-2022-78945',
    waterConnectionDate: '2022-07-20',
    solarPanelSystemInstalled: true,
    solarCapacity: '15 kW / 30 Panels',
    solarInstallationDate: '2023-02-15',
    rainwaterHarvesting: true,
    separateMeterFloorwise: true,

    // C) Safety Features
    fireExtinguisherAvailable: true,
    cctvCoverage: true,
    emergencyAlarmSystem: true,
    visitorAccessControl: false,
    biometricAccessControl: false
  },
  'DEFAULT': {
    // A) Building Legal Details
    sanctionedPlanNumber: 'BP/2020/9876',
    sanctionDate: '2020-04-10',
    completionCertificateNumber: 'CC/2021/456',
    completionCertificateDate: '2021-02-18',
    occupancyCert: 'OC/2021/892',
    occupancyCertDate: '2021-03-05',
    emergencyExitAvailable: true,
    structuralRiskIdentified: false,
    fireSafetyAvailable: true,
    liftAvailable: true,
    buildingCondition: 'Excellent',
    legalRemarks: 'Commercial occupancy approved. Fire department NOC renewed annually.',

    // B) Social Details & Water Connection Details
    waterConnectionAvailable: true,
    waterMeterNumber: 'WM-2020-11223',
    waterConnectionDate: '2020-05-12',
    solarPanelSystemInstalled: true,
    solarCapacity: '50 kW / 100 Panels',
    solarInstallationDate: '2021-08-25',
    rainwaterHarvesting: true,
    separateMeterFloorwise: true,

    // C) Safety Features
    fireExtinguisherAvailable: true,
    cctvCoverage: true,
    emergencyAlarmSystem: true,
    visitorAccessControl: true,
    biometricAccessControl: true
  }
};

export function getCategoryDetailedData(asset: any) {
  return {
    schoolDetailedData: null,
    hospitalDetailedData: null,
    officeDetailedData: null,
    shopDetailedData: null,
    toiletDetailedData: null,
    landData: null,
  };
}
