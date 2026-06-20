import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MasterDataRecord, MasterDataFormErrors, MASTER_IDS } from '@/types/asset-type/master-data.types';
import { toast } from 'sonner';

const getInit = (e: MasterDataRecord | null, sg: string) => ({
  code: e?.id || '', name: e?.name || '', group: e?.group || ((!sg || sg === 'all') ? '' : sg), description: e?.description ?? '',
  isActive: e ? e.status === 'Active' : true, status: e?.status || 'Active', depreciationRate: e?.depreciationRate, conditionFactor: e?.conditionFactor,
  displayOrder: e?.displayOrder, isMovable: e?.isMovable ?? true, hasFloorDetails: e?.hasFloorDetails ?? false, hasInventory: e?.hasInventory ?? false,
  isInventoryMandatory: e?.isInventoryMandatory ?? false, hasLegalCompliance: e?.hasLegalCompliance ?? false, valuationType: e?.valuationType || '',
  allowUnitRegistration: e?.allowUnitRegistration ?? false, allowRoomRegistration: e?.allowRoomRegistration ?? false, taxPercentage: e?.taxPercentage,
  effectiveFromDate: e?.effectiveFromDate || '', effectiveToDate: e?.effectiveToDate || '', calculationType: e?.calculationType || '',
  penaltyValue: e?.penaltyValue, gracePeriodDays: e?.gracePeriodDays, departmentId: e?.departmentId,
});

export function useMasterDataFormState(masterId: string, editData: MasterDataRecord | null, onSave: (p: MasterDataRecord, cb?: () => void) => void, onClose: () => void, selectedGroup = 'all', existingCodes: string[] = [], existingNames: string[] = []) {
  const [formData, setFormData] = useState(getInit(editData, selectedGroup));
  const [errors, setErrors] = useState<MasterDataFormErrors>({});
  const t = useTranslations('asset.configuration.masterData.form');

  React.useEffect(() => { setFormData(getInit(editData, selectedGroup)); setErrors({}); }, [editData, selectedGroup]);

  const validate = useCallback(() => {
    const e: MasterDataFormErrors = {};
    const isRelaxed = [MASTER_IDS.TAX, MASTER_IDS.PENALTY, MASTER_IDS.ROOM_TYPE, MASTER_IDS.TYPE_OF_USE, MASTER_IDS.SUB_TYPE_OF_USE].includes(masterId as any);
    const skipCode = [MASTER_IDS.INVENTORY_CONDITION, MASTER_IDS.INVENTORY_MODEL, MASTER_IDS.OWNERSHIP_TYPE, MASTER_IDS.OWNING_DEPARTMENT, MASTER_IDS.SUB_TYPE_OF_USE].includes(masterId);
    
    const code = formData.code?.trim() || "", name = formData.name?.trim() || "", desc = formData.description?.trim() || "";
    if (!skipCode) {
      if (!code) e.code = "errors.codeRequired";
      else if (code.length > (isRelaxed ? 50 : 15)) e.code = isRelaxed ? "errors.codeTooLong50" : "errors.codeTooLong15";
      else if (!/^[\p{L}\p{N}_-]+$/u.test(code)) e.code = "errors.codeInvalidChars";
      else if (existingCodes.some(c => c.toLowerCase() === code.toLowerCase() && c.toLowerCase() !== editData?.id?.toLowerCase())) e.code = "errors.codeDuplicate";
    }

    if (!name) e.name = "errors.nameRequired";
    else if (name.length > (isRelaxed ? 100 : 50)) e.name = isRelaxed ? "errors.nameTooLong100" : "errors.nameTooLong50";
    else if (!/^[\p{L}\p{N}\s_-]+$/u.test(name)) e.name = "errors.nameInvalidChars";
    else if (existingNames.some(n => n.toLowerCase() === name.toLowerCase() && n.toLowerCase() !== editData?.name?.toLowerCase())) e.name = "errors.nameDuplicate";

    const reqGroup = [MASTER_IDS.TYPE, MASTER_IDS.INVENTORY_NAME, MASTER_IDS.INVENTORY_CONDITION, MASTER_IDS.INVENTORY_MODEL].includes(masterId);
    if (reqGroup && (!formData.group || formData.group === 'all' || formData.group === '0')) e.group = "errors.categoryRequired";

    if (desc.length > 500) e.description = "errors.descriptionTooLong";
    else if (desc && !/^[\p{L}\p{N}\s_-]+$/u.test(desc)) e.description = "errors.descInvalidChars";

    if (masterId === MASTER_IDS.TAX) {
      if (formData.taxPercentage == null || isNaN(Number(formData.taxPercentage))) e.taxPercentage = "errors.taxPercentageRequired";
      else if (Number(formData.taxPercentage) < 0 || Number(formData.taxPercentage) > 100) e.taxPercentage = "errors.taxPercentageRange";
      if (!formData.effectiveFromDate) e.effectiveFromDate = "errors.effectiveFromDateRequired";
    }

    if (masterId === MASTER_IDS.PENALTY) {
      if (!formData.calculationType) e.calculationType = "errors.calculationTypeRequired";
      if (formData.penaltyValue == null || isNaN(Number(formData.penaltyValue))) e.penaltyValue = "errors.penaltyValueRequired";
      else if (Number(formData.penaltyValue) < 0) e.penaltyValue = "errors.penaltyValueRange";
      else if (formData.calculationType === 'Percentage' && Number(formData.penaltyValue) > 100) e.penaltyValue = "errors.penaltyValuePercentageRange";
      if (formData.gracePeriodDays == null || isNaN(Number(formData.gracePeriodDays))) e.gracePeriodDays = "errors.gracePeriodDaysRequired";
      else if (Number(formData.gracePeriodDays) < 0) e.gracePeriodDays = "errors.gracePeriodDaysRange";
    }

    if (masterId === MASTER_IDS.TYPE_OF_USE) {
      if (!formData.departmentId) e.departmentId = "errors.groupIdRequired";
      if (!desc) e.description = "errors.descriptionRequired";
    }

    if (masterId === MASTER_IDS.SUB_TYPE_OF_USE) {
      if (!formData.departmentId) e.departmentId = "errors.typeOfUseRequired";
      if (!desc) e.description = "errors.descriptionRequired";
      if (formData.displayOrder == null || String(formData.displayOrder) === '') e.displayOrder = "errors.searchSequenceRequired";
    }

    return e;
  }, [formData, masterId, existingCodes, existingNames, editData?.id, editData?.name]);

  const handleSubmit = (ev?: React.FormEvent | { preventDefault: () => void; stopPropagation: () => void }, isPending = false) => {
    if (ev) { if (typeof ev.preventDefault === 'function') ev.preventDefault(); if (typeof ev.stopPropagation === 'function') ev.stopPropagation(); }
    if (isPending) return;
    const vErrs = validate();
    if (Object.keys(vErrs).length > 0) return setErrors(vErrs), toast.error(t('errors.fillRequired'));
    const mg = [MASTER_IDS.TYPE, MASTER_IDS.INVENTORY_NAME, MASTER_IDS.INVENTORY_CONDITION, MASTER_IDS.INVENTORY_MODEL, MASTER_IDS.ROOM_TYPE, MASTER_IDS.TYPE_OF_USE, MASTER_IDS.SUB_TYPE_OF_USE].includes(masterId);
    onSave({
      id: formData.code, backendId: editData?.backendId, name: formData.name, description: formData.description, group: mg ? formData.group : 'all',
      status: formData.isActive ? 'Active' : 'Inactive', departmentId: formData.departmentId, isMovable: formData.isMovable, hasFloorDetails: formData.hasFloorDetails,
      hasInventory: formData.hasInventory, isInventoryMandatory: formData.isInventoryMandatory, hasLegalCompliance: formData.hasLegalCompliance,
      valuationType: formData.valuationType, displayOrder: formData.displayOrder, depreciationRate: formData.depreciationRate, conditionFactor: formData.conditionFactor,
      allowUnitRegistration: formData.allowUnitRegistration, allowRoomRegistration: formData.allowRoomRegistration, taxPercentage: formData.taxPercentage,
      effectiveFromDate: formData.effectiveFromDate, effectiveToDate: formData.effectiveToDate || null, calculationType: formData.calculationType,
      penaltyValue: formData.penaltyValue, gracePeriodDays: formData.gracePeriodDays,
    }, onClose);
  };

  const setField = (field: string, value: string | boolean | number | null) => {
    let sVal = value;
    if (typeof value === 'string') {
      if (field === 'code') sVal = value.replace(/[^\p{L}\p{N}_-]/gu, '');
      else if (field === 'name' || field === 'description') sVal = value.replace(/[^\p{L}\p{N}\s_-]/gu, '');
    }
    setFormData(p => ({ ...p, [field]: sVal }));
    if (errors[field as keyof MasterDataFormErrors]) setErrors(p => { const n = { ...p }; delete n[field as keyof MasterDataFormErrors]; return n; });
  };

  return { formData, setField, errors, handleSubmit };
}
