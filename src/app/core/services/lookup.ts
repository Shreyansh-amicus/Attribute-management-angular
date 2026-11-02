import { inject, Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IBusinessUnit } from '../../shared/models/IBusinessUnit.model';
import { Observable } from 'rxjs';
import { ICompany } from '../../shared/models/ICompany.model';
import { ICustomerLocationLookUp } from '../../shared/models/ILookup.model';

@Injectable({
    providedIn : "root"
})
export class Lookup {
    private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getBusinessUnits(): Observable<IBusinessUnit[]> {
    return this.http.get<IBusinessUnit[]>(
      `${this.apiUrl}/businessUnits`,
    );
  }

  getCompanies(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(
      `${this.apiUrl}/companies`,
    );
  }

  getCustomerLocation(): Observable<ICustomerLocationLookUp[]> {
    return this.http.get<ICustomerLocationLookUp[]>(
      `${this.apiUrl}/customerLocation`,
    );
  }
}