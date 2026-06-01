'use client';

import { useEffect, useState } from 'react';
import { ConfigurationService } from '@/services/asset/configuration.service';
import { DynamicScreenRenderer } from '@/components/modules/assets/shared/DynamicScreenRenderer';
import { Card } from '@/components/common';
import { ScreenConfig } from '@/types/asset.types';
import * as LucideIcons from 'lucide-react';

interface DynamicAssetPageClientProps {
  slug: string[];
  locale: string;
}

export default function DynamicAssetPageClient({ slug, locale }: DynamicAssetPageClientProps) {
  const [config, setConfig] = useState<ScreenConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const routePath1 = `/asset/${slug.join('/')}`;
      const routePath2 = `/asset/ScreenField/${slug.join('/')}`;
      try {
        let screenConfig = await ConfigurationService.getScreenByRoute(routePath1);
        if (!screenConfig) {
          screenConfig = await ConfigurationService.getScreenByRoute(routePath2);
        }
        setConfig(screenConfig);
      } catch (err) {
        console.error('Failed to fetch config', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // Common UI Layout wrapper inside client
  const renderLayout = (
    title: string,
    description: string | undefined,
    Icon: any,
    breadcrumb: React.ReactNode,
    children: React.ReactNode
  ) => {
    return (
      <>
        <Card className="flex justify-between items-center p-4 shadow-sm rounded-xl bg-white border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-sm text-gray-500 font-medium">{description}</p>
              )}
            </div>
          </div>
        </Card>
        <div className="mt-4 mb-2 flex items-center justify-between gap-4">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {breadcrumb}
            <div id="breadcrumb-portal" className="flex justify-end" />
          </div>
        </div>
        <div className="mt-1 w-full animate-in fade-in duration-500">
          {children}
        </div>
      </>
    );
  };

  if (!config) {
    return renderLayout(
      slug[slug.length - 1].replace(/-/g, ' '),
      "Asset module page content",
      LucideIcons.Monitor,
      null,
      (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <LucideIcons.Construction className="w-12 h-12 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Under Construction</h2>
          <p className="text-slate-500 max-w-md">
            The page for <span className="font-mono text-blue-600">/asset/{slug.join('/')}</span> is currently being developed or lacks dynamic configuration.
          </p>
        </div>
      )
    );
  }

  const IconComponent = (LucideIcons as any)[config.screenIcon || 'Monitor'] || LucideIcons.Monitor;

  return renderLayout(
    config.screenName,
    config.purpose || 'Manage data for this screen',
    IconComponent,
    (
      <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
        <span>Asset</span>
        <LucideIcons.ChevronRight size={12} />
        <span className="text-slate-600 uppercase tracking-widest">{config.screenCode}</span>
      </div>
    ),
    (
      <div className="mt-2">
        <DynamicScreenRenderer config={config} />
      </div>
    )
  );
}

