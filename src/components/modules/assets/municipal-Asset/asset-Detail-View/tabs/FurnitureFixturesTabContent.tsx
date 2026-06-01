"use client";

import React, { useMemo, useState } from 'react';
import { Eye, Package2, CircleAlert, FileText, Hash, Layers3, SquareStack } from 'lucide-react';
import { Badge, Button, Card, CardContent, Drawer, MasterTable, type Column } from '@/components/common';
import type { AssetDetailController } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import type { InventoryBatchDetail, InventoryBatchListResponse, InventoryUnitResponse } from '../../detail-tabs/furniture-fixtures.types';

function formatMoney(value?: number | null): string {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function textOrDash(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
  if (typeof value === 'object') return '-';
  return String(value);
}

interface FurnitureFixturesTabContentProps {
  controller: AssetDetailController;
  inventoryData?: InventoryBatchListResponse | null;
  inventoryError?: string | null;
}

type InventoryRow = InventoryBatchDetail & Record<string, unknown>;

export function FurnitureFixturesTabContent({
  controller,
  inventoryData,
  inventoryError,
}: FurnitureFixturesTabContentProps): React.JSX.Element {
  const { asset } = controller;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState<InventoryBatchDetail | null>(null);
  const pageSize = 5;

  const batches = inventoryData?.batches ?? [];
  const totalCount = batches.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedBatches = useMemo(
    () => batches.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [batches, currentPage]
  );

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [inventoryData?.parentAssetId]);

  const columns: Column<InventoryRow>[] = [
    { key: 'batchId', label: 'Batch ID', width: '110px' },
    { key: 'inventoryType', label: 'Inventory Type', width: '160px' },
    { key: 'itemName', label: 'Item Name', width: '180px' },
    { key: 'modelBrand', label: 'Model / Brand', width: '190px' },
    {
      key: 'quantity',
      label: 'Qty',
      width: '90px',
      render: (value) => <span className="font-semibold">{textOrDash(value)}</span>,
    },
    {
      key: 'condition',
      label: 'Condition',
      width: '140px',
      render: (value) => (
        <Badge variant="secondary" size="sm" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          {textOrDash(value)}
        </Badge>
      ),
    },
    { key: 'unitValue', label: 'Unit Value', width: '120px', render: (value) => formatMoney(Number(value ?? 0)) },
    { key: 'totalBatchValue', label: 'Purchase Value', width: '140px', render: (value) => formatMoney(Number(value ?? 0)) },
    { key: 'totalBatchCV', label: 'Capital Value', width: '140px', render: (value) => formatMoney(Number(value ?? 0)) },
  ];

  if (!inventoryData && !inventoryError) {
    return (
      <Card padding="none" className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="flex min-h-65 flex-col items-center justify-center p-8 text-center">
          <Package2 className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">Loading furniture & fixtures inventory...</p>
        </CardContent>
      </Card>
    );
  }

  if (inventoryError) {
    return (
      <Card padding="none" className="rounded-xl border border-rose-200 bg-white shadow-sm">
        <CardContent className="flex min-h-65 flex-col items-center justify-center p-8 text-center">
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
              <p className="mt-1 text-xs text-slate-500">{inventoryData?.parentAssetName || asset.name}</p>
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
          pageNumber={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          paginationConfig={{ enabled: true }}
          headerTitle=""
          headerSubtitle=""
          actionLabel="Action"
          renderActions={(row) => (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBatch(row)}
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

      <Drawer
        open={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        width="xl"
        title={
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <SquareStack className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{selectedBatch?.itemName || 'Batch Details'}</div>
              <div className="text-xs font-medium text-slate-500">Batch #{selectedBatch?.batchId}</div>
            </div>
          </div>
        }
      >
        {selectedBatch && (
          <div className="space-y-4 p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Condition</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{textOrDash(selectedBatch.condition)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quantity</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{selectedBatch.quantity}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Owning Department</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{textOrDash(selectedBatch.owningDepartment)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card padding="none" className="rounded-xl border border-slate-200 bg-white">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Batch Information
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div><span className="font-semibold text-slate-500">Inventory Type:</span> {textOrDash(selectedBatch.inventoryType)}</div>
                    <div><span className="font-semibold text-slate-500">Model / Brand:</span> {textOrDash(selectedBatch.modelBrand)}</div>
                    <div><span className="font-semibold text-slate-500">Specifications:</span> {textOrDash(selectedBatch.specifications)}</div>
                    <div><span className="font-semibold text-slate-500">Purchase Date:</span> {formatDate(selectedBatch.purchaseDate)}</div>
                    <div><span className="font-semibold text-slate-500">Invoice No:</span> {textOrDash(selectedBatch.invoiceNumber)}</div>
                    <div><span className="font-semibold text-slate-500">Invoice Date:</span> {formatDate(selectedBatch.invoiceDate)}</div>
                    <div><span className="font-semibold text-slate-500">Registered:</span> {selectedBatch.isRegistered ? 'Yes' : 'No'}</div>
                    <div><span className="font-semibold text-slate-500">Registered Date:</span> {formatDate(selectedBatch.registeredDate)}</div>
                  </div>
                </CardContent>
              </Card>

              <Card padding="none" className="rounded-xl border border-slate-200 bg-white">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Layers3 className="h-4 w-4 text-blue-600" />
                    Financial Summary
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div><span className="font-semibold text-slate-500">Unit Value:</span> {formatMoney(selectedBatch.unitValue)}</div>
                    <div><span className="font-semibold text-slate-500">Total Purchase Value:</span> {formatMoney(selectedBatch.totalBatchValue)}</div>
                    <div><span className="font-semibold text-slate-500">Total Capital Value:</span> {formatMoney(selectedBatch.totalBatchCV)}</div>
                    <div><span className="font-semibold text-slate-500">Created Date:</span> {formatDate(selectedBatch.createdDate)}</div>
                    <div><span className="font-semibold text-slate-500">Invoice File:</span> {textOrDash(selectedBatch.invoiceFileName)}</div>
                    <div><span className="font-semibold text-slate-500">Photo File:</span> {textOrDash(selectedBatch.photoFileName)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card padding="none" className="rounded-xl border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Hash className="h-4 w-4 text-blue-600" />
                    Registered Units
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{selectedBatch.units.length} units</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Asset No</th>
                        <th className="px-3 py-2">Asset Name</th>
                        <th className="px-3 py-2">Unit #</th>
                        <th className="px-3 py-2">Condition</th>
                        <th className="px-3 py-2 text-right">Purchase Value</th>
                        <th className="px-3 py-2 text-right">Capital Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedBatch.units.map((unit: InventoryUnitResponse) => (
                        <tr key={unit.assetId} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-semibold text-blue-600">{unit.assetNo}</td>
                          <td className="px-3 py-2 text-slate-700">{unit.assetName}</td>
                          <td className="px-3 py-2 text-slate-700">{unit.unitNumber}</td>
                          <td className="px-3 py-2 text-slate-700">{textOrDash(unit.condition)}</td>
                          <td className="px-3 py-2 text-right text-slate-700">{formatMoney(unit.unitPurchaseValue ?? 0)}</td>
                          <td className="px-3 py-2 text-right font-semibold text-emerald-700">{formatMoney(unit.unitCapitalValue ?? 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
}
