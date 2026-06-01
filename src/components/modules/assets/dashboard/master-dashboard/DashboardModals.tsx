'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, Button } from '@/components/common';
import type { MunicipalAsset, DashboardAuctionDetail } from '@/types/asset-type/asset-dashboard.types';

const MotionCard = motion.create(Card);
const CLOSE_CLS = 'p-1.5 text-white hover:bg-white/20 hover:text-white rounded-lg min-w-0 h-auto px-0 bg-transparent border-0 flex items-center justify-center shadow-none';

export function EncroachmentModal({ assets, onClose }: { assets: MunicipalAsset[]; onClose: () => void }) {
  const t = useTranslations('assetmasterdashboard');
  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
      <MotionCard initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} variant="default" padding="none" className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8" /><div><h2 className="text-xl font-bold">{t('encroachmentAlerts')}</h2><p className="text-red-100 text-xs">{t('activeEncroachmentsCases', { count: assets.length })}</p></div></div>
          <Button variant="ghost" onClick={onClose} className={CLOSE_CLS}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(85vh-90px)] space-y-3 bg-gray-50">
          {assets.map(a => <div key={a.id} className="bg-white border border-red-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><div><h4 className="text-sm font-bold text-gray-900 mb-1">{a.name}</h4><p className="text-xs text-gray-500">{t('location')}: {a.location} | {t('zone')}: {a.zone}</p></div></div>)}
        </div>
      </MotionCard>
    </div>
  );
}

export function AuctionDetailModal({ detail, onClose }: { detail: DashboardAuctionDetail; onClose: () => void }) {
  const t = useTranslations('assetmasterdashboard');
  const rows = [{ l: t('amount'), v: detail.bid.amount }, { l: t('bids'), v: detail.bid.bids }, { l: t('time'), v: detail.bid.time }, { l: t('updated'), v: new Date(detail.bid.timestamp).toLocaleString() }];
  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
      <MotionCard initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} variant="default" padding="none" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex justify-between items-center">
          <div><h2 className="text-xl font-bold">{t('auctionActivity')}</h2><p className="text-blue-100 text-xs capitalize">{detail.type}{' - Item #'}{detail.index + 1}</p></div>
          <Button variant="ghost" onClick={onClose} className={CLOSE_CLS}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-5 bg-gray-50 space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4"><h3 className="text-sm font-bold text-gray-900">{detail.bid.property}</h3><p className="text-xs text-gray-500 mt-1">{t('auctionId')}: {detail.bid.auctionId}</p></div>
          <div className="grid grid-cols-2 gap-3 text-sm">{rows.map(r => <div key={r.l} className="rounded-xl border border-gray-200 bg-white p-3"><p className="text-xs font-semibold text-gray-500">{r.l}</p><p className="text-base font-bold text-gray-900">{r.v}</p></div>)}</div>
        </div>
      </MotionCard>
    </div>
  );
}
