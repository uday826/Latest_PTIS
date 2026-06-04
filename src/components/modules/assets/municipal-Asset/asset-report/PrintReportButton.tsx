'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type PrintReportButtonProps = Record<string, never>;

export function PrintReportButton(_props: PrintReportButtonProps) {
  const restorePrintNodeRef = useRef<null | (() => void)>(null);
  const restoreInlineStylesRef = useRef<null | (() => void)>(null);
  const restoreBodyChildrenRef = useRef<null | (() => void)>(null);

  const clearPrintMode = useCallback(() => {
    if (restoreBodyChildrenRef.current) {
      restoreBodyChildrenRef.current();
      restoreBodyChildrenRef.current = null;
    }
    if (restoreInlineStylesRef.current) {
      restoreInlineStylesRef.current();
      restoreInlineStylesRef.current = null;
    }
    if (restorePrintNodeRef.current) {
      restorePrintNodeRef.current();
      restorePrintNodeRef.current = null;
    }
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

    const printableReport = document.getElementById('printable-report');
    if (printableReport?.parentElement) {
      const originalParent = printableReport.parentElement;
      const originalNextSibling = printableReport.nextSibling;

      document.body.appendChild(printableReport);
      restorePrintNodeRef.current = () => {
        if (!originalParent.isConnected) return;
        if (originalNextSibling && originalParent.contains(originalNextSibling)) {
          originalParent.insertBefore(printableReport, originalNextSibling);
        } else {
          originalParent.appendChild(printableReport);
        }
      };

      const previousStyle = printableReport.getAttribute('style');
      printableReport.style.position = 'static';
      printableReport.style.inset = 'auto';
      printableReport.style.margin = '0';
      printableReport.style.left = 'auto';
      printableReport.style.top = 'auto';
      printableReport.style.transform = 'none';
      restoreInlineStylesRef.current = () => {
        if (previousStyle === null) {
          printableReport.removeAttribute('style');
        } else {
          printableReport.setAttribute('style', previousStyle);
        }
      };

      const bodyChildren = Array.from(document.body.children).filter((child) => child !== printableReport);
      const previousBodyChildStyles = bodyChildren.map((child) => ({
        element: child as HTMLElement,
        style: (child as HTMLElement).getAttribute('style'),
      }));

      previousBodyChildStyles.forEach(({ element }) => {
        element.style.setProperty('display', 'none', 'important');
      });

      restoreBodyChildrenRef.current = () => {
        previousBodyChildStyles.forEach(({ element, style }) => {
          if (style === null) {
            element.removeAttribute('style');
          } else {
            element.setAttribute('style', style);
          }
        });
      };
    }

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
