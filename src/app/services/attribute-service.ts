import { Injectable } from '@angular/core';
import { IAttributeModel } from '../models/IAttribute.model';
import { IBusinessUnit } from '../models/IBusinessUnit.model';
import { ICompany } from '../models/ICompany.model';
import { ICustomerLocationLookUp } from '../models/ILookup.model';

@Injectable({
  providedIn : 'root'
})
export class AttributeService {

  readonly debugInstanceId = Math.random().toString(36).slice(2);

constructor() {
  console.log('AttributeService created:', this.debugInstanceId);
}

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

  readonly businessUnits: IBusinessUnit[] = [
    { BusinessUnitId: 1, BusinessUnitName: 'Finance' },
    { BusinessUnitId: 2, BusinessUnitName: 'Human Resources' },
    { BusinessUnitId: 3, BusinessUnitName: 'Operations' },
    { BusinessUnitId: 4, BusinessUnitName: 'Marketing' },
    { BusinessUnitId: 5, BusinessUnitName: 'Supply Chain' },
  ];

  readonly companies: ICompany[] = [
    { CompanyId: 1, CompanyName: 'Acme Corp' },
    { CompanyId: 2, CompanyName: 'Globex Industries' },
    { CompanyId: 3, CompanyName: 'Initech Software' },
  ];

  readonly customerLocations: ICustomerLocationLookUp[] = [
    { CustomerLocationId: 1, CustomerLocationName: 'New York, USA', BusinessUnitId: 1 },
    { CustomerLocationId: 2, CustomerLocationName: 'Mumbai, India', BusinessUnitId: 1 },
    { CustomerLocationId: 3, CustomerLocationName: 'Berlin, Germany', BusinessUnitId: 2 },
    { CustomerLocationId: 4, CustomerLocationName: 'London, UK', BusinessUnitId: 2 },
    { CustomerLocationId: 5, CustomerLocationName: 'Bengaluru, India', BusinessUnitId: 3 },
    { CustomerLocationId: 6, CustomerLocationName: 'Chennai, India', BusinessUnitId: 3 },
    { CustomerLocationId: 7, CustomerLocationName: 'Sydney, Australia', BusinessUnitId: 4 },
    { CustomerLocationId: 8, CustomerLocationName: 'Singapore', BusinessUnitId: 4 },
    { CustomerLocationId: 9, CustomerLocationName: 'Pune, India', BusinessUnitId: 5 },
    { CustomerLocationId: 10, CustomerLocationName: 'Hyderabad, India', BusinessUnitId: 5 },
  ];

  addAttribute(attribute: IAttributeModel): void {
  const alreadyExists = this.mockAttributes.some(
    item => item.AttributeId === attribute.AttributeId
  );

  if (alreadyExists) {
    console.warn(
      'Duplicate attribute prevented:',
      attribute.AttributeId
    );
    return;
  }

  this.mockAttributes = [...this.mockAttributes, attribute];

  console.log('Attribute added:', attribute.AttributeId);
  console.log('Total attributes:', this.mockAttributes.length);
}
}
