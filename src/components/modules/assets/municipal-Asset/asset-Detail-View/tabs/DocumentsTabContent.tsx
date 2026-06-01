"use client";

import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Eye, 
  Download
} from 'lucide-react';
import { Card, Button } from '@/components/common';
import { useLocale, useTranslations } from 'next-intl';
import type { AssetDetailController, DocumentItem } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';

const formatDate = (dateStr: string | undefined | null, locale: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);
    return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(dateStr);
  }
};

export function DocumentsTabContent({ controller }: { controller: AssetDetailController }): React.JSX.Element {
  const t = useTranslations('municipalAsset');
  const locale = useLocale();
  const {
    asset,
    buildingData,
    detailedData,
    handleViewDocument,
    handleDownloadDocument
  } = controller;

  // 1. Resolve documents dynamically from either asset.documents, detailedData.documents, or properties mapping
  const allDocuments = React.useMemo<DocumentItem[]>(() => {
    // Direct asset documents (API ready)
    const assetDocs = (asset as unknown as Record<string, unknown>).documents;
    if (Array.isArray(assetDocs) && assetDocs.length > 0) {
      return assetDocs as DocumentItem[];
    }

    // Category detailed documents
    const detailedDocs = detailedData?.documents;
    if (Array.isArray(detailedDocs) && detailedDocs.length > 0) {
      return detailedDocs as DocumentItem[];
    }

    // Dynamic metadata-driven backup parser (no mock details imported)
    const sourceData = { ...detailedData, ...buildingData };
    const docDefinitions = [
      { key: 'sanctionedPlanNumber', dateKey: 'sanctionDate', title: t('documentsTab.approvedBuildingPlan'), fileName: 'Approved-Building-Plan.pdf', label: t('documentsTab.planNumber') },
      { key: 'completionCertificateNumber', dateKey: 'completionCertificateDate', title: t('documentsTab.completionCertificate'), fileName: 'Completion-Certificate.pdf', label: t('documentsTab.certificateNumber') },
      { key: 'occupancyCert', dateKey: 'occupancyCertDate', title: t('documentsTab.occupancyCertificate'), fileName: 'Occupancy-Certificate.pdf', label: t('documentsTab.certificateNumber') },
      { key: 'waterMeterNumber', dateKey: 'waterConnectionDate', title: t('documentsTab.waterConnectionDocument'), fileName: 'Water-Connection-Receipt.pdf', label: t('documentsTab.meterNumber') },
      { key: 'solarCapacity', dateKey: 'solarInstallationDate', title: t('documentsTab.solarPanelSystemCertificate'), fileName: 'Solar-Installation-Certificate.pdf', label: t('documentsTab.capacityPanels') },
    ];

    return docDefinitions
      .map(def => ({
        title: def.title,
        number: String(sourceData[def.key] || ''),
        date: String(sourceData[def.dateKey] || ''),
        fileName: def.fileName,
        label: def.label,
        name: def.title
      }))
      .filter(doc => !!doc.number) as DocumentItem[]; // Only display if document number/data is present!
  }, [asset, detailedData, buildingData, t]);

  // Helper renderer for each document block card
  const renderDocCard = (doc: DocumentItem, index: number): React.JSX.Element => {
    const docNum = doc.number || (doc as unknown as Record<string, unknown>).number;
    const isAvailable = !!docNum;

    return (
      <Card
        key={index} 
        className="p-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-xl shadow-sm hover:bg-[#EDF2F9] transition-all duration-200 flex flex-col justify-between"
        padding="none"
      >
        <div>
          {/* Header row with document title and date next to it */}
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#E0E7FF] flex items-center justify-center border border-[#C7D2FE] shrink-0">
                <FileText className="w-4 h-4 text-indigo-700" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 leading-tight truncate" title={doc.name}>
                {doc.name}
              </h4>
            </div>
            {isAvailable && (
              <span className="text-[11px] text-slate-500 font-bold shrink-0">
                {formatDate(doc.uploadDate || doc.date, locale)}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 mt-auto">
          <Button
            disabled={!isAvailable}
            variant="primary"
            size="sm"
            icon={Eye}
            onClick={(): void => handleViewDocument({
              name: doc.name,
              fileData: doc.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              fileName: doc.fileName
            })}
            className="flex-1 text-[11px] font-bold shadow-sm h-8"
          >
            {t('documentsTab.viewDocument')}
          </Button>
          <Button
            disabled={!isAvailable}
            variant="success"
            size="sm"
            icon={Download}
            onClick={(): void => handleDownloadDocument({
              name: doc.name,
              fileData: doc.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              fileName: doc.fileName
            })}
            className="flex-1 text-[11px] font-bold shadow-sm h-8"
          >
            {t('documentsTab.download')}
          </Button>
        </div>
      </Card>
    );
  };

  if (allDocuments.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl min-h-[200px] w-full">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-700">{t('documentsTab.noDocuments')}</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1 mx-auto">{t('documentsTab.noDocumentsDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pr-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allDocuments.map((doc, idx) => renderDocCard(doc, idx))}
      </div>
    </motion.div>
  );
}
