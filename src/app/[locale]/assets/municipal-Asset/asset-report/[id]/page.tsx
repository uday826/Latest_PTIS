import {
  ReportConstructionTable,
  ReportFooterInfo,
  ReportMediaSection,
  ReportSummarySection,
  ReportTopBar,
  firstAvailable,
  formatText,
  getEstateReportViewModel,
  getField,
  getFirstImage,
  pickText,
  toMarathiDigits,
} from '@/components/modules/assets/municipal-Asset/asset-report';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Estate Report | ${id}` };
}

export default async function MunicipalAssetReportPage({ params }: PageProps) {
  const { id } = await params;
  const reportData = await getEstateReportViewModel(id);

  if (!reportData) notFound();

  const {
    record,
    title,
    assetId,
    authorityName,
    organizationName,
    departmentName,
    citySurvey,
    ownershipType,
    purchaseValue,
    marketValue,
    address,
    hasLift,
    isRevenueGenerating,
    assetCondition,
    description,
    operationalControl,
    isBuildingCategory,
    constructionRows,
    onSpotSrc,
    dpPlanSrc,
    digitalPlanSrc,
    assetTypeName,
    occupancyStatus,
    isActive,
    purchaseDate,
    marketValueDate,
  } = reportData;

  return (
    <div className="min-h-screen bg-[#e5e7eb] p-1 font-sans text-slate-900">
      <ReportTopBar title={title} />
      <div className="mx-auto max-w-319.5">
        <div className="w-full overflow-x-auto print:p-0 flex justify-center custom-scrollbar">
          <div
            id="printable-report"
            className="w-[297mm] h-[210mm] min-w-[297mm] min-h-[210mm] py-[6mm] px-[7mm] rounded-[14px] bg-white border border-gray-300 shadow-[0_8px_18px_rgba(15,23,42,0.06)] print:shadow-none print:border-none relative overflow-hidden box-border"
          >
            <div className="relative z-10 font-sans text-gray-900 h-full flex flex-col">
              <ReportSummarySection
                assetId={assetId}
                authorityName={authorityName}
                organizationName={organizationName}
                departmentName={departmentName}
                citySurvey={citySurvey}
                ownershipType={ownershipType}
                purchaseValue={purchaseValue}
                marketValue={marketValue}
                title={title}
                address={address}
                hasLift={hasLift}
                isRevenueGenerating={isRevenueGenerating}
                assetCondition={assetCondition}
                description={description}
                operationalControl={operationalControl}
              />

              <div className="flex flex-col gap-3 flex-1 min-h-0">
                <div className="flex flex-col gap-3 min-w-0">
                  <ReportConstructionTable
                    isBuildingCategory={isBuildingCategory}
                    constructionRows={constructionRows}
                    formatText={formatText}
                    toMarathiDigits={toMarathiDigits}
                    getField={getField}
                    firstAvailable={firstAvailable}
                  />

                  <ReportMediaSection
                    title={title}
                    record={record}
                    onSpotSrc={onSpotSrc}
                    dpPlanSrc={dpPlanSrc}
                    digitalPlanSrc={digitalPlanSrc}
                    getFirstImage={getFirstImage}
                  />
                </div>

                <div className="hidden w-82.5 flex-col gap-3 shrink-0 h-full" />
              </div>

              <ReportFooterInfo
                record={record}
                assetTypeName={assetTypeName}
                occupancyStatus={occupancyStatus}
                isActive={isActive}
                purchaseDate={purchaseDate}
                marketValueDate={marketValueDate}
                pickText={pickText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



