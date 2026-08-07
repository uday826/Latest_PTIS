import React from 'react';
import { Input, Select } from '@/components/common';

interface AddWingFormFieldsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  formErrors: Record<string, string>;
}

export default function AddWingFormFields({
  formValues,
  setFormValues,
  formErrors
}: AddWingFormFieldsProps) {
  const themeColorOptions = [
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Purple', value: 'purple' },
    { label: 'Orange', value: 'orange' },
  ];

  const gradeOptions = [
    { label: 'A+ Grade', value: 'A+' },
    { label: 'A Grade', value: 'A' },
    { label: 'B+ Grade', value: 'B+' },
    { label: 'B Grade', value: 'B' },
    { label: 'C Grade', value: 'C' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5">
      {/* Wing Name */}
      <Input
        label="Wing Name"
        required
        placeholder="e.g. E Wing"
        value={formValues.wingName}
        onChange={(e) => setFormValues({ ...formValues, wingName: e.target.value })}
        error={formErrors.wingName}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Block / Block Name */}
      <Input
        label="Block Name"
        placeholder="e.g. Tulip Block"
        value={formValues.blockName}
        onChange={(e) => setFormValues({ ...formValues, blockName: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Theme Color */}
      <Select
        label="Theme Color"
        value={formValues.themeColor}
        onChange={(e, val) => setFormValues({ ...formValues, themeColor: val })}
        options={themeColorOptions}
        selectSize="sm"
      />

      {/* Property Grade */}
      <Select
        label="Property Grade"
        value={formValues.grade}
        onChange={(e, val) => setFormValues({ ...formValues, grade: val })}
        options={gradeOptions}
        selectSize="sm"
      />

      {/* Floors */}
      <Input
        label="Floors"
        type="number"
        value={formValues.floors}
        onChange={(e) => setFormValues({ ...formValues, floors: e.target.value })}
        error={formErrors.floors}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Total Units */}
      <Input
        label="Total Units"
        type="number"
        value={formValues.units}
        onChange={(e) => setFormValues({ ...formValues, units: e.target.value })}
        error={formErrors.units}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Residential Units */}
      <Input
        label="Residential Units"
        type="number"
        value={formValues.res}
        onChange={(e) => setFormValues({ ...formValues, res: e.target.value })}
        error={formErrors.res}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Commercial Units */}
      <Input
        label="Commercial Units"
        type="number"
        value={formValues.com}
        onChange={(e) => setFormValues({ ...formValues, com: e.target.value })}
        error={formErrors.com}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Amenity Units */}
      <Input
        label="Amenity Units"
        type="number"
        value={formValues.amen}
        onChange={(e) => setFormValues({ ...formValues, amen: e.target.value })}
        error={formErrors.amen}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* New Demand */}
      <Input
        label="New Demand (₹)"
        value={formValues.newDem}
        onChange={(e) => setFormValues({ ...formValues, newDem: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Retro Demand */}
      <Input
        label="Retro Demand (₹)"
        value={formValues.retroDem}
        onChange={(e) => setFormValues({ ...formValues, retroDem: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Discount Amount */}
      <Input
        label="Discount (₹)"
        value={formValues.discount}
        onChange={(e) => setFormValues({ ...formValues, discount: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Discounted Units */}
      <Input
        label="Discounted Units"
        value={formValues.discLabel}
        onChange={(e) => setFormValues({ ...formValues, discLabel: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Exempted Units */}
      <Input
        label="Exempted Units"
        value={formValues.exemp}
        onChange={(e) => setFormValues({ ...formValues, exemp: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* Exemption Type */}
      <Input
        label="Exemption Type"
        value={formValues.exempLabel}
        onChange={(e) => setFormValues({ ...formValues, exempLabel: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* REV Impact */}
      <Input
        label="REV Impact"
        value={formValues.rvImpact}
        onChange={(e) => setFormValues({ ...formValues, rvImpact: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />

      {/* REV Impact Percentage */}
      <Input
        label="REV Impact %"
        value={formValues.rvLabel}
        onChange={(e) => setFormValues({ ...formValues, rvLabel: e.target.value })}
        className="font-bold text-[10.5px] px-3 py-1.5 border-gray-250 h-8"
      />
    </div>
  );
}
