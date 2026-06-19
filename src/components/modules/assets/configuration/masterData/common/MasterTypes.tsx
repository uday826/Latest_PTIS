'use client';

import { Layers, Box, Calculator, AlertCircle, Home, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/common/Card';
import { type MasterTypesProps, type MasterDataType, type MasterId, MASTER_IDS } from '@/types/asset-type/master-data.types';

const iconMap: Record<string, LucideIcon> = { 
  [MASTER_IDS.TYPE]: Layers, 
  [MASTER_IDS.CATEGORY]: Box,
  [MASTER_IDS.INVENTORY_CATEGORY]: Box,
  [MASTER_IDS.INVENTORY_MODEL]: Box,
  [MASTER_IDS.INVENTORY_NAME]: Layers,
  [MASTER_IDS.INVENTORY_CONDITION]: Layers,
  [MASTER_IDS.OWNERSHIP_TYPE]: Box,
  [MASTER_IDS.OWNING_DEPARTMENT]: Box,
  [MASTER_IDS.TAX]: Calculator,
  [MASTER_IDS.PENALTY]: AlertCircle,
  [MASTER_IDS.ROOM_TYPE]: Home,
};

export function MasterTypes({ selected, onSelect, masterTypes }: MasterTypesProps & { masterTypes: MasterDataType[] }) {
  const t = useTranslations('asset.configuration.masterData');
  const mt = useTranslations('asset.masterNames');

  return (
    <Card
      variant="bordered"
      padding="none"
      className="w-full h-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md flex flex-col"
    >
      {/* Header */}
      <div className="h-[54px] shrink-0 bg-[#33445c] text-white px-5 flex items-center gap-2">
        <Layers size={16} className="stroke-[2.2]" />
        <span className="font-semibold text-[15px]">{t('masterTypes')}</span>
      </div>

      <div className="p-3 space-y-2.5 flex-1 overflow-y-auto">
        {(masterTypes || []).map((item) => {
          const Icon = iconMap[item.id] || Layers;
          const isActive = selected === item.id;
          const localizedName = mt(item.id as MasterId) || item.name;
          return (
            <div key={item.id} onClick={() => onSelect(item.id)} className={`h-[52px] rounded-[10px] border px-3 flex items-center gap-3 cursor-pointer transition-all ${isActive ? 'bg-[#0b89a3] border-[#0b89a3] text-white shadow-sm' : 'bg-[#f8fafc] border-[#d9dee5] hover:bg-[#f1f5f9]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/10' : 'bg-[#0b89a3]'}`}><Icon size={17} className="text-white" strokeWidth={2} /></div>
              <div className="min-w-0 leading-tight">
                <div className={`text-[14px] font-semibold truncate ${isActive ? 'text-white' : 'text-[#0f172a]'}`}>{localizedName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
