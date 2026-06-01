# 🏛️ AMS Hybrid Asset Form Implementation Guide

This guide details the **Hybrid Asset Form Architecture** implemented in the NTIS Municipal Asset Management module. It maps directly to the `AMS` SQL Server database DDL schema and coordinates layout resolution across the API and frontend layers.

---

## 💡 The Philosophy: "Static Core, Dynamic Extension"
The hybrid approach segregates form attributes into two distinct tiers:
1. **The System Core (Static Layer)**: Universal, immutable columns stored directly in `AMS.AssetMaster` (e.g. `AssetName`, `AssetCode`, `PurchaseValue`, `AcquisitionDate`). Rendered using highly styled, customized React templates for high performance and premium design.
2. **The Dynamic Attributes (Flexible Metadata Layer)**: Contextual, category/type-specific fields configured by administrators (e.g. *Pipe Diameter* for Utilities, *Carpet Area* for Buildings). Configured in `AMS.AssetAttributeDefinition` and dynamically loaded below core fields.

---

## 🗄️ 1. Database Architecture & Seed Setup

Dynamic attributes are managed by three central tables. Using a nullable `AssetTypeId` enables **Hierarchical Fallback Resolution** without duplicate configurations.

### Configuration Schema Tables
*   `AMS.AssetAttributeDefinition`: Registers custom fields, section mapping, validations, and display ordering.
*   `AMS.AssetAttributeOption`: Configures predefined dropdown/multiselect options.
*   `AMS.AssetAttributeValue`: Stores actual transactional key-values for each asset.

### Context Resolution Rules
When loading forms, the system resolves configured attribute definitions hierarchically:
1.  **Global Fields**: Definitions where `AssetCategoryId IS NULL` and `AssetTypeId IS NULL`. Applies to all municipal assets.
2.  **Category Defaults**: Definitions where `AssetCategoryId = @CategoryId` and `AssetTypeId IS NULL`. Applies to all asset types in that category.
3.  **Type Customizations**: Definitions where `AssetCategoryId = @CategoryId` and `AssetTypeId = @TypeId`. Applies strictly to that specific type.

---

## ⚙️ 2. API Backend Implementation (C# / .NET Core)

The C# backend is responsible for (a) resolving dynamic layout JSON, and (b) executing transactional saves of core properties and EAV values.

### A. The Layout Resolution Endpoint
This query fetches active attributes matching the fallback rules and groups them by `SectionName` for easy client rendering:

```csharp
[HttpGet("form-layout")]
public async Task<IActionResult> GetFormLayout(int categoryId, int? typeId, string screenCode = "BASIC_INFO")
{
    var attributes = await _dbContext.AssetAttributeDefinitions
        .Where(a => a.AssetCategoryId == categoryId && a.IsActive && 
                   (a.AssetTypeId == null || a.AssetTypeId == typeId))
        .OrderBy(a => a.DisplayOrder)
        .Select(a => new {
            a.Id,
            a.SectionName,
            a.AttributeKey,
            a.AttributeLabel,
            a.DataType,
            a.ControlType,
            a.IsRequired,
            a.IsSystemDefined,
            Options = _dbContext.AssetAttributeOptions
                .Where(o => o.AttributeId == a.Id && o.IsActive)
                .OrderBy(o => o.DisplayOrder)
                .Select(o => new { o.OptionText, o.OptionValue })
                .ToList()
        })
        .ToListAsync();

    var groupedSections = attributes
        .GroupBy(a => a.SectionName ?? "General Details")
        .Select(g => new {
            SectionName = g.Key,
            IsSystemDefault = g.Any(x => x.IsSystemDefined),
            Fields = g.ToList()
        })
        .ToList();

    return Ok(groupedSections);
}
```

### B. The Transactional Save DTO & Handler
Receives core parameters and maps dynamic attributes directly to `AssetMaster.ExtraFieldJson` (for high-speed queries) and `AssetAttributeValue` (for relational reports).

```csharp
public class RegisterAssetDto
{
    public string AssetCode { get; set; }
    public string AssetName { get; set; }
    public int CategoryId { get; set; }
    public int? TypeId { get; set; }
    public decimal? PurchaseValue { get; set; }
    public DateTime? AcquisitionDate { get; set; }
    public Dictionary<string, object> DynamicAttributes { get; set; }
}
```

---

## 🖥️ 3. Frontend Orchestration (Next.js / TypeScript)

On the client, the wizard screen queries the `form-layout` endpoint. System defaults render your premium custom layouts (like `<AssetIdentity />`), while dynamic items render automatically below.

### Dynamic Step Container Pattern
```tsx
// src/components/modules/asset/municipal-Asset/add-New-Asset/basic-Info/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAssetForm } from '../AssetFormContext';
import { DynamicFormSection } from '@/components/modules/asset/common/DynamicFormSection';
import AssetIdentity from './AssetIdentity';

export default function BasicInfoStep() {
  const { formData, updateField } = useAssetForm();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryId = formData.categoryId;
  const typeId = formData.typeId;

  useEffect(() => {
    if (!categoryId) return;

    const fetchLayout = async () => {
      try {
        const res = await fetch(`/api/asset-proxy/form-layout?categoryId=${categoryId}&typeId=${typeId}`);
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error('Failed to load combination layout', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLayout();
  }, [categoryId, typeId]);

  if (loading) return <div>Loading configured fields...</div>;

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        // CASE A: Render static core fields (Premium layouts)
        if (section.isSystemDefault) {
          return (
            <AssetIdentity
              key={section.sectionName}
              formData={formData}
              onChange={(name, val) => updateField(name, val)}
            />
          );
        }

        // CASE B: Render dynamically configured custom sections
        return (
          <div key={section.sectionName} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">
              {section.sectionName}
            </h3>
            <DynamicFormSection
              fields={section.fields}
              value={formData.dynamicAttributes ?? {}}
              onChange={(fieldCode, val) => {
                const updatedAttrs = { ...formData.dynamicAttributes, [fieldCode]: val };
                updateField('dynamicAttributes', updatedAttrs);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
```

---

## 🏆 Key Architecture Highlights
1. **No SQL Schema Changes**: Adding a field does not require database DDL alterations or code redeployment.
2. **Curated Aesthetics**: Retains bespoke custom visual cards for the most critical municipal fields.
3. **Optimized Queries**: Leverages JSON serialization in the client fetch path and indexed EAV records in background report analytics.
