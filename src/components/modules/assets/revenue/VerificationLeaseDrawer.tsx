import { useEffect, useState, useTransition, useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FileCheck2,
  FileText,
  Grid,
  Image as ImageIcon,
  ShieldX,
  User,
  Users,
  X,
  FolderOpen,
  Building2,
  MapPinned,
} from 'lucide-react';
import { Button, Drawer, MasterTable, type Column, useToast } from '@/components/common';
import type { VerificationLeaseModalProps } from '../../../../types/asset/revenue.types';
import { verifyAction, approveAction, getPreviousTenantHistoryAction } from '@/app/[locale]/assets/revenue/manage-renters/actions';
import { fetchAssetDocumentFile } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
import type { AssetDocumentListItem } from '@/types/municipal-asset/detail-tabs.types';
import {
  DocumentPreviewDrawer,
  isImage,
  type LoadedDocumentFile,
  parseFileNameFromDisposition,
} from '@/components/modules/assets/municipal-Asset/detail-tabs/documentHelpers';
import { RemarkActionDrawer } from './RemarkActionDrawer';

import { useTranslations } from 'next-intl';

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function toDisplay(value: unknown): string {
  if (isBlank(value)) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function toCurrencyDisplay(value: unknown): string {
  if (isBlank(value)) return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString('en-IN');
}

function toDateDisplay(value: unknown): string {
  if (typeof value !== 'string' || !value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN');
}

function getFileTitle(documentItem: AssetDocumentListItem): string {
  return documentItem.name || documentItem.fileName || 'Document';
}

function InfoCard({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm flex flex-col items-center justify-center">
      <span className="absolute -top-3 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
        {label}
      </span>
      <span className="text-sm font-black text-slate-800 mt-2">{toDisplay(value)}</span>
    </div>
  );
}

interface OverviewTableRow extends Record<string, unknown> {
  zoneNo: string;
  wardNo: string;
  unitName: string;
  shopNumber: string;
  shopActNumber: string;
}

interface ConstructionTableRow extends Record<string, unknown> {
  shopNo: string;
  shopArea: string;
  renterName: string;
  monthlyRent: string;
  bharaniKaalavadi: number;
  status: string;
}

export function VerificationLeaseModal({
  record,
  onClose,
  assetDetails = null,
  documents = [],
  assetPhotosAndPlans = [],
}: VerificationLeaseModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('revenueManagement');

  const { success: toastSuccess, error: toastError } = useToast();
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  const [selectedDocument, setSelectedDocument] = useState<AssetDocumentListItem | null>(null);
  const [loadedFile, setLoadedFile] = useState<LoadedDocumentFile | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});
  const [remarkDrawerOpen, setRemarkDrawerOpen] = useState(false);
  const [remarkAction, setRemarkAction] = useState<'send' | 'approve'>('send');

  const revokeLoadedFile = useCallback(() => {
    setLoadedFile((current) => {
      if (current?.objectUrl) URL.revokeObjectURL(current.objectUrl);
      return null;
    });
  }, []);

  useEffect(() => revokeLoadedFile, [revokeLoadedFile]);

  useEffect(() => {
    if (!record.id) return;
    const loadHistory = async () => {
      try {
        const items = await getPreviousTenantHistoryAction(Number(record.id));
        setHistoryItems(items);
      } catch {
        console.error('Failed to load previous tenant history.');
      }
    };
    loadHistory();
  }, [record.id]);

  const readDocumentFile = useCallback(async (documentItem: AssetDocumentListItem) => {
    const result = await fetchAssetDocumentFile(documentItem.id);
    if (result.error || !result.base64) {
      throw new Error(result.error || 'Unable to load this file.');
    }

    const binaryStr = atob(result.base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const blob = new Blob([bytes], {
      type: result.contentType || documentItem.contentType || 'application/octet-stream',
    });
    const fileName =
      parseFileNameFromDisposition(result.contentDisposition) ||
      documentItem.fileName ||
      documentItem.name;

    return {
      objectUrl: URL.createObjectURL(blob),
      contentType: result.contentType || documentItem.contentType || 'application/octet-stream',
      fileName,
    } satisfies LoadedDocumentFile;
  }, []);

  const readDocumentThumbnailSrc = useCallback(async (documentItem: AssetDocumentListItem) => {
    const result = await fetchAssetDocumentFile(documentItem.id);
    if (result.error || !result.base64) {
      throw new Error(result.error || 'Unable to load this file.');
    }

    const contentType = result.contentType || documentItem.contentType || 'application/octet-stream';
    return `data:${contentType};base64,${result.base64}`;
  }, []);

  const loadDocumentFile = useCallback(
    async (documentItem: AssetDocumentListItem) => {
      revokeLoadedFile();
      setIsLoadingFile(true);
      setFileError(null);

      try {
        const file = await readDocumentFile(documentItem);
        setLoadedFile(file);
      } catch (error) {
        setFileError(error instanceof Error ? error.message : 'Unable to load this file.');
      } finally {
        setIsLoadingFile(false);
      }
    },
    [readDocumentFile, revokeLoadedFile]
  );

  const openDocument = useCallback(
    (documentItem: AssetDocumentListItem) => {
      setSelectedDocument(documentItem);
      void loadDocumentFile(documentItem);
    },
    [loadDocumentFile]
  );

  const closePreview = useCallback(() => {
    setSelectedDocument(null);
    setFileError(null);
    setIsLoadingFile(false);
    revokeLoadedFile();
  }, [revokeLoadedFile]);

  const downloadDocument = useCallback(() => {
    if (!selectedDocument) return;

    if (!loadedFile) {
      void loadDocumentFile(selectedDocument);
      return;
    }

    const link = document.createElement('a');
    link.href = loadedFile.objectUrl;
    link.download = loadedFile.fileName || selectedDocument.fileName || selectedDocument.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [loadDocumentFile, loadedFile, selectedDocument]);

  const documentCards = useMemo(() => {
    return documents
      .filter((doc) => {
        const name = (doc.name || '').toLowerCase();
        return name === 'aadhar' || name === 'pan';
      })
      .map((doc) => ({
        ...doc,
        label: getFileTitle(doc),
        isImage: isImage(doc.contentType || '', doc.fileName || doc.name || ''),
      }));
  }, [documents]);

  const mediaCards = useMemo(() => {
    return assetPhotosAndPlans.map((doc) => ({
      ...doc,
      label: getFileTitle(doc),
      isImage: isImage(doc.contentType || '', doc.fileName || doc.name || ''),
    }));
  }, [assetPhotosAndPlans]);

  const getMediaSearchText = (doc: AssetDocumentListItem) =>
    `${doc.name || ''} ${doc.fileName || ''} ${(doc as any).documentTitle || ''} ${(doc as any).bindingPurpose || ''}`.toLowerCase();

  const leftMediaPanels = [
    {
      title: t('drawers.assetPhoto'),
      doc:
        mediaCards.find((doc) => {
          const name = getMediaSearchText(doc);
          return (
            (name.includes('asset image') ||
              name.includes('asset photo') ||
              name.includes('on spot') ||
              name.includes('photo')) &&
            !name.includes('plan')
          );
        }) ?? null,
      fallbackIcon: Building2,
      fallbackText: t('drawers.assetPhoto'),
    },
    {
      title: t('drawers.opPlan'),
      doc: mediaCards.find((doc) => {
        const name = getMediaSearchText(doc);
        return name.includes('op plan') || (name.includes('plan') && !name.includes('dp plan') && !name.includes('asset photo plan'));
      }) ?? null,
      fallbackIcon: Grid,
      fallbackText: t('drawers.opPlan'),
    },
    {
      title: t('drawers.dpPlan'),
      doc: mediaCards.find((doc) => {
        const name = getMediaSearchText(doc);
        return name.includes('dp plan') || name.includes('asset photo plan') || name.includes('digital plan');
      }) ?? null,
      fallbackIcon: MapPinned,
      fallbackText: t('drawers.dpPlan'),
    },
  ] as const;

  useEffect(() => {
    const imageDocuments = [...documentCards, ...mediaCards].filter((doc) => doc.isImage);
    if (imageDocuments.length === 0) {
      void Promise.resolve().then(() => setThumbnailUrls({}));
      return;
    }

    let cancelled = false;

    const loadThumbnails = async () => {
      const entries = await Promise.all(
        imageDocuments.map(async (doc) => {
          try {
            const src = await readDocumentThumbnailSrc(doc);
            return [String(doc.id), src] as const;
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      const nextThumbs: Record<string, string> = {};
      entries.forEach((entry) => {
        if (!entry) return;
        nextThumbs[entry[0]] = entry[1];
      });
      setThumbnailUrls(nextThumbs);
    };

    void loadThumbnails();

    return () => {
      cancelled = true;
    };
  }, [documentCards, mediaCards, readDocumentThumbnailSrc]);

  const handleRevertClick = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('drawerRevertId', String(record.id));
    nextParams.delete('drawerVerificationId');
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    router.refresh();
  };

  const isVerified = String(record.workflowStatus).toLowerCase() === 'verified';

  const handleOpenRemarkDrawer = () => {
    setRemarkAction(isVerified ? 'approve' : 'send');
    setRemarkDrawerOpen(true);
  };

  const handleRemarkConfirm = (remarks: string) => {
    startTransition(async () => {
      try {
        const action = remarkAction === 'approve' ? approveAction : verifyAction;
        const result = await action(record.id, remarks);

        if (result.success) {
          toastSuccess(result.message || 'Workflow step processed successfully.');
          setRemarkDrawerOpen(false);
          onClose();
        } else {
          toastError(result.message || 'Workflow step failed.');
        }
      } catch {
        toastError('An unexpected error occurred.');
      }
    });
  };

  const asset = assetDetails as Record<string, any> | null;

  const currentTenantFields = [
    { l: `${t('drawers.srNo')}:`, v: toDisplay(record.id), l2: `${t('tables.cols.duration')}:`, v2: record.duration ?? '0' },
    { l: `${t('drawers.form.applicationType')}:`, v: record.applicationTypeName ?? '-', l2: `${t('drawers.leasePeriod')}:`, v2: `${toDateDisplay(record.leaseStartDate)} - ${toDateDisplay(record.leaseEndDate)}` },
    { l: `${t('tables.cols.tenantName')}:`, v: record.tenantName ?? '-', vClass: 'font-bold text-slate-900', l2: `${t('tables.cols.rentAmount')}:`, v2: record.monthlyRent != null ? `₹ ${toCurrencyDisplay(record.monthlyRent)}` : '-', v2Class: 'font-bold text-red-600' },
    { l: `${t('drawers.form.mobileNumber')}:`, v: record.tenantMobile ?? '-', l2: `${t('drawers.form.securityDeposit')}:`, v2: record.securityDeposit != null ? `₹ ${toCurrencyDisplay(record.securityDeposit)}` : '-' },
    { l: `${t('drawers.form.tenantType')}:`, v: record.tenantType ?? '-', l2: `${t('drawers.form.paymentFrequency')}:`, v2: record.paymentFrequency ?? '-' },
    { l: `${t('drawers.form.emailAddress')}:`, v: record.tenantEmail ?? '-', l2: `${t('drawers.form.aadhaarNumber')}:`, v2: record.tenantAadhaarNo ?? '-' },
    { l: `${t('drawers.form.panNumber')}:`, v: record.tenantPanCardNo ?? '-', l2: `${t('drawers.statusActive')}:`, v2: toDisplay(record.isActive) },
  ];

  const assetNumber = asset?.assetNo ?? '-';
  const buildingAssetName = asset?.assetName ?? '-';
  const assetCategory = asset?.assetCategoryName ?? '-';
  const shopNameVal = record.shopName ?? '-';
  const overviewColumns: Column<OverviewTableRow>[] = [
    { key: 'zoneNo', label: t('drawers.cols.zoneNo'), align: 'center', width: '120px', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'wardNo', label: t('drawers.cols.wardNo'), align: 'center', width: '120px', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'unitName', label: t('drawers.cols.unitName'), align: 'center', width: '170px', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'shopNumber', label: t('drawers.cols.unitNumber'), align: 'center', width: '110px', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'shopActNumber', label: t('drawers.cols.unitActNumber'), align: 'center', width: '120px', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
  ];

  const overviewData: OverviewTableRow[] = [
    {
      zoneNo: toDisplay(asset?.zoneName),
      wardNo: toDisplay(asset?.wardName),
      unitName: record.shopName ?? '-',
      shopNumber: record.shopNo ?? '-',
      shopActNumber: asset?.assetTypeId != null ? String(asset.assetTypeId) : '-',
    },
  ];

  const constructionColumns: Column<ConstructionTableRow>[] = [
    { key: 'shopNo', label: t('drawers.cols.unitNumber'), align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopArea', label: t('drawers.cols.unitArea'), align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'renterName', label: t('tables.cols.tenantName'), align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'monthlyRent', label: t('tables.cols.rentAmount'), align: 'center', cellClassName: 'whitespace-nowrap text-red-600 font-semibold' },
    { key: 'bharaniKaalavadi', label: t('tables.cols.duration'), align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'status', label: t('tables.cols.status'), align: 'center', cellClassName: 'whitespace-nowrap' },
  ];

  const constructionData: ConstructionTableRow[] = [
    {
      shopNo: record.shopNo ?? '-',
      shopArea: record.totalAreaSqFt != null ? Number(record.totalAreaSqFt).toFixed(2) : '-',
      renterName: record.tenantName ?? '-',
      monthlyRent: record.monthlyRent != null ? `₹ ${toCurrencyDisplay(record.monthlyRent)}` : '-',
      bharaniKaalavadi: record.duration ?? 0,
      status: record.workflowStatus ?? '-',
    },
  ];

  const currentMonthlyRentVal = record.previousMonthlyRent ?? 0;
  const revisedRentVal = record.monthlyRent ?? 0;
  const totalMonthlyRentVal = record.monthlyRent ?? 0;
  const expectedAnnualRentVal = totalMonthlyRentVal ? totalMonthlyRentVal * 12 : undefined;

  const rentSummaryRows = [
    { l: t('rentSummary.currentRent'), v: currentMonthlyRentVal ? `₹ ${toCurrencyDisplay(currentMonthlyRentVal)}` : '-' },
    { l: t('rentSummary.revisedRent'), v: revisedRentVal ? `₹ ${toCurrencyDisplay(revisedRentVal)}` : '-' },
    { l: t('rentSummary.totalMonthlyRent'), v: totalMonthlyRentVal ? `₹ ${toCurrencyDisplay(totalMonthlyRentVal)}` : '-' },
    { l: t('rentSummary.expectedAnnualRent'), v: expectedAnnualRentVal ? `₹ ${toCurrencyDisplay(expectedAnnualRentVal)}` : '-' },
  ];

  return (
    <Drawer
      open={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-black" />
          <h2 className="font-bold text-sm tracking-wide text-black">{t('tabs.verification')}</h2>
        </div>
      }
      width="xl"
      footer={
        <>
          <Button onClick={onClose} variant="secondary" size="sm" icon={X} disabled={isPending}>
            {t('drawers.cancel')}
          </Button>
          <Button variant="danger" size="sm" icon={ShieldX} onClick={handleRevertClick} disabled={isPending}>
            {t('drawers.revertRequest')}
          </Button>
          {isVerified ? (
            <Button variant="success" size="sm" icon={FileCheck2} onClick={handleOpenRemarkDrawer} disabled={isPending}>
              {isPending ? t('drawers.processing') : t('drawers.approve')}
            </Button>
          ) : (
            <Button variant="success" size="sm" icon={FileCheck2} onClick={handleOpenRemarkDrawer} disabled={isPending}>
              {isPending ? t('drawers.processing') : t('drawers.sendToApproval')}
            </Button>
          )}
        </>
      }
    >
      <div className="p-5 bg-slate-50 min-h-full">
        {/* Asset header */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 mb-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm">
            <span className="absolute -top-3 left-4 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
              {t('drawers.assetInformation')}
            </span>
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-2 mt-1">
              <span className="text-[10px] text-slate-500 font-bold">{t('drawers.assetName')}</span>
              <span className="text-xs font-bold text-red-600">{buildingAssetName || '-'}</span>
              <span className="text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2">{t('drawers.address')}</span>
              <span className="text-xs font-bold text-slate-800 border-t border-slate-100 pt-2">{record.tenantAddress ?? '-'}</span>
            </div>
          </div>
          <InfoCard label={t('drawers.assetNo')} value={assetNumber} />
          <InfoCard label={t('drawers.workflowStatus')} value={record.workflowStatus ?? '-'} />
        </div>

        {/* Overview table */}
        <div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_300px] gap-4 mb-6">
          <div className="overflow-x-auto">
            <MasterTable
              columns={overviewColumns}
              data={overviewData}
              containerClassName="border border-slate-200 rounded-lg shadow-sm"
              tableClassName="min-w-max text-[10px] table-auto"
              theadClassName="bg-slate-50"
              pageSize={1}
              totalCount={1}
              totalPages={1}
              pageNumber={1}
              paginationConfig={{ enabled: false }}
              maxBodyHeightClassName="max-h-none"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold">{t('drawers.assetCategory')}</span>
            <span className="text-sm font-bold text-red-600 mb-3">{assetCategory}</span>
            <span className="text-[10px] text-slate-500 font-bold">{t('drawers.unitName')}</span>
            <span className="text-sm font-bold text-red-600">{shopNameVal || '-'}</span>
          </div>
        </div>

        {/* Construction details */}
        <div className="mb-4 overflow-hidden rounded-lg">
          <div className="bg-teal-600 text-white text-[10px] font-bold py-1.5 text-center">
            {t('drawers.unitDetails')}
          </div>
          <MasterTable
            columns={constructionColumns}
            data={constructionData}
            tableClassName="text-[10px]"
            theadClassName="bg-slate-50"
            pageSize={1}
            totalCount={1}
            totalPages={1}
            pageNumber={1}
            paginationConfig={{ enabled: false }}
            maxBodyHeightClassName="max-h-none"
          />
        </div>

        {/* Tenant information */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm relative pt-4 mb-6 mt-4">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a869e] text-white text-[9px] font-bold px-4 py-0.5 rounded shadow-sm">
            {t('drawers.allTenantInfo')}
          </span>
          <div className="flex divide-x divide-slate-200 min-h-[150px]">
            {/* Previous tenant */}
            <div className="flex-1 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
              <div className="bg-slate-50 border-b border-slate-200 text-[#e65c00] text-[10px] font-bold py-1.5 flex items-center justify-center gap-1 sticky top-0">
                <Users className="w-3.5 h-3.5" /> {t('drawers.previousTenants', { count: historyItems.length })}
              </div>
              <div className="flex-1 p-3 space-y-3">
                {historyItems.length > 0 ? (
                  historyItems.map((item, index) => (
                    <div key={item.id || index} className="p-2 border border-slate-100 rounded bg-slate-50/50 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-800">{item.tenantName}</span>
                        <span className="text-[8px] text-slate-400 font-semibold">
                          {item.performedDate ? new Date(item.performedDate).toLocaleDateString('en-IN') : '-'}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-semibold">
                        {t('drawers.form.mobileNumber')}: {item.tenantMobile || '-'} | {t('tables.cols.leaseType')}: {item.leaseType || '-'}
                      </div>
                      {item.leaseStartDate && (
                        <div className="text-[9px] text-slate-400 font-medium">
                          {t('tables.cols.duration')}: {item.duration} {t('drawers.months')}
                        </div>
                      )}
                      <div className="text-[9px] text-slate-500 font-semibold">
                        {t('tables.cols.rentAmount')}: ₹ {item.monthlyRent ? item.monthlyRent.toLocaleString('en-IN') : '-'}
                      </div>
                      {item.remarks && (
                        <div className="text-[8px] text-slate-400 italic">
                          {t('tables.cols.remarks')}: &quot;{item.remarks}&quot;
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 py-6">
                    <Users className="w-8 h-8 opacity-30" />
                    <span className="text-[10px] font-semibold">
                      {t('drawers.noPreviousTenants')}
                    </span>
                    {record.previousTenantMobile && (
                      <span className="text-[9px] text-slate-400">{record.previousTenantMobile}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Current tenant */}
            <div className="flex-1 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 text-[#008f11] text-[10px] font-bold py-1.5 flex items-center justify-center gap-1">
                <User className="w-3.5 h-3.5" /> {t('drawers.currentTenant')}
              </div>
              <div className="p-0">
                <table className="w-full text-[9px] font-semibold text-slate-700">
                  <tbody className="divide-y divide-slate-100">
                    {currentTenantFields.map((field, index) => (
                      <tr key={index}>
                        <td className="px-3 py-1.5 bg-slate-50/50 w-1/4">{field.l}</td>
                        <td className={`px-3 py-1.5 border-r border-slate-100 ${field.vClass || ''}`}>{field.v}</td>
                        <td className="px-3 py-1.5 bg-slate-50/50 w-1/4">{field.l2}</td>
                        <td className={`px-3 py-1.5 ${field.v2Class || ''}`}>{field.v2}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-3 py-1.5 bg-slate-50/50">{t('drawers.form.leaseStartDate')}:</td>
                      <td className="px-3 py-1.5 border-r border-slate-100">{toDateDisplay(record.leaseStartDate)}</td>
                      <td className="px-3 py-1.5 bg-slate-50/50">{t('drawers.address')}:</td>
                      <td className="px-3 py-1.5">{record.tenantAddress ?? '-'}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 bg-slate-50/50">{t('drawers.form.leaseEndDate')}:</td>
                      <td className="px-3 py-1.5 border-r border-slate-100">{toDateDisplay(record.leaseEndDate)}</td>
                      <td className="px-3 py-1.5 bg-slate-50/50">{t('tables.cols.remarks')}:</td>
                      <td className="px-3 py-1.5">{record.remarks ?? record.reason ?? record.rejectionReason ?? '-'}</td>
                    </tr>
                    {Boolean(record.oldLeaseStartDate || record.oldLeaseEndDate || record.terminationDate) && (
                      <>
                        <tr>
                          <td className="px-3 py-1.5 bg-slate-50/50">{t('drawers.form.oldLeaseStartDate')}:</td>
                          <td className="px-3 py-1.5 border-r border-slate-100">{toDateDisplay(record.oldLeaseStartDate)}</td>
                          <td className="px-3 py-1.5 bg-slate-50/50">{t('drawers.form.vacatingDate')}:</td>
                          <td className="px-3 py-1.5">{toDateDisplay(record.terminationDate)}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 bg-slate-50/50">{t('drawers.form.oldLeaseEndDate')}:</td>
                          <td className="px-3 py-1.5 border-r border-slate-100">{toDateDisplay(record.oldLeaseEndDate)}</td>
                          <td className="px-3 py-1.5 bg-slate-50/50"></td>
                          <td className="px-3 py-1.5"></td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_250px] gap-4 mb-4">
          {/* Left: media cards from API */}
          <div className="flex flex-col gap-3">
            {leftMediaPanels.map((panel) => {
              const doc = panel.doc;
              const thumbUrl = doc ? thumbnailUrls[String(doc.id)] : null;

              return (
                <button
                  key={panel.title}
                  type="button"
                  onClick={() => {
                    if (doc) openDocument(doc);
                  }}
                  className="group relative min-h-[120px] flex-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/0 to-slate-900/15" />
                  <span className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#0a869e] px-3 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm text-center whitespace-nowrap">
                    {panel.title}
                  </span>

                  {doc && thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={panel.title}
                      className="absolute inset-0 h-full w-full object-contain bg-slate-50 p-2"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <panel.fallbackIcon className="h-8 w-8 text-slate-300" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {panel.fallbackText}
                        </span>
                        <span className="text-[9px] text-slate-400">{t('drawers.noPreview')}</span>
                      </div>
                    </div>
                  )}

                  {doc ? (
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-900/65 to-transparent px-2 pb-2 pt-6">
                      <div className="text-[9px] font-semibold text-white/90">{doc.label}</div>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Center: uploaded documents from API */}
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-lg relative p-4 flex flex-col bg-white shadow-sm min-h-[380px]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a869e] text-white text-[9px] font-bold px-3 py-0.5 rounded shadow-sm flex items-center gap-1">
                <FileText className="w-3 h-3" /> {t('drawers.uploadedDocs')}
              </span>

              {documentCards.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 mt-2 overflow-y-auto max-h-[350px]">
                  {documentCards.map((doc, idx) => (
                    <button
                      key={`${doc.id}-${idx}`}
                      type="button"
                      onClick={() => openDocument(doc)}
                      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm text-left transition hover:border-blue-200 hover:bg-blue-50/30 flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-md bg-slate-50 border border-slate-100 overflow-hidden">
                        {doc.isImage && thumbnailUrls[String(doc.id)] ? (
                          <img
                            src={thumbnailUrls[String(doc.id)]}
                            alt={doc.label}
                            className="h-full w-full object-cover"
                          />
                        ) : doc.isImage ? (
                          <ImageIcon className="h-6 w-6 text-slate-300" />
                        ) : (
                          <FileText className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-slate-700 truncate">{doc.label}</div>
                        <div className="text-[9px] font-bold text-emerald-600 mt-0.5">{t('drawers.viewDoc')}</div>
                        {doc.uploadedDate ? (
                          <div className="text-[8px] text-slate-400 mt-0.5">{toDateDisplay(doc.uploadedDate)}</div>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <FolderOpen className="w-10 h-10 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-400">{t('drawers.noDocs')}</p>
                  <p className="text-[10px] text-slate-300">{t('drawers.noDocsDesc')}</p>
                </div>
              )}
            </div>

            {/* Rejection reason if exists */}
            {record.rejectionReason && (
              <div className="border border-red-200 rounded-lg bg-red-50 p-3 shadow-sm">
                <div className="text-[10px] font-bold text-red-600 mb-1">{t('drawers.rejectionReason')}</div>
                <p className="text-xs text-red-700">{record.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Right: rent summary from API */}
          <div className="space-y-4">
            <div className="bg-white border border-[#0a869e] rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#0a869e] text-white text-[10px] font-bold py-1.5 text-center">
                {t('rentSummary.title')}
              </div>
              <table className="w-full text-[9px] font-semibold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-center bg-slate-50/50">
                    <th className="px-2 py-2 border-r border-slate-200">{t('rentSummary.colDetail')}</th>
                    <th className="px-2 py-2">{t('rentSummary.colAmount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-center">
                  {rentSummaryRows.map((row, index) => (
                    <tr key={index} className={index === 2 ? 'bg-slate-50/50' : ''}>
                      <td className="px-2 py-2.5 border-r border-slate-200 text-left">{row.l}</td>
                      <td className="px-2 py-2.5 font-bold text-slate-800">{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <DocumentPreviewDrawer
        selectedDocument={selectedDocument}
        loadedFile={loadedFile}
        isLoadingFile={isLoadingFile}
        fileError={fileError}
        onClose={closePreview}
        onDownload={downloadDocument}
      />
      <RemarkActionDrawer
        open={remarkDrawerOpen}
        title={remarkAction === 'approve' ? 'Approve Request' : 'Send to Approval'}
        description={
          remarkAction === 'approve'
            ? 'Add a remark before approving this request.'
            : 'Add a remark before sending this request to approval.'
        }
        label="Remarks"
        placeholder="Enter remarks..."
        confirmLabel={remarkAction === 'approve' ? 'Confirm Approve' : 'Confirm Send'}
        isPending={isPending}
        onClose={() => setRemarkDrawerOpen(false)}
        onConfirm={handleRemarkConfirm}
      />
    </Drawer>
  );
}

