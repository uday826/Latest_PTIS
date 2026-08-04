export interface SocietyDetails {
  name: string;
  registrationNumber: string;
  reraRegistration: string;
  totalTaxAssessmentId: string;
  auditStatus: string;
  chairman: string;
  chairmanContact: string;
  secretary: string;
  secretaryContact: string;
  treasurer: string;
  treasurerContact: string;
  officeAddress: string;
  emailContact: string;
}

export interface WingSummaryMetrics {
  totalUnits: number;
  residentialUnits: number;
  commercialUnits: number;
  otherUnits: number;
  totalCarpetArea: number;
  totalBuiltUpArea: number;
}

export interface WingDetailsDTO {
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
  collection: string;
  outstanding: string;
  additionalRevenue: string;
  collectionPct: string;
  mods: { matched: string; missing: string; newCount: string; modified: string };
}

export interface ComparisonRowDTO {
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

export interface AddWingPayload {
  wingName: string;
  blockName: string;
  floorsCount: number;
  unitsCount: number;
  constructionType: string;
  primaryUse: string;
}
