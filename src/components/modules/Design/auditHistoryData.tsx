import React from 'react';
import { Plus, Map, Eye, UserCheck, FileText, CheckCircle2, Wallet, FileEdit } from 'lucide-react';

export interface HistoryEvent {
  id: string;
  title: string;
  date: string;
  icon: React.ReactNode;
  desc: string;
}

export const historyEvents: HistoryEvent[] = [
  { id: 'created', title: 'Property Registry Created', date: '10-Jan-2024 10:00', icon: <Plus size={11} />, desc: 'Property added to Nagpur municipal data registry.' },
  { id: 'geo', title: 'Geo-Sequencing Verified', date: '15-Jan-2024 16:30', icon: <Map size={11} />, desc: 'GIS Coordinates matched successfully.' },
  { id: 'survey', title: 'Property Survey Audit Completed', date: '10-Feb-2024 14:15', icon: <Eye size={11} />, desc: 'Physical inspector completed measurements check.' },
  { id: 'verified', title: 'Tax Record Verified', date: '20-Feb-2024 11:20', icon: <UserCheck size={11} />, desc: 'Registry documents and ownership deeds audited.' },
  { id: 'assessed', title: 'Tax Assessment Processed', date: '01-Apr-2024 18:00', icon: <FileText size={11} />, desc: 'Rateable value assessment calculated.' },
  { id: 'approved', title: 'Assessment Board Approved', date: '20-Apr-2024 10:45', icon: <CheckCircle2 size={11} />, desc: 'Board commission signed final approval log.' },
  { id: 'collected', title: 'Payment Collection Logged', date: '05-May-2024 15:30', icon: <Wallet size={11} />, desc: 'HDFC NetBanking payment received.' },
  { id: 'edited', title: 'Property Registry Edited', date: '29-Jul-2026 12:00', icon: <FileEdit size={11} />, desc: 'Primary mobile and owner information updated.' }
];

export const auditDetailsMap: Record<string, any> = {
  created: {
    title: 'Property Registry Created',
    date: '10-Jan-2024 10:00',
    user: 'SuperAdmin Operator',
    role: 'IT Administrator',
    prevVal: 'N/A (New Record)',
    newVal: 'Property ID: 1290082181, Status: Pending Assessment',
    remarks: 'Primary data entry completed successfully from physical file applications.',
    docs: 'Registry_Application_Form.pdf'
  },
  geo: {
    title: 'Geo-Sequencing Verified',
    date: '15-Jan-2024 16:30',
    user: 'Inspector A. R. Sharma',
    role: 'GIS Verification Officer',
    prevVal: 'Coordinates: Empty',
    newVal: 'Coordinates: 19.0760° N, 72.8777° E, Zone A',
    remarks: 'Validated physical location with satellite maps and overlay grid vectors.',
    docs: 'GIS_Coordinate_Report.geojson'
  },
  survey: {
    title: 'Property Survey Audit Completed',
    date: '10-Feb-2024 14:15',
    user: 'Surveyor Rahul Verma',
    role: 'Field Inspector',
    prevVal: 'Reported Area: 400 m²',
    newVal: 'Builtup Footprint: 440 m² (Survey verified)',
    remarks: 'Physical measurements verify 10% carpet extensions built on back courtyard.',
    docs: 'Survey_Measurements_Log.pdf, Ground_Photo_1.jpg'
  },
  verified: {
    title: 'Tax Record Verified',
    date: '20-Feb-2024 11:20',
    user: 'Officer Deepali Patil',
    role: 'Auditor Level 2',
    prevVal: 'Verification: Pending',
    newVal: 'Verification: Verified & Signed',
    remarks: 'Registry deeds, family records, and tax exemptions validated.',
    docs: 'Exemption_Certificates.zip'
  },
  assessed: {
    title: 'Tax Assessment Processed',
    date: '01-Apr-2024 18:00',
    user: 'Assessor K. G. Joshi',
    role: 'Property Tax Assessor',
    prevVal: 'Annual Tax: ₹0',
    newVal: 'Rateable: ₹18,45,000, Tax: ₹18,752',
    remarks: 'Assessment processed using senior citizen standard discount matrices.',
    docs: 'Calculated_Tax_Worksheet.pdf'
  },
  approved: {
    title: 'Assessment Board Approved',
    date: '20-Apr-2024 10:45',
    user: 'Commissioner S. K. Mehta',
    role: 'Chief Approving Commissioner',
    prevVal: 'Approval: Pending Board Sign-off',
    newVal: 'Approval: Commissioner Approved (Level 3)',
    remarks: 'Final review completed. Allowed for municipal collection.',
    docs: 'Commissioner_Board_Resolution.pdf'
  },
  collected: {
    title: 'Payment Collection Logged',
    date: '05-May-2024 15:30',
    user: 'Collector Manoj Shinde',
    role: 'Collection Desk Desk Officer',
    prevVal: 'Outstanding balance: ₹18,752',
    newVal: 'Paid: ₹12,456, Outstanding: ₹6,296',
    remarks: 'Payment received via Net Banking HDFC. Receipt REC-2026-908A generated.',
    docs: 'Tax_Payment_Receipt_REC-2026-908A.pdf'
  },
  edited: {
    title: 'Property Registry Edited',
    date: '29-Jul-2026 12:00',
    user: 'Shri Balasaheb Thackeray',
    role: 'Primary Taxpayer (Self Portal)',
    prevVal: 'Mobile: 9876543200, Email: empty',
    newVal: 'Mobile: 9876543210, Email: owner@property.com',
    remarks: 'Self portal updates completed using Aadhaar verification.',
    docs: 'Aadhaar_OTP_Log.txt'
  }
};
