import { ReactNode } from 'react';

export default function ValuationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}
