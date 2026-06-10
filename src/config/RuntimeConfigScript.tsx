/**
 * Runtime Config Script Component
 * 
 * This server component injects runtime configuration into the HTML
 * as a script tag, making it available to client components via window.__RUNTIME_CONFIG__
 */

import { getServerRuntimeConfig, validateRuntimeConfig } from './runtime-config';

export function RuntimeConfigScript() {
  const config = getServerRuntimeConfig();
  
  // Validate config on server side
  validateRuntimeConfig(config);
  
  // Serialize config
  const serializedConfig = JSON.stringify(config);
  
  // We use a hidden div with a data attribute instead of a <script> tag
  // to completely avoid React 18+ hydration warnings regarding scripts in components.
  return (
    <div
      id="runtime-config"
      data-config={serializedConfig}
      style={{ display: 'none' }}
      aria-hidden="true"
    />
  );
}
