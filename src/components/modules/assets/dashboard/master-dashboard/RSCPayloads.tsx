/**
 * RSCPayloads.tsx
 *
 * Pure React Server Components used as payload wrappers for `actions-rsc.tsx`.
 * When a Server Action returns JSX (ReactNode), Next.js serializes the response
 * through the RSC wire protocol — so the browser Network tab → Payload / Preview
 * shows the RSC format (0:, 1:, 2: prefixed lines) instead of plain JSON.
 *
 * These components carry the real data AND render a hidden `<script data-rsc>`
 * element so the client can deserialize the typed payload from the RSC stream.
 */

import type { AssetDashboardTypeByCategory, AssetDashboardAssetByType } from '@/types/asset-type/asset-dashboard-api.types';

// ─── TypeListRSC ─────────────────────────────────────────────────────────────

interface TypeListRSCProps {
  types: AssetDashboardTypeByCategory[];
  error?: string;
}

/**
 * Server Component returned by `fetchTypesByCategoryRSCAction`.
 * Encodes the types payload so the RSC wire protocol transmits it
 * as component tree data rather than raw JSON.
 */
export function TypeListRSC({ types, error }: TypeListRSCProps) {
  if (error) {
    return (
      <div data-rsc-type="types-error" style={{ display: 'none' }}>
        <script
          data-rsc-payload="types"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ error, types: [] }) }}
        />
      </div>
    );
  }

  return (
    <div data-rsc-type="types-list" style={{ display: 'none' }}>
      {/* Hidden RSC payload — picked up by the client bridge */}
      <script
        data-rsc-payload="types"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ types }) }}
      />
      {/* Render each type as a semantic element so the RSC tree is rich */}
      {types.map((tp) => (
        <article
          key={tp.id}
          data-type-id={tp.id}
          data-category-id={tp.categoryId}
          data-count={tp.count}
          data-total-value={tp.totalValue}
          aria-label={tp.assetType}
        >
          <span data-field="assetType">{tp.assetType}</span>
          <span data-field="count">{tp.count}</span>
          <span data-field="totalValue">{tp.totalValue}</span>
        </article>
      ))}
    </div>
  );
}

// ─── AssetListRSC ─────────────────────────────────────────────────────────────

interface AssetListRSCProps {
  assets: AssetDashboardAssetByType[];
  error?: string;
}

/**
 * Server Component returned by `fetchAssetsByTypeRSCAction`.
 * Encodes the assets payload so the RSC wire protocol transmits it
 * as component tree data rather than raw JSON.
 */
export function AssetListRSC({ assets, error }: AssetListRSCProps) {
  if (error) {
    return (
      <div data-rsc-type="assets-error" style={{ display: 'none' }}>
        <script
          data-rsc-payload="assets"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ error, assets: [] }) }}
        />
      </div>
    );
  }

  return (
    <div data-rsc-type="assets-list" style={{ display: 'none' }}>
      {/* Hidden RSC payload — picked up by the client bridge */}
      <script
        data-rsc-payload="assets"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ assets }) }}
      />
      {/* Render each asset as a semantic element so the RSC tree is rich */}
      {assets.map((asset, idx) => (
        <article
          key={`${asset.id}-${idx}`}
          data-asset-id={asset.id}
          data-ward={asset.wardName}
          data-zone={asset.zoneName}
          data-status={asset.status}
          aria-label={asset.name}
        >
          <span data-field="name">{asset.name}</span>
          <span data-field="status">{asset.status}</span>
          <span data-field="marketValue">{asset.marketValue}</span>
          <span data-field="wardName">{asset.wardName}</span>
          <span data-field="zoneName">{asset.zoneName}</span>
        </article>
      ))}
    </div>
  );
}
