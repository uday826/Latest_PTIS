/* eslint-disable i18next/no-literal-string */
'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input, Label, SearchInput, Select } from '@/components/common';
import { LeaseRentFilters } from './LeaseRentFilters';
import { LeaseRentTable } from './LeaseRentTable';
import { LeaseRentVerificationTable } from './LeaseRentVerificationTable';
import { LeaseRentApprovalTable } from './LeaseRentApprovalTable';
import { NewLeaseRegistrationModal } from './NewLeaseRegistrationDrawer';
import { RegistrationHistoryModal } from './RegistrationHistoryDrawer';
import { VerificationLeaseModal } from './VerificationLeaseDrawer';
import { ApprovalLeaseModal } from './ApprovalLeaseModal';
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
  assetCategoryId = null,
  zoneId = null,
  wardId = null,
  assetId = null,
  verificationRecords = [],
  approvalRecords = [],
  drawerAssetId = null,
  selectedRegistration = null,
  selectedAsset = null,
  assetDocuments = [],
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
  zoneOptions = [],
  wardOptions = [],
  assetOptions = [],
}: LeaseRentRegistrationProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [category, setCategory] = useState(assetCategoryId ? String(assetCategoryId) : 'all');
  const [zone, setZone] = useState(zoneId ? String(zoneId) : 'all');
  const [ward, setWard] = useState(wardId ? String(wardId) : 'all');
  const [assetSelect, setAssetSelect] = useState(assetId ? String(assetId) : 'all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [selectedRecordForHistory, setSelectedRecordForHistory] = useState<LeaseRentRecord | null>(null);
  const drawerAsset = (selectedAsset as AssetMasterDetails | null) ?? (drawerAssetId ? ({ assetNo: 'Asset not found' } as AssetMasterDetails) : null);
  
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
    const currentZone = hasKey('zoneId') ? nextParams.zoneId : toNullableNumber(zone);
    const currentWard = hasKey('wardId') ? nextParams.wardId : toNullableNumber(ward);
    const currentAsset = hasKey('assetId') ? nextParams.assetId : toNullableNumber(assetSelect);

    if (currentCategory != null && Number.isFinite(currentCategory)) {
      params.set('assetCategoryId', String(currentCategory));
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

    return `${pathname}?${params.toString()}`;
  }, [assetSelect, category, pageNumber, pageSize, pathname, searchQuery, toNullableNumber, ward, zone]);

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
      updateQuery({ pageNumber: 1, assetCategoryId: toNullableNumber(value) });
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

  const renderStageFilters = () => {
    if (stage === 'registration' || stage === 'reverted') {
      return (
        <LeaseRentFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          zone={zone}
          setZone={setZone}
          ward={ward}
          setWard={setWard}
          assetSelect={assetSelect}
          setAssetSelect={setAssetSelect}
          categoryOptions={categoryOptions}
          zoneOptions={zoneOptions}
          wardOptions={wardOptions}
          assetOptions={assetOptions}
          onCategoryChange={handleCategoryChange}
          onZoneChange={handleZoneChange}
          onWardChange={handleWardChange}
          onAssetChange={handleAssetChange}
        />
      );
    }

    return (
      <div className="mb-4 rounded-2xl border border-slate-200/60 bg-slate-50 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_minmax(0,1fr)_170px_170px]">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Asset Category</Label>
          <Select
            value={category}
            onChange={(_, value) => handleCategoryChange(value === 'all' ? null : value)}
            options={[
              { label: 'All Categories', value: 'all' },
              ...categoryOptions,
              ]}
              selectSize="sm"
              className="w-full"
              placeholder="All Categories"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Smart Search</Label>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search across all fields..."
              className="mb-0 w-full"
              showClear={false}
            />
          </div>

          <div className="space-y-1.5">
            <Input
              type="date"
              label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <Input
              type="date"
              label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
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
          onPageChange={(nextPage) => updateQuery({ pageNumber: nextPage })}
          onPageSizeChange={(nextSize) => updateQuery({ pageNumber: 1, pageSize: nextSize })}
          onActionClick={handleRegistrationAction}
          onHistoryClick={handleHistoryAction}
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
      />
    );
  };

  return (
    <>
      {renderStageFilters()}
      {renderStageTable()}

      {drawerAsset ? (
        <NewLeaseRegistrationModal
          asset={drawerAsset}
          record={selectedRegistration}
          documents={assetDocuments}
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
        />
      ) : null}

      {approvalDrawerOpen && selectedApproval ? (
        <ApprovalLeaseModal
          record={selectedApproval}
          onClose={closeApprovalDrawer}
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
