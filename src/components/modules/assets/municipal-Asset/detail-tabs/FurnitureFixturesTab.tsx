/* eslint-disable i18next/no-literal-string */
'use client';

import { Button, Card, CardContent, Drawer, MasterTable } from '@/components/common';
import type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';
import type { InventoryBatchDetail, InventoryUnitResponse } from '@/types/municipal-asset/furniture-fixtures.types';
import { CircleAlert, Eye, FileText, Hash, Layers3, Package2, SquareStack } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { blank, formatDate, formatMoney, getInventoryBatchColumns, getInventoryUnitColumns } from './detailcolumn';

interface FurnitureFixturesTabProps {
  asset: AssetDetailRecord;
}

type InventoryRow = Record<string, unknown> & InventoryBatchDetail;
type InventoryUnitRow = Record<string, unknown> & InventoryUnitResponse;

export function FurnitureFixturesTab({ asset }: FurnitureFixturesTabProps): React.JSX.Element {
  const inventoryData = asset.inventoryData;
  const inventoryError = asset.inventoryError;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState<InventoryBatchDetail | null>(null);
  const [unitPage, setUnitPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pageSize = 5;
  const batches = inventoryData?.batches ?? [];
  const totalCount = batches.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const displayPage = Math.min(currentPage, totalPages);

  const paginatedBatches = batches.slice((displayPage - 1) * pageSize, displayPage * pageSize);
  const unitPageSize = 5;
  const unitTotalCount = selectedBatch?.units.length ?? 0;
  const unitTotalPages = Math.max(1, Math.ceil(unitTotalCount / unitPageSize));
  const displayUnitPage = Math.min(unitPage, unitTotalPages);
  const paginatedUnits = (selectedBatch?.units ?? []).slice(
    (displayUnitPage - 1) * unitPageSize,
    displayUnitPage * unitPageSize
  );

  const columns = useMemo(() => getInventoryBatchColumns(), []);
  const unitColumns = useMemo(() => getInventoryUnitColumns(), []);

  if (!inventoryData && !inventoryError) {
    return (
      <Card padding="none" className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
          <Package2 className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">Loading furniture & fixtures inventory...</p>
        </CardContent>
      </Card>
    );
  }

  if (inventoryError) {
    return (
      <Card padding="none" className="rounded-xl border border-rose-200 bg-white shadow-sm">
        <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
          <CircleAlert className="mb-3 h-12 w-12 text-rose-400" />
          <p className="text-sm font-semibold text-rose-700">{inventoryError}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card padding="none" className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Asset Inventory</h3>
                <span className="text-sm text-slate-500">
                  ({inventoryData?.totalBatches ?? 0} records · {inventoryData?.totalUnits ?? 0} units)
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{inventoryData?.parentAssetName || asset.assetName}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Batches</p>
                <p className="text-base font-black text-blue-700">{inventoryData?.totalBatches ?? 0}</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Units</p>
                <p className="text-base font-black text-emerald-700">{inventoryData?.totalUnits ?? 0}</p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-violet-50/40 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Purchase</p>
                <p className="text-base font-black text-violet-700">{formatMoney(inventoryData?.totalPurchaseValue ?? 0)}</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/40 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Capital</p>
                <p className="text-base font-black text-amber-700">{formatMoney(inventoryData?.totalCapitalValue ?? 0)}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <MasterTable<InventoryRow>
          columns={columns}
          data={paginatedBatches as InventoryRow[]}
          getRowKey={(row) => row.batchId}
          pageNumber={displayPage}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          paginationConfig={{ enabled: true }}
          actionLabel="Action"
          renderActions={(row) => (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setUnitPage(1);
                setSelectedBatch(row);
              }}
              className="h-8 w-8 rounded-full border border-blue-100 bg-white p-0 text-blue-600 hover:bg-blue-50"
              aria-label={`View batch ${row.batchId}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          tableClassName="min-w-[1400px]"
          maxBodyHeightClassName="max-h-[calc(100vh-360px)]"
          containerClassName="overflow-hidden"
        />
      </Card>

      {mounted && createPortal(
        <Drawer
        open={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        width="xl"
        title={
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-black p-2 text-white">
              <SquareStack className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-black">{selectedBatch?.itemName || 'Batch Details'}</div>
            </div>
          </div>
        }
      >
        {selectedBatch && (
          <div className="space-y-4 bg-white p-5 text-black">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/60">Condition</p>
                <p className="mt-1 text-sm font-semibold text-black">{blank(selectedBatch.condition)}</p>
              </div>
              <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/60">Quantity</p>
                <p className="mt-1 text-sm font-semibold text-black">{selectedBatch.quantity}</p>
              </div>
              <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/60">Owning Department</p>
                <p className="mt-1 text-sm font-semibold text-black">{blank(selectedBatch.owningDepartment)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card padding="none" className="rounded-xl border border-black/10 bg-white">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-black">
                    <FileText className="h-4 w-4 text-black" />
                    Batch Information
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div><span className="font-semibold text-black/60">Inventory Type:</span> <span className="text-black">{blank(selectedBatch.inventoryType)}</span></div>
                    <div><span className="font-semibold text-black/60">Model / Brand:</span> <span className="text-black">{blank(selectedBatch.modelBrand)}</span></div>
                    <div><span className="font-semibold text-black/60">Specifications:</span> <span className="text-black">{blank(selectedBatch.specifications)}</span></div>
                    <div><span className="font-semibold text-black/60">Purchase Date:</span> <span className="text-black">{formatDate(selectedBatch.purchaseDate)}</span></div>
                    <div><span className="font-semibold text-black/60">Invoice No:</span> <span className="text-black">{blank(selectedBatch.invoiceNumber)}</span></div>
                    <div><span className="font-semibold text-black/60">Invoice Date:</span> <span className="text-black">{formatDate(selectedBatch.invoiceDate)}</span></div>
                    <div><span className="font-semibold text-black/60">Registered:</span> <span className="text-black">{selectedBatch.isRegistered ? 'Yes' : 'No'}</span></div>
                    <div><span className="font-semibold text-black/60">Registered Date:</span> <span className="text-black">{formatDate(selectedBatch.registeredDate)}</span></div>
                  </div>
                </CardContent>
              </Card>

              <Card padding="none" className="rounded-xl border border-black/10 bg-white">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-black">
                    <Layers3 className="h-4 w-4 text-black" />
                    Financial Summary
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div><span className="font-semibold text-black/60">Unit Value:</span> <span className="text-black">{formatMoney(selectedBatch.unitValue)}</span></div>
                    <div><span className="font-semibold text-black/60">Total Purchase Value:</span> <span className="text-black">{formatMoney(selectedBatch.totalBatchValue)}</span></div>
                    <div><span className="font-semibold text-black/60">Total Capital Value:</span> <span className="text-black">{formatMoney(selectedBatch.totalBatchCV)}</span></div>
                    <div><span className="font-semibold text-black/60">Created Date:</span> <span className="text-black">{formatDate(selectedBatch.createdDate)}</span></div>
                    <div><span className="font-semibold text-black/60">Invoice File:</span> <span className="text-black">{blank(selectedBatch.invoiceFileName)}</span></div>
                    <div><span className="font-semibold text-black/60">Photo File:</span> <span className="text-black">{blank(selectedBatch.photoFileName)}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card padding="none" className="rounded-xl border border-black/10 bg-white">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-black">
                    <Hash className="h-4 w-4 text-black" />
                    Registered Units
                  </div>
                  <span className="text-xs font-semibold text-black/60">{unitTotalCount} units</span>
                </div>

                <MasterTable<InventoryUnitRow>
                  columns={unitColumns}
                  data={paginatedUnits as InventoryUnitRow[]}
                  getRowKey={(row) => String(row.assetId)}
                  pageNumber={displayUnitPage}
                  pageSize={unitPageSize}
                  totalCount={unitTotalCount}
                  totalPages={unitTotalPages}
                  onPageChange={setUnitPage}
                  paginationConfig={{ enabled: true }}
                  tableClassName="min-w-[1200px]"
                  maxBodyHeightClassName="max-h-[320px]"
                  containerClassName="overflow-hidden rounded-lg border border-black/10"
                  theadClassName="bg-black/[0.03]"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </Drawer>,
      document.body
    )}
    </div>
  );
}
