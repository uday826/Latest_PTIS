import { ScreenService } from './sfm-screen.service';
import { SectionService } from './sfm-section.service';
import { FieldService } from './sfm-field.service';

export const ScreenFieldMasterService = {
  ...ScreenService,
  ...SectionService,
  ...FieldService,
};

export { ScreenService, SectionService, FieldService };
export { isScreenShape, normalizeScreen, isSectionShape, normalizeSection, isFieldShape, normalizeField, isScreenGroupShape, normalizeScreenGroup } from './sfm-types-guard';
export { buildScreenPayload, buildSectionPayload, buildFieldPayload } from './sfm-payload';
