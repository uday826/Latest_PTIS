import type { ReactNode } from 'react';
import { AssetRegisterClientWrapper } from '@/components/modules/assets/municipal-Asset/AssetRegisterClientWrapper';

interface AssetRegisterLayoutProps {
  children: ReactNode;
}

export default function AssetRegisterLayout({ children }: AssetRegisterLayoutProps) {
  return (
    <AssetRegisterClientWrapper>
      {children}
    </AssetRegisterClientWrapper>
  );
}
