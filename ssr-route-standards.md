# SSR Route Standards for Next.js App Router

Use this checklist when converting any `src/app` page to the project SSR standard.

## SSR Definition

A route is SSR-standard when the `page.tsx` is a Server Component that:

- Fetches initial route data on the server.
- Awaits `params` and `searchParams` in the page.
- Uses route actions for all route data reads and mutations.
- Keeps direct service calls inside action files or dedicated server-only API modules.
- Passes serializable initial data into client components.
- Keeps browser-only behavior inside focused client components.
- Handles loading and error states with route-level `loading.tsx` and `error.tsx`.

This does not mean every component is server-only. Forms, modals, tables with local state, URL sync, effects, and event handlers usually remain client components.

## Page Rules

1. `page.tsx` must not contain `"use client"`.
2. `page.tsx` should be `async` when it reads data.
3. In this project, use the Next.js 16 / promise-style App Router route props pattern:

```ts
type PageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};
```

4. Call `setRequestLocale(locale)` when the route is localized.
5. Validate dynamic params before calling APIs.
6. Fetch initial data by calling route actions from `action.ts`.
7. Use `Promise.all` for independent server reads.
8. Do not use React client hooks in `page.tsx`: no `useState`, `useEffect`, `useMemo`, `useRouter`, `useSearchParams`, or `usePathname`.
9. Do not access browser APIs in `page.tsx`: no `window`, `document`, `localStorage`, `sessionStorage`, or DOM APIs.
10. Pass only serializable props from server to client components.
11. Do not import service files directly in `page.tsx`.
12. Do not call `src/lib/api/**` directly from `page.tsx`.
13. Do not declare route-specific `type` or `interface` blocks in `page.tsx`; import them from `src/types/**`.
14. `layout.tsx` must not depend on `searchParams`; search-based data belongs in `page.tsx`.

## Core Architecture Rule

The architecture is layered and must stay one-directional.

Required production data flow:

```text
page.tsx / layout.tsx
  -> route-local action.ts
      -> src/lib/api/**
          -> backend API

client component / client hook
  -> nearest route-local action.ts
      -> src/lib/api/**
          -> backend API
```

Rules:

1. Every backend API call must go through route-local `action.ts`.
2. `action.ts` must be placed beside `page.tsx` inside the route folder under `src/app/**`.
3. Pages call actions from `./action`, never services.
4. Layouts must not call services directly.
5. Client components call actions, never services.
6. Client hooks call actions, never services.
7. Actions call services under `src/lib/api/**`.
8. Services call backend APIs.
9. UI components render and collect user input; they do not own backend data access.
10. Data normalization should happen in `action.ts` or route-safe utilities before props reach the UI.
11. Business validation should happen before the service call.
12. Backend response details should not leak into component rendering unless the UI truly needs them.

## No New Third-Party Package Rule

1. Do not add new third-party packages for SSR conversion or route integration.
2. Do not add UI libraries, form libraries, validation libraries, state libraries, data-fetching libraries, date libraries, modal/toast libraries, i18n libraries, or utility packages.
3. Use existing project code first:
   - `src/components/common/**`
   - `src/components/layout/**`
   - `src/components/modules/**`
   - `src/hooks/**`
   - `src/lib/utils/**`
   - `src/lib/validations/**`
   - `src/lib/api/**`
   - `src/types/**`
   - `src/i18n/locales/**`
4. A new dependency requires explicit project-owner approval.
5. Default decision: do not add the package.

## Required Data Flow

Every route must follow this call cycle:

```text
page.tsx
  -> action.ts
      -> src/lib/api/**
          -> backend API
```

Client components must follow this call cycle:

```text
client component or client hook
  -> action.ts
      -> src/lib/api/**
          -> backend API
```

Allowed:

* `page.tsx` imports route actions from local `./action`.
* Client components import route actions from the nearest route `action.ts`.
* `action.ts` imports service/API functions from `src/lib/api/**`.
* Service/API files call the backend.

Not allowed:

* `page.tsx` importing from `src/lib/api/**`.
* `layout.tsx` importing from `src/lib/api/**`.
* Client components importing from `src/lib/api/**`.
* Client hooks importing from `src/lib/api/**`.
* UI components calling `fetch` directly for business data.
* UI utilities importing backend service response helpers.
* New route-facing action files named `actions.tsx`, `actions.ts`, `*.action.ts`, or `*.actions.ts`.

## Dynamic Rendering Rules

Use `export const dynamic = 'force-dynamic';` when the route depends on:

- Per-request user/session/cookie/header data.
- Search params that change the server data.
- Non-cacheable backend responses.
- Permission checks that must run every request.

Avoid `force-dynamic` for simple static master pages unless the data truly must be fresh per request.

## No Mock Data Rule

1. Do not add mock data to production pages, components, actions, services, or utilities.
2. Do not silently render fake rows, fake dropdowns, or placeholder API payloads when the backend fails.
3. Do not keep temporary sample arrays in route components.
4. Test fixtures are allowed only in test files under `src/__tests__/**` or colocated test fixture files.
5. Story/demo-only data must not be imported by production routes.
6. Empty API results should render a real empty state, not fake content.

## No Silent Fallback Rule

1. Do not hide API failures by returning success with empty data.
2. Do not replace failed backend responses with default business data.
3. Return explicit action failures for failed reads/mutations.
4. Show route errors through `error.tsx` or client error surfaces.
5. Fallback values are allowed only for optional display fields after a successful API response.
6. Required route data failure must throw so route-level `error.tsx` renders.
7. Optional data failure must be visible as an error/warning and must not look like successful empty data.
8. Empty list is valid only when the API call succeeded and the backend returned an empty list.
9. Do not use `catch(() => [])` for required route data.
10. Do not convert failed action/service responses into successful empty UI.

Not allowed:

- failed API response -> `[]`
- failed API response -> `null`
- failed API response -> empty table
- failed API response -> default dropdowns
- failed API response -> fake total count
- failed API response -> fake success
- failed API response -> mock data

## Next.js 16 Params/SearchParams Rule

Use promise-style route props:

```ts
type ExamplePageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
```

Rules:

1. Await `params` before reading route segments.
2. Await `searchParams` before reading query values.
3. Never pass raw `searchParams` directly to actions.
4. Sanitize query values in the page or a utility before calling actions.
5. Treat array query values as invalid unless the route explicitly supports repeated params.
6. `layout.tsx` must not depend on `searchParams`; search-based data belongs in `page.tsx`.

## Query Param Sanitization Rules

1. Convert every query param to a known type before use.
2. Trim strings.
3. Reject or normalize invalid numbers.
4. Clamp pagination values to safe ranges.
5. Whitelist enum-like values.
6. Ignore unknown query params unless they should trigger canonical redirect.
7. Never pass unsanitized query params into services.
8. Use helper functions for common parsing:

```ts
const value = typeof raw === 'string' ? raw.trim() : '';
```

## Canonical URL Redirect Rules

Use `redirect()` when query params are valid but non-canonical.

Examples:

- `?page=0` redirects to `?page=1`.
- `?pageSize=9999` redirects to max allowed page size.
- Empty query values are removed.
- Unknown sort keys are removed or replaced with a default.

Rules:

1. Sanitize first.
2. Compare sanitized query state to the current URL state.
3. Redirect only when the URL should change.
4. Avoid redirect loops by building the canonical URL from sanitized values only.
5. Use localized route prefixes when building redirect paths.

## Pagination Rules

1. Default page is `1`.
2. Page numbers must be positive integers.
3. Page size must come from an allowed list, for example `10`, `20`, `50`, `100`.
4. Clamp or redirect invalid page sizes.
5. Use server-side pagination for large backend datasets.
6. Page components pass sanitized pagination to actions.
7. Actions pass sanitized pagination to services.
8. UI receives total count, current page, page size, and rows.
9. Empty pages after delete should redirect to the previous valid page when possible.

## Backend Page Size Contract Rule

Use or reuse the backend maximum page size for each paginated route:

```ts
const MAX_PAGE_SIZE = 100;
const ALLOWED_PAGE_SIZES = [10, 20, 50, 100] as const;
```

1. Preserve backend page-size contract names used by the service endpoint, commonly `PageSize`, `pageSize`, `PageNumber`, or `pageNumber`.
2. Do not invent new pagination query names in services without matching backend contract.
3. Each paginated route must define or reuse the backend maximum page size.
4. User-provided `pageSize` must never exceed backend max.
5. Invalid `pageSize` must be clamped or redirected to canonical URL.
6. Do not send `pageSize=500` to an API that supports max `100`.
7. Do not calculate fake `total` from current rows.
8. Use backend-provided `total` or `totalCount` when available.
9. If requested page is greater than total pages after fetch, redirect to the last valid page.
10. `pageSize = -1` may be used only where existing backend/service code already uses it to request all rows.
11. `pageSize = -1` must not be exposed as a normal user-selectable UI option.
12. UI page-size options should use bounded values already used in the project, such as `10`, `20`, `50`, or `100`.
13. Actions must validate `pageNumber` and `pageSize` before calling `src/lib/api/**`.
14. Pages must sanitize query pagination before calling actions.

## Route Action File Location And Naming Rule

Every route under `src/app/**` must expose its route-facing server actions from an `action.ts` file placed beside `page.tsx`.

Required structure:

```text
route-folder/
  page.tsx
  action.ts
  loading.tsx
  error.tsx
```

For nested routes:

```text
src/app/[locale]/property-tax/ptis/QuickDataEntry/[propertyId]/FloorSubmission/
  page.tsx
  action.ts
  loading.tsx
  error.tsx
```

Rules:

1. The route-facing action file must be named `action.ts`.
2. `action.ts` must live in the same route folder as `page.tsx`.
3. `page.tsx` must import route actions from local `./action`.
4. Client components and client hooks must import server actions from the nearest route `action.ts`.
5. Every production backend/API call must go through this route-local `action.ts`.
6. `action.ts` is the only route-facing file allowed to call `src/lib/api/**`.
7. `action.ts` must start with `'use server';`.
8. Do not place route-facing actions only inside component folders, hook folders, utility folders, or `src/lib/api/**`.
9. Do not import `src/lib/api/**` directly in `page.tsx`, `layout.tsx`, client components, client hooks, table column files, or UI utilities.
10. Do not create new route-facing files named `actions.tsx`, `actions.ts`, `*.action.ts`, or `*.actions.ts`.
11. Existing legacy files like `actions.tsx`, `actions.ts`, `document.actions.ts`, `property.actions.ts`, `CapitalValue.action.ts`, `RateableValue.action.ts`, `*.action.ts`, or `*.actions.ts` may remain temporarily, but they should be treated as migration candidates unless they are internal helpers behind the route-local `action.ts`.
12. When converting or touching a route, Codex should create or migrate to route-local `action.ts` beside `page.tsx`.
13. Legacy domain action files may be kept as internal helpers only if `action.ts` becomes the public route action boundary.
14. `page.tsx` and client components should import from `./action`, not from domain action files directly.
15. Even though the file extension is `.ts`, `action.ts` should not render JSX or export React components.
16. `action.ts` should contain server actions, validation, service calls, response normalization, revalidation, redirects, and safe action results only.

## Action File Extension Rule

The route action file must be `.ts`, not `.tsx`.

Reason:

- `action.ts` must not render JSX.
- `action.ts` must not export React components.
- It contains server actions, validation, service calls, response normalization, revalidation, redirects, and safe action results only.

## Action Argument Rules

1. Action arguments must be serializable.
2. Validate action arguments before calling services.
3. Do not accept raw `FormData` unless the action intentionally handles a form submission.
4. Convert IDs to numbers only after validation.
5. Keep locale as an explicit action argument when revalidation or translated errors need it.
6. Do not pass React state objects directly into actions.
7. Do not pass functions, class instances, Dates, Maps, Sets, or DOM objects into actions.

## Server Action Rules

1. Put route mutations and route-specific reads in route-local `action.ts` beside `page.tsx`.
2. Add `'use server';` at the top of `action.ts`.
3. Validate payloads before calling APIs.
4. Return consistent action results.
5. Use `revalidatePath` after create/update/delete.
6. Build revalidation paths from `locale` and route params.
7. Do not import client components into `action.ts`.
8. Do not expose raw backend errors directly when a translation key or safe message exists.
9. `action.ts` is the only route-facing layer allowed to call `src/lib/api/**`.
10. Keep action names explicit, for example `getFloorDataAction`, `submitFloorSubmissionAction`, `deleteFloorSubmissionAction`.
11. Actions should return normalized, UI-safe data when the page/client should not know backend response details.
12. Do not declare business `type` or `interface` blocks in `action.ts`; import them from `src/types/**`.
13. Actions should destructure and normalize service responses before returning them.
14. Actions should not return backend-only metadata unless the UI needs it.
15. Do not render JSX or export React components from `action.ts`.

## API/Service Rules (src/lib/api/**)

1. Keep backend HTTP calls in `src/lib/api/**`.
2. Service/API files must never be imported directly by pages or client components.
3. Normalize inconsistent backend responses in utilities before passing to UI.
4. Use typed service responses wherever possible.
5. Throw typed API errors from service layers when the caller needs status-specific handling.
6. Service/API files should not import route components.
7. Service/API files should not import route actions.
8. Service/API files should not depend on UI state or React hooks.
9. Do not create new route service files outside `src/lib/api/**`.
10. Do not declare reusable API response or payload `type`/`interface` blocks in service files; import them from `src/types/**`.
11. Services should expose domain functions, not route-specific UI functions.
12. Services should throw `ApiError` or return a typed response consistently according to existing local pattern.
13. Services should not call `revalidatePath`, `redirect`, `notFound`, or `getTranslations`.
14. Services should not know about `locale` unless the backend API requires it.

## Route-Local Fetch Helper Rule

Route-local fetch helpers such as `fetch*.ts`, `*.fetch.ts`, `data-fetcher.ts`, `data-fetcher-utils.ts`, `record.mapper.ts`, `*.mapper.ts`, and `valuation-fetch.ts` must stay behind the action boundary.

Allowed:

1. Pure mapping.
2. Pure formatting.
3. Pure validation.
4. Calling a route action.
5. Building UI-safe data from an action result.

Not allowed:

1. Calling `src/lib/api/**` directly from UI/page/client code.
2. Calling `src/services/**` directly.
3. Calling backend `fetch` directly.
4. Hiding API errors with fallback data.
5. Returning mock data.

Rules:

1. Route-local helpers may be imported by actions or by other route-local server helpers.
2. Pages may import route-local parsing or mapping helpers only when they do not call backend APIs.
3. Client components must not import route-local helpers that call backend APIs.
4. Any helper that calls `src/lib/api/**`, `apiClient`, `fetch`, cookies, headers, or server-only modules is server-only.
5. Server-only route helpers must not be imported into client components.
6. Mappers should normalize data shape and names, not perform UI rendering.
7. If a route-local fetch helper calls backend data, move that backend call into the route action layer or document the required migration.

## API Response Destructuring Rules

1. Do not pass raw backend response envelopes directly to components.
2. Destructure `success`, `data`, `error`, `message`, `total`, and pagination fields in actions.
3. Normalize alternate backend names in one place before UI consumption.
4. Preserve backend errors in action failure responses.
5. Use typed helpers for repeated response shapes.
6. Prefer these UI shapes:

```ts
{ success: true, data }
{ success: false, error }
```

7. For list pages, prefer:

```ts
{
  rows,
  total,
  page,
  pageSize
}
```

## No any Escape Rule

1. Do not use `any` to bypass route, action, service, form, or API typing.
2. Do not use `response as any`, `payload as any`, `props as any`, or `error as any`.
3. Prefer existing types from `src/types/**`.
4. Use `unknown` at external/backend boundaries.
5. Narrow with type guards, validators, or existing response validators.
6. Return typed UI-safe data from actions.
7. Do not pass unknown backend objects into components.
8. If a legacy `any` already exists, do not spread it into new files.
9. Do not cast through `as any` to silence TypeScript.
10. Test-only casts should be minimized and must not justify production `any`.

## Prop Passing And End-To-End Verification Rules

1. Server pages pass initial data to client components through explicit props.
2. Prop names should describe UI meaning, not backend field names when backend naming is inconsistent.
3. Do not pass raw action results to large client components unless the component is an action-result renderer.
4. Verify the path from backend response to UI field:

```text
service response -> action normalization -> page prop -> client component prop -> rendered field
```

5. When adding or changing a field, verify create, edit, list, delete, validation, and translated error display where applicable.

## Layout Rules

1. Layouts are Server Components by default.
2. Do not add `"use client"` to route layouts unless there is no smaller client boundary.
3. Layouts should fetch shared navigation/session/permission data server-side.
4. Layouts should not call services directly; use actions or server-only guard utilities that already follow project pattern.
5. Shared interactive wrappers should be child client components.
6. Layouts must pass only serializable props into client wrappers.

## Loading Rules

1. Every async route must have `loading.tsx`.
2. Reuse route-level `loading.tsx` where present.
3. Prefer existing common loading UI, especially `src/components/common/LoadingPage.tsx` or existing common exports.
4. Do not create custom loading UI unless an existing module pattern already does it.
5. Do not show fake rows or mock data in loading UI.
6. Skeletons are allowed only as visual placeholders.
7. Do not fetch data in `loading.tsx`.
8. Keep `loading.tsx` small.
9. Do not use loading UI to hide API failures.
10. Loading components must not call APIs.
11. Loading components must not import services or actions.
12. Loading UI should match the route density and not introduce layout shift.

## Client Component Rules

A component should be client-only only when it needs:

- Event handlers.
- Local form state.
- `useState`, `useEffect`, `useReducer`, or refs.
- Router hooks.
- Browser APIs.
- Toasts, portals, modals, drag/drop, or focus management.

Rules for client components:

1. Add `"use client"` only at the smallest useful boundary.
2. Receive initial server data through props.
3. Do not fetch initial page data again on mount if the server already provided it.
4. Use server actions for submit/delete/update flows.
5. Keep URL synchronization in hooks, not in the server page.
6. Keep optimistic UI isolated in hooks/utilities.
7. Never import service/API files directly.
8. Never call backend business APIs directly with `fetch`.
9. If client interaction needs fresh data, call a server action.
10. Do not declare component props, form values, payloads, or API response `type`/`interface` blocks inside client components; import them from `src/types/**`.

## useTransition vs useEffect Rules

1. Do not call backend APIs from `useEffect`.
2. Do not call services from `useEffect`.
3. Do not use `useEffect` for initial page data that can be fetched in `page.tsx`.
4. Use `useTransition` for user-triggered server actions such as save, update, delete, refresh, search apply, pagination, tab change, filter apply, status toggle, or route update.
5. Use `useEffect` only for local browser behavior: focus, measurements, subscriptions, URL/local state sync, one-time client-only effects, and cleanup.
6. If a client component needs fresh server data after a user event, call an action inside an event handler, optionally wrapped in `startTransition`.
7. Do not create polling loops with `useEffect` unless explicitly required and reviewed.

## Multilingual And Indian Language Search Rules

1. Search input should preserve Unicode text, including Devanagari and Marathi/Hindi characters.
2. Use a Unicode-friendly search regex when validating free-text search:

```ts
const INDIAN_LANGUAGE_SEARCH_REGEX = /^[\p{L}\p{M}\p{N}\s.,\-()/]+$/u;
```

3. Do not use English-only regex like `/^[a-zA-Z0-9 ]+$/`.
4. Preserve Hindi and Marathi Devanagari input.
5. Normalize text with `.normalize('NFC')`.
6. Trim leading/trailing spaces.
7. Collapse repeated spaces only for search fields.
8. Do not strip Indian language characters during sanitization.
9. Do not transliterate automatically.
10. Backend search should receive the exact user search term after safe trimming.
11. Use `URLSearchParams` when writing search to URL.
12. Do not manually concatenate raw search text into URLs.
13. UI should use i18n labels and placeholders for search fields.
14. Add tests for English, Hindi, and Marathi/Devanagari terms when search behavior changes.

## Type Ownership Rules

All reusable `type` and `interface` declarations belong under `src/types/**`.

Do not declare types or interfaces in:

- `page.tsx`
- `layout.tsx`
- `action.ts`
- Client components
- Client hooks
- Service/API files under `src/lib/api/**`
- Utility files when the type is part of route, API, form, payload, or response shape

Allowed exceptions:

- Tiny local-only helper types that are not exported and are not part of route props, form data, API data, payloads, or shared UI contracts.
- Generic utility-only types that are meaningful only inside one utility file.

Preferred structure:

```text
src/types/
  module-name.types.ts
  property-tax.types.ts
  floor-details.types.ts
  room-details.types.ts
```

Rules:

1. Put API request payload types in `src/types/**`.
2. Put API response types in `src/types/**`.
3. Put form value types in `src/types/**`.
4. Put page prop types in `src/types/**` when reused or route-specific.
5. Put client component prop types in `src/types/**`.
6. Export types with clear domain names.
7. Import types with `import type`.

Example:

```ts
import type { FloorSubmissionPageProps } from '@/types/floor-details.types';
```

## Common UI Component Rules

1. Reuse existing UI components from `src/components/common/**` for route UI generation.
2. Do not edit files inside `src/components/common/**` during route SSR conversion.
3. Do not create one-off duplicates of common components inside route folders.
4. Do not add third-party UI.
5. Prefer existing common components for:

- Buttons and action buttons
- Inputs, selects, dropdowns, search selects, textareas, checkboxes, radio groups
- Tables, sortable headers, table headers, master tables
- Cards, badges, status badges, tabs
- Drawers, tooltips, context menus, confirmation providers
- Loading, error, unauthorized, validation, and page container surfaces

6. If a route needs custom layout, compose common components inside the route/module component.
7. If a common component appears insufficient, document the gap instead of changing `src/components/common/**`.
8. Route-specific UI belongs under the route module/component area, not inside `src/components/common/**`.
9. Prefer direct imports over `src/components/common/index.ts` when only a few components are used.
10. The barrel file `src/components/common/index.ts` can pull unused exports; avoid it when direct imports are clearer.

## Strict i18n Rules

1. Server pages use `getTranslations` from `next-intl/server` when they need translated server errors or labels.
2. Client components use `useTranslations`.
3. Always call `setRequestLocale(locale)` in localized server pages.
4. Keep namespace names explicit, for example:

```ts
const t = await getTranslations({ locale, namespace: 'quickDataEntry' });
```

5. Do not hardcode user-visible strings when the surrounding module already uses i18n.
6. Add keys to `src/i18n/locales/en/**`, `src/i18n/locales/hi/**`, and `src/i18n/locales/mr/**` together.
7. Do not add a key in only one locale.
8. Do not rename existing keys without updating all usages.
9. Keep namespaces aligned with the surrounding module, for example `quickDataEntry`, `ptis`, `common`, or `screenAccess`.
10. Error text returned by actions should be a safe message or a translation key understood by the UI.
11. Do not hardcode labels, placeholders, buttons, table headers, empty states, validation messages, or error messages.
12. Do not submit translated labels to APIs.
13. Submit IDs/codes to APIs.
14. Display translated labels in UI.
15. Missing translation keys fail review.

## Error Rules

1. Every async route must have `error.tsx`.
2. Reuse route-level `error.tsx` for page-level server failures.
3. `error.tsx` must reuse the existing route/common `ErrorPage` pattern.
4. Required SSR fetch failure must throw and reach `error.tsx`.
5. Expected form/action validation failures should return structured action errors.
6. Missing resources use `notFound()`.
7. Permission failures use unauthorized/permission UI, not `notFound()`.
8. Do not render fake empty states for API failures.
9. Do not expose raw backend stack traces.
10. Client components display action failures inline or through existing toast/error components.
11. Do not create new error UI if existing common/route error UI is enough.
12. Convert known API statuses into meaningful errors:
    - `401`: unauthorized
    - `403`: forbidden
    - `404`: not found
    - `500+`: server error
13. Use client error boundaries for complex interactive form surfaces.

## Redirection Rules

1. Use `redirect()` only in server pages, layouts, or server actions.
2. Use `notFound()` for missing resources, not for permission failures.
3. Use canonical redirects for invalid-but-recoverable query params.
4. Client navigation should use router only for UI navigation, not for replacing server validation.
5. Always preserve `locale` when redirecting localized routes.

## Data Shape Rules

1. Validate and coerce route params before API calls.
2. Normalize arrays and wrapped responses before rendering.
3. Avoid passing `undefined` when the client expects `null` or `[]`.
4. Avoid passing class instances, functions, Dates, Maps, Sets, or non-serializable objects to client components.
5. Prefer `null` for missing object data and `[]` for missing list data.
6. Keep backend naming conversions out of JSX.
7. Convert numeric strings once, near the boundary.
8. Keep date formatting in utilities or display components.
9. Do not mutate service response objects in components.

## Code Size And File Splitting Rules

1. Keep `page.tsx` focused on route orchestration.
2. Move route actions to `action.ts`.
3. Move API calls to `src/lib/api/**`.
4. Move reusable data shaping to `src/lib/utils/**`.
5. Move reusable types to `src/types/**`.
6. Split large client components into feature sections when one file becomes hard to scan.
7. Keep route-specific components under the module/route component folder.
8. Do not split files only to create tiny wrappers with no meaning.

## 200-Line File Size Rule

1. Prefer each file to stay under 200 lines when practical.
2. If a file crosses 200 lines, Codex must check whether to split into:
   - section components
   - table columns
   - hooks
   - mappers
   - validators
   - constants
   - query sanitizers
   - action helpers
3. Do not split only to create meaningless wrappers.
4. Keep `page.tsx` focused on route orchestration.
5. Keep client components focused and split large forms/tables into child components.

## Import Rules

1. Use absolute imports with `@/`.
2. Use `import type` for type-only imports.
3. Do not import from barrel files when direct imports are clearer.
4. Avoid `src/components/common/index.ts` if it pulls many unused exports.
5. Keep imports grouped in this order:

- External packages
- App route imports
- Components
- Hooks
- Services/actions
- Utils
- Types

6. Remove unused imports.
7. Do not import server-only modules into client components.
8. Do not import client components into server actions or services.
9. Do not create circular imports.
10. Run lint/type-check after changes.

## Recursive Import And Child Import Audit Rule

Before converting a route, recursively audit imports from:

- Route files
- Main client component
- Child components
- Hooks
- Utilities
- Validation files
- Mapper files
- Table column files
- Constants
- Barrel files

Rules:

1. Follow child imports until reaching external packages, `src/components/common/**`, `src/lib/api/**`, `src/lib/utils/**`, `src/lib/validations/**`, `src/types/**`, or i18n files.
2. Check every child import for direct `src/lib/api/**` usage.
3. Check every child import for server-only imports inside client components.
4. Check every barrel import for accidental extra dependencies.
5. Prefer direct imports when a barrel pulls unrelated common components or server/client mixed dependencies.
6. Record violations with exact file paths.

## Security And Permission Rules

1. Permission checks must happen server-side for protected route access.
2. Client-side permission checks are UI convenience only, not security.
3. Do not trust client-provided IDs, locale, role, permission, or ownership values.
4. Validate ownership-sensitive IDs in actions/services before mutation.
5. Do not expose tokens, cookies, secrets, or raw headers to client components.
6. Do not log sensitive user or property data.
7. Use existing server access guard and permission helpers where the surrounding route uses them.
8. Return `401`/`403` style failures through existing API error handling patterns.

## Folder Rules

For a full SSR-standard route, prefer this shape:

```text
route-folder/
  page.tsx
  action.ts
  loading.tsx
  error.tsx
```

Use nested route layouts only when multiple child pages share navigation or wrappers.

## Test Case Rules

Use the existing property-tax test pattern under `src/__tests__/app/[locale]/property-tax/**`.

Rules:

1. Test actions as the route-facing API.
2. Mock `src/lib/api/**` services in action tests.
3. Do not mock actions when testing actions.
4. Do not call real backend APIs in unit tests.
5. Import actions from `@/app/[locale]/.../action`.
6. Import mocked services from `@/lib/api/**`.
7. Import reusable test data types from `@/types/**`.
8. Mock Next.js server modules when needed, such as `next/cache`, `next/headers`, `next/navigation`.
9. Clear mocks in `beforeEach`.
10. Cover valid input, invalid input, service success, service failure, thrown errors, and revalidation.
11. Cover pagination sanitization when a route uses pagination.
12. Cover canonical query behavior when a route sanitizes query params.
13. Cover multilingual search with English and Indian language input when search is changed.
14. Cover no silent fallback: failed service responses should produce action failures or route errors.
15. Tests may use mock data only inside test files.
16. Tests should assert that invalid input does not call the service.
17. Tests should assert that successful mutations call `revalidatePath` with the correct localized route.
18. Tests should not import client components into action tests.
19. Tests should not depend on `src/components/common/**` implementation details.
20. Add or update tests when changing action validation, response destructuring, pagination, redirect rules, or service argument mapping.

## Property-Tax Test Placement Rule

Use the existing test locations:

- Route action tests: `src/__tests__/app/[locale]/property-tax/**`
- Property-tax component tests: `src/__tests__/components/modules/property-tax/**`
- Hook tests: `src/__tests__/hooks/**`, including `src/__tests__/hooks/ptis/**`, `src/__tests__/hooks/zoneMaster/**`, and `src/__tests__/hooks/property-search/**`
- Service tests: `src/__tests__/lib/api/**`
- PTIS service tests: `src/__tests__/lib/api/ptis/**`
- Property-search service tests: `src/__tests__/lib/api/property-search/**`
- Tax-zoning service tests: `src/__tests__/lib/api/taxZoning/**`
- Utility tests: `src/__tests__/lib/utils/**`
- Validation tests: `src/__tests__/lib/validations/**`
- Shared utility tests: `src/__tests__/utils/**`

Rules:

1. Codex must not create a new test structure when a nearby pattern exists.
2. Put new property-tax action tests near the route action being tested under `src/__tests__/app/[locale]/property-tax/**`.
3. Put component behavior tests under `src/__tests__/components/modules/property-tax/**`.
4. Put hook behavior tests under `src/__tests__/hooks/**`.
5. Put `src/lib/api/**` service tests under `src/__tests__/lib/api/**`.
6. Put validation schema tests under `src/__tests__/lib/validations/**`.
7. Action tests should mock `src/lib/api/**`.
8. Service tests may import the service under test.
9. Component/hook tests should mock actions, not services.
10. Tests may use mock data only inside test files.
11. Invalid action input tests must assert that the service was not called.
12. Mutation tests must assert `revalidatePath` with the correct localized route.
13. Pagination/query sanitization tests must include URL tampering cases.
14. Search tests must include English, Hindi, and Marathi/Devanagari terms when search behavior changes.

## Service Import Exception For Tests

Production code must not import `src/lib/api/**` from pages, client components, or hooks.

Production code rule:

```text
Only actions call `src/lib/api/**`.
```

Tests may import or mock `src/lib/api/**` only in these cases:

1. Action tests mock the service layer to verify action validation, argument mapping, response handling, and revalidation.
2. Service tests import the service under test and mock `apiClient` or backend transport.
3. Utility/validation tests may import service-adjacent types only when needed for typed fixtures.
4. Component/hook tests should mock actions, not services.
5. Production components/hooks/pages/layouts must never import services.

Tests must not use service imports to justify production service imports from UI code.

Property-tax examples currently follow these useful patterns:

- `src/__tests__/app/[locale]/property-tax/ptis/TaxDetails/action.test.ts` tests action validation and mocks `@/lib/api/ptis/ptisMain-taxdetails/taxDetails.service`.
- `src/__tests__/app/[locale]/property-tax/zone-master/deletePropertyActions.test.ts` tests mutation actions, mocked services, and `revalidatePath`.

## Codex / AI Code Review Instructions

When reviewing or converting a route, check in this order:

1. Classify the route.
2. Identify the entry file.
3. Identify the parent layout.
4. Identify loading/error files.
5. Verify the route has `action.ts` beside `page.tsx`; if legacy `actions.tsx`, `actions.ts`, `*.actions.ts`, or `*.action.ts` exists, mark it as a migration candidate.
6. Identify the main UI component.
7. Inspect all child imports recursively.
8. Identify hooks used.
9. Identify utils/mappers used.
10. Identify types used.
11. Identify i18n namespaces used.
12. Identify query params accepted.
13. Identify backend page-size limit.
14. Identify API/service functions called by actions.
15. Trace every backend API call.
16. Verify every backend call goes through the route action layer.
17. Verify pages, client components, and hooks do not import `src/lib/api/**`.
18. Verify `page.tsx` awaits `params` and `searchParams`.
19. Verify query params are sanitized before action calls.
20. Verify canonical redirects and pagination rules.
21. Verify services live under `src/lib/api/**`.
22. Verify response destructuring and normalization.
23. Verify client components use common UI components and do not modify `src/components/common/**`.
24. Verify all reusable types live under `src/types/**`.
25. Verify imports follow project rules.
26. Verify error/loading files are reused.
27. Verify security and permission checks.
28. Report any direct service import violation.
29. Report any route-local fetch helper violation.
30. Report any mock data violation.
31. Report any silent fallback violation.
32. Report any `any` escape.
33. Identify tests to add/update.
34. Run lint/type-check after changes when feasible.
35. Report lint/type-check result only if actually run.
36. Verify no new package is introduced.

Findings should name exact file paths and the violated rule.

## Conversion Checklist

Before converting:

- Identify the route entry file.
- Identify the main UI component.
- Identify all server actions.
- Identify API/service files.
- Identify common components.
- Identify hooks.
- Identify utilities/helpers.
- Identify types/config/data files.
- Identify unresolved imports.
- Identify table column files, mapper files, validation files, constants files, and route-local helpers.
- Identify all barrel imports.

During conversion:

- Remove `"use client"` from `page.tsx`.
- Move interactive UI into a child client component.
- Move initial fetch orchestration into `page.tsx`.
- Move actual data reads into route-local `action.ts`.
- Move backend calls into `src/lib/api/**` service files if they are not already there.
- Ensure `page.tsx` calls actions, not services.
- Ensure client components call actions, not services.
- Reuse common UI components.
- Do not modify `src/components/common/**`.
- Move inline route, form, payload, response, and component prop types to `src/types/**`.
- Replace type imports with `import type`.
- Await `params` and `searchParams`.
- Sanitize query params before action calls.
- Add canonical redirects where invalid query params are recoverable.
- Add `setRequestLocale(locale)`.
- Add or update `loading.tsx`.
- Add or update `error.tsx`.
- Add `dynamic = 'force-dynamic'` only when needed.
- Pass initial data as serializable props.
- Use server actions for mutations.
- Revalidate after mutations.

After conversion:

- Confirm there are no client hooks in `page.tsx`.
- Confirm no browser APIs are used in server files.
- Confirm `page.tsx` has no imports from `src/lib/api/**`.
- Confirm client components/hooks have no imports from `src/lib/api/**`.
- Confirm all backend calls are reached through `action.ts`.
- Confirm route UI uses existing common components where available.
- Confirm no files under `src/components/common/**` were changed.
- Confirm `page.tsx`, `action.ts`, services, hooks, and client components do not contain reusable `type` or `interface` declarations.
- Confirm all route/API/form/component contract types are imported from `src/types/**`.
- Confirm initial page data appears without client-side fetch-on-mount.
- Confirm create/update/delete still revalidates the correct route.
- Confirm i18n namespaces exist for all translated keys.
- Confirm recursive child import audit has no direct service imports from UI.
- Confirm TypeScript passes.
- Confirm route loads in browser for at least one real dynamic param.

## Final Production Gate

Before considering a route production-ready:

1. Route has `action.ts` beside `page.tsx`.
2. No new third-party package was added.
3. `page.tsx` and `layout.tsx` are server components unless there is a documented smaller impossible boundary.
4. `page.tsx` and `layout.tsx` do not import `src/lib/api/**`.
5. Client components and hooks do not import `src/lib/api/**`.
6. Every backend API call flows through route-local `action.ts`.
7. Actions validate arguments and call `src/lib/api/**`.
8. Query params are sanitized and canonicalized where needed.
9. Pagination follows backend page-size contract.
10. `loading.tsx` and `error.tsx` reuse existing common/route patterns.
11. i18n keys exist for English, Hindi, and Marathi when user-visible strings changed.
12. Reusable types live in `src/types/**`.
13. Common UI components are reused and `src/components/common/**` is unchanged.
14. Imports use `@/`, type-only imports use `import type`, and unused imports are removed.
15. Recursive child import audit has no server/client boundary violations.
16. No `any` escape was introduced.
17. Tests are added or updated in the matching `src/__tests__/**` location.
18. Lint and type-check pass when actually run.

## Route Classification Labels

Use these labels:

- **SSR-standard**: Server `page.tsx` fetches initial data and renders client UI with serializable props.
- **Hybrid SSR/client**: Server page fetches some initial data, but client still performs important initial reads.
- **Client-rendered**: `page.tsx` or the main route shell is client-only and fetches initial page data in the browser.
- **Static/server**: Server page renders without per-request dynamic data.
- **Non-compliant data flow**: Any page, client component, or hook imports/calls `src/lib/api/**` directly.
- **Test-only service import**: A test imports or mocks `src/lib/api/**` under the allowed test exception.

## Current Floor Submission Route Classification

`src/app/[locale]/property-tax/ptis/QuickDataEntry/[propertyId]/FloorSubmission/page.tsx` is **SSR-standard**, not pure server-only.

Reasons:

- `page.tsx` is a Server Component.
- It is `async`.
- It awaits `params` and `searchParams`.
- It calls `setRequestLocale(locale)`.
- It exports `dynamic = 'force-dynamic'`.
- It fetches initial lookup, property, floor, room, and edit data on the server.
- It passes initial data into `FloorSubmission`.
- Mutations must live in `action.ts` with `'use server'`.
- The interactive form/table/room UI remains client-side through child components and hooks.

One improvement needed for the strict project rule:

- `page.tsx` should not import service functions directly.
- Any direct service call in `page.tsx` must be wrapped by a route action in `action.ts`.

This is the correct pattern for a complex form route. The goal is not to make every component server-only; the goal is to make the route entry and initial data flow server-rendered while preserving client interactivity where it belongs.
