import React from 'react';
import Image from 'next/image';
import { DynamicQRCode } from './DynamicQRCode';

type ReportPropertyHeaderTableProps = {
  wardNo: string;
  assetId: string;
  partNo: string;
  citySurveyNo: string;
  plotNo: string;
  constructionAreaSqMeter: string;
  openPlotAreaSqMeter: string;
};

type ReportSummarySectionProps = {
  assetId: string;
  authorityName: string;
  organizationName: string;
  departmentName: string;
  citySurvey: string;
  ownershipType: string;
  purchaseValue: string;
  marketValue: string;
  title: string;
  address: string;
  hasLift: string;
  isRevenueGenerating: string;
  assetCondition: string;
  description: string;
  operationalControl: string;
  propertyHeaderTable?: ReportPropertyHeaderTableProps;
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

export function ReportSummarySection({
  assetId,
  authorityName,
  organizationName,
  departmentName,
  citySurvey,
  ownershipType,
  purchaseValue,
  marketValue,
  title,
  address,
  hasLift,
  isRevenueGenerating,
  assetCondition,
  description,
  operationalControl,
  propertyHeaderTable,
}: ReportSummarySectionProps) {
  return (
    <>
      <div className="flex justify-between items-start pb-2 mb-3 rounded-b-2xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12.5 h-12.5 shrink-0">
            <Image
              src="/akola Logo.png"
              alt="Akola Municipal Corporation Logo"
              width={50}
              height={50}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="border border-black rounded-lg px-3 py-2">
            <h1 className="text-[20px] font-black leading-tight tracking-wide text-[#0d4380]">अकोला महानगरपालिका, अकोला</h1>
            <h2 className="text-[10px] font-bold text-gray-800 tracking-wide mt-1">महाराष्ट्र महानगरपालिका अधिनियम १९४९ चे प्रकरण ११ व ८ कराधन नियम अन्वये मालमत्ता विवरण तक्ता</h2>
            <div className="inline-block text-white font-bold px-4 py-0.75 rounded-full mt-2 text-[10px] shadow-sm bg-[#175294]">महानगरपालिका मालमत्ता - आरोग्य संस्था माहिती</div>
          </div>
        </div>

        {propertyHeaderTable && (
          <div className="overflow-hidden rounded-[10px] border border-[#b0b6c2] bg-white shadow-sm mx-2 mt-1.5" style={{ maxWidth: '460px' }}>
            <table className="w-full table-fixed border-collapse text-center text-[9px] font-bold leading-[1.1] text-[#0d4380]">
              <thead>
                <tr className="bg-gray-100/80">
                  {columns.map((column, index) => (
                    <th
                      key={column.key}
                      className={[
                        'border-b border-[#b0b6c2] px-1 py-0.5 align-middle',
                        index !== columns.length - 1 ? 'border-r border-[#b0b6c2]' : '',
                      ].join(' ')}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr className="bg-white align-middle">
                  {columns.map((column, index) => (
                    <td
                      key={column.key}
                      className={[
                        'px-1 py-0.5 align-middle text-[9px] font-bold text-[#0d4380]',
                        index !== columns.length - 1 ? 'border-r border-[#e2e8f0]' : '',
                      ].join(' ')}
                    >
                      {propertyHeaderTable[column.key] || '-'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col items-center shrink-0 w-28 relative z-20 pt-1">
          <div className="border border-[#b0b6c2] p-1 rounded-md w-25 bg-white shadow-sm flex items-center justify-center min-h-6">
            <DynamicQRCode assetId={assetId.toString()} />
          </div>
          <div className="relative border border-[#b0b6c2] rounded-md w-full mt-2.5 pt-2 pb-1.5 px-1.5 flex justify-center bg-white shadow-sm z-10">
            <div className="absolute -top-2 bg-[#175294] text-white text-[8px] px-2.5 py-0.5 rounded-sm font-bold tracking-wider leading-none shadow-sm whitespace-nowrap">मालमत्ता क्रमांक</div>
            <div className="font-black text-[8px] tracking-widest text-gray-900 leading-[1.2] text-center break-all mt-0.5">{assetId}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3 shrink-0">
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="border border-[#b0b6c2] rounded-[10px] overflow-hidden shadow-sm text-[10px] leading-tight text-[#0d4380]">
            <div className="grid grid-cols-[84px_92px_64px_96px_70px_1fr_1fr]">
              <div className="border-r border-b border-[#b0b6c2] px-0.75 py-0.75 flex items-center justify-center font-bold bg-white">प्राधिकरणाचे नाव</div>
              <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">संस्थेचे नाव</div>
              <div className="border-r border-b border-[#b0b6c2] px-0.75 py-1.5 flex items-center justify-center font-bold bg-white">विभागाचे नाव</div>
              <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">सिटी सर्वे क्रमांक</div>
              <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">मालकी प्रकार</div>
              <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">खरेदी मूल्य</div>
              <div className="border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">बाजार मूल्य</div>

              <div className="border-r border-[#b0b6c2] px-0.75 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{authorityName}</div>
              <div className="border-r border-[#b0b6c2] px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{organizationName}</div>
              <div className="border-r border-[#b0b6c2] px-1 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{departmentName}</div>
              <div className="border-r border-[#b0b6c2] px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{citySurvey}</div>
              <div className="border-r border-[#b0b6c2] px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{ownershipType}</div>
              <div className="border-r border-[#b0b6c2] px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{purchaseValue}</div>
              <div className="px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{marketValue}</div>
            </div>
          </div>

          <div className="border border-[#b0b6c2] rounded-[10px] overflow-hidden shadow-sm text-[11px] leading-tight text-[#0d4380]">
            <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr]">
              <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center font-bold bg-white">मालमत्तेचे नाव</div>
              <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center text-[#cc0c0c] font-black">{title}</div>
              <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">लिफ्ट उपलब्ध आहे का?</div>
              <div className="border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">मालमत्तेची अवस्था</div>

              <div className="border-r border-[#b0b6c2] px-2 py-1.5 flex items-center  font-black">पत्ता :</div>
              <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center text-[#cc0c0c] font-black">{address}</div>
              <div className="border-r border-[#b0b6c2] px-2 py-1.5 grid grid-cols-2">
                <div className="border-r border-[#b0b6c2] px-2 text-center">
                  <div className="font-bold">लिफ्ट उपलब्ध</div>
                  <div className="mt-0.5 text-[12px] text-gray-700">{hasLift}</div>
                </div>
                <div className="px-2 text-center">
                  <div className="font-bold">महसूल निर्माण</div>
                  <div className="mt-0.5 text-[12px] text-gray-700">{isRevenueGenerating}</div>
                </div>
              </div>
              <div className="border-[#b0b6c2] px-2 py-1.5 flex items-center text-[#cc0c0c] font-black">{assetCondition === '-' ? description : assetCondition}</div>
            </div>
          </div>
        </div>

        <div className="w-82.5 relative border border-[#b0b6c2] rounded-[10px] p-3 pt-6 shadow-sm bg-gray-50/30">
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white px-8 py-0.5 rounded-full text-[11px] font-black tracking-widest shadow-sm border-[1.5px] border-white bg-[#175294]">KYC</div>
          <div className="flex flex-col gap-2 h-full justify-center text-[11px] font-bold text-[#0d4380]">
            <div className="flex gap-2 text-gray-700 items-center">
              <span className="w-32.5 text-[#0d4380]">प्राधिकरणाचे नाव :</span>
              <span className="text-[12px] text-[#cc0c0c]">{authorityName}</span>
            </div>
            <div className="flex gap-2 border-t border-dashed border-gray-300 pt-2 text-gray-700 items-center">
              <span className="w-32.5 text-[#0d4380]">संस्थेचे नाव :</span>
              <span className="text-[12px] text-[#cc0c0c]">{organizationName}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-300 pt-2 bg-gray-100/50 -mx-3 -mb-3 p-2 px-6 rounded-b-[10px] text-gray-700">
              <span>विभागाचे नाव :- {departmentName}</span>
              <span>कार्यकारी नियंत्रण विभाग :- {operationalControl}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
