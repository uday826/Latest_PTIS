'use client';
/* eslint-disable i18next/no-literal-string */

import { IndianRupee, Mail, Phone, User } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button, Label } from '@/components/common';
import type { RenterDetailsFormData, RenterDetailsFormProps } from '../../../../types/asset/revenue.types';

export function RenterDetailsForm({ onSuccess, onCancel }: RenterDetailsFormProps) {
  const [formData, setFormData] = useState<RenterDetailsFormData>({
    tenantName: '',
    mobileNo: '',
    email: '',
    category: '',
    assetNumber: '',
    rentAmount: '',
    depositAmount: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantName || !formData.mobileNo || !formData.rentAmount) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }
    toast.success('Renter Registered Successfully!');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
      {/* Form Header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">New Lease & Renter Registration</h3>
        <p className="text-[10px] text-slate-500 font-medium mt-0.5">Register new tenants for municipal assets under strict agreements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category & Asset selection */}
        <div className="space-y-1">
          <Label required className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Asset Category
          </Label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
          >
            <option value="">Select Asset Category</option>
            <option value="shopping-complex">Shopping Complex</option>
            <option value="plot-land">Plot / Open Land</option>
            <option value="garden">Municipal Garden</option>
            <option value="guest-house">Municipal Quarters</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label required className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Asset ID / Number
          </Label>
          <input
            type="text"
            name="assetNumber"
            value={formData.assetNumber}
            onChange={handleChange}
            placeholder="e.g. SHOP-5, PLOT-12"
            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
            required
          />
        </div>

        {/* Tenant Information */}
        <div className="space-y-1">
          <Label required className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Tenant Full Name
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              name="tenantName"
              value={formData.tenantName}
              onChange={handleChange}
              placeholder="e.g. Ramesh Kumar"
              className="w-full pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label required className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Mobile Number
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              placeholder="10-digit number"
              className="w-full pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Email Address
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@domain.com"
              className="w-full pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-1">
          <Label required className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Monthly Rent (₹)
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <IndianRupee className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="number"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              placeholder="e.g. 15000"
              className="w-full pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Security Deposit (₹)
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <IndianRupee className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="number"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleChange}
              placeholder="e.g. 50000"
              className="w-full pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Agreement Dates */}
        <div className="space-y-1">
          <Label required className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Agreement Start Date
          </Label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <Label required className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Agreement End Date
          </Label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
            required
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          size="sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="success"
          size="sm"
        >
          Register & Create Agreement
        </Button>
      </div>
    </form>
  );
}
