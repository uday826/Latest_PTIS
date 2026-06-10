import React from 'react';

export type ReportMovableAssetGroup = 'vehicle' | 'furniture' | 'equipment' | 'other';

export type ReportMovableAssetRow = {
  id: string | number;
  group: ReportMovableAssetGroup;
  name: string;
  quantity: number | null;
  value: number | null;
  imageSrc?: string | null;
};

type ReportMovableAssetsTableProps = {
  rows: ReportMovableAssetRow[];
};

const GROUP_LABELS: Record<ReportMovableAssetGroup, string> = {
  vehicle: 'वाहने',
  furniture: 'फर्निचर',
  equipment: 'उपकरणे',
  other: 'इतर',
};

const GROUP_ORDER: ReportMovableAssetGroup[] = ['vehicle', 'furniture', 'equipment', 'other'];

function toMarathiDigits(value: unknown): string {
  const digits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(value ?? '-').replace(/\d/g, (d) => digits[Number(d)]);
}

function formatCurrencyINR(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return toMarathiDigits(new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num));
}

export function ReportMovableAssetsTable({ rows }: ReportMovableAssetsTableProps) {
  if (!rows || rows.length === 0) return null;

  const grouped = new Map<ReportMovableAssetGroup, ReportMovableAssetRow[]>();
  for (const g of GROUP_ORDER) grouped.set(g, []);
  for (const row of rows) {
    const existing = grouped.get(row.group);
    if (existing) existing.push(row);
    else grouped.get('other')!.push(row);
  }

  const visibleGroups = GROUP_ORDER.filter((g) => (grouped.get(g)?.length ?? 0) > 0);

  let grandQty = 0;
  let grandVal = 0;
  for (const row of rows) {
    if (row.quantity !== null && row.quantity !== undefined) grandQty += row.quantity;
    if (row.value !== null && row.value !== undefined) grandVal += row.value;
  }

  return (
    <div className="border border-[#b0b6c2] rounded-md overflow-hidden shadow-sm bg-white shrink-0">
      <table className="w-full text-center border-collapse text-[9px] font-bold text-[#0d4380] leading-[1.1]">
        <thead className="bg-gray-100/80 align-middle">
          <tr>
            <th
              colSpan={4}
              className="bg-[#175294] text-white py-1 px-2 border-b border-[#b0b6c2]"
            >
              ATTACHED INVENTORY / संलग्न वस्तू आणि उपकरणे
            </th>
          </tr>
          <tr>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">मालमत्ता गट</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">मालमत्तेचे नाव</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">प्रमाण (QTY)</th>
            <th className="border-b border-[#b0b6c2] p-1 font-bold align-middle">मूल्य (VALUE ₹)</th>
          </tr>
        </thead>
        <tbody>
          {visibleGroups.map((group) => {
            const groupRows = grouped.get(group)!;
            const groupQty = groupRows.reduce((s, r) => s + (r.quantity ?? 0), 0);
            const groupVal = groupRows.reduce((s, r) => s + (r.value ?? 0), 0);

            return (
              <React.Fragment key={group}>
                {groupRows.map((row, idx) => (
                  <tr key={row.id} className="bg-white text-gray-700 align-middle h-4">
                    {idx === 0 && (
                      <td
                        className="border-r border-b border-[#e2e8f0] p-1 text-[#175294] font-black bg-blue-50/30 align-middle"
                        rowSpan={groupRows.length}
                      >
                        {GROUP_LABELS[group]}
                      </td>
                    )}
                    <td className="border-r border-b border-[#e2e8f0] p-1 text-[#0d4380] text-left pl-2">
                      <div className="flex items-center gap-1.5">
                        {row.imageSrc && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={row.imageSrc} alt="" className="w-3.5 h-3.5 rounded object-cover shrink-0" />
                        )}
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td className="border-r border-b border-[#e2e8f0] p-1 text-gray-900 font-black">
                      {row.quantity !== null && row.quantity !== undefined ? toMarathiDigits(row.quantity) : '-'}
                    </td>
                    <td className="border-b border-[#e2e8f0] p-1 text-gray-900 font-black text-right pr-2">
                      {row.value !== null && row.value !== undefined ? formatCurrencyINR(row.value) : '-'}
                    </td>
                  </tr>
                ))}
                {/* Group Total Row */}
                <tr className="bg-gray-50/50 text-[#175294] align-middle h-4">
                  <td className="border-r border-b border-[#e2e8f0] p-1 font-black text-right pr-2" colSpan={2}>
                    एकूण {GROUP_LABELS[group]}
                  </td>
                  <td className="border-r border-b border-[#e2e8f0] p-1 font-black text-gray-900">
                    {toMarathiDigits(groupQty)}
                  </td>
                  <td className="border-b border-[#e2e8f0] p-1 font-black text-gray-900 text-right pr-2">
                    {groupVal > 0 ? formatCurrencyINR(groupVal) : '-'}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
          {/* Grand Total Row */}
          <tr className="bg-[#175294] text-white align-middle h-4">
            <td className="border-r border-[#b0b6c2] p-1 font-black text-right pr-2" colSpan={2}>
              एकूण (GRAND TOTAL)
            </td>
            <td className="border-r border-[#b0b6c2] p-1 font-black">
              {toMarathiDigits(grandQty)}
            </td>
            <td className="p-1 font-black text-right pr-2">
              {grandVal > 0 ? formatCurrencyINR(grandVal) : '-'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}