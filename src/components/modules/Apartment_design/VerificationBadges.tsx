import React from 'react';
import { 
  CheckCircle2, 
  Wallet, 
  UserCheck, 
  Droplet, 
  ShieldCheck, 
  Briefcase, 
  Link2,
  BarChart3
} from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

export default function VerificationBadges() {
  return (
    <div className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm text-[10px] flex items-center justify-between gap-x-1.5 shrink-0 select-none h-[40px] xl:h-[42px] overflow-x-auto no-scrollbar whitespace-nowrap w-full">
      <StatusBadge icon={<CheckCircle2 size={12} className="text-green-600" />} title="GIS Verified" status="Verified" statusColor="text-green-600" />
      <StatusBadge icon={<CheckCircle2 size={12} className="text-green-600" />} title="Assessment" status="Completed" statusColor="text-green-600" />
      <StatusBadge icon={<Wallet size={12} className="text-green-600" />} title="Collection Status" status="On Track" statusColor="text-green-600" />
      <StatusBadge icon={<Droplet size={12} className="text-blue-600" />} title="Water Connection" status="Active" statusColor="text-green-600" isBlue />
      <StatusBadge icon={<ShieldCheck size={12} className="text-green-600" />} title="Fire NOC" status="Valid" statusColor="text-green-600" />
      <StatusBadge icon={<Briefcase size={12} className="text-green-600" />} title="Trade License" status="Active" statusColor="text-green-600" />
      <StatusBadge icon={<Link2 size={12} className="text-green-600" />} title="BPMS Linked" status="Active" statusColor="text-green-600" />
      <StatusBadge icon={<BarChart3 size={12} className="text-green-600" />} title="Survey Completion" status="96%" statusColor="text-green-600" />
    </div>
  );
}
