import { sanitizeInput } from '../security';

export interface SanitizeParamsOptions<T extends string> {
  allowedSortColumns: readonly T[];
  maxPageSize?: number;
  defaultPageSize?: number;
}

export interface SanitizedParams<T extends string> {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  sortBy: T | undefined;
  sortOrder: 'asc' | 'desc' | undefined;
  type: string | undefined;
  status: string | undefined;
}

/**
 * Utility function to sanitize, clamp, and parse URL dynamic query parameters
 * before passing them to Server Actions or API clients.
 *
 * Enforces strict whitelists for sortable columns, limits page size boundaries,
 * and strips hazardous user input tags to protect against XSS/injections.
 */
export function sanitizeParams<T extends string>(
  params: Record<string, unknown> | null | undefined,
  options: SanitizeParamsOptions<T>
): SanitizedParams<T> {
  const defaultPageSize = options.defaultPageSize ?? 10;
  const maxPageSize = options.maxPageSize ?? 100;
  const allowedSortColumns = options.allowedSortColumns;

  if (!params) {
    return {
      pageNumber: 1,
      pageSize: defaultPageSize,
      searchTerm: '',
      sortBy: undefined,
      sortOrder: undefined,
      type: undefined,
      status: undefined,
    };
  }

  // 1. pageNumber
  let pageNumber = 1;
  if ('pageNumber' in params) {
    const val = parseInt(String(params.pageNumber), 10);
    if (!isNaN(val) && val >= 1) {
      pageNumber = val;
    }
  }

  // 2. pageSize
  let pageSize = defaultPageSize;
  if ('pageSize' in params) {
    const val = parseInt(String(params.pageSize), 10);
    if (!isNaN(val) && val >= 1) {
      pageSize = Math.min(val, maxPageSize);
    }
  }

  // 3. searchTerm / q
  let searchTerm = '';
  if ('searchTerm' in params && params.searchTerm) {
    searchTerm = sanitizeInput(String(params.searchTerm)).trim();
  } else if ('q' in params && params.q) {
    searchTerm = sanitizeInput(String(params.q)).trim();
  }

  // 4. sortBy
  let sortBy: T | undefined = undefined;
  if ('sortBy' in params && typeof params.sortBy === 'string') {
    if (allowedSortColumns.includes(params.sortBy as T)) {
      sortBy = params.sortBy as T;
    }
  }

  // 5. sortOrder
  let sortOrder: 'asc' | 'desc' | undefined = undefined;
  if ('sortOrder' in params && typeof params.sortOrder === 'string') {
    const order = params.sortOrder.toLowerCase();
    if (order === 'asc' || order === 'desc') {
      sortOrder = order as 'asc' | 'desc';
    }
  }

  // 6. type
  let type: string | undefined = undefined;
  if ('type' in params && typeof params.type === 'string') {
    type = sanitizeInput(params.type).trim();
  }

  // 7. status
  let status: string | undefined = undefined;
  if ('status' in params && typeof params.status === 'string') {
    status = sanitizeInput(params.status).trim();
  }

  return {
    pageNumber,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
    type,
    status,
  };
}
