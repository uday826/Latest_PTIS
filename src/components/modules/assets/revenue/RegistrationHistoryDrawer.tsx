import { useEffect, useState, useTransition } from 'react';
import { Building2, Calendar, FileText, Clock, Loader2 } from 'lucide-react';
import { Button, Drawer, Label, useToast } from '@/components/common';
import type { RegistrationHistoryModalProps } from '../../../../types/asset/revenue.types';
import { getPreviousTenantHistoryAction } from '@/app/[locale]/assets/revenue/manage-renters/actions';
import type { PreviousTenantHistoryItem } from '@/lib/api/asset/asset-lease-rent-details.service';

export function RegistrationHistoryModal({ record, onClose }: RegistrationHistoryModalProps) {
  const [historyItems, setHistoryItems] = useState<PreviousTenantHistoryItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const { error: toastError } = useToast();

  useEffect(() => {
    if (!record.id) return;
    startTransition(async () => {
      try {
        const items = await getPreviousTenantHistoryAction(Number(record.id));
        setHistoryItems(items);
      } catch {
        toastError('Failed to load registration history.');
      }
    });
  }, [record.id, toastError]);

  const drawerTitle = (
    <div className="flex items-center gap-3">
      <div className="p-1.5 border border-purple-200 bg-purple-50 rounded-lg">
        <Clock className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <h2 className="font-bold text-base text-slate-800 leading-tight">Registration History</h2>
        <p className="text-[10px] text-slate-500 font-medium">View complete history and changes</p>
      </div>
    </div>
  );

  const drawerFooter = (
    <Button onClick={onClose} variant="primary" size="sm">
      Close
    </Button>
  );

  return (
    <Drawer open={true} onClose={onClose} title={drawerTitle} width="md" footer={drawerFooter}>
      <div className="p-5 bg-slate-100 min-h-full space-y-4">
        {/* Card 1: Asset & Tenant Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">
                {record.shopName || '-'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Registration ID: {record.id || '-'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Category', value: record.category || '-' },
              { label: 'Tenant Name', value: record.tenantName || '-' },
              { label: 'Lease Type', value: record.leaseType || '-' }
            ].map((f, i) => (
              <div key={i} className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500">{f.label}</Label>
                <div className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Status Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-800">Status Timeline</h3>
          </div>
          
          {isPending ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : historyItems.length > 0 ? (
            <div className="space-y-6 relative border-l border-slate-100 pl-4 ml-2">
              {historyItems.map((item, index) => (
                <div key={item.id || index} className="relative">
                  <div className="absolute -left-6 mt-1.5 w-3 h-3 rounded-full bg-purple-600 border-2 border-white shadow-sm" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm">
                        {item.actionLabel || item.actionType}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(item.performedDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Status: <span className="font-bold text-purple-700">{item.toStatus}</span>
                      {item.remarks ? ` | Remarks: "${item.remarks}"` : ''}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Tenant: {item.tenantName} ({item.tenantMobile})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center font-medium">No timeline history records found.</p>
          )}
        </div>

        {/* Card 3: Current Lease Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-800">Lease Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Lease Type', value: record.leaseType || 'Rent' },
              { label: 'Rent Amount', value: record.rentAmount != null ? `₹ ${record.rentAmount.toLocaleString('en-IN')}` : '-' },
              { label: 'Payment Frequency', value: record.paymentFrequency || 'Monthly' }
            ].map((f, i) => (
              <div key={i} className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500">{f.label}</Label>
                <div className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
