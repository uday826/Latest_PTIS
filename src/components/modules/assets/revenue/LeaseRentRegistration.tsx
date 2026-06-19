
/* eslint-disable i18next/no-literal-string */
'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Input, Label, SearchInput, SearchSelect, Select } from '@/components/common';
import { LeaseRentFilters } from './LeaseRentFilters';
import { LeaseRentTable } from './LeaseRentTable';
import { LeaseRentVerificationTable } from './LeaseRentVerificationTable';
import { LeaseRentApprovalTable } from './LeaseRentApprovalTable';
import { NewLeaseRegistrationModal } from './NewLeaseRegistrationDrawer';
import { RegistrationHistoryModal } from './RegistrationHistoryDrawer';
import { VerificationLeaseModal } from './VerificationLeaseDrawer';
import { ApprovalLeaseModal } from './ApprovalLeaseDrawer';
import { RejectRegistrationModal } from './RejectRegistrationDrawer';
import { RevertRegistrationModal } from './RevertRegistrationDrawer';
import type {
  ApprovalRecord,
  AssetMasterDetails,
  LeaseRentRecord,
  LeaseRentRegistrationProps,
  VerificationRecord,
} from '../../../../types/asset/revenue.types';

export function LeaseRentRegistration({
  stage = 'registration',
  initialRecords = [],
  pageNumber = 1,
  pageSize = 5,
  totalCount = 0,
  totalPages = 1,
  searchTerm = '',
  fromDate = '',
  toDate = '',
  assetCategoryId = null,
  assetTypeId = null,
  zoneId = null,
  wardId = null,
  assetId = null,
  verificationRecords = [],
  approvalRecords = [],
  selectedRegistration = null,
  selectedAsset = null,
  assetDocuments = [],
  leaseRentDocuments = [],
  assetPhotosAndPlans = [],
  applicationTypes = [],
  verificationDrawerId = null,
  selectedVerification = null,
  approvalDrawerId = null,
  selectedApproval = null,
  rejectDrawerId = null,
  selectedRejection = null,
  revertDrawerId = null,
  selectedRevert = null,
  categoryOptions = [],
  assetTypeOptions = [],
  zoneOptions = [],
  wardOptions = [],
  assetOptions = [],
}: LeaseRentRegistrationProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [category, setCategory] = useState(assetCategoryId ? String(assetCategoryId) : 'all');
  const [assetType, setAssetType] = useState(assetTypeId ? String(assetTypeId) : 'all');
  const [zone, setZone] = useState(zoneId ? String(zoneId) : 'all');
  const [ward, setWard] = useState(wardId ? String(wardId) : 'all');
  const [assetSelect, setAssetSelect] = useState(assetId ? String(assetId) : 'all');
  const [fromDateValue, setFromDateValue] = useState(fromDate);
  const [toDateValue, setToDateValue] = useState(toDate);

  const [selectedRecordForHistory, setSelectedRecordForHistory] = useState<LeaseRentRecord | null>(null);
  const drawerAsset = (selectedAsset as AssetMasterDetails | null) ?? null;

  const verificationDrawerOpen = verificationDrawerId != null;
  const openVerificationDrawer = useCallback(
    (recordId: string | number) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set('drawerVerificationId', String(recordId));
      startTransition(() => {
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
        router.refresh();
      });
    },
    [pathname, router, searchParams]
  );

  const closeVerificationDrawer = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('drawerVerificationId');
    const queryString = nextParams.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      router.refresh();
    });
  }, [pathname, router, searchParams]);

  const approvalDrawerOpen = approvalDrawerId != null;
  const openApprovalDrawer = useCallback(
    (recordId: string | number) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set('drawerApprovalId', String(recordId));
      startTransition(() => {
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
        router.refresh();
      });
    },
    [pathname, router, searchParams]
  );

  const closeApprovalDrawer = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('drawerApprovalId');
    const queryString = nextParams.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      router.refresh();
    });
  }, [pathname, router, searchParams]);

  const rejectDrawerOpen = rejectDrawerId != null;
  const openRejectDrawer = useCallback(
    (recordId: string | number) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set('drawerRejectId', String(recordId));
      startTransition(() => {
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
        router.refresh();
      });
    },
    [pathname, router, searchParams]
  );

  const closeRejectDrawer = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('drawerRejectId');
    const queryString = nextParams.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      router.refresh();
    });
  }, [pathname, router, searchParams]);

  const revertDrawerOpen = revertDrawerId != null;


  const closeRevertDrawer = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('drawerRevertId');
    const queryString = nextParams.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      router.refresh();
    });
  }, [pathname, router, searchParams]);

  const toNullableNumber = useCallback((value: string | number | null | undefined) => {
    if (value == null || value === 'all') return null;
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, []);

  const buildUrl = useCallback((nextParams: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams();
    params.set('pageNumber', String(nextParams.pageNumber ?? pageNumber));
    params.set('pageSize', String(nextParams.pageSize ?? pageSize));

    const currentSearch = String(nextParams.searchTerm ?? searchQuery ?? '').trim();
    if (currentSearch) params.set('searchTerm', currentSearch);

    const hasKey = (key: string) => Object.prototype.hasOwnProperty.call(nextParams, key);

    const currentCategory = hasKey('assetCategoryId')
      ? nextParams.assetCategoryId
      : toNullableNumber(category);
    const currentAssetType = hasKey('assetTypeId')
      ? nextParams.assetTypeId
      : toNullableNumber(assetType);
    const currentZone = hasKey('zoneId') ? nextParams.zoneId : toNullableNumber(zone);
    const currentWard = hasKey('wardId') ? nextParams.wardId : toNullableNumber(ward);
    const currentAsset = hasKey('assetId') ? nextParams.assetId : toNullableNumber(assetSelect);
    const currentFromDate = hasKey('fromDate') ? nextParams.fromDate : fromDateValue;
    const currentToDate = hasKey('toDate') ? nextParams.toDate : toDateValue;

    if (currentCategory != null && Number.isFinite(currentCategory)) {
      params.set('assetCategoryId', String(currentCategory));
    }
    if (currentAssetType != null && Number.isFinite(currentAssetType)) {
      params.set('assetTypeId', String(currentAssetType));
    }
    if (currentZone != null && Number.isFinite(currentZone)) {
      params.set('zoneId', String(currentZone));
    }
    if (currentWard != null && Number.isFinite(currentWard)) {
      params.set('wardId', String(currentWard));
    }
    if (currentAsset != null && Number.isFinite(currentAsset)) {
      params.set('assetId', String(currentAsset));
    }

    const normalizedFromDate = currentFromDate == null ? '' : String(currentFromDate).trim();
    const normalizedToDate = currentToDate == null ? '' : String(currentToDate).trim();
    if (normalizedFromDate) params.set('fromDate', normalizedFromDate);
    if (normalizedToDate) params.set('toDate', normalizedToDate);

    return `${pathname}?${params.toString()}`;
  }, [assetSelect, category, assetType, fromDateValue, pageNumber, pageSize, pathname, searchQuery, toDateValue, toNullableNumber, ward, zone]);

  const updateQuery = useCallback(
    (nextParams: Record<string, string | number | null | undefined>) => {
      const nextUrl = buildUrl(nextParams);
      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
        router.refresh();
      });
    },
    [buildUrl, router]
  );

  const openAssetDrawer = useCallback(
    (assetIdValue: string | number) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set('drawerAssetId', String(assetIdValue));
      startTransition(() => {
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
        router.refresh();
      });
    },
    [pathname, router, searchParams]
  );

  const closeAssetDrawer = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('drawerAssetId');
    const queryString = nextParams.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      router.refresh();
    });
  }, [pathname, router, searchParams]);

  const handleCategoryChange = useCallback(
    (value: string | null) => {
      const nextValue = value ?? 'all';
      setCategory(nextValue);
      setAssetType('all');
      updateQuery({ pageNumber: 1, assetCategoryId: toNullableNumber(value), assetTypeId: null });
    },
    [toNullableNumber, updateQuery]
  );

  const handleAssetTypeChange = useCallback(
    (value: string | null) => {
      const nextValue = value ?? 'all';
      setAssetType(nextValue);
      updateQuery({ pageNumber: 1, assetTypeId: toNullableNumber(value) });
    },
    [toNullableNumber, updateQuery]
  );

  const handleZoneChange = useCallback(
    (value: string | null) => {
      const nextValue = value ?? 'all';
      setZone(nextValue);
      setWard('all');
      setAssetSelect('all');
      updateQuery({
        pageNumber: 1,
        zoneId: toNullableNumber(value),
        wardId: null,
        assetId: null,
      });
    },
    [toNullableNumber, updateQuery]
  );

  const handleWardChange = useCallback(
    (value: string | null) => {
      const nextValue = value ?? 'all';
      setWard(nextValue);
      setAssetSelect('all');
      updateQuery({
        pageNumber: 1,
        wardId: toNullableNumber(value),
        assetId: null,
      });
    },
    [toNullableNumber, updateQuery]
  );

  const handleAssetChange = useCallback(
    (value: string | null) => {
      const nextValue = value ?? 'all';
      setAssetSelect(nextValue);
      updateQuery({ pageNumber: 1, assetId: toNullableNumber(value) });
    },
    [toNullableNumber, updateQuery]
  );

  const handleFromDateChange = useCallback(
    (value: string) => {
      setFromDateValue(value);
      updateQuery({ pageNumber: 1, fromDate: value || null });
    },
    [updateQuery]
  );

  const handleToDateChange = useCallback(
    (value: string) => {
      setToDateValue(value);
      updateQuery({ pageNumber: 1, toDate: value || null });
    },
    [updateQuery]
  );

  const handleRegistrationAction = useCallback(
    (record: LeaseRentRecord) => {
      if (record.assetMasterId) {
        openAssetDrawer(record.assetMasterId);
      }
    },
    [openAssetDrawer]
  );

  const handleHistoryAction = useCallback((record: LeaseRentRecord) => {
    setSelectedRecordForHistory(record);
  }, []);

  const handleVerificationAction = useCallback((record: VerificationRecord) => {
    openVerificationDrawer(record.id);
  }, [openVerificationDrawer]);

  const handleApprovalAction = useCallback((record: ApprovalRecord) => {
    openApprovalDrawer(record.id);
  }, [openApprovalDrawer]);

  const handleRejectAction = useCallback((record: ApprovalRecord) => {
    openRejectDrawer(record.id);
  }, [openRejectDrawer]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery === searchTerm) return;
      updateQuery({ pageNumber: 1, searchTerm: searchQuery });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, searchTerm, updateQuery]);

  useEffect(() => {
    setCategory(assetCategoryId ? String(assetCategoryId) : 'all');
  }, [assetCategoryId]);

  useEffect(() => {
    setAssetType(assetTypeId ? String(assetTypeId) : 'all');
  }, [assetTypeId]);

  useEffect(() => {
    setZone(zoneId ? String(zoneId) : 'all');
  }, [zoneId]);

  useEffect(() => {
    setWard(wardId ? String(wardId) : 'all');
  }, [wardId]);

  useEffect(() => {
    setAssetSelect(assetId ? String(assetId) : 'all');
  }, [assetId]);

  const t = useTranslations('revenueManagement');

  const renderStageFilters = () => {
    if (stage === 'registration' || stage === 'reverted') {
      return (
        <LeaseRentFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          assetType={assetType}
          setAssetType={setAssetType}
          zone={zone}
          setZone={setZone}
          ward={ward}
          setWard={setWard}
          assetSelect={assetSelect}
          setAssetSelect={setAssetSelect}
          categoryOptions={categoryOptions}
          assetTypeOptions={assetTypeOptions}
          zoneOptions={zoneOptions}
          wardOptions={wardOptions}
          assetOptions={assetOptions}
          onCategoryChange={handleCategoryChange}
          onAssetTypeChange={handleAssetTypeChange}
          onZoneChange={handleZoneChange}
          onWardChange={handleWardChange}
          onAssetChange={handleAssetChange}
        />
      );
    }

    return (
      <div className="w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_180px_180px_150px_150px]">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('filters.smartSearch')}</Label>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('filters.smartSearchPlaceholder')}
              className="mb-0 w-full"
              showClear={false}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('filters.category')}</Label>
            <SearchSelect
              name="category"
              value={category}
              onChange={(_, value) => handleCategoryChange(value === 'all' ? null : value)}
              options={[
                { label: t('filters.allCategories'), value: 'all' },
                ...categoryOptions,
              ]}
              className="w-full"
              placeholder={t('filters.allCategories')}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('filters.assetType') || 'Asset Type'}</Label>
            <SearchSelect
              name="assetType"
              value={assetType}
              onChange={(_, value) => handleAssetTypeChange(value === 'all' ? null : value)}
              options={[
                { label: t('filters.allAssetTypes') || 'All Asset Types', value: 'all' },
                ...assetTypeOptions,
              ]}
              className="w-full"
              placeholder={t('filters.allAssetTypes') || 'All Asset Types'}
            />
          </div>

          <div className="space-y-1.5">
            <Input
              type="date"
              label={t('filters.fromDate')}
              value={fromDateValue}
              max={toDateValue || undefined}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <Input
              type="date"
              label={t('filters.toDate')}
              value={toDateValue}
              min={fromDateValue || undefined}
              onChange={(e) => handleToDateChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500"
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  };

  const renderStageTable = () => {
    if (stage === 'registration' || stage === 'reverted') {
      return (
        <LeaseRentTable
          records={initialRecords}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          stage={stage}
          onPageChange={(nextPage) => updateQuery({ pageNumber: nextPage })}
          onPageSizeChange={(nextSize) => updateQuery({ pageNumber: 1, pageSize: nextSize })}
          onActionClick={handleRegistrationAction}
          onHistoryClick={handleHistoryAction}
          headerExtra={renderStageFilters()}
        />
      );
    }

    if (stage === 'verification') {
      return (
        <LeaseRentVerificationTable
          records={verificationRecords}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={(nextPage) => updateQuery({ pageNumber: nextPage })}
          onPageSizeChange={(nextSize) => updateQuery({ pageNumber: 1, pageSize: nextSize })}
          onActionClick={handleVerificationAction}
          headerExtra={renderStageFilters()}
        />
      );
    }

    return (
      <LeaseRentApprovalTable
        records={approvalRecords}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={(nextPage) => updateQuery({ pageNumber: nextPage })}
        onPageSizeChange={(nextSize) => updateQuery({ pageNumber: 1, pageSize: nextSize })}
        onActionClick={handleApprovalAction}
        onRejectClick={handleRejectAction}
        headerExtra={renderStageFilters()}
      />
    );
  };

  return (
    <>
      {renderStageTable()}

      {drawerAsset && selectedRegistration ? (
        <NewLeaseRegistrationModal
          asset={drawerAsset}
          record={selectedRegistration}
          documents={leaseRentDocuments}
          assetPhotosAndPlans={assetPhotosAndPlans}
          applicationTypes={applicationTypes}
          onClose={closeAssetDrawer}
        />
      ) : null}

      {selectedRecordForHistory ? (
        <RegistrationHistoryModal
          record={selectedRecordForHistory}
          onClose={() => setSelectedRecordForHistory(null)}
        />
      ) : null}

      {verificationDrawerOpen && selectedVerification ? (
        <VerificationLeaseModal
          record={selectedVerification}
          onClose={closeVerificationDrawer}
          assetDetails={selectedAsset}
          documents={assetDocuments}
          assetPhotosAndPlans={assetPhotosAndPlans}
        />
      ) : null}

      {approvalDrawerOpen && selectedApproval ? (
        <ApprovalLeaseModal
          record={selectedApproval}
          onClose={closeApprovalDrawer}
          assetDetails={selectedAsset}
          documents={assetDocuments}
          assetPhotosAndPlans={assetPhotosAndPlans}
        />
      ) : null}

      {rejectDrawerOpen && selectedRejection ? (
        <RejectRegistrationModal
          record={selectedRejection}
          onClose={closeRejectDrawer}
        />
      ) : null}

      {revertDrawerOpen && selectedRevert ? (
        <RevertRegistrationModal
          record={selectedRevert}
          onClose={closeRevertDrawer}
        />
      ) : null}
    </>
  );
}

export default LeaseRentRegistration;
