"use client";

import React from 'react';
import { motion } from 'motion/react';
import {
  Scale,
  Heart,
  Shield,
  Check,
  X,
  AlertTriangle,
  Activity,
  LucideIcon
} from 'lucide-react';
import { Card, Badge } from '@/components/common';
import type { DetailSection, BuildingDataFields, AssetDetailController } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import { useLocale, useTranslations } from 'next-intl';

import { legalFallbackDetails } from '../../data/assetDetailMockData';

const MotionCard = motion.create(Card);

// Fallback details resolved from central data module for easy API integration
const fallbackDetails = legalFallbackDetails;

const formatDate = (dateStr: string | undefined | null | unknown, locale: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(String(dateStr));
    if (isNaN(date.getTime())) return String(dateStr);
    return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(dateStr);
  }
};

const renderBoolean = (t: (key: string) => string, val: unknown, format: 'available' | 'yes'): React.JSX.Element | null => {
  if (val === undefined || val === null) return null;
  const isTrue = val === true || String(val).toLowerCase() === 'yes' || String(val).toLowerCase() === 'available' || String(val).toLowerCase() === 'true';

  if (isTrue) {
    return (
      <Badge variant="success" size="sm" icon={Check}>
        {format === 'available' ? t('legalTab.status.available') : t('legalTab.status.yes')}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" size="sm" icon={X}>
      {format === 'available' ? t('legalTab.status.notAvailable') : t('legalTab.status.no')}
    </Badge>
  );
};

const renderRisk = (t: (key: string) => string, val: unknown): React.JSX.Element | null => {
  if (val === undefined || val === null) return null;
  const isHighRisk = val === true || String(val).toLowerCase() === 'yes' || String(val).toLowerCase() === 'high' || String(val).toLowerCase() === 'true';

  if (isHighRisk) {
    return (
      <Badge variant="destructive" size="sm" icon={AlertTriangle} className="animate-pulse">
        {t('legalTab.status.riskIdentified')}
      </Badge>
    );
  }

  return (
    <Badge variant="success" size="sm" icon={Check}>
      {t('legalTab.status.noStructuralRisk')}
    </Badge>
  );
};

const renderCondition = (val: string): React.JSX.Element => {
  return (
    <Badge variant="default" size="sm" icon={Activity}>
      {val}
    </Badge>
  );
};

const renderCertificateStatus = (t: (key: string) => string, locale: string, certNumber: unknown, certDate: unknown): React.JSX.Element => {
  if (certNumber) {
    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge variant="success" size="sm" icon={Check}>
          {t('legalTab.status.available')}
        </Badge>
        <div className="text-[11px] font-semibold text-slate-800 leading-normal mt-0.5">
          {t('legalTab.prefixes.no')} {String(certNumber)} {certDate ? `(${formatDate(certDate, locale)})` : ''}
        </div>
      </div>
    );
  }

  return (
    <Badge variant="secondary" size="sm" icon={X}>
      {t('legalTab.status.notAvailable')}
    </Badge>
  );
};

const buildDetailSections = (t: (key: string) => string, locale: string): DetailSection[] => [
  {
    title: t('legalTab.sectionTitles.buildingApproval'),
    icon: Scale,
    fields: [
      {
        label: t('legalTab.labels.approvedBuildingPlan'),
        value: (d: BuildingDataFields): React.JSX.Element => renderCertificateStatus(t, locale, d.sanctionedPlanNumber, d.sanctionDate)
      },
      {
        label: t('legalTab.labels.completionCertificate'),
        value: (d: BuildingDataFields): React.JSX.Element => renderCertificateStatus(t, locale, d.completionCertificateNumber, d.completionCertificateDate)
      },
      {
        label: t('legalTab.labels.occupancyCertificate'),
        value: (d: BuildingDataFields): React.JSX.Element => renderCertificateStatus(t, locale, d.occupancyCert, d.occupancyCertDate)
      },
      {
        label: t('legalTab.labels.emergencyExit'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.emergencyExitAvailable, 'available')
      },
      {
        label: t('legalTab.labels.structuralRisk'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderRisk(t, d.structuralRiskIdentified)
      },
      {
        label: t('legalTab.labels.fireSafetyClearance'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.fireSafetyAvailable, 'available')
      },
      {
        label: t('legalTab.labels.liftFacility'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.liftAvailable, 'available')
      },
      {
        label: t('legalTab.labels.buildingCondition'),
        value: (d: BuildingDataFields): React.JSX.Element | null => d.buildingCondition ? renderCondition(String(d.buildingCondition)) : null
      },
      {
        label: t('legalTab.labels.legalRemarks'),
        value: (d: BuildingDataFields): React.ReactNode => d.legalRemarks ? String(d.legalRemarks) : null
      }
    ]
  },
  {
    title: t('legalTab.sectionTitles.socialWater'),
    icon: Heart,
    fields: [
      {
        label: t('legalTab.labels.waterConnectionStatus'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.waterConnectionAvailable, 'available')
      },
      {
        label: t('legalTab.labels.rainwaterHarvesting'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.rainwaterHarvesting, 'available')
      },
      {
        label: t('legalTab.labels.waterConnectionMeter'),
        value: (d: BuildingDataFields): React.ReactNode => d.waterMeterNumber ? `${t('legalTab.prefixes.meterNo')} ${String(d.waterMeterNumber)} (${formatDate(d.waterConnectionDate, locale)})` : null
      },
      {
        label: t('legalTab.labels.solarPanelInstalled'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.solarPanelSystemInstalled, 'yes')
      },
      {
        label: t('legalTab.labels.separateMeterFloorWise'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.separateMeterFloorwise, 'available')
      },
      {
        label: t('legalTab.labels.solarSystemCapacity'),
        value: (d: BuildingDataFields): React.ReactNode => d.solarCapacity ? `${String(d.solarCapacity)} (${formatDate(d.solarInstallationDate, locale)})` : null
      }
    ]
  },
  {
    title: t('legalTab.sectionTitles.safetySecurity'),
    icon: Shield,
    fields: [
      {
        label: t('legalTab.labels.fireExtinguisherAvailable'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.fireExtinguisherAvailable, 'available')
      },
      {
        label: t('legalTab.labels.cctvSurveillanceCoverage'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.cctvCoverage, 'available')
      },
      {
        label: t('legalTab.labels.emergencyAlarmSystem'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.emergencyAlarmSystem, 'available')
      },
      {
        label: t('legalTab.labels.visitorAccessControl'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.visitorAccessControl, 'available')
      },
      {
        label: t('legalTab.labels.biometricAccessControl'),
        value: (d: BuildingDataFields): React.JSX.Element | null => renderBoolean(t, d.biometricAccessControl, 'available')
      }
    ]
  }
];

export function LegalPlanningTabContent({ controller }: { controller: AssetDetailController }): React.JSX.Element {
  const { asset, buildingData } = controller;
  const t = useTranslations('municipalAsset');
  const locale = useLocale();

  // Merge high-fidelity realistic fallbacks with actual buildingData
  const activeFallback = fallbackDetails[asset.id] || fallbackDetails['DEFAULT'];
  const mergedData = { ...activeFallback, ...buildingData } as BuildingDataFields;

  const sections = buildDetailSections(t, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pr-6 space-y-5"
    >
      {sections.map((section, sIdx) => {
        const SectionIcon = section.icon as LucideIcon;

        const activeFields = section.fields
          .map(field => {
            const valNode = field.value(mergedData);
            return {
              ...field,
              renderedNode: valNode
            };
          })
          .filter(field => field.renderedNode !== null && field.renderedNode !== undefined && field.renderedNode !== '');

        if (activeFields.length === 0) return null;

        return (
          <MotionCard
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: sIdx * 0.08 }}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            padding="none"
          >
            {/* Akola Module Coordinated Header: light blue (#E6F2FF) background with dark text (#0F172B) */}
            <div className="px-4 py-3 flex items-center gap-2.5 border-b border-blue-200/60 bg-[#E6F2FF]">
              <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center border border-blue-200 shadow-sm">
                <SectionIcon className="w-3.5 h-3.5 text-slate-800" />
              </div>
              <h3 className="text-xs font-bold tracking-tight text-[#0F172B] uppercase">{section.title}</h3>
            </div>

            {/* Grid Layout presentation grid - 4 columns inside each horizontal card */}
            <div className="p-4 bg-gradient-to-br from-white to-slate-50/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeFields.map((field, fIdx) => {
                  return (
                    <div
                      key={fIdx}
                      className="flex flex-col gap-1 p-2 px-3 rounded bg-[#F8FAFC] border border-slate-100/80 hover:border-slate-200/80 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.015)]"
                    >
                      {/* Ultra-high-contrast labels for absolute readability */}
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        {field.label}
                      </span>
                      {/* Premium body text */}
                      <div className="text-[12px] font-bold text-slate-900 leading-normal">
                        {field.renderedNode}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </MotionCard>
        );
      })}
    </motion.div>
  );
}
