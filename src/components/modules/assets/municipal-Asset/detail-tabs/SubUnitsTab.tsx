/* eslint-disable i18next/no-literal-string */
'use client';

import { Badge, Button, Card, CardContent, Drawer, MasterTable } from '@/components/common';
import type { AssetChildAssetItem, AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';
import { AlertCircle, Building2, Eye } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  blank,
  getSubUnitDetailColumns,
  getSubUnitFloorColumns,
  getSubUnitMainColumns,
  getSubUnitRenterColumns,

  getSubUnitRoomColumns
} from './detailcolumn';

type SubUnitRow = AssetChildAssetItem & Record<string, unknown>;

// ─── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="border-b border-slate-200 pb-2 mb-3">
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
    </div>
  );
}

export function SubUnitsTab({ asset }: { asset: AssetDetailRecord }) {
  const children = useMemo(() => {
    return (asset.childAssets ?? []).filter(
      (child) =>
        !(child as Record<string, unknown>).inventoryBatchId &&
        !(child as Record<string, unknown>).InventoryBatchId &&
        !child.assetNo?.startsWith('FUR-') &&
        !child.assetNo?.startsWith('ELE-') &&
        !child.assetNo?.startsWith('EQP-')
    );
  }, [asset.childAssets]);

  const [pageNumber, setPageNumber] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<SubUnitRow | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const pageSize = 10;
  const totalCount = children.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const displayPage = Math.min(pageNumber, totalPages);

  const paginatedChildren = useMemo(
    () => children.slice((displayPage - 1) * pageSize, displayPage * pageSize),
    [children, displayPage]
  );

  const columns = useMemo(() => getSubUnitMainColumns(), []);
  const renterColumns = useMemo(() => getSubUnitRenterColumns(), []);
  const roomColumns = useMemo(() => getSubUnitRoomColumns(), []);
  const floorColumns = useMemo(() => getSubUnitFloorColumns(), []);
  const subUnitDetailColumns = useMemo(() => getSubUnitDetailColumns(), []);

  if (asset.childAssetsError) {
    return (
      <Card padding="none" className="rounded-xl border border-rose-200 bg-white shadow-sm">
        <CardContent className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center animate-in fade-in">
          <AlertCircle className="mb-3 h-12 w-12 text-rose-400" />
          <p className="text-sm font-semibold text-rose-700">Sub-units could not be loaded</p>
          <p className="mt-1 text-xs text-rose-500">{asset.childAssetsError}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <Card padding="none" className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 text-slate-800">
            <Building2 className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold">Sub Unit Details</h3>
          </div>
          <Badge variant="secondary" size="sm" className="font-bold border-blue-100 bg-blue-50 text-blue-700">
            {children.length} Sub Units
          </Badge>
        </CardContent>

        <MasterTable<SubUnitRow>
          columns={columns}
          data={paginatedChildren as SubUnitRow[]}
          getRowKey={(row) => row.id}
          pageNumber={displayPage}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={setPageNumber}
          paginationConfig={{ enabled: true }}
          actionLabel="View"
          renderActions={(row) => (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUnit(row)}
              className="h-8 w-8 rounded-full border border-blue-100 bg-white p-0 text-blue-600 hover:bg-blue-50"
              aria-label={`View sub-unit ${row.assetNo || row.id}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          emptyText="No sub-units available for this asset."
          headerTitle=""
          headerSubtitle=""
          tableClassName="min-w-max"
          maxBodyHeightClassName="max-h-[calc(100vh-360px)]"
          containerClassName="overflow-hidden"
        />
      </Card>

      {/* ── Detail Drawer ─────────────────────────────────────────────────── */}
      {mounted && createPortal(
        <Drawer
          open={!!selectedUnit}
          onClose={() => setSelectedUnit(null)}
          width="xl"
          title={
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {selectedUnit?.assetName || 'Sub-Unit Details'}
                </div>
                <div className="text-xs font-medium text-slate-500">
                  {selectedUnit?.assetNo || `ID ${selectedUnit?.id}`}
                </div>
              </div>
            </div>
          }
        >
          {selectedUnit && (
            <div className="space-y-5 p-5 font-sans">
              {/* Status badges row */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'STATUS', value: selectedUnit.status },
                  { label: 'OCCUPANCY', value: selectedUnit.occupancyStatus },
                  { label: 'CATEGORY', value: selectedUnit.assetCategoryName },
                  { label: 'TYPE', value: selectedUnit.assetTypeName },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{blank(value)}</p>
                  </div>
                ))}
              </div>

              {/* ── 1. Renter Details ──────────────────────────────────────────── */}
              <Card padding="none" className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <CardContent className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <SectionHeading title="Renter Details" />
                </CardContent>
                <MasterTable<Record<string, unknown>>
                  columns={renterColumns}
                  data={(selectedUnit.renterDetails ?? []) as Record<string, unknown>[]}
                  getRowKey={(row, index) => String(row.id ?? index)}
                  paginationConfig={{ enabled: false }}
                  emptyText="No renter information available."
                  tableClassName="min-w-[800px] table-fixed"
                  containerClassName="border-0 shadow-none"
                />
              </Card>

              {/* ── 2. Room Wise Submission Details ───────────────────────────── */}
              <Card padding="none" className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <CardContent className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <SectionHeading title="Room Wise Submission Details" />
                </CardContent>
                <MasterTable<Record<string, unknown>>
                  columns={roomColumns}
                  data={(selectedUnit.roomWiseSubmissions ?? []) as Record<string, unknown>[]}
                  getRowKey={(row, index) => String(row.id ?? index)}
                  paginationConfig={{ enabled: false }}
                  emptyText="No room-wise submission data available."
                  tableClassName="min-w-[1000px] table-fixed"
                  containerClassName="border-0 shadow-none"
                />
              </Card>

              {/* ── 3. Floor Details ──────────────────────────────────────────── */}
              <Card padding="none" className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <CardContent className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <SectionHeading title="Floor Details" />
                </CardContent>
                <MasterTable<Record<string, unknown>>
                  columns={floorColumns}
                  data={(selectedUnit.floorDetails ?? []) as Record<string, unknown>[]}
                  getRowKey={(row, index) => String(row.id ?? index)}
                  paginationConfig={{ enabled: false }}
                  emptyText="No floor details available."
                  tableClassName="min-w-[1100px] table-fixed"
                  containerClassName="border-0 shadow-none"
                />
              </Card>


            </div>
          )}
        </Drawer>,
        document.body
      )}
    </div>
  );
}

