export interface ComplianceIssue {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Open' | 'Resolved' | 'Overridden';
  remediation: string;
  validationBadgeKey?: 'fire' | 'water' | 'mobile';
}

export const initialComplianceIssues: ComplianceIssue[] = [
  {
    id: 'commercial-use',
    title: 'Possible Commercial Use',
    severity: 'High',
    description: 'Satellite change detection matches garage/shop activities.',
    status: 'Open',
    remediation: 'Schedule manual verification or update property category to Mixed-Use.',
  },
  {
    id: 'area-difference',
    title: 'Area Difference Found',
    severity: 'High',
    description: 'Sat footprint shows 440 m² vs 400 m² reported (10% diff).',
    status: 'Open',
    remediation: 'Re-measure the built-up area and run dual-valuation.',
  },
  {
    id: 'parking-missing',
    title: 'Parking Provision Missing',
    severity: 'Medium',
    description: 'Design permits lack ground-floor parking configurations.',
    status: 'Open',
    remediation: 'Verify building permit layout drawings.',
  },
  {
    id: 'fire-noc',
    title: 'Fire NOC Expired',
    severity: 'Medium',
    description: 'Fire NOC has expired in Dec 2023.',
    status: 'Open',
    remediation: 'Upload valid renewal receipt or certificate from Municipal Fire Dept.',
    validationBadgeKey: 'fire',
  },
  {
    id: 'water-dup',
    title: 'Duplicate Water Connection',
    severity: 'Low',
    description: 'Tap connection matches another property unit in Wing B.',
    status: 'Open',
    remediation: 'Verify consumer ID details in Water billing system.',
    validationBadgeKey: 'water',
  },
  {
    id: 'occupancy-change',
    title: 'Occupancy Change Detected',
    severity: 'Low',
    description: 'Occupancy change from residential to mixed use detected.',
    status: 'Open',
    remediation: 'Update tenant records or update tax calculation factor.',
  },
  {
    id: 'boundary-wall',
    title: 'Boundary Wall Missing',
    severity: 'Low',
    description: 'Boundary wall not found in latest survey photos.',
    status: 'Open',
    remediation: 'Update physical layout records.',
  },
  {
    id: 'mobile-verify',
    title: 'Taxpayer Mobile Not Verified',
    severity: 'Low',
    description: 'Mobile number is not linked to Aadhaar registry.',
    status: 'Open',
    remediation: 'Initiate mobile validation SMS flow.',
    validationBadgeKey: 'mobile',
  }
];
