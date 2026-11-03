import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { IAttributeModel } from '../../shared/models/IAttribute.model';
import {
  AttributeDTO,
  CreateAttributeDTO
} from '../../shared/models/attribute.dto';

import { environment } from '../../../environments/environment';
import { MappingService } from './mapping';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MappingService);

  private readonly apiUrl = `${environment.apiUrl}/attributes`;

  // GET: Fetch all attributes.
  getAttributes(): Observable<IAttributeModel[]> {
    return this.http.get<AttributeDTO[]>(this.apiUrl).pipe(
      map((dtos) => dtos.map((dto) => this.mapper.toAttribute(dto)))
    );
  }

  // GET: Fetch an attribute by ID.
  getAttributeById(id: number): Observable<IAttributeModel> {
    return this.http.get<AttributeDTO>(`${this.apiUrl}/${id}`).pipe(
      map((dto) => this.mapper.toAttribute(dto))
    );
  }

  // POST: Create a new attribute.
  createAttribute(
    attribute: Omit<IAttributeModel, 'AttributeId'>,
  ): Observable<IAttributeModel> {
    const dto: CreateAttributeDTO = this.mapper.toCreateDTO(attribute);

    return this.http.post<AttributeDTO>(this.apiUrl, dto).pipe(
      map((response) => this.mapper.toAttribute(response))
    );
  }

  // PUT: Replace an existing attribute.
  updateAttribute(
    id: number,
    attribute: IAttributeModel,
  ): Observable<IAttributeModel> {
    const dto: AttributeDTO = this.mapper.toDTO(attribute);

    return this.http.put<AttributeDTO>(
      `${this.apiUrl}/${id}`,
      dto
    ).pipe(
      map((response) => this.mapper.toAttribute(response))
    );
  }

  // PATCH: Partially update an existing attribute.
  patchAttribute(
    id: number,
    changes: Partial<IAttributeModel>,
  ): Observable<IAttributeModel> {
    // We'll implement partial DTO mapping separately.
    throw new Error('PATCH mapping has not been implemented yet.');
  }

  // DELETE: Delete an attribute.
  deleteAttribute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}