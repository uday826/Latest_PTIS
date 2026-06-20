
'use client';

import type { AssetDetailRecord, AssetDocumentListItem } from '@/types/municipal-asset/detail-tabs.types';
import { ClipboardList, Map, Coins, Scale, Contact, FileText, Image as ImageIcon, Phone, Mail, Navigation, DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? 'NA' : String(value);
}

function formatArea(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return `${num.toLocaleString('en-IN')} sq.m`;
}

export function OverviewTab({ asset }: { asset: AssetDetailRecord }) {
  const t = useTranslations('assetDetail');

  const photos = asset.photosAndPlans?.filter((item: AssetDocumentListItem) => item.bindingPurpose?.toLowerCase() === 'asset image') ?? [];
  const plans = asset.photosAndPlans?.filter((item: AssetDocumentListItem) => item.bindingPurpose?.toLowerCase() === 'asset photo plan') ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 bg-slate-50/30 p-4 rounded-xl">
      {/* Top 3-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Column: Basic Information */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 rounded-t-xl">
              <ClipboardList className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-800">{t('overviewTab.basicInfo', { defaultValue: 'Basic Information' })}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.assetName', { defaultValue: 'Asset Name' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right max-w-[60%]">{blank(asset.assetName)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.owningDepartment', { defaultValue: 'Owning Department' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right max-w-[60%]">{blank(asset.departmentName)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.ownershipType', { defaultValue: 'Ownership Type' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.ownershipType)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.type', { defaultValue: 'Type' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.assetTypeName)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.status', { defaultValue: 'Status' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.status)}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.condition', { defaultValue: 'Condition' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.assetCondition)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Property, Area & Building details */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Property & Registration Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 bg-emerald-50/70 border-b border-emerald-100 px-4 py-2">
              <ClipboardList className="h-4 w-4 text-emerald-700" />
              <h3 className="text-xs font-bold text-emerald-800">{t('overviewTab.propertyRegistration', { defaultValue: 'Property & Registration Details' })}</h3>
            </div>
            <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.assetWardNo', { defaultValue: 'Ward Number' })}</p>
                <p className="font-bold text-slate-700">{blank(asset.assetWardNo)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.partitionNo', { defaultValue: 'Partition Number' })}</p>
                <p className="font-bold text-slate-700">{blank(asset.partitionNo)}</p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 bg-purple-50/70 border-b border-purple-100 px-4 py-2">
              <Map className="h-4 w-4 text-purple-700" />
              <h3 className="text-xs font-bold text-purple-800">{t('overviewTab.propertyDetailsCard', { defaultValue: 'Property Details' })}</h3>
            </div>
            <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="col-span-2">
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.address', { defaultValue: 'Address' })}</p>
                <p className="font-bold text-slate-700">{blank(asset.address)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.locality', { defaultValue: 'Locality' })}</p>
                <p className="font-bold text-slate-700">{blank(asset.locality)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.pinCode', { defaultValue: 'Pin Code' })}</p>
                <p className="font-bold text-slate-700">{blank(asset.pinCode)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.latitude', { defaultValue: 'Latitude' })}</p>
                <p className="font-bold text-slate-700">{blank(asset.latitude)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.longitude', { defaultValue: 'Longitude' })}</p>
                <p className="font-bold text-slate-700">{blank(asset.longitude)}</p>
              </div>
            </div>
          </div>

          {/* Area Measurements */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 bg-blue-50/70 border-b border-blue-100 px-4 py-2">
              <Scale className="h-4 w-4 text-blue-700" />
              <h3 className="text-xs font-bold text-blue-800">{t('overviewTab.areaMeasurements', { defaultValue: 'Area Measurements' })}</h3>
            </div>
            <div className="p-3 grid grid-cols-3 gap-x-4 gap-y-2 text-xs border-b border-slate-100">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.landArea', { defaultValue: 'Plot Area' })}</p>
                <p className="font-bold text-slate-700">{formatArea(asset.landAreaSqMeter)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.builtUpArea', { defaultValue: 'Built-up Area' })}</p>
                <p className="font-bold text-slate-700">{formatArea(asset.builtUpAreaSqMeter)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.carpetArea', { defaultValue: 'Carpet Area' })}</p>
                <p className="font-bold text-slate-700">{formatArea(asset.carpetAreaSqMeter)}</p>
              </div>
            </div>
            {/* Dimensions Subsection */}
            <div className="bg-slate-50/50 p-3">
              <p className="text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-wider">{t('overviewTab.dimensionsLand', { defaultValue: 'Dimensions' })}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.totalLength', { defaultValue: 'Total Length' })}</p>
                  <p className="font-bold text-slate-700">{asset.totalLength ? `${asset.totalLength} m` : '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.averageWidth', { defaultValue: 'Average Width' })}</p>
                  <p className="font-bold text-slate-700">{asset.averageWidth ? `${asset.averageWidth} m` : '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Building Structure */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 bg-orange-50/70 border-b border-orange-100 px-4 py-2">
              <Coins className="h-4 w-4 text-orange-700" />
              <h3 className="text-xs font-bold text-orange-800">{t('overviewTab.buildingStructure', { defaultValue: 'Building Structure' })}</h3>
            </div>
            <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('floorTab.totalFloors', { defaultValue: 'Total Floors' })}</p>
                <p className="font-bold text-slate-700">{blank(asset.floorSummary?.totalFloors)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{t('overviewTab.hasLift', { defaultValue: 'Has Lift' })}</p>
                <p className="font-bold text-slate-700">
                  {asset.hasLift 
                    ? t('overviewTab.yes', { defaultValue: 'Yes' }) 
                    : t('overviewTab.no', { defaultValue: 'No' })
                  }
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Land Photographs & Development Plan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2 text-slate-700">
              <ImageIcon className="h-4 w-4" />
              <h4 className="text-xs font-bold">{t('overviewTab.assetImage', { defaultValue: 'Asset Image' })}</h4>
            </div>
            <div className="space-y-2">
              {photos.length > 0 ? (
                <div className="space-y-2">
                  {photos.map((p: AssetDocumentListItem) => (
                    <a key={p.id} href={`/api/documents/${p.documentGuid}/download`} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={`/api/documents/${p.documentGuid}/view`}
                        alt={p.name || "Asset Photograph"}
                        className="w-full h-auto aspect-video rounded-lg object-cover border border-slate-200 hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-400">{t('overviewTab.noImageAvailable', { defaultValue: 'No Image Available' })}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2 text-slate-700">
              <FileText className="h-4 w-4" />
              <h4 className="text-xs font-bold">{t('overviewTab.developmentPlan', { defaultValue: 'Development Plan' })}</h4>
            </div>
            <div className="space-y-2">
              {plans.length > 0 ? (
                <div className="space-y-2">
                  {plans.map((p: AssetDocumentListItem) => (
                    <a key={p.id} href={`/api/documents/${p.documentGuid}/download`} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={`/api/documents/${p.documentGuid}/view`}
                        alt={p.name || "Development Plan"}
                        className="w-full h-auto aspect-video rounded-lg object-cover border border-slate-200 hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 relative overflow-hidden group">
                  <span className="text-[10px] font-semibold text-slate-400">{t('overviewTab.noPlanUploaded', { defaultValue: 'No Plan Uploaded' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Layout sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Land & Administration Details */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 rounded-t-xl">
              <Map className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-800">{t('overviewTab.landAdminDetails', { defaultValue: 'Land & Administration Details' })}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.mouja', { defaultValue: 'Mouja (City)' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right max-w-[60%]">{blank(asset.moujaName)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.authorityName', { defaultValue: 'Authority Name' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right max-w-[60%]">{blank(asset.authorityName)}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.organization', { defaultValue: 'Organization Name' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right max-w-[60%]">{blank(asset.organizationName)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Occupancy & Condition Details */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 rounded-t-xl">
              <ClipboardList className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-800">{t('overviewTab.occupancyConditionDetails', { defaultValue: 'Occupancy & Condition Details' })}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.occupancyStatus', { defaultValue: 'Occupancy Status' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.occupancyStatus)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.isRevenueGenerating', { defaultValue: 'Revenue Generating' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">
                  {asset.isRevenueGenerating 
                    ? t('overviewTab.yes', { defaultValue: 'Yes' }) 
                    : t('overviewTab.no', { defaultValue: 'No' })
                  }
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.operationalControl', { defaultValue: 'Operational Control' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.operationalControl)}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.condition', { defaultValue: 'Asset Condition' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.assetCondition)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Valuation Details */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 rounded-t-xl">
              <DollarSign className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-800">{t('overviewTab.financialValuationDetails', { defaultValue: 'Financial & Valuation Details' })}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.capitalValue', { defaultValue: 'Capital Value' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">
                  {asset.capitalValue !== null && asset.capitalValue !== undefined ? `₹ ${asset.capitalValue.toLocaleString('en-IN')}` : '-'}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.lastCVCalculationDate', { defaultValue: 'Last Valuation Date' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">
                  {asset.lastCVCalculationDate ? new Date(asset.lastCVCalculationDate).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Guardian/Manager */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 rounded-t-xl">
              <Contact className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-800">{t('overviewTab.assetGuardianManager', { defaultValue: 'Asset Guardian/Manager' })}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.inChargeName', { defaultValue: 'Name' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.inChargeName)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.inChargeDesignation', { defaultValue: 'Designation' })}</span>
                <span className="text-xs font-bold text-slate-800 text-right">{blank(asset.inChargeDesignation)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.inChargeMobile', { defaultValue: 'Contact' })}</span>
                {asset.inChargeMobile ? (
                  <a href={`tel:${asset.inChargeMobile}`} className="flex items-center gap-1 text-sm font-bold text-emerald-700 hover:underline">
                    <Phone className="h-3 w-3" />
                    {asset.inChargeMobile}
                  </a>
                ) : (
                  <span className="text-xs font-bold text-slate-800">-</span>
                )}
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-xs font-semibold text-slate-500">{t('overviewTab.inChargeEmail', { defaultValue: 'Email' })}</span>
                {asset.inChargeEmail ? (
                  <a href={`mailto:${asset.inChargeEmail}`} className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">
                    <Mail className="h-3 w-3" />
                    {asset.inChargeEmail}
                  </a>
                ) : (
                  <span className="text-xs font-bold text-slate-800">-</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
