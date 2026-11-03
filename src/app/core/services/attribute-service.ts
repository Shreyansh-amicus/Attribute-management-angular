
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  map,
  tap,
  finalize,
} from 'rxjs';

import { IAttributeModel } from '../../shared/models/IAttribute.model';
import {
  AttributeDTO,
  CreateAttributeDTO,
} from '../../shared/models/attribute.dto';

import { environment } from '../../../environments/environment';
import { MappingService } from './mapping';
import { StoreService } from './store';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MappingService);
  private readonly store = inject(StoreService);

  private readonly apiUrl = `${environment.apiUrl}/attributes`;

  // GET: Fetch all attributes and update the store.
  getAttributes(): Observable<IAttributeModel[]> {
    this.store.setLoading(true);

    return this.http
      .get<AttributeDTO[]>(this.apiUrl)
      .pipe(
        map(dtos =>
          dtos.map(dto => this.mapper.toAttribute(dto))
        ),

        tap(attributes => {
          this.store.setAttributes(attributes);
        }),

        finalize(() => {
          this.store.setLoading(false);
        })
      );
  }

  // GET: Fetch an attribute by ID.
  getAttributeById(id: number): Observable<IAttributeModel> {
    return this.http
      .get<AttributeDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        map(dto => this.mapper.toAttribute(dto))
      );
  }

  // POST: Create a new attribute and add it to the store.
  createAttribute(
    attribute: Omit<IAttributeModel, 'AttributeId'>
  ): Observable<IAttributeModel> {
    const dto: CreateAttributeDTO =
      this.mapper.toCreateDTO(attribute);

    return this.http
      .post<AttributeDTO>(this.apiUrl, dto)
      .pipe(
        map(response => this.mapper.toAttribute(response)),

        tap(createdAttribute => {
          this.store.addAttribute(createdAttribute);
        })
      );
  }

  // PUT: Replace an existing attribute and update the store.
  updateAttribute(
    id: number,
    attribute: IAttributeModel
  ): Observable<IAttributeModel> {
    const dto: AttributeDTO = this.mapper.toDTO(attribute);

    return this.http
      .put<AttributeDTO>(`${this.apiUrl}/${id}`, dto)
      .pipe(
        map(response => this.mapper.toAttribute(response)),

        tap(updatedAttribute => {
          this.store.updateAttribute(updatedAttribute);
        })
      );
  }

  // PATCH: Partially update an attribute and update the store.
  patchAttribute(
    id: number,
    changes: Partial<IAttributeModel>
  ): Observable<IAttributeModel> {
    const dto = this.mapper.toPartialDTO(changes);

    return this.http
      .patch<AttributeDTO>(`${this.apiUrl}/${id}`, dto)
      .pipe(
        map(response => this.mapper.toAttribute(response)),

        tap(updatedAttribute => {
          this.store.updateAttribute(updatedAttribute);
        })
      );
  }

  // DELETE: Delete an attribute and remove it from the store.
  deleteAttribute(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.store.removeAttribute(id);
        })
      );
  }

  // GET: Search attributes and update the store with the results.
  searchAttributes(searchTerm: string): Observable<IAttributeModel[]> {
    this.store.setLoading(true);

    return this.http
      .get<AttributeDTO[]>(this.apiUrl, {
        params: {
          q: searchTerm,
        },
      })
      .pipe(
        map(dtos =>
          dtos.map(dto => this.mapper.toAttribute(dto))
        ),

        tap(attributes => {
          this.store.setAttributes(attributes);
        }),

        finalize(() => {
          this.store.setLoading(false);
        })
      );
  }
}
