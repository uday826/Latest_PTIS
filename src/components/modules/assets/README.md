# Asset Management Frontend Architecture

This document explains the technical and conceptual architecture of the **Hybrid Asset Management Form Workflow** implemented in the NTIS UI.

## Conceptual Overview

The municipal asset tracking system needs to support a wide variety of asset types (Buildings, Land, Gardens, Infrastructure, Vehicles, etc.). Traditional relational database schemas (SQL) struggle when every asset type has completely different attributes. Creating hundreds of columns (where 90% are null) is an anti-pattern. 

To solve this, we implemented a **Hybrid Data Approach**. The frontend captures and formats data into four distinct database tables:

1. **`[AssetMaster]` (Static Core)**
   - **Concept**: Every asset, regardless of type, shares common properties (Name, Ward, Zone, Latitude/Longitude, Valuation, Department).
   - **Technical**: Maps directly to standard SQL columns.

2. **`[AssetFieldValue]` (Dynamic EAV)**
   - **Concept**: Entity-Attribute-Value (EAV). When a specific asset type (e.g., a "Hospital Building") has unique fields (e.g., "Number of Beds"), the frontend dynamically renders this field and passes it as a key-value pair.
   - **Technical**: Maps to `TextValue`, `NumberValue`, `BooleanValue`, or `DateValue` columns in the `AssetFieldValue` table.

3. **`[AssetFloorDetails]` (Relational Sub-entities)**
   - **Concept**: Many buildings have complex, multi-floor configurations.
   - **Technical**: Captured in the `FloorDetailsConfigurator.tsx` and mapped to a 1-to-Many relational table.

4. **`[AssetFormData]` (NoSQL / JSON Payload)**
   - **Concept**: Some wizard steps generate deeply nested, complex frontend data (like the interactive Furniture & Fixture inventory or complex Legal Compliance arrays) that don't need to be queried relationally in SQL.
   - **Technical**: The frontend serializes this step's entire state into a JSON string (`JSON.stringify()`) and saves it in a single column for later re-hydration.

---

## Technical Implementation Workflow

### 1. Context & State Management
We use React Context (`AssetFormContext.tsx`) to hold the entire state of the multi-step form.
- The context stores `formData` which accumulates data from every step.
- Helper functions (`handleInputChange`, `updateFormData`) are provided to all nested components.

### 2. Dynamic Routing & Step Configuration
The `assetFormSteps.tsx` handles conditional logic. 
- Using `HARDCODED_ASSET_DATA` (in `constants.ts`), the wizard determines what steps are visible.
- Example: If `assetType` matches `Garden` or `Playground`, the wizard enables the "Furniture & Fixtures" step, but hides the "Floor Details" step.
- Navigation logic dynamically bypasses hidden steps.

### 3. Component Architecture (Enforced < 200 Lines Rule)
To maintain code readability and avoid monolithic files, the UI is heavily modularized:
- **`assetFormHeader.tsx`**: The layout wrapper (`AssetFormHeader`) holding the Topbar, Stepper, Content Area, and Footer.
- **`BasicInfoStep.tsx`**: Split into `BasicInfoPropertyDetails` and `BasicInfoOwnershipDetails`.
- **`FloorDetailsStep.tsx`**: Split into `FloorDetailsConfigurator` (the dynamic floor table) and `FloorDetailsAttachments` (maps and photos).
- **`assetFormFooter.tsx`**: Handles "Next", "Previous", and "Save" operations.

### 4. CRUD Operations & Database Mapping

When the user clicks **Save** or **Submit** in `AssetFormFooter.tsx`:
1. **API Call**: The frontend performs a secure server action to `submitAssetForm` mapping the form data.
2. **TypeScript & Backend Integration**: The data is mapped directly on the server to matches the relational tables (`AssetMaster`, `AssetFloorDetails`, `AssetFieldValue`, and `AssetFormData`) on the live .NET/C# backend.
3. **Optimized Save State**: Unnecessary API updates are automatically skipped if the form state has not been modified since the last successful step save.

### Conclusion
By blending relational columns, EAV tables, and JSON blobs, the frontend can render an infinite number of asset combinations dynamically without requiring backend schema migrations for every new asset type. The UI remains clean, modular, and performant.
