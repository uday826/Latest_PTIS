'use client';

import { useMemo, useState } from 'react';
import { LeaseRentFilters } from './LeaseRentFilters';
import { LeaseRentTable } from './LeaseRentTable';
import { NewLeaseRegistrationModal } from './NewLeaseRegistrationDrawer';
import { RegistrationHistoryModal } from './RegistrationHistoryDrawer';
import { mockLeaseRecords, LeaseRentRecord } from './mockData';

export function LeaseRentRegistration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Shopping Complex');
  const [zone, setZone] = useState('all');
  const [ward, setWard] = useState('all');
  const [assetSelect, setAssetSelect] = useState('all');

  const [selectedRecordForRegistration, setSelectedRecordForRegistration] = useState<LeaseRentRecord | null>(null);
  const [selectedRecordForHistory, setSelectedRecordForHistory] = useState<LeaseRentRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return mockLeaseRecords.filter((record) => {
      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        record.tenantName.toLowerCase().includes(normalizedSearch) ||
        record.shopName.toLowerCase().includes(normalizedSearch) ||
        record.assetId.toLowerCase().includes(normalizedSearch);

      const matchesAsset = assetSelect === 'all' || record.assetId === assetSelect;
      return matchesSearch && matchesAsset;
    });
  }, [searchQuery, assetSelect]);

  return (
    <>
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
    
      />

      <LeaseRentTable
        records={filteredRecords}
        onActionClick={setSelectedRecordForRegistration}
        onHistoryClick={setSelectedRecordForHistory}
      />

      {selectedRecordForRegistration ? (
        <NewLeaseRegistrationModal
          record={selectedRecordForRegistration}
          onClose={() => setSelectedRecordForRegistration(null)}
        />
      ) : null}

      {selectedRecordForHistory ? (
        <RegistrationHistoryModal
          record={selectedRecordForHistory}
          onClose={() => setSelectedRecordForHistory(null)}
        />
      ) : null}
    </>
  );
}

export default LeaseRentRegistration;
