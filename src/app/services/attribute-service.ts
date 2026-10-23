import { Service } from '@angular/core';
import { IAttributeModel } from '../models/IAttribute.model';

@Service()
export class AttributeService {
  mockAttributes: IAttributeModel[] = [
    {
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
      AttributeId: 102,
      AttributeName: 'Employee Onboarding Status',
      BusinessUnitName: 'Human Resources',
      CompanyName: 'Globex Industries',
      CustomerLocationName: 'London, UK',
      IsActive: true,
      CreatedOn: new Date('2025-03-22T14:15:00Z'),
      CreatedBy: 'David Chen',
      // Optional fields left out to test undefined handling
    },
    {
      AttributeId: 103,
      AttributeName: 'Legacy Machine ID',
      BusinessUnitName: 'Operations',
      CompanyName: 'Initech Software',
      CustomerLocationName: 'Berlin, Germany',
      IsActive: false, // Inactive
      CreatedOn: new Date('2024-11-05T09:00:00Z'),
      CreatedBy: 'Elena Rostova',
    },
    {
      AttributeId: 104,
      AttributeName: 'Campaign ROI Threshold',
      BusinessUnitName: 'Marketing',
      CompanyName: 'Acme Corp',
      CustomerLocationName: 'Tokyo, Japan',
      IsActive: true,
      CreatedOn: new Date('2025-06-18T11:45:00Z'),
      CreatedBy: 'Kenji Sato',
      UpdatedOn: new Date('2025-07-02T15:30:00Z'),
      UpdatedBy: 'Kenji Sato',
    },
    {
      AttributeId: 105,
      AttributeName: 'Warehouse Fleet Capacity',
      BusinessUnitName: 'Supply Chain',
      CompanyName: 'Umbrella Corp',
      CustomerLocationName: 'Sydney, Australia',
      IsActive: true,
      CreatedOn: new Date('2025-08-01T16:20:00Z'),
      CreatedBy: 'Marcus Vance',
    },
    {
      AttributeId: 106,
      AttributeName: 'Deprecated Tax Bracket',
      BusinessUnitName: 'Finance',
      CompanyName: 'Globex Industries',
      CustomerLocationName: 'London, UK',
      IsActive: false, // Inactive
      CreatedOn: new Date('2024-05-12T07:10:00Z'),
      CreatedBy: 'Sarah Jenkins',
    },
    {
      AttributeId: 107,
      AttributeName: 'Remote Work Eligibility',
      BusinessUnitName: 'Human Resources',
      CompanyName: 'Umbrella Corp',
      CustomerLocationName: 'New York, USA',
      IsActive: true,
      CreatedOn: new Date('2025-09-10T10:05:00Z'),
      CreatedBy: 'Amara Okafor',
      UpdatedOn: new Date('2025-12-01T09:00:00Z'),
      UpdatedBy: 'David Chen',
    },
    {
      AttributeId: 108,
      AttributeName: 'Archived Vendor Tier',
      BusinessUnitName: 'Supply Chain',
      CompanyName: 'Initech Software',
      CustomerLocationName: 'Berlin, Germany',
      IsActive: false, // Inactive
      CreatedOn: new Date('2024-08-30T13:50:00Z'),
      CreatedBy: 'David Chen',
    },
  ];
}
