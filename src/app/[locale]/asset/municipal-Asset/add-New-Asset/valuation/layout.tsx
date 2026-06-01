import { ReactNode } from 'react';
import { Card } from '@/components/common';
import { IndianRupee } from 'lucide-react';

export default function ValuationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-3 border border-blue-200 bg-blue-50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <IndianRupee className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <div className="text-lg font-semibold text-blue-800">Asset Valuation Summary</div>
          <div className="text-sm text-blue-600">Final Asset Valuation Summary</div>
        </div>
      </Card>

      {children}
    </div>

  );
}
