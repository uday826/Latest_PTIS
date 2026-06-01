'use client';

import React, { useState } from 'react';
import { Search, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '@/components/common/Card';
import { PaymentDetailView } from './PaymentDetailView';

export interface PaymentRecord {
  id: string;
  zone: string;
  wardNo: string;
  assetId: string;
  complexName: string;
  shopNo: string;
  assetName: string;
  tenantName: string;
  mobileNo: string;
  leaseType: string;
  rentDue: number;
  status: 'Unpaid' | 'Paid';
}

const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: '1',
    zone: 'A - पूर्व',
    wardNo: 'प्रभाग क्र. 12',
    assetId: 'MPMS-DS-25',
    complexName: 'अकोट रोड ते अशोक नगर मनपा व्यापारी संकुल',
    shopNo: '15',
    assetName: 'मोहितोष झेरॉक्स',
    tenantName: 'ज्योती संजय महागावकर',
    mobileNo: '9876543210',
    leaseType: 'Rent',
    rentDue: 13212,
    status: 'Unpaid'
  },
  {
    id: '2',
    zone: 'A - पूर्व',
    wardNo: 'प्रभाग क्र. 12',
    assetId: 'MPMS-DS-27',
    complexName: 'अकोट रोड ते अशोक नगर मनपा व्यापारी संकुल',
    shopNo: '17',
    assetName: 'वक्रतुंड गावरान चहा',
    tenantName: 'निर्मलकुमार मुरलीधर आयदासानी',
    mobileNo: '9776543210',
    leaseType: 'Rent',
    rentDue: 11180,
    status: 'Unpaid'
  },
  {
    id: '3',
    zone: 'A - पूर्व',
    wardNo: 'प्रभाग क्र. 12',
    assetId: 'MPMS-DS-62',
    complexName: 'अकोट रोड ते अशोक नगर मनपा व्यापारी संकुल',
    shopNo: '13',
    assetName: 'श्री विद्या हरीश बलसागरा तर्फे संराज भूमि प्रतिष्ठाता',
    tenantName: 'सौ रिपू दर्शन खंडेलवाल व संदेश सुरज खंडेलवाल',
    mobileNo: '9676543210',
    leaseType: 'Rent',
    rentDue: 8785,
    status: 'Unpaid'
  },
  {
    id: '4',
    zone: 'A - पूर्व',
    wardNo: 'प्रभाग क्र. 12',
    assetId: 'MPMS-DS-63',
    complexName: 'अकोट रोड ते अशोक नगर मनपा व्यापारी संकुल',
    shopNo: '14',
    assetName: 'वर्धन स्वरुप संकीर्णशा',
    tenantName: 'वर्धन स्वरुप खंडेलवाल',
    mobileNo: '9576543210',
    leaseType: 'Rent',
    rentDue: 0,
    status: 'Paid'
  },
  {
    id: '5',
    zone: 'B - पश्चिम',
    wardNo: 'प्रभाग क्र. 23',
    assetId: 'MPMS-AS-9',
    complexName: 'कोंडवाडा मनपा व्यापारी संकुल',
    shopNo: '5',
    assetName: 'युगंधर डिझाईन सेंटर',
    tenantName: 'श्री दत्तात्रय शेठले',
    mobileNo: '9476543210',
    leaseType: 'Rent',
    rentDue: 0,
    status: 'Paid'
  }
];

export function PaymentSection() {
  const [records] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(null);

  if (selectedRecord) {
    return <PaymentDetailView record={selectedRecord} onBack={() => setSelectedRecord(null)} />;
  }

  return (
    <div className="space-y-6">
      <Card variant="bordered" padding="none" className="bg-white shadow-sm overflow-hidden border-slate-200">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-800">Search & Filter</h2>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mb-4">Filter payment records by zone, category, and status</p>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Zone</label>
              <select className="w-full h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none">
                <option>विभागीय कार्यालय निवडा</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Ward</label>
              <select className="w-full h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none">
                <option>निवडा</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Asset Category</label>
              <select className="w-full h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none">
                <option>All Categories</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Lease/Rent Type</label>
              <select className="w-full h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none">
                <option>All Types</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Payment Status</label>
              <select className="w-full h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none">
                <option>All Status</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">Smart Search</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by Asset ID, Shop/Plot No..."
                    className="w-full h-9 pl-8 pr-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none placeholder:font-normal"
                  />
                </div>
                <button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-700">
            <thead>
              <tr className="bg-[#1f2937] text-white font-semibold text-[10px] leading-tight">
                <th className="px-4 py-3 border-r border-slate-600/50 w-12 text-center">Sr<br/>No</th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Zone <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Ward<br/>no <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Asset Id <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Complex name <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Shop/Plot<br/>no <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Asset name <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Tenant name <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Mobile<br/>No <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Lease/Rent<br/>type <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">Rent Due<br/>Amount <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 border-r border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors text-center">Status <span className="text-[8px] text-slate-400 opacity-70 ml-1">↑↓</span></th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record, index) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 border-r border-slate-100 text-center font-medium">{index + 1}</td>
                  <td className="px-4 py-3 border-r border-slate-100 font-medium">{record.zone}</td>
                  <td className="px-4 py-3 border-r border-slate-100">{record.wardNo}</td>
                  <td className="px-4 py-3 border-r border-slate-100 font-semibold">{record.assetId}</td>
                  <td className="px-4 py-3 border-r border-slate-100">{record.complexName}</td>
                  <td className="px-4 py-3 border-r border-slate-100 text-center">{record.shopNo}</td>
                  <td className="px-4 py-3 border-r border-slate-100 font-medium">{record.assetName}</td>
                  <td className="px-4 py-3 border-r border-slate-100">{record.tenantName}</td>
                  <td className="px-4 py-3 border-r border-slate-100">{record.mobileNo}</td>
                  <td className="px-4 py-3 border-r border-slate-100 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                      {record.leaseType}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100 font-bold">
                    ₹{record.rentDue.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100 text-center">
                    {record.status === 'Unpaid' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-200 bg-orange-50/50 text-orange-600 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        Unpaid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50/50 text-emerald-600 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Paid
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => setSelectedRecord(record)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      <IndianRupee className="w-3 h-3" />
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Rows per page:</span>
            <select className="h-8 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded outline-none">
              <option>5</option>
              <option>10</option>
              <option>20</option>
            </select>
            <span className="text-xs text-slate-500 ml-2">Showing 1 to 5 of 30 entries</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-700 transition-colors">First</button>
            <button className="px-2 py-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <span className="text-[10px]">❮</span>
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">2</button>
            <span className="text-slate-400 text-xs px-1">...</span>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">6</button>
            <button className="px-2 py-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <span className="text-[10px]">❯</span>
            </button>
            <button className="px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-700 transition-colors">Last</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
