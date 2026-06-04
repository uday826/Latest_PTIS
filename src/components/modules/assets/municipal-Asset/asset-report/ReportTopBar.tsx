import { Card } from '@/components/common';
import { PrintReportButton, BackButton } from './PrintReportButton';

type ReportTopBarProps = {
  title: string;
};

export function ReportTopBar({ title }: ReportTopBarProps) {
  return (
    <div className="mx-auto flex w-full max-w-437.5 flex-col gap-2.5 no-print mb-4 px-2 xl:px-0">
      <Card variant="elevated" className="border-0 bg-white shadow-sm overflow-hidden">
        <div className="bg-[#0e315d] text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BackButton />
              <div>
                <h1 className="text-[20px] font-extrabold leading-none truncate max-w-2xl" title={title}>
                  {title || 'Estate Report'}
                </h1>
              </div>
            </div>
            <PrintReportButton />
          </div>
        </div>
      </Card>
    </div>
  );
}
