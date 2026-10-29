import { inject, Injectable, Service } from '@angular/core';
import { ICompany } from '../models/ICompany.model';
import { IBusinessUnit } from '../models/IBusinessUnit.model';
import { ICustomerLocationLookUp } from '../models/ILookup.model';
import { AttributeService } from './attribute-service';

@Injectable({
    providedIn : "root"
})
export class Lookup {
    private readonly attributeService = inject(AttributeService);

    getBusinessUnits(){
        return this.attributeService.businessUnits;
    }

    getCompanies(){
        return this.attributeService.companies;
    }

    getCustomerLocation(){
        return this.attributeService.customerLocations
    }
}