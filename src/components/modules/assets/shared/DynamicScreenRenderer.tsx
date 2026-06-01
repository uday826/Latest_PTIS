'use client';

import React, { useState, useCallback } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import {
  Input,
  Button,
  Card,
  ToggleSwitch,
  TextArea,
  SearchSelect
} from '@/components/common';
import { Label } from '@/components/common/label';
import { toast } from 'sonner';
import { ConfigurationService } from '@/services/asset/configuration.service';
import { ScreenConfig, ScreenField } from '@/types/asset.types';

interface DynamicScreenRendererProps {
  config: ScreenConfig;
}

export function DynamicScreenRenderer({ config }: DynamicScreenRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Validation: check required fields ──────────────────────────────────
    const allFields = config.sections
      .filter(s => s.isActive)
      .flatMap(s => s.fields.filter(f => f.isActive));

    const missingRequired = allFields
      .filter(f => f.required && !formData[f.fieldName])
      .map(f => f.label);

    if (missingRequired.length > 0) {
      toast.error(`Please fill required fields: ${missingRequired.slice(0, 3).join(', ')}${missingRequired.length > 3 ? ` (+${missingRequired.length - 3} more)` : ''}`);
      return;
    }

    // ── Submit to backend ──────────────────────────────────────────────────
    setIsSaving(true);
    try {
      const result = await ConfigurationService.saveAssetMaster(formData);
      const action = result?.updated ? 'updated' : 'saved';
      toast.success(`${config.screenName} ${action} successfully!`);
      // Reset form after successful save
      setFormData({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to save asset');
    } finally {
      setIsSaving(false);
    }
  }, [formData, config]);

  const renderField = (field: ScreenField) => {
    if (!field.isActive) return null;

    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      value: formData[field.fieldName] || '',
      onChange: (e: any) => handleInputChange(field.fieldName, e.target?.value ?? e),
      required: field.required,
      className: "w-full"
    };

    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'phone':
        return <Input {...commonProps} type={field.fieldType} />;

      case 'number':
        return <Input {...commonProps} type="number" />;

      case 'date':
        return <Input {...commonProps} type="date" />;

      case 'textarea':
        return <TextArea {...commonProps} rows={3} />;

      case 'select':
      case 'dropdown':
        return (
          <SearchSelect
            name={field.fieldName}
            options={field.options || []}
            value={formData[field.fieldName] || ''}
            onChange={(_name: string, val: string) => handleInputChange(field.fieldName, val)}
            placeholder={field.placeholder || 'Select option...'}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={!!formData[field.fieldName]}
              onChange={(val) => handleInputChange(field.fieldName, val)}
            />
            <span className="text-sm text-slate-600">{field.label}</span>
          </div>
        );

      default:
        return <Input {...commonProps} />;
    }
  };

  // Count filled fields for progress indication
  const allActiveFields = config.sections
    .filter(s => s.isActive)
    .flatMap(s => s.fields.filter(f => f.isActive));
  const filledCount = allActiveFields.filter(f => formData[f.fieldName]).length;
  const totalCount = allActiveFields.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form id="dynamic-screen-form" onSubmit={handleSubmit} className="space-y-6">
        {config.sections.filter(s => s.isActive).sort((a, b) => a.order - b.order).map(section => (
          <Card key={section.id} className="overflow-hidden border-slate-200">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider text-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {section.label}
              </h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {section.fields.filter(f => f.isActive).length} fields
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.fields
                .filter(f => f.isActive)
                .sort((a, b) => a.order - b.order)
                .map(field => (
                  <div key={field.id} className="space-y-1.5">
                    {field.fieldType !== 'checkbox' && (
                      <Label required={field.required}>{field.label}</Label>
                    )}
                    {renderField(field)}
                    {field.helpText && (
                      <p className="text-[11px] text-slate-400 italic">{field.helpText}</p>
                    )}
                  </div>
                ))}
            </div>
          </Card>
        ))}

        {/* ═══════════════ SAVE BUTTON BAR ═══════════════ */}
        <Card className="overflow-hidden border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="px-6 py-5 flex items-center justify-between">
            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {filledCount} / {totalCount} fields completed
                </span>
              </div>
              {filledCount > 0 && filledCount === totalCount && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle size={14} />
                  <span className="text-[11px] font-bold">All fields filled</span>
                </div>
              )}
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              variant="primary"
              icon={isSaving ? Loader2 : Save}
              disabled={isSaving}
              className={`
                px-8 py-2.5 text-sm font-bold shadow-lg
                bg-blue-600 hover:bg-blue-700 text-white
                rounded-xl transition-all duration-200
                ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-200 hover:scale-[1.02]'}
              `}
            >
              {isSaving ? 'Saving...' : `Save ${config.screenName}`}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
