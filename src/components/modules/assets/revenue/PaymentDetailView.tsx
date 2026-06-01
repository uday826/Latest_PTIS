'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Map, Navigation, 
  Home, Building2, User, FileText, 
  Calendar, Eye, Download, Search,
  IndianRupee, CreditCard
} from 'lucide-react';
import { Card } from '@/components/common/Card';

interface PaymentDetailViewProps {
  record: any;
  onBack: () => void;
}

export function PaymentDetailView({ record, onBack }: PaymentDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'make' | 'other' | 'history'>('make');

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header section matching the Figma design */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Lease & Rent Registration</h2>
          <p className="text-xs text-slate-400">Payment Management System</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
          <button 
            onClick={() => setActiveTab('make')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'make' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <span className="flex items-center gap-2">
              <CreditCardIcon className="w-3.5 h-3.5" />
              Make Payment
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('other')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'other' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <span className="flex items-center gap-2">
              <CircleIcon className="w-3.5 h-3.5" />
              Other Payment
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'history' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <span className="flex items-center gap-2">
              <HistoryIcon className="w-3.5 h-3.5" />
              Payment History
            </span>
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Payments</p>
            <p className="text-sm font-black text-blue-600">2</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Amount</p>
            <p className="text-sm font-black text-emerald-600">₹50,000</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Status</p>
            <p className="text-sm font-black text-red-500">Unpaid</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel: Asset Information */}
        <Card variant="bordered" padding="none" className="bg-white overflow-hidden flex flex-col h-full border-slate-200">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="p-1 bg-blue-100 text-blue-600 rounded">
              <ShieldIcon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-700">Asset Information</h3>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {/* Map Header Card */}
            <div className="relative h-32 rounded-xl bg-slate-100 overflow-hidden mb-4 border border-slate-200">
              {/* Mock Map Background */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-300"></div>
              
              {/* Blue Overlay Card */}
              <div className="absolute inset-x-4 bottom-4 bg-blue-600 rounded-lg p-3 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-[10px] font-bold opacity-90 uppercase tracking-wide">Asset ID:</span>
                  <span className="text-xs font-black">{record.assetId}</span>
                </div>
                <p className="text-[10px] font-medium opacity-80">Complex name</p>
                <p className="text-xs font-bold leading-tight">{record.complexName}</p>
                <p className="text-[10px] leading-tight opacity-90 mt-0.5">{record.assetName}</p>
              </div>

              {/* Pin Icon */}
              <div className="absolute top-4 right-1/3 bg-blue-500 p-1.5 rounded-full text-white shadow-md border-2 border-white">
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2">
                <div className="p-1 rounded bg-blue-100 text-blue-600 mt-0.5"><Map className="w-3 h-3" /></div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Zone</p>
                  <p className="text-[11px] font-bold text-slate-800">{record.zone}</p>
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2">
                <div className="p-1 rounded bg-purple-100 text-purple-600 mt-0.5"><Navigation className="w-3 h-3" /></div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Ward No</p>
                  <p className="text-[11px] font-bold text-slate-800">{record.wardNo}</p>
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2">
                <div className="p-1 rounded bg-emerald-100 text-emerald-600 mt-0.5"><Home className="w-3 h-3" /></div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Shop/Plot No</p>
                  <p className="text-[11px] font-bold text-slate-800">{record.shopNo}</p>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2 mb-3">
              <div className="p-1 rounded bg-orange-100 text-orange-600 mt-0.5"><MapPin className="w-3 h-3" /></div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase">Complex Address</p>
                <p className="text-[11px] font-bold text-slate-800">{record.complexName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2">
                <div className="p-1 rounded bg-teal-100 text-teal-600 mt-0.5"><Building2 className="w-3 h-3" /></div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Asset Category</p>
                  <p className="text-[11px] font-bold text-slate-800">Shopping Complex</p>
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2">
                <div className="p-1 rounded bg-rose-100 text-rose-600 mt-0.5"><FileText className="w-3 h-3" /></div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Asset Name</p>
                  <p className="text-[11px] font-bold text-slate-800">{record.assetName}</p>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2 mb-3">
              <div className="p-1 rounded bg-indigo-100 text-indigo-600 mt-0.5"><User className="w-3 h-3" /></div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase">Tenant Name</p>
                <p className="text-[11px] font-bold text-slate-800">{record.tenantName}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-100 text-blue-600"><FileText className="w-3 h-3" /></div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Lease Type</p>
                  <span className="inline-block px-2 py-0.5 mt-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-full">{record.leaseType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-cyan-100 text-cyan-600"><Calendar className="w-3 h-3" /></div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Finance Year</p>
                  <p className="text-[11px] font-bold text-slate-800">2025</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>
        </Card>

        {/* Right Panel: Dynamic Tab Content */}
        <Card variant="bordered" padding="none" className={`bg-white overflow-hidden flex flex-col h-full border-slate-200 ${activeTab === 'make' ? 'bg-slate-50/30' : ''}`}>
          {activeTab === 'make' && (
            <div className="flex-1 flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded">
                    <IndianRupeeIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-700">Make a Payment</h3>
                </div>
                <div className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-600 shadow-sm">
                  Finance Year: 2025
                </div>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-orange-500 text-white text-[10px] font-bold">▲</div>
                      <span className="text-xs font-bold text-orange-800">Pending Demand</span>
                    </div>
                    <p className="text-xl font-black text-orange-600">₹ 6,606</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500 text-white text-[10px] font-bold">✓</div>
                      <span className="text-xs font-bold text-emerald-800">Current Demand</span>
                    </div>
                    <p className="text-xl font-black text-emerald-600">₹ 6,606</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-red-50/50 border border-red-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">%</div>
                      <span className="text-xs font-bold text-red-700">Penalty (2%)</span>
                    </div>
                    <span className="text-sm font-black text-red-600">₹ 132.12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50/50 border border-purple-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-700 ml-7">GST (18%)</span>
                    </div>
                    <span className="text-sm font-black text-purple-600">₹ 1,212.86</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                    <span className="text-sm font-bold text-blue-900">Total Amount</span>
                    <span className="text-xl font-black text-blue-700">₹ 7,951</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">Mobile Number <span className="text-red-500">*</span></label>
                      <input type="text" defaultValue={record.mobileNo} className="w-full h-9 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">Email Address <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Enter email" className="w-full h-9 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 placeholder:text-slate-400" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">Payment Mode <span className="text-red-500">*</span></label>
                      <select className="w-full h-9 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-slate-500">
                        <option>Select Mode</option>
                        <option>UPI</option>
                        <option>Card</option>
                        <option>Net Banking</option>
                        <option>Cash</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold text-slate-600">Payment Type</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="payType" className="w-3.5 h-3.5 accent-blue-600" />
                        <span className="text-xs font-medium text-slate-600">Monthly</span>
                      </label>
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-500 bg-blue-50/50 rounded-lg cursor-pointer">
                        <input type="radio" name="payType" defaultChecked className="w-3.5 h-3.5 accent-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Pending</span>
                      </label>
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="payType" className="w-3.5 h-3.5 accent-blue-600" />
                        <span className="text-xs font-medium text-slate-600">Partial</span>
                      </label>
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="payType" className="w-3.5 h-3.5 accent-blue-600" />
                        <span className="text-xs font-medium text-slate-600">Total</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <IndianRupeeIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-black text-slate-800">7,951</span>
                    </div>
                    <button className="flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-bold text-xs shadow-sm">
                      <LockIcon className="w-3.5 h-3.5" />
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'other' && (
            <div className="flex-1 flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded">
                    <IndianRupeeIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-700">Other Payment</h3>
                </div>
                <div className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-600 shadow-sm">
                  Finance Year: 2025
                </div>
              </div>
              
              <div className="p-5 flex-1">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">Mobile Number <span className="text-red-500">*</span></label>
                      <input type="text" defaultValue={record.mobileNo} className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">Email ID <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Enter email" className="w-full h-10 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 placeholder:text-slate-400" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">Payment Type <span className="text-red-500">*</span></label>
                      <select className="w-full h-10 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-slate-500">
                        <option>Select Type</option>
                        <option>Deposit</option>
                        <option>Penalty</option>
                        <option>Transfer Fee</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600">Payment Mode <span className="text-red-500">*</span></label>
                      <select className="w-full h-10 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-slate-500">
                        <option>Select Mode</option>
                        <option>UPI</option>
                        <option>Card</option>
                        <option>Cash</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-4 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-lg w-40">
                      <IndianRupeeIcon className="w-4 h-4 text-slate-500" />
                      <input type="text" defaultValue="0" className="w-full bg-transparent outline-none font-bold text-sm text-slate-800" />
                    </div>
                    <button className="flex items-center justify-center gap-1.5 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-bold text-xs shadow-sm">
                      <LockIcon className="w-3.5 h-3.5" />
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="flex-1 flex flex-col h-full bg-white">
              <div className="p-4 bg-gradient-to-r from-indigo-900 to-indigo-700 text-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="w-4 h-4 text-indigo-200" />
                  <h3 className="font-bold text-white">Transaction History</h3>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col h-full">
                <div className="mb-4 ml-auto w-64">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="w-full h-9 pl-9 pr-3 text-xs font-medium bg-white border border-slate-200 rounded-full outline-none focus:border-blue-500 placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="px-4 py-3">Receipt No</th>
                        <th className="px-4 py-3">Fin. Year</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Date & Time</th>
                        <th className="px-4 py-3">Mode</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-700">RCP-2024-001</td>
                        <td className="px-4 py-3 text-slate-600">2025</td>
                        <td className="px-4 py-3 font-bold text-emerald-600">₹25,000</td>
                        <td className="px-4 py-3 text-slate-500">
                          <div>2024-11-20</div>
                          <div className="text-[10px]">10:30:45</div>
                        </td>
                        <td className="px-4 py-3"><span className="text-blue-600 font-medium">Online</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-700">RCP-2024-002</td>
                        <td className="px-4 py-3 text-slate-600">2025</td>
                        <td className="px-4 py-3 font-bold text-emerald-600">₹25,000</td>
                        <td className="px-4 py-3 text-slate-500">
                          <div>2024-10-20</div>
                          <div className="text-[10px]">02:15:30</div>
                        </td>
                        <td className="px-4 py-3"><span className="text-blue-600 font-medium">QR</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-500">Showing 1 to 2 of 2 entries</span>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50 transition-colors">
                      <span className="text-[10px]">❮</span>
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white font-bold rounded shadow-sm text-xs">
                      1
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50 transition-colors">
                      <span className="text-[10px]">❯</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Minimal icon components to match lucide styles for custom or specific named icons used in Figma
function CreditCardIcon(props: any) {
  return <CreditCard {...props} />;
}
function CircleIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );
}
function HistoryIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
      <path d="M3 3v5h5"></path>
      <path d="M12 7v5l4 2"></path>
    </svg>
  );
}
function ShieldIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}
function IndianRupeeIcon(props: any) {
  return <IndianRupee {...props} />;
}
function LockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

