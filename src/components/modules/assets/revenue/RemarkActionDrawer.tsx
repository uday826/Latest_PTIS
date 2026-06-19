'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Button, Drawer, Label, useToast } from '@/components/common';

interface RemarkActionDrawerProps {
  open: boolean;
  title: string;
  description: string;
  label: string;
  placeholder: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'secondary' | 'success' | 'danger';
  isPending?: boolean;
  onClose: () => void;
  onConfirm: (remark: string) => Promise<void> | void;
}

export function RemarkActionDrawer({
  open,
  title,
  description,
  label,
  placeholder,
  confirmLabel,
  confirmVariant = 'success',
  isPending = false,
  onClose,
  onConfirm,
}: RemarkActionDrawerProps) {
  const t = useTranslations('revenueManagement');
  const [remark, setRemark] = useState('');
  const { error: toastError } = useToast();
  const drawerTitle = (
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-bold tracking-wide text-black">{title}</h2>
    </div>
  );

  useEffect(() => {
    if (open) setRemark('');
  }, [open]);

  const handleConfirm = () => {
    if (!remark.trim()) {
      toastError('Remarks are required.');
      return;
    }

    void onConfirm(remark.trim());
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={drawerTitle}
      width="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isPending}>
            {t('drawers.cancel')}
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="min-h-full bg-slate-50 p-6">
        <p className="mb-6 text-sm font-semibold text-slate-700">{description}</p>

        <div className="space-y-1.5">
          <Label required className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            {label}
          </Label>
          <textarea
            className="h-32 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            placeholder={placeholder}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={isPending}
          />
        </div>
      </div>
    </Drawer>
  );
}
