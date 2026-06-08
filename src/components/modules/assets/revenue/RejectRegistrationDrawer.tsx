'use client';
/* eslint-disable i18next/no-literal-string */

import { useState, useTransition } from 'react';
import { XCircle, Loader2 } from 'lucide-react';
import { Button, Drawer, Label, useToast } from '@/components/common';
import type { RejectRegistrationModalProps } from '../../../../types/asset/revenue.types';
import { rejectAction } from '@/app/[locale]/assets/revenue/manage-renters/actions';

export function RejectRegistrationModal({ record, onClose }: RejectRegistrationModalProps) {
  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();
  const { success: toastSuccess, error: toastError } = useToast();

  const handleConfirmRejection = () => {
    if (!reason.trim()) {
      toastError('Reason is required for rejection.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await rejectAction(record.id, reason);
        if (result.success) {
          toastSuccess(result.message || 'Request rejected successfully.');
          onClose();
        } else {
          toastError(result.message || 'Rejection failed.');
        }
      } catch {
        toastError('An unexpected error occurred.');
      }
    });
  };

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
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleConfirmRejection}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null} Confirm Rejection
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
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
          />
        </div>
      </div>
    </Drawer>
  );
}
