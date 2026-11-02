import { inject, Injectable } from '@angular/core';
import { IAttributeModel } from '../../shared/models/IAttribute.model';
import { IBusinessUnit } from '../../shared/models/IBusinessUnit.model';
import { ICompany } from '../../shared/models/ICompany.model';
import { ICustomerLocationLookUp } from '../../shared/models/ILookup.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  readonly debugInstanceId = Math.random().toString(36).slice(2);

  constructor() {
    console.log('AttributeService created:', this.debugInstanceId);
  }
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}`;
  
  // GET: Fetch all attributes.
  getAttributes(): Observable<IAttributeModel[]> {
    return this.http.get<IAttributeModel[]>(this.apiUrl);
  }

  // GET: Fetch an attribute by ID.
  getAttributeById(id: number): Observable<IAttributeModel> {
    return this.http.get<IAttributeModel>(`${this.apiUrl}/${id}`);
  }

  // POST: Create a new attribute.
  createAttribute(
    attribute: Omit<IAttributeModel, 'AttributeId'>,
  ): Observable<IAttributeModel> {
    return this.getAttributes().pipe(
      map((attributes) => {
        const nextId =
          attributes.length > 0
            ? Math.max(...attributes.map((item) => item.AttributeId)) + 1
            : 101;

        return {
          ...attribute,
          AttributeId: nextId,
        } as IAttributeModel;
      }),
      switchMap((newAttribute) =>
        this.http.post<IAttributeModel>(this.apiUrl, newAttribute),
      ),
    );
  }

  // PUT: Update an existing attribute.
  updateAttribute(
    id: number,
    attribute: IAttributeModel,
  ): Observable<IAttributeModel> {
    return this.http.put<IAttributeModel>(
      `${this.apiUrl}/${id}`,
      attribute,
    );
  }

  // PATCH: Partially update an existing attribute.
  patchAttribute(
    id: number,
    changes: Partial<IAttributeModel>,
  ): Observable<IAttributeModel> {
    return this.http.patch<IAttributeModel>(
      `${this.apiUrl}/${id}`,
      changes,
    );
  }

  // DELETE: Delete an attribute.
  deleteAttribute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
