import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map, tap, finalize, concatMap, catchError, of } from 'rxjs';

import { IAttributeModel } from '../../shared/models/IAttribute.model';

import { AttributeDTO, CreateAttributeDTO } from '../../shared/models/attribute.dto';

import { environment } from '../../../environments/environment';

import { MappingService } from './mapping';
import { StoreService } from './store';
import { ActivityLogService } from './activity-log-service';
import { CreateActivityLogDTO } from '../../shared/models/activity-log-dto';
import { ActivityAction } from '../../shared/models/activity-log-model';

export interface AttributePageRequest {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  searchTerm?: string;
}

export interface AttributePageResult {
  items: IAttributeModel[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MappingService);
  private readonly store = inject(StoreService);
  private readonly activityLog = inject(ActivityLogService);

  private readonly apiUrl = `${environment.apiUrl}/attributes`;

  // GET: Fetch all attributes.
  getAttributes(): Observable<IAttributeModel[]> {
    this.store.setLoading(true);

    return this.http.get<AttributeDTO[]>(this.apiUrl).pipe(
      map((dtos) => dtos.map((dto) => this.mapper.toAttribute(dto))),

      tap((attributes) => {
        this.store.setAttributes(attributes);
      }),

      finalize(() => {
        this.store.setLoading(false);
      }),
    );
  }

  // GET: Fetch one attribute.
  getAttributeById(id: number): Observable<IAttributeModel> {
    return this.http
      .get<AttributeDTO>(`${this.apiUrl}/${id}`)
      .pipe(map((dto) => this.mapper.toAttribute(dto)));
  }

  // POST: Create an attribute.
  createAttribute(attribute: Omit<IAttributeModel, 'AttributeId'>): Observable<IAttributeModel> {
    const dto: CreateAttributeDTO = this.mapper.toCreateDTO(attribute);

    return this.http.post<AttributeDTO>(this.apiUrl, dto).pipe(
      map((response) => this.mapper.toAttribute(response)),

      tap((created) => {
        this.store.addAttribute(created);
      }),

      concatMap((created) =>
        this.recordActivitySafely('CREATE', created.AttributeId, created.AttributeName).pipe(
          map(() => created),
        ),
      ),
    );
  }

  // PUT: Replace an attribute.
  updateAttribute(id: number, attribute: IAttributeModel): Observable<IAttributeModel> {
    const dto: AttributeDTO = this.mapper.toDTO(attribute);

    return this.http.put<AttributeDTO>(`${this.apiUrl}/${id}`, dto).pipe(
      map((response) => this.mapper.toAttribute(response)),

      tap((updated) => {
        this.store.updateAttribute(updated);
      }),

      concatMap((updated) =>
        this.recordActivitySafely('EDIT', updated.AttributeId, updated.AttributeName).pipe(
          map(() => updated),
        ),
      ),
    );
  }

  // PATCH: Partially update an attribute.
  patchAttribute(id: number, changes: Partial<IAttributeModel>): Observable<IAttributeModel> {
    const dto = this.mapper.toPartialDTO(changes);

    return this.http.patch<AttributeDTO>(`${this.apiUrl}/${id}`, dto).pipe(
      map((response) => this.mapper.toAttribute(response)),

      tap((updated) => {
        this.store.updateAttribute(updated);
      }),

      concatMap((updated) =>
        this.recordActivitySafely('EDIT', updated.AttributeId, updated.AttributeName).pipe(
          map(() => updated),
        ),
      ),
    );
  }

  // DELETE: Remove an attribute.
  deleteAttribute(id: number): Observable<void> {
    const attribute = this.store.snapshot.attributes.find((item) => item.AttributeId === id);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.store.removeAttribute(id);
      }),

      concatMap(() =>
        this.recordActivitySafely('DELETE', id, attribute?.AttributeName ?? `Attribute #${id}`),
      ),
    );
  }

  // GET: Search attributes.
  searchAttributes(searchTerm: string): Observable<IAttributeModel[]> {
    this.store.setLoading(true);

    return this.http
      .get<AttributeDTO[]>(this.apiUrl, {
        params: {
          q: searchTerm,
        },
      })
      .pipe(
        map((dtos) => dtos.map((dto) => this.mapper.toAttribute(dto))),

        tap((attributes) => {
          this.store.setAttributes(attributes);
        }),

        finalize(() => {
          this.store.setLoading(false);
        }),
      );
  }

  // Save activity without making a successful CRUD operation fail
  // if the separate activity logging request fails.
  private recordActivitySafely(
    action: ActivityAction,
    attributeId: number,
    attributeName: string,
  ): Observable<void> {
    const activity: CreateActivityLogDTO = {
      action,
      related_attribute_id: attributeId,
      attribute_name: attributeName,
      performed_by: this.store.snapshot.username ?? 'Unknown user',
      timestamp: new Date().toISOString(),
    };

    return this.activityLog.recordActivity(activity).pipe(
      map((): void => undefined),

      catchError((error) => {
        console.error('Unable to save activity log:', error);

        return of(undefined);
      }),
    );
  }
}
