'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';
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

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      variant="ghost"
      size="sm"
      className="h-8 w-8 border border-white/15 bg-transparent px-0 text-white hover:bg-white/10"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}
