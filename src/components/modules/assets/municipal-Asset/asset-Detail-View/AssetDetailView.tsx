"use client";

// Asset Detail View Component - Municipal Estate Management System
import { Button, Card } from '@/components/common';
import { useAssetDetailController } from '@/hooks/asset-hooks/asset-detail-view-hooks/useAssetDetailController';
import type { AssetDetailViewContentProps, AssetDetailViewProps } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React from 'react';
import { MunicipalAsset, municipalAssets } from '../data/municipalAssets';
import { AssetDetailSummaryBar } from './AssetDetailSummaryBar';
import { AssetDetailTabsLayout } from './AssetDetailTabsLayout';
import { ImageLightboxModal } from './ImageLightboxModal';

export function AssetDetailView({ asset: propAsset, assetId, onBack }: AssetDetailViewProps): React.JSX.Element {
  const t = useTranslations('municipalAsset');
  const params = useParams();
  
  // Resolve asset using either prop, assetId, or route parameters
  const resolvedAssetId = assetId || (params?.id as string) || '';

  const asset = React.useMemo(() => {
    if (propAsset) return propAsset;

    // Search in municipalAssets
    const foundInMunicipal = municipalAssets.find((item: MunicipalAsset) => item.id === resolvedAssetId);
    if (foundInMunicipal) return foundInMunicipal;

    return null;
  }, [propAsset, resolvedAssetId]);

  const handleBack = (): void => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  // Safety check: Ensure asset object exists
  if (!asset) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Card className="text-center p-8 bg-white border border-slate-200 shadow-sm max-w-sm" padding="none">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">{t('notFound.title')}</h2>
          <p className="text-sm text-slate-500 mb-4">{t('notFound.description', { id: resolvedAssetId })}</p>
          <Button onClick={handleBack} variant="primary" size="sm" className="font-bold shadow-sm transition-all mx-auto">
            {t('notFound.goBack')}
          </Button>
        </Card>
      </div>
    );
  }

  // Only support building-category assets in this detail view.
  if (asset.category !== 'building') {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Card className="text-center p-8 bg-white border border-slate-200 shadow-sm max-w-sm" padding="none">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">{t('notSupported.title')}</h2>
          <p className="text-sm text-slate-500 mb-4">{t('notSupported.description', { category: asset.category })}</p>
          <Button onClick={handleBack} variant="primary" size="sm" className="font-bold shadow-sm transition-all mx-auto">
            {t('notFound.goBack')}
          </Button>
        </Card>
      </div>
    );
  }

  return <AssetDetailViewContent asset={asset} onBack={handleBack} />;
}

function AssetDetailViewContent({ asset, onBack }: AssetDetailViewContentProps): React.JSX.Element {
  const t = useTranslations('municipalAsset');
  const controller = useAssetDetailController(asset);

  return (
    <div className="mb-3 flex flex-col">
      {/* Header - Compact */}
      <div className="flex-shrink-0 pb-[12px] flex items-center justify-between border-b border-municipal-primary/10 pr-[16px] pl-[16px] px-[16px] bg-[#E6F2FF]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 hover:bg-white rounded-lg transition-colors text-municipal-deep h-9 w-9 min-w-0 flex items-center justify-center"
            aria-label={t('header.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl text-[rgb(0,0,0)] font-bold text-[20px]">{asset.name}</h1>
            <p className="text-sm text-municipal-primary/70 text-[13px] text-[rgba(0,0,0,0.7)]">{asset.assetType}{asset.zone ? ` • ${asset.zone}` : ''}</p>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <AssetDetailSummaryBar controller={controller} />

      {/* Tabs - Redesigned with Modern UI */}
      <AssetDetailTabsLayout controller={controller} />

      {/* Unified Image Lightbox Modal */}
      {controller.lightboxOpen && controller.lightboxImages.length > 0 && (
        <ImageLightboxModal
          assetName={asset.name}
          images={controller.lightboxImages}
          index={controller.lightboxIndex}
          title={controller.lightboxTitle}
          onClose={controller.closeLightbox}
          onNext={controller.nextImage}
          onPrev={controller.prevImage}
          onSelectIndex={controller.setLightboxIndex}
          onKeyDown={controller.handleLightboxKeyDown}
        />
      )}
    </div>
  );
}
