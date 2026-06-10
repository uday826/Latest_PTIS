type ReportPropertyHeaderTableProps = {
  wardNo: string;
  assetId: string;
  partNo: string;
  citySurveyNo: string;
  plotNo: string;
  constructionAreaSqMeter: string;
  openPlotAreaSqMeter: string;
};

const columns = [
  {
    key: 'wardNo',
    label: (
      <>
        वॉर्ड क्र.
      </>
    ),
  },
  {
    key: 'assetId',
    label: (
      <>
        मालमत्ता
        <br />
        आय डी
      </>
    ),
  },
  {
    key: 'partNo',
    label: (
      <>
        भाग क्र.
      </>
    ),
  },
  {
    key: 'citySurveyNo',
    label: (
      <>
        सिटी सर्वे क्र.
      </>
    ),
  },
  {
    key: 'plotNo',
    label: (
      <>
        प्लॉट क्र.
      </>
    ),
  },
  {
    key: 'constructionAreaSqMeter',
    label: (
      <>
        बांधकाम क्षेत्रफळ
        <br />
        (चौ. मी.)
      </>
    ),
  },
  {
    key: 'openPlotAreaSqMeter',
    label: (
      <>
        खुला भूखंड क्षेत्रफळ
        <br />
        (चौ. मी.)
      </>
    ),
  },
] as const;

export function ReportPropertyHeaderTable({
  wardNo,
  assetId,
  partNo,
  citySurveyNo,
  plotNo,
  constructionAreaSqMeter,
  openPlotAreaSqMeter,
}: ReportPropertyHeaderTableProps) {
  const values = {
    wardNo,
    assetId,
    partNo,
    citySurveyNo,
    plotNo,
    constructionAreaSqMeter,
    openPlotAreaSqMeter,
  };

  return (
    <div className="mb-3 shrink-0 overflow-hidden rounded-[8px] border border-[#8f8f8f] bg-white shadow-sm">
      <table className="w-full table-fixed border-collapse text-center text-[9px] font-black leading-[1.15] text-[#2f2f2f]">
        <thead>
          <tr className="bg-white">
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={[
                  'h-10 border-b border-[#b8b8b8] px-1.5 py-1 align-middle',
                  index !== columns.length - 1 ? 'border-r border-[#b8b8b8]' : '',
                  column.key === 'constructionAreaSqMeter' || column.key === 'openPlotAreaSqMeter'
                    ? 'w-[18%]'
                    : 'w-[10.66%]',
                ].join(' ')}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {columns.map((column, index) => (
              <td
                key={column.key}
                className={[
                  'h-4 px-1.5 py-1 align-middle text-[10px] font-black text-black',
                  index !== columns.length - 1 ? 'border-r border-[#b8b8b8]' : '',
                ].join(' ')}
              >
                {values[column.key] || '-'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}