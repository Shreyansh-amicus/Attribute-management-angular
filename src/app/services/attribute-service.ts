import { Service } from '@angular/core';
import { IAttributeModel } from '../models/IAttribute.model';

@Service()
export class AttributeService {
  mockAttributes: IAttributeModel[] = [
    {
      // Combination 1: Both values are present
      AttributeId: 101,
      AttributeName: 'Cost Center Code',
      BusinessUnitName: 'Finance',
      CompanyName: 'Acme Corp',
      CustomerLocationName: 'New York, USA',
      IsActive: true,
      CreatedOn: new Date('2025-01-15T08:30:00Z'),
      CreatedBy: 'Sarah Jenkins',
      UpdatedOn: new Date('2025-06-20T10:15:00Z'),
      UpdatedBy: 'System Admin',
    },
    {
      // Combination 2: Company is present, Location is completely omitted (undefined)
      AttributeId: 102,
      AttributeName: 'Employee Onboarding Status',
      BusinessUnitName: 'Human Resources',
      CompanyName: 'Globex Industries',
      IsActive: true,
      CreatedOn: new Date('2025-03-22T14:15:00Z'),
      CreatedBy: 'David Chen',
    },
    {
      // Combination 3: Company is completely omitted (undefined), Location is present
      AttributeId: 103,
      AttributeName: 'Legacy Machine ID',
      BusinessUnitName: 'Operations',
      CustomerLocationName: 'Berlin, Germany',
      IsActive: false,
      CreatedOn: new Date('2024-11-05T09:00:00Z'),
      CreatedBy: 'Elena Rostova',
    },
    {
      // Combination 4: Both fields are completely omitted (undefined)
      AttributeId: 104,
      AttributeName: 'Campaign ROI Threshold',
      BusinessUnitName: 'Marketing',
      IsActive: true,
      CreatedOn: new Date('2025-06-18T11:45:00Z'),
      CreatedBy: 'Kenji Sato',
      UpdatedOn: new Date('2025-07-02T15:30:00Z'),
      UpdatedBy: 'Kenji Sato',
    },
    {
      // Combination 5: Company is an empty string, Location is present
      AttributeId: 105,
      AttributeName: 'Warehouse Fleet Capacity',
      BusinessUnitName: 'Supply Chain',
      CompanyName: '',
      CustomerLocationName: 'Sydney, Australia',
      IsActive: true,
      CreatedOn: new Date('2025-08-01T16:20:00Z'),
      CreatedBy: 'Marcus Vance',
    },
    {
      // Combination 6: Company is present, Location is an empty string
      AttributeId: 106,
      AttributeName: 'Deprecated Tax Bracket',
      BusinessUnitName: 'Finance',
      CompanyName: 'Globex Industries',
      CustomerLocationName: '',
      IsActive: false,
      CreatedOn: new Date('2024-05-12T07:10:00Z'),
      CreatedBy: 'Sarah Jenkins',
    },
    {
      // Combination 7: Both are empty strings
      AttributeId: 107,
      AttributeName: 'Remote Work Eligibility',
      BusinessUnitName: 'Human Resources',
      CompanyName: '',
      CustomerLocationName: '',
      IsActive: true,
      CreatedOn: new Date('2025-09-10T10:05:00Z'),
      CreatedBy: 'Amara Okafor',
      UpdatedOn: new Date('2025-12-01T09:00:00Z'),
      UpdatedBy: 'David Chen',
    },
    {
      // Combination 8: Baseline valid data copy to maintain diversity balance
      AttributeId: 108,
      AttributeName: 'Archived Vendor Tier',
      BusinessUnitName: 'Supply Chain',
      CompanyName: 'Initech Software',
      CustomerLocationName: 'Berlin, Germany',
      IsActive: false,
      CreatedOn: new Date('2024-08-30T13:50:00Z'),
      CreatedBy: 'David Chen',
    },
  ];

}
