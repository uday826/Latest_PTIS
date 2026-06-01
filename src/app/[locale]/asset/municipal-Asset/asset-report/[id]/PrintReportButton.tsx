'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/common';

type PrintReportButtonProps = {
  locale: string;
  id: string;
};

export function PrintReportButton({ locale, id }: PrintReportButtonProps) {
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <Button
      variant="primary"
      size="sm"
      icon={Printer}
      onClick={handlePrintReport}
      className="estate-report-print-button"
    >
      Export PDF
    </Button>
  );
}
