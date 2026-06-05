'use client';
/* eslint-disable i18next/no-literal-string */

import { XCircle } from 'lucide-react';
import { Button, Drawer, Label } from '@/components/common';

interface RejectRegistrationRecord {
  assetId?: string;
  grievanceNo?: string;
  assetCategory?: string;
}

interface ModalProps {
  record: RejectRegistrationRecord;
  onClose: () => void;
}

export function RejectRegistrationModal({ record: _record, onClose }: ModalProps) {
  const drawerTitle = (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-red-100 rounded-full">
         <XCircle className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <h2 className="font-bold text-base text-slate-800 leading-tight">Reject Registration</h2>
        <p className="text-[10px] text-slate-500 font-medium">Provide reason for rejection</p>
      </div>
    </div>
  );

  const drawerFooter = (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button variant="danger" size="sm">
        Confirm Rejection
      </Button>
    </>
  );

  return (
    <Drawer
      open={true}
      onClose={onClose}
      title={drawerTitle}
      width="md"
      footer={drawerFooter}
    >
      <div className="p-6 bg-slate-50 min-h-full">
        <p className="text-sm font-semibold text-slate-700 mb-6">
          Are you sure you want to reject this registration?
        </p>
        
        <div className="space-y-1.5">
          <Label required className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            Rejection Reason
          </Label>
          <textarea 
            className="w-full h-32 p-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 placeholder:font-normal placeholder:text-slate-400 resize-none transition-all shadow-sm"
            placeholder="Enter reason for rejection..."
          />
        </div>
      </div>
    </Drawer>
  );
}
