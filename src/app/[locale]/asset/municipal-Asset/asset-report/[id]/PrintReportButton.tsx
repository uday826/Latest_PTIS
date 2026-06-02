'use client';

import { useCallback, useEffect } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/common';

type PrintReportButtonProps = {
  locale: string;
  id: string;
};

export function PrintReportButton({ locale, id }: PrintReportButtonProps) {
  const clearPrintMode = useCallback(() => {
    document.documentElement.classList.remove('printing-asset-report');
    document.body.classList.remove('printing-asset-report');
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => {
      clearPrintMode();
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      clearPrintMode();
    };
  }, [clearPrintMode]);

  const handlePrintReport = useCallback(() => {
    clearPrintMode();

    document.documentElement.classList.add('printing-asset-report');
    document.body.classList.add('printing-asset-report');

    // Give the browser a frame to apply the print-only shell reset before opening print preview.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  }, [clearPrintMode]);

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
