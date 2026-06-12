import {
  MasterDataRecord,
  MasterDataType,
} from './master-data.types';

export interface AssetUser {
  id: string;
  name: string;
  role: string;
  accessibleScreenCodes?: string[];
  screenStates?: Record<string, boolean>;
}

export interface ScreenItem {
  screenCode: string;
  screenPath: string;
}

export interface MasterTypesProps {
  selected: string;
  onSelect: (id: string) => void;
  masterTypes: MasterDataType[];
}


export interface MasterTableRecordProps {
  master: MasterDataType;
  selectedGroup: string;
  onDelete: (row: MasterDataRecord, masterId: string) => Promise<void>;
  onSave: (
    payload: MasterDataRecord,
    masterId: string,
    editData: MasterDataRecord | null,
    onSuccess?: () => void
  ) => Promise<void>;
  isPending?: boolean;
}


/** Shared pagination configuration passed from MasterDataView down to each Table component. */
export interface PaginationConfig {
  page: number;
  pageSize: number;
  search: string;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (term: string) => void;
}

export interface MasterDataFormToast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export { MASTER_IDS, MASTER_STATUS } from './master-data.types';
export type {
  MasterId,
  MasterDataStatus,
  MasterDataRecord,
  MasterDataGroup,
  MasterDataType,
  MasterDataActions,
  MasterDataFormProps,
  MasterDataFormErrors,
  GroupFilterProps,
  MasterDataRootProps,
  MasterDataCommonProps,
} from './master-data.types';
