import React from 'react';

export interface PropertyDetails {
  upic: string;
  ownerName: string;
  mobile: string;
  useType: string;
  carpetArea: number;
  builtUpArea: number;
  division: string;
  moujaName: string;
  category: string;
  surveyNo: string;
  subZoneNo: string;
  flatShopNo: string;
  plotNo: string;
  wing: string;
  taxZone: string;
  plotArea: number;
  plotAreaUnit: string;
  status: 'Active' | 'Pending' | 'Locked';
  propertyHolder: string;
  propertyDescription: string;
}

export interface TimelineStage {
  id: string;
  label: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  date?: string;
  officer?: string;
  remarks?: string;
}

export interface AuditHistoryEvent {
  id: string;
  title: string;
  date: string;
  icon?: React.ReactNode;
  desc: string;
  user?: string;
  role?: string;
  prevVal?: string;
  newVal?: string;
  remarks?: string;
  docs?: string;
}

export interface TaxComparison {
  generalTax: number;
  educationTax: number;
  treeCess: number;
  waterCess: number;
  roadCess: number;
  fireCess: number;
  lightCess: number;
  waterBenefitCess: number;
  sewageCess: number;
  specialEduTax: number;
}
