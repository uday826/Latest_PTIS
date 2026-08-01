export interface TimelineField {
  label: string;
  value: string;
}

export interface TimelineStage {
  title: string;
  status: string;
  statusType: 'completed' | 'inProgress' | 'pending';
  fields: TimelineField[];
  hasFullDetails: boolean;
}

export const stageDataMap: Record<string, TimelineStage> = {
  geoSequencing: {
    title: 'GEO SEQUENCING DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Geo Sequencing Status', value: 'Completed' },
      { label: 'Sequencing Date', value: '15-Jan-2024' },
      { label: 'GIS Reference Number', value: 'GIS-GEO-2024-0019' },
      { label: 'Property Coordinates', value: '19.0760° N, 72.8777° E' },
      { label: 'Zone', value: 'Zone-A' },
      { label: 'Ward', value: 'Ward-04' },
      { label: 'Survey or Plot Reference', value: 'Plot-129' },
      { label: 'Verified By', value: 'Officer A. R. Sharma' },
      { label: 'Remarks', value: 'Geo-sequencing verify successful. Coordinates verified on GIS map.' },
      { label: 'Last Updated', value: '15-Jan-2024 16:30' },
    ],
    hasFullDetails: true,
  },
  survey: {
    title: 'SURVEY DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Survey Status', value: 'Completed' },
      { label: 'Survey Date', value: '10-Feb-2024' },
      { label: 'Survey Number', value: 'SRV-90821-B' },
      { label: 'Surveyor Name', value: 'Inspector Rahul Verma' },
      { label: 'Survey Type', value: 'Physical Audit' },
      { label: 'Plot Area', value: '400.00 m²' },
      { label: 'Built-up Area', value: '440.00 m²' },
      { label: 'Measurement Notes', value: 'Measurements verify 10% area increase due to carpet extensions.' },
      { label: 'Supporting Documents', value: 'Survey_Report.pdf, Ground_Photo.jpg' },
      { label: 'Remarks', value: 'Physical survey completed and signed by surveyor.' },
      { label: 'Last Updated', value: '10-Feb-2024 14:15' },
    ],
    hasFullDetails: true,
  },
  verification: {
    title: 'VERIFICATION DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Verification Status', value: 'Completed' },
      { label: 'Verification Date', value: '20-Feb-2024' },
      { label: 'Verified By', value: 'Officer Deepali Patil' },
      { label: 'Verification Type', value: 'Document & Physical Audit' },
      { label: 'Documents Verified', value: 'Sale Deed, Tax Receipts, GIS Coordinate Log' },
      { label: 'GIS Verification', value: 'Verified & Matched' },
      { label: 'Ownership Verification', value: 'Confirmed (Shri Balasaheb Thackeray)' },
      { label: 'Discrepancies Found', value: 'None' },
      { label: 'Remarks', value: 'Document audits are complete. Cross-matched ownership registry successfully.' },
      { label: 'Last Updated', value: '20-Feb-2024 11:20' },
    ],
    hasFullDetails: false,
  },
  assessment: {
    title: 'ASSESSMENT DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Assessment Status', value: 'Completed' },
      { label: 'Assessment Date', value: '01-Apr-2024' },
      { label: 'Assessment Number', value: 'ASM-PT-2024-9901' },
      { label: 'Assessed By', value: 'Assessor K. G. Joshi' },
      { label: 'Property Category', value: 'Residential' },
      { label: 'Usage Type', value: 'निवासी (Residential Tenant/Owner)' },
      { label: 'Rateable Value', value: '₹18,45,000' },
      { label: 'Capital Value', value: '₹36,90,000' },
      { label: 'Assessed Tax', value: '₹18,752' },
      { label: 'Remarks', value: 'Annual tax assessment processed on latest rateable values.' },
      { label: 'Last Updated', value: '01-Apr-2024 18:00' },
    ],
    hasFullDetails: true,
  },
  approval: {
    title: 'APPROVAL DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Approval Status', value: 'Completed' },
      { label: 'Approval Date', value: '20-Apr-2024' },
      { label: 'Approval Reference Number', value: 'APP-DEC-99812-C' },
      { label: 'Approved By', value: 'Commissioner S. K. Mehta' },
      { label: 'Approval Level', value: 'Level 3 (Final Board)' },
      { label: 'Conditions', value: 'Subject to yearly property tax compliance.' },
      { label: 'Remarks', value: 'Approved for final collection.' },
      { label: 'Last Updated', value: '20-Apr-2024 10:45' },
    ],
    hasFullDetails: false,
  },
  collection: {
    title: 'COLLECTION DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Collection Status', value: 'Completed' },
      { label: 'Collection Date', value: '05-May-2024' },
      { label: 'Demand Amount', value: '₹18,752' },
      { label: 'Paid Amount', value: '₹12,456' },
      { label: 'Outstanding Amount', value: '₹6,296' },
      { label: 'Payment Mode', value: 'Net Banking (HDFC)' },
      { label: 'Receipt Number', value: 'REC-882711-PT' },
      { label: 'Transaction Reference', value: 'TXN-8817281928' },
      { label: 'Collection Officer', value: 'Officer Manoj Shinde' },
      { label: 'Last Updated', value: '05-May-2024 15:30' },
    ],
    hasFullDetails: true,
  },
  mutation: {
    title: 'MUTATION DETAILS',
    status: 'In Progress',
    statusType: 'inProgress',
    fields: [
      { label: 'Mutation Status', value: 'In Progress' },
      { label: 'Application Date', value: '29-Jul-2026' },
      { label: 'Mutation Application Number', value: 'MUT-APP-2026-880' },
      { label: 'Current Owner', value: 'Shri Balasaheb Thackeray' },
      { label: 'Proposed Owner', value: 'Smt. Shalini Thackeray' },
      { label: 'Transfer Type', value: 'Inheritance' },
      { label: 'Supporting Documents', value: 'Family Deed, Death Certificate' },
      { label: 'Expected Completion Date', value: '30-Aug-2024' },
      { label: 'Current Processing Stage', value: 'Document Verification Phase' },
      { label: 'Pending Action', value: 'Review by Mutation Officer' },
      { label: 'Responsible Department', value: 'Revenue Department' },
      { label: 'Expected Next Step', value: 'Public Notice Issuance' },
      { label: 'Remarks', value: 'Mutation in progress. Pending final verified inheritance document.' },
      { label: 'Last Updated', value: '29-Jul-2026 12:00' },
    ],
    hasFullDetails: false,
  },
  appeal: {
    title: 'APPEAL DETAILS',
    status: 'Pending',
    statusType: 'pending',
    fields: [],
    hasFullDetails: false,
  }
};
