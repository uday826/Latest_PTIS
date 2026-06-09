'use client';
/* eslint-disable i18next/no-literal-string */

import { useState, useTransition } from 'react';
import { Undo2, Loader2 } from 'lucide-react';
import { Button, Drawer, Label, useToast } from '@/components/common';
import type { AssetLeaseRentDetailsListItem } from '@/lib/api/asset/asset-lease-rent-details.service';
import {
  revertToRegistrationAction,
} from '@/app/[locale]/assets/revenue/manage-renters/actions';

export interface RevertRegistrationModalProps {
  record: AssetLeaseRentDetailsListItem;
  onClose: () => void;
}

export function RevertRegistrationModal({ record, onClose }: RevertRegistrationModalProps) {
  const [remarks, setRemarks] = useState('');
  const [isPending, startTransition] = useTransition();
  const { success: toastSuccess, error: toastError } = useToast();

  const handleConfirmRevert = () => {
    if (!remarks.trim()) {
      toastError('Remarks are required for reverting.');
      return;
    }

    startTransition(async () => {
      try {
        const action = revertToRegistrationAction;
        const result = await action(record.id, remarks);

        if (result.success) {
          toastSuccess(result.message || 'Request reverted successfully.');
          onClose();
        } else {
          toastError(result.message || 'Revert action failed.');
        }
      } catch {
        toastError('An unexpected error occurred.');
      }
    });
  };

  const drawerTitle = (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-amber-100 rounded-full">
         <Undo2 className="w-6 h-6 text-amber-600" />
      </div>
      <div>
        <h2 className="font-bold text-base text-slate-800 leading-tight">Revert Request</h2>
        <p className="text-[10px] text-slate-500 font-medium">Provide remarks for reverting this request</p>
      </div>
    </div>
  );

  const drawerFooter = (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={onClose}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleConfirmRevert}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null} Confirm Revert
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
          Are you sure you want to revert this registration request?
        </p>
        
        <div className="space-y-1.5">
          <Label required className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            Revert Remarks
          </Label>
          <textarea 
            className="w-full h-32 p-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder:font-normal placeholder:text-slate-400 resize-none transition-all shadow-sm"
            placeholder="Enter reason or remarks for reverting..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={isPending}
          />
        </div>
      </div>
    </Drawer>
  );
}
