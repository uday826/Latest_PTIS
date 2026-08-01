// Static mock data for Apartment Management Dashboard

export interface WingDetails {
  id: string;
  grade: string;
  wing: string;
  name: string;
  floors: string;
  units: string;
  res: string;
  com: string;
  amen: string;
  newDem: string;
  retroDem: string;
  discount: string;
  discLabel: string;
  exemp: string;
  exempLabel: string;
  rvImpact: string;
  rvLabel: string;
  themeColor: string;
  gradeBorderColor: string;
  badgeBgColor: string;
  // New fields for expanded card
  collection: string;
  outstanding: string;
  additionalRevenue: string;
  collectionPct: string;
  mods: { matched: string; missing: string; newCount: string; modified: string };
  discountDetails: {
    amount: string;
    pct: string;
    units: string;
    category: string;
    period: string;
    status: string;
    remarks: string;
  };
  exemptionDetails: {
    units: string;
    category: string;
    eligible: string;
    amount: string;
    certNo: string;
    validity: string;
    status: string;
    remarks: string;
  };
  rvImpactDetails: {
    prevRv: string;
    revisedRv: string;
    diff: string;
    pctChange: string;
    units: string;
    effectiveDate: string;
    ref: string;
    remarks: string;
  };
}

export const initialWings: WingDetails[] = [
  {
    id: 'A',
    grade: 'A+',
    wing: 'A Wing',
    name: 'Krishna Block',
    floors: 'G + 7',
    units: '19',
    res: '16',
    com: '2',
    amen: '1',
    newDem: '43,920',
    retroDem: '68,850',
    discount: '-₹5,391',
    discLabel: '7u',
    exemp: '2 u',
    exempLabel: '<500 sq.ft.',
    rvImpact: '+₹1.23L',
    rvLabel: '+253.9%',
    themeColor: 'green',
    gradeBorderColor: 'border-green-500 text-green-600',
    badgeBgColor: 'bg-green-700',
    collection: '₹38,529',
    outstanding: '₹5,391',
    additionalRevenue: '₹1,23,100',
    collectionPct: '97.7%',
    mods: { matched: '3', missing: '1', newCount: '1', modified: '16' },
    discountDetails: {
      amount: '₹5,391',
      pct: '12.27%',
      units: '7 Units',
      category: 'Senior Citizen & Small Area',
      period: 'FY 2023-24',
      status: 'Approved',
      remarks: 'Applicable to residential units under 500 sq.ft.'
    },
    exemptionDetails: {
      units: '2 Units',
      category: 'Freedom Fighter & Defense Exemption',
      eligible: 'Flat 102, Flat 204',
      amount: '₹4,500',
      certNo: 'CERT-FF-9921',
      validity: 'Permanent',
      status: 'Verified',
      remarks: 'General tax component fully exempted.'
    },
    rvImpactDetails: {
      prevRv: '₹12,450',
      revisedRv: '₹43,920',
      diff: '₹31,470',
      pctChange: '+253.9%',
      units: '19 Units',
      effectiveDate: '01-Apr-2023',
      ref: 'TMC-RV-2023-A',
      remarks: 'Revised based on carpet area physical survey.'
    }
  },
  {
    id: 'B',
    grade: 'A',
    wing: 'B Wing',
    name: 'Sai Block',
    floors: 'G + 7',
    units: '19',
    res: '16',
    com: '2',
    amen: '1',
    newDem: '43,920',
    retroDem: '68,850',
    discount: '-₹5,391',
    discLabel: '7u',
    exemp: '2 u',
    exempLabel: '<500 sq.ft.',
    rvImpact: '+₹1.23L',
    rvLabel: '+253.9%',
    themeColor: 'purple',
    gradeBorderColor: 'border-purple-500 text-purple-600',
    badgeBgColor: 'bg-purple-700',
    collection: '₹35,240',
    outstanding: '₹8,560',
    additionalRevenue: '₹1,11,850',
    collectionPct: '80.2%',
    mods: { matched: '5', missing: '1', newCount: '0', modified: '15' },
    discountDetails: {
      amount: '₹5,391',
      pct: '12.27%',
      units: '7 Units',
      category: 'Senior Citizen & Small Area',
      period: 'FY 2023-24',
      status: 'Approved',
      remarks: 'Applicable to residential units under 500 sq.ft.'
    },
    exemptionDetails: {
      units: '2 Units',
      category: 'Freedom Fighter & Defense Exemption',
      eligible: 'Flat 102, Flat 204',
      amount: '₹4,500',
      certNo: 'CERT-FF-9921',
      validity: 'Permanent',
      status: 'Verified',
      remarks: 'General tax component fully exempted.'
    },
    rvImpactDetails: {
      prevRv: '₹12,450',
      revisedRv: '₹43,920',
      diff: '₹31,470',
      pctChange: '+253.9%',
      units: '19 Units',
      effectiveDate: '01-Apr-2023',
      ref: 'TMC-RV-2023-B',
      remarks: 'Revised based on carpet area physical survey.'
    }
  },
  {
    id: 'C',
    grade: 'A+',
    wing: 'C Wing',
    name: 'Ganesh Block',
    floors: 'G + 7',
    units: '15',
    res: '12',
    com: '2',
    amen: '1',
    newDem: '43,920',
    retroDem: '50,160',
    discount: '-₹5,820',
    discLabel: '5u',
    exemp: '1 u',
    exempLabel: 'Freedom Fighter',
    rvImpact: '+₹86,240',
    rvLabel: '+206.7%',
    themeColor: 'green',
    gradeBorderColor: 'border-green-500 text-green-600',
    badgeBgColor: 'bg-green-700',
    collection: '₹41,380',
    outstanding: '₹2,540',
    additionalRevenue: '₹66,240',
    collectionPct: '94.2%',
    mods: { matched: '2', missing: '0', newCount: '1', modified: '12' },
    discountDetails: {
      amount: '₹5,820',
      pct: '11.60%',
      units: '5 Units',
      category: 'Senior Citizen & Small Area',
      period: 'FY 2023-24',
      status: 'Approved',
      remarks: 'Applicable to residential units under 500 sq.ft.'
    },
    exemptionDetails: {
      units: '1 Unit',
      category: 'Freedom Fighter & Defense Exemption',
      eligible: 'Flat 302',
      amount: '₹2,250',
      certNo: 'CERT-FF-9923',
      validity: 'Permanent',
      status: 'Verified',
      remarks: 'General tax component fully exempted.'
    },
    rvImpactDetails: {
      prevRv: '₹41,720',
      revisedRv: '₹1,27,960',
      diff: '₹86,240',
      pctChange: '+206.7%',
      units: '15 Units',
      effectiveDate: '01-Apr-2023',
      ref: 'TMC-RV-2023-C',
      remarks: 'Revised based on carpet area physical survey.'
    }
  },
  {
    id: 'D',
    grade: 'B+',
    wing: 'D Wing',
    name: 'Lotus Block',
    floors: 'G + 6',
    units: '14',
    res: '11',
    com: '2',
    amen: '1',
    newDem: '40,220',
    retroDem: '48,440',
    discount: '-₹4,120',
    discLabel: '3u',
    exemp: '0 u',
    exempLabel: '-',
    rvImpact: '+₹62,310',
    rvLabel: '+178.9%',
    themeColor: 'orange',
    gradeBorderColor: 'border-orange-500 text-orange-600',
    badgeBgColor: 'bg-orange-600',
    collection: '₹32,100',
    outstanding: '₹1,120',
    additionalRevenue: '₹82,310',
    collectionPct: '78.9%',
    mods: { matched: '2', missing: '2', newCount: '2', modified: '8' },
    discountDetails: {
      amount: '₹4,120',
      pct: '8.51%',
      units: '3 Units',
      category: 'Senior Citizen & Small Area',
      period: 'FY 2023-24',
      status: 'Approved',
      remarks: 'Applicable to residential units under 500 sq.ft.'
    },
    exemptionDetails: {
      units: '0 Unit',
      category: 'Freedom Fighter & Defense Exemption',
      eligible: '-',
      amount: '0',
      certNo: '-',
      validity: '-',
      status: '-',
      remarks: 'No active exemption claim.'
    },
    rvImpactDetails: {
      prevRv: '₹34,810',
      revisedRv: '₹97,120',
      diff: '₹62,310',
      pctChange: '+178.9%',
      units: '14 Units',
      effectiveDate: '01-Apr-2023',
      ref: 'TMC-RV-2023-D',
      remarks: 'Revised based on carpet area physical survey.'
    }
  }
];

export interface ComparisonRow {
  prevNo: string;
  prevWing: string;
  prevType: string;
  prevFlr: string;
  prevYr: string;
  prevCon: string;
  prevUse: string;
  prevRent: string;
  prevCarpet: number;
  prevBua: number;
  prevAyr: string;
  prevRtPd: string;
  prevRate: string;
  prevRv: string;
  prevTax: string;
  prevRtTax: string;
  prevPen: string;
  diffCarpet: number;
  diffBua: number;
  diffRv: number;
  diffTax: number;
  diffRtTax: number;
  diffPen: number;
  diffStatus: 'Matched' | 'Modified' | 'New' | 'Missing';
  diffSuggestion: 'Verify Area' | 'Create New' | 'Verify' | '-';
  currProp: string;
  currWing: string;
  currType: string;
  currFlr: string;
  currYr: string;
  currCon: string;
  currUse: string;
  currRent: string;
  currCarpet: number;
  currBua: number;
  currAyr: string;
  currRtPd: string;
  currRate: string;
  currRv: string;
  currTax: string;
  currRtTax: string;
  currPen: string;
}

export const comparisonRows: ComparisonRow[] = [
  {
    prevNo: "1",
    prevWing: "B/102",
    prevType: "Flat",
    prevFlr: "1",
    prevYr: "2008",
    prevCon: "RCC",
    prevUse: "Residential",
    prevRent: "-",
    prevCarpet: 624,
    prevBua: 780,
    prevAyr: "2024-25",
    prevRtPd: "2021-24",
    prevRate: "8.00",
    prevRv: "3,510",
    prevTax: "10,811",
    prevRtTax: "10,811",
    prevPen: "0",
    diffCarpet: 0,
    diffBua: 0,
    diffRv: 0,
    diffTax: 0,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "Matched",
    diffSuggestion: "-",
    currProp: "102",
    currWing: "B/102",
    currType: "Flat",
    currFlr: "1",
    currYr: "2008",
    currCon: "RCC",
    currUse: "Residential",
    currRent: "-",
    currCarpet: 624,
    currBua: 780,
    currAyr: "2024-25",
    currRtPd: "2021-24",
    currRate: "8.00",
    currRv: "3,510",
    currTax: "10,811",
    currRtTax: "10,811",
    currPen: "0"
  },
  {
    prevNo: "2",
    prevWing: "B/103",
    prevType: "Flat",
    prevFlr: "1",
    prevYr: "2010",
    prevCon: "RCC",
    prevUse: "Residential",
    prevRent: "-",
    prevCarpet: 736,
    prevBua: 920,
    prevAyr: "2024-25",
    prevRtPd: "2021-24",
    prevRate: "8.00",
    prevRv: "4,410",
    prevTax: "13,583",
    prevRtTax: "13,583",
    prevPen: "0",
    diffCarpet: 48,
    diffBua: 60,
    diffRv: 767,
    diffTax: 2021,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "Modified",
    diffSuggestion: "Verify Area",
    currProp: "103",
    currWing: "B/103",
    currType: "Flat",
    currFlr: "1",
    currYr: "2010",
    currCon: "RCC",
    currUse: "Residential",
    currRent: "-",
    currCarpet: 784,
    currBua: 980,
    currAyr: "2024-25",
    currRtPd: "2021-24",
    currRate: "8.00",
    currRv: "5,177",
    currTax: "15,604",
    currRtTax: "15,604",
    currPen: "0"
  },
  {
    prevNo: "3",
    prevWing: "B/201",
    prevType: "Flat",
    prevFlr: "2",
    prevYr: "2008",
    prevCon: "RCC",
    prevUse: "Residential",
    prevRent: "₹15,000",
    prevCarpet: 680,
    prevBua: 850,
    prevAyr: "2024-25",
    prevRtPd: "2021-24",
    prevRate: "10.00",
    prevRv: "3,825",
    prevTax: "11,781",
    prevRtTax: "11,781",
    prevPen: "260",
    diffCarpet: 0,
    diffBua: 0,
    diffRv: 0,
    diffTax: 0,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "Matched",
    diffSuggestion: "-",
    currProp: "201",
    currWing: "B/201",
    currType: "Flat",
    currFlr: "2",
    currYr: "2008",
    currCon: "RCC",
    currUse: "Residential",
    currRent: "₹15,000",
    currCarpet: 680,
    currBua: 850,
    currAyr: "2024-25",
    currRtPd: "2021-24",
    currRate: "10.00",
    currRv: "3,825",
    currTax: "11,781",
    currRtTax: "11,781",
    currPen: "260"
  },
  {
    prevNo: "4",
    prevWing: "B/S-01",
    prevType: "Shop",
    prevFlr: "0",
    prevYr: "2015",
    prevCon: "RCC",
    prevUse: "Commercial",
    prevRent: "₹25,000",
    prevCarpet: 256,
    prevBua: 320,
    prevAyr: "2024-25",
    prevRtPd: "2021-24",
    prevRate: "10.00",
    prevRv: "3,456",
    prevTax: "12,255",
    prevRtTax: "12,255",
    prevPen: "2100",
    diffCarpet: 0,
    diffBua: 0,
    diffRv: 0,
    diffTax: 0,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "Matched",
    diffSuggestion: "-",
    currProp: "S-01",
    currWing: "B/S-01",
    currType: "Shop",
    currFlr: "0",
    currYr: "2015",
    currCon: "RCC",
    currUse: "Commercial",
    currRent: "₹25,000",
    currCarpet: 256,
    currBua: 320,
    currAyr: "2024-25",
    currRtPd: "2021-24",
    currRate: "10.00",
    currRv: "3,456",
    currTax: "12,255",
    currRtTax: "12,255",
    currPen: "2100"
  },
  {
    prevNo: "5",
    prevWing: "B/S-02",
    prevType: "Shop",
    prevFlr: "0",
    prevYr: "2015",
    prevCon: "RCC",
    prevUse: "Commercial",
    prevRent: "₹18,000",
    prevCarpet: 224,
    prevBua: 280,
    prevAyr: "2024-25",
    prevRtPd: "2021-24",
    prevRate: "10.00",
    prevRv: "3,024",
    prevTax: "12,011",
    prevRtTax: "12,011",
    prevPen: "1000",
    diffCarpet: 12,
    diffBua: 20,
    diffRv: 88,
    diffTax: 299,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "Modified",
    diffSuggestion: "Verify Area",
    currProp: "S-02",
    currWing: "B/S-02",
    currType: "Shop",
    currFlr: "0",
    currYr: "2015",
    currCon: "RCC",
    currUse: "Commercial",
    currRent: "₹18,000",
    currCarpet: 236,
    currBua: 300,
    currAyr: "2024-25",
    currRtPd: "2021-24",
    currRate: "10.00",
    currRv: "3,112",
    currTax: "12,310",
    currRtTax: "12,310",
    currPen: "1000"
  },
  {
    prevNo: "6",
    prevWing: "B/S-03",
    prevType: "Shop",
    prevFlr: "0",
    prevYr: "2015",
    prevCon: "RCC",
    prevUse: "Commercial",
    prevRent: "₹20,000",
    prevCarpet: 288,
    prevBua: 360,
    prevAyr: "2024-25",
    prevRtPd: "2021-24",
    prevRate: "10.00",
    prevRv: "2,838",
    prevTax: "10,839",
    prevRtTax: "10,839",
    prevPen: "0",
    diffCarpet: 0,
    diffBua: 0,
    diffRv: 0,
    diffTax: 0,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "Matched",
    diffSuggestion: "-",
    currProp: "S-03",
    currWing: "B/S-03",
    currType: "Shop",
    currFlr: "0",
    currYr: "2015",
    currCon: "RCC",
    currUse: "Commercial",
    currRent: "₹20,000",
    currCarpet: 288,
    currBua: 360,
    currAyr: "2024-25",
    currRtPd: "2021-24",
    currRate: "10.00",
    currRv: "2,838",
    currTax: "10,839",
    currRtTax: "10,839",
    currPen: "0"
  },
  {
    prevNo: "7",
    prevWing: "B/104",
    prevType: "Flat",
    prevFlr: "1",
    prevYr: "2008",
    prevCon: "RCC",
    prevUse: "Residential",
    prevRent: "-",
    prevCarpet: 0,
    prevBua: 0,
    prevAyr: "-",
    prevRtPd: "-",
    prevRate: "-",
    prevRv: "-",
    prevTax: "-",
    prevRtTax: "-",
    prevPen: "0",
    diffCarpet: 32,
    diffBua: 60,
    diffRv: 1031,
    diffTax: 3620,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "New",
    diffSuggestion: "Create New",
    currProp: "104",
    currWing: "B/104",
    currType: "Flat",
    currFlr: "1",
    currYr: "2008",
    currCon: "RCC",
    currUse: "Residential",
    currRent: "-",
    currCarpet: 600,
    currBua: 800,
    currAyr: "2024-25",
    currRtPd: "2021-24",
    currRate: "8.00",
    currRv: "4,856",
    currTax: "14,401",
    currRtTax: "14,401",
    currPen: "0"
  },
  {
    prevNo: "8",
    prevWing: "B/105",
    prevType: "Flat",
    prevFlr: "1",
    prevYr: "2008",
    prevCon: "RCC",
    prevUse: "Residential",
    prevRent: "-",
    prevCarpet: 0,
    prevBua: 0,
    prevAyr: "-",
    prevRtPd: "-",
    prevRate: "-",
    prevRv: "-",
    prevTax: "-",
    prevRtTax: "-",
    prevPen: "0",
    diffCarpet: 32,
    diffBua: 60,
    diffRv: 1031,
    diffTax: 3620,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "New",
    diffSuggestion: "Create New",
    currProp: "105",
    currWing: "B/105",
    currType: "Flat",
    currFlr: "1",
    currYr: "2008",
    currCon: "RCC",
    currUse: "Residential",
    currRent: "-",
    currCarpet: 640,
    currBua: 840,
    currAyr: "2024-25",
    currRtPd: "2021-24",
    currRate: "8.00",
    currRv: "4,856",
    currTax: "14,401",
    currRtTax: "14,401",
    currPen: "0"
  },
  {
    prevNo: "9",
    prevWing: "B/106",
    prevType: "Flat",
    prevFlr: "1",
    prevYr: "2008",
    prevCon: "RCC",
    prevUse: "Residential",
    prevRent: "-",
    prevCarpet: 0,
    prevBua: 0,
    prevAyr: "-",
    prevRtPd: "-",
    prevRate: "-",
    prevRv: "-",
    prevTax: "-",
    prevRtTax: "-",
    prevPen: "0",
    diffCarpet: 0,
    diffBua: 0,
    diffRv: 0,
    diffTax: 0,
    diffRtTax: 0,
    diffPen: 0,
    diffStatus: "Missing",
    diffSuggestion: "Verify",
    currProp: "106",
    currWing: "B/106",
    currType: "Flat",
    currFlr: "1",
    currYr: "2008",
    currCon: "RCC",
    currUse: "Residential",
    currRent: "-",
    currCarpet: 0,
    currBua: 0,
    currAyr: "-",
    currRtPd: "-",
    currRate: "-",
    currRv: "-",
    currTax: "-",
    currRtTax: "-",
    currPen: "0"
  }
];
