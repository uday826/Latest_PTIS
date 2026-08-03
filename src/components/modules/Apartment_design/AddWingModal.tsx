import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { WingDetails } from './mockData';
import AddWingFormFields from './AddWingFormFields';

interface AddWingModalProps {
  isOpen: boolean;
  onClose: () => void;
  wings: WingDetails[];
  onAddWing: (newWing: WingDetails) => void;
}

export default function AddWingModal({
  isOpen,
  onClose,
  wings,
  onAddWing
}: AddWingModalProps) {
  const [formValues, setFormValues] = useState({
    wingName: '',
    blockName: '',
    grade: 'A+',
    themeColor: 'blue',
    floors: '7',
    units: '15',
    res: '12',
    com: '2',
    amen: '1',
    newDem: '43,920',
    retroDem: '50,000',
    discount: '-₹5,000',
    discLabel: '5u',
    exemp: '1 u',
    exempLabel: 'Freedom Fighter',
    rvImpact: '+₹85,000',
    rvLabel: '+200.0%'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formValues.wingName.trim()) {
      errors.wingName = 'Wing Name is required';
    } else if (wings.some(w => w.wing.toLowerCase() === formValues.wingName.trim().toLowerCase())) {
      errors.wingName = 'Wing Name must be unique';
    }

    const floorsNum = Number(formValues.floors);
    if (isNaN(floorsNum) || floorsNum < 0) {
      errors.floors = 'Floors cannot be negative';
    }

    const unitsNum = Number(formValues.units);
    if (isNaN(unitsNum) || unitsNum < 0) {
      errors.units = 'Total Units cannot be negative';
    }

    const resNum = Number(formValues.res);
    const comNum = Number(formValues.com);
    const amenNum = Number(formValues.amen);
    if (isNaN(resNum) || resNum < 0) errors.res = 'Cannot be negative';
    if (isNaN(comNum) || comNum < 0) errors.com = 'Cannot be negative';
    if (isNaN(amenNum) || amenNum < 0) errors.amen = 'Cannot be negative';

    if (!errors.units && !errors.res && !errors.com && !errors.amen) {
      if (resNum + comNum + amenNum > unitsNum) {
        errors.units = 'Res + Com + Amen units cannot exceed Total Units';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddWingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      const themeConfig = {
        green: {
          themeColor: 'green',
          gradeBorderColor: 'border-green-500 text-green-600',
          badgeBgColor: 'bg-green-700'
        },
        purple: {
          themeColor: 'purple',
          gradeBorderColor: 'border-purple-500 text-purple-600',
          badgeBgColor: 'bg-purple-750'
        },
        orange: {
          themeColor: 'orange',
          gradeBorderColor: 'border-orange-500 text-orange-600',
          badgeBgColor: 'bg-orange-600'
        },
        blue: {
          themeColor: 'blue',
          gradeBorderColor: 'border-blue-500 text-blue-600',
          badgeBgColor: 'bg-blue-700'
        }
      }[formValues.themeColor as 'green' | 'purple' | 'orange' | 'blue'] || {
        themeColor: 'blue',
        gradeBorderColor: 'border-blue-500 text-blue-600',
        badgeBgColor: 'bg-blue-700'
      };

      const newWingObj: WingDetails = {
        id: formValues.wingName.trim().charAt(0).toUpperCase(),
        grade: formValues.grade,
        wing: formValues.wingName.trim(),
        name: formValues.blockName.trim() || 'Block',
        floors: `G + ${Number(formValues.floors) - 1 || 1}`,
        units: formValues.units,
        res: formValues.res,
        com: formValues.com,
        amen: formValues.amen,
        newDem: formValues.newDem,
        retroDem: formValues.retroDem,
        discount: formValues.discount,
        discLabel: formValues.discLabel,
        exemp: formValues.exemp,
        exempLabel: formValues.exempLabel,
        rvImpact: formValues.rvImpact,
        rvLabel: formValues.rvLabel,
        collection: '₹0',
        outstanding: '₹0',
        additionalRevenue: '₹0',
        collectionPct: '0%',
        mods: { matched: '0', missing: '0', newCount: '0', modified: '0' },
        ...themeConfig,
        discountDetails: {
          amount: formValues.discount,
          pct: '10%',
          units: `${formValues.discLabel} Units`,
          category: 'Standard Discount Policy',
          period: 'FY 2023-24',
          status: 'Approved',
          remarks: 'System generated discount based on rules.'
        },
        exemptionDetails: {
          units: `${formValues.exemp} Units`,
          category: 'Social Exemption Status',
          eligible: 'Specified units only',
          amount: '₹3,000',
          certNo: 'CERT-EX-2023',
          validity: 'Valid',
          status: 'Approved',
          remarks: formValues.exempLabel || 'Exemption details matching certificate.'
        },
        rvImpactDetails: {
          prevRv: '₹15,000',
          revisedRv: formValues.newDem,
          diff: formValues.rvImpact,
          pctChange: formValues.rvLabel,
          units: `${formValues.units} Units`,
          effectiveDate: '01-Apr-2023',
          ref: 'TMC-RV-2023',
          remarks: 'Dynamic calculated difference engine impact.'
        }
      };

      onAddWing(newWingObj);

      setFormValues({
        wingName: '',
        blockName: '',
        grade: 'A+',
        themeColor: 'blue',
        floors: '7',
        units: '15',
        res: '12',
        com: '2',
        amen: '1',
        newDem: '43,920',
        retroDem: '50,000',
        discount: '-₹5,000',
        discLabel: '5u',
        exemp: '1 u',
        exempLabel: 'Freedom Fighter',
        rvImpact: '+₹85,000',
        rvLabel: '+200.0%'
      });
      setFormErrors({});

      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center animate-fadeIn p-4 overflow-y-auto font-sans">
      <div
        className="bg-white border border-[#002fbe]/20 rounded-xl shadow-2xl p-5 w-full max-w-xl animate-scaleIn flex flex-col gap-4 relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-wing-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-150">
          <h3 id="add-wing-title" className="font-extrabold text-[#002fbe] text-[13px] uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Plus size={15} /> Add New Wing
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 font-extrabold text-[15px] cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn select-none">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-200 mb-3 animate-bounce">
              ✓
            </div>
            <span className="text-[12px] font-black text-[#1e2b58] uppercase tracking-wide">Wing Added Successfully!</span>
            <span className="text-[10px] text-gray-550 font-medium mt-1">Recalculating town aggregates & tax projections...</span>
          </div>
        ) : (
          <form onSubmit={handleAddWingSubmit} className="flex flex-col gap-4 text-[10px] font-extrabold text-gray-700">
            {/* Input Grid */}
            <AddWingFormFields 
              formValues={formValues} 
              setFormValues={setFormValues} 
              formErrors={formErrors} 
            />

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-150 mt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-550 font-bold transition cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#002fbe] hover:bg-[#002a8f] text-white rounded-lg font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : 'Save Wing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
