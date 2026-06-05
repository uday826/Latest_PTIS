'use client';

import { Pencil } from 'lucide-react';

interface VerificationRecord {
  id: string;
  grievanceNo: string;
  isNew: boolean;
  assetId: string;
  assetCategory: string;
  assetSubCategory: string;
  tenantName: string;
  correctionBy: string;
  correctionDate: string;
  status: 'Pending';
}

const MOCK_VERIFICATION_RECORDS: VerificationRecord[] = [
  {
    id: '1',
    grievanceNo: '',
    isNew: true,
    assetId: 'MPMS-AS-9',
    assetCategory: 'Shopping Complex',
    assetSubCategory: '(गंगोवाडा मनपा व्यापारी संकुल)',
    tenantName: 'राजेश कुमार शर्मा',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending'
  },
  {
    id: '2',
    grievanceNo: '',
    isNew: true,
    assetId: 'MPMS-AS-12',
    assetCategory: 'Shopping Complex',
    assetSubCategory: '(राजकमल कॉम्प्लेक्स)',
    tenantName: 'सुनिता देशमुख',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending'
  },
  {
    id: '3',
    grievanceNo: '',
    isNew: true,
    assetId: 'MPMS-PL-001',
    assetCategory: 'Plot / Open Land',
    assetSubCategory: 'गांधी मैदान - व्यावसायिक विभाग',
    tenantName: 'महाराष्ट्र स्पोर्टस अकादमी',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending'
  },
  {
    id: '4',
    grievanceNo: '',
    isNew: true,
    assetId: 'MPMS-PL-003',
    assetCategory: 'Plot / Open Land',
    assetSubCategory: 'यशवंत मैदान - कार्यक्रम क्षेत्र',
    tenantName: 'अकोला महोत्सव समिती',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending'
  },
  {
    id: '5',
    grievanceNo: '',
    isNew: true,
    assetId: 'PMC-GRD-001',
    assetCategory: 'Garden',
    assetSubCategory: '',
    tenantName: 'Dream Wedding Planners',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending'
  }
];

interface Props {
  onActionClick?: (record: any) => void;
}

export function LeaseRentVerificationTable({ onActionClick }: Props = {}) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm mt-4">
      <table className="w-full border-collapse text-left text-xs font-semibold text-slate-700">
        <thead>
          <tr className="bg-[#1f2937] text-white font-bold text-[10px] uppercase tracking-wider border-b border-slate-700">
            <th className="px-4 py-3.5 text-center w-16">Sr. No</th>
            <th className="px-4 py-3.5">Grievance No</th>
            <th className="px-4 py-3.5">Asset ID</th>
            <th className="px-4 py-3.5">Asset Category</th>
            <th className="px-4 py-3.5">Tenant Name</th>
            <th className="px-4 py-3.5">Correction By</th>
            <th className="px-4 py-3.5">Correction Date</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-center w-16">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_VERIFICATION_RECORDS.map((r, index) => (
            <tr key={r.id} className="hover:bg-slate-50/50 transition-colors text-slate-700">
              <td className="px-4 py-4 text-center font-bold text-slate-400">{index + 1}</td>
              <td className="px-4 py-4">
                {r.isNew && (
                  <span className="inline-flex px-2 py-0.5 rounded border border-emerald-200 text-emerald-600 bg-emerald-50 text-[10px] font-bold">
                    New
                  </span>
                )}
                {r.grievanceNo && <span className="ml-2">{r.grievanceNo}</span>}
              </td>
              <td className="px-4 py-4 font-bold text-slate-800">{r.assetId}</td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <span>{r.assetCategory}</span>
                  {r.assetSubCategory && (
                    <span className="text-[10px] text-red-500/80 font-normal mt-0.5">
                      {r.assetSubCategory}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-slate-800">{r.tenantName}</td>
              <td className="px-4 py-4 text-slate-500">{r.correctionBy}</td>
              <td className="px-4 py-4 text-slate-500">{r.correctionDate}</td>
              <td className="px-4 py-4">
                {r.status === 'Pending' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-200 bg-orange-50/50 text-orange-600 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Pending
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-center">
                <button 
                  onClick={() => onActionClick?.(r)}
                  className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-500">Showing 1 to 5 of 10 records</span>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
            <span className="text-[10px]">❮</span> Previous
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">1</button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">2</button>
          <button className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1">
            Next <span className="text-[10px]">❯</span>
          </button>
        </div>
      </div>
    </div>
  );
}
