import React from 'react';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5">
      {/* Wing Name */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Wing Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="e.g. E Wing"
          value={formValues.wingName}
          onChange={(e) => setFormValues({ ...formValues, wingName: e.target.value })}
          className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.wingName ? 'border-red-500' : 'border-gray-250'}`}
        />
        {formErrors.wingName && <span className="text-red-500 text-[8.5px] font-bold mt-0.5">{formErrors.wingName}</span>}
      </div>

      {/* Block / Block Name */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Block Name</label>
        <input
          type="text"
          placeholder="e.g. Tulip Block"
          value={formValues.blockName}
          onChange={(e) => setFormValues({ ...formValues, blockName: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Theme Color */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Theme Color</label>
        <select
          value={formValues.themeColor}
          onChange={(e) => setFormValues({ ...formValues, themeColor: e.target.value })}
          className="border border-gray-250 px-2 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="orange">Orange</option>
        </select>
      </div>

      {/* Property Grade */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Property Grade</label>
        <select
          value={formValues.grade}
          onChange={(e) => setFormValues({ ...formValues, grade: e.target.value })}
          className="border border-gray-250 px-2 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        >
          <option value="A+">A+ Grade</option>
          <option value="A">A Grade</option>
          <option value="B+">B+ Grade</option>
          <option value="B">B Grade</option>
          <option value="C">C Grade</option>
        </select>
      </div>

      {/* Floors */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Floors</label>
        <input
          type="number"
          value={formValues.floors}
          onChange={(e) => setFormValues({ ...formValues, floors: e.target.value })}
          className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.floors ? 'border-red-500' : 'border-gray-250'}`}
        />
        {formErrors.floors && <span className="text-red-500 text-[8.5px] font-bold mt-0.5">{formErrors.floors}</span>}
      </div>

      {/* Total Units */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Total Units</label>
        <input
          type="number"
          value={formValues.units}
          onChange={(e) => setFormValues({ ...formValues, units: e.target.value })}
          className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.units ? 'border-red-500' : 'border-gray-250'}`}
        />
        {formErrors.units && <span className="text-red-500 text-[8.5px] font-bold mt-0.5">{formErrors.units}</span>}
      </div>

      {/* Residential Units */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Residential Units</label>
        <input
          type="number"
          value={formValues.res}
          onChange={(e) => setFormValues({ ...formValues, res: e.target.value })}
          className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.res ? 'border-red-500' : 'border-gray-250'}`}
        />
        {formErrors.res && <span className="text-red-500 text-[8.5px] font-bold mt-0.5">{formErrors.res}</span>}
      </div>

      {/* Commercial Units */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Commercial Units</label>
        <input
          type="number"
          value={formValues.com}
          onChange={(e) => setFormValues({ ...formValues, com: e.target.value })}
          className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.com ? 'border-red-500' : 'border-gray-250'}`}
        />
        {formErrors.com && <span className="text-red-500 text-[8.5px] font-bold mt-0.5">{formErrors.com}</span>}
      </div>

      {/* Amenity Units */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Amenity Units</label>
        <input
          type="number"
          value={formValues.amen}
          onChange={(e) => setFormValues({ ...formValues, amen: e.target.value })}
          className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.amen ? 'border-red-500' : 'border-gray-250'}`}
        />
        {formErrors.amen && <span className="text-red-500 text-[8.5px] font-bold mt-0.5">{formErrors.amen}</span>}
      </div>

      {/* New Demand */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">New Demand (₹)</label>
        <input
          type="text"
          value={formValues.newDem}
          onChange={(e) => setFormValues({ ...formValues, newDem: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Retro Demand */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Retro Demand (₹)</label>
        <input
          type="text"
          value={formValues.retroDem}
          onChange={(e) => setFormValues({ ...formValues, retroDem: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Discount Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Discount (₹)</label>
        <input
          type="text"
          value={formValues.discount}
          onChange={(e) => setFormValues({ ...formValues, discount: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Discounted Units */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Discounted Units</label>
        <input
          type="text"
          value={formValues.discLabel}
          onChange={(e) => setFormValues({ ...formValues, discLabel: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Exempted Units */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Exempted Units</label>
        <input
          type="text"
          value={formValues.exemp}
          onChange={(e) => setFormValues({ ...formValues, exemp: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Exemption Type */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">Exemption Type</label>
        <input
          type="text"
          value={formValues.exempLabel}
          onChange={(e) => setFormValues({ ...formValues, exempLabel: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* REV Impact */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">REV Impact</label>
        <input
          type="text"
          value={formValues.rvImpact}
          onChange={(e) => setFormValues({ ...formValues, rvImpact: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* REV Impact Percentage */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-555 font-extrabold uppercase text-[9px] tracking-wider">REV Impact %</label>
        <input
          type="text"
          value={formValues.rvLabel}
          onChange={(e) => setFormValues({ ...formValues, rvLabel: e.target.value })}
          className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
