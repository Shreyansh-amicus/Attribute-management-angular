
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  forkJoin,
  map,
  of,
  tap,
} from 'rxjs';

export interface ErrorLog {
  id: number;
  message: string;
  source: string;
  status?: number;
  timestamp: Date;
}

interface ErrorLogDTO {
  attribute_id: number;
  message: string;
  source: string;
  status?: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorLogService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/errorLogs';

  private readonly errorLogsSubject =
    new BehaviorSubject<ErrorLog[]>([]);

  readonly errorLogs$ = this.errorLogsSubject.asObservable();

  // Date-based IDs avoid collisions with previously stored records.

  loadErrorLogs(): Observable<ErrorLog[]> {
    return this.http.get<ErrorLogDTO[]>(this.apiUrl).pipe(
      map((dtos) => dtos.map((dto) => this.toModel(dto))),
      tap((logs) => this.errorLogsSubject.next(logs)),
      catchError((error) => {
        console.error('Unable to load error logs:', error);
        return of(this.errorLogsSubject.value);
      })
    );
  }

  logError(
  message: string,
  source: string,
  status?: number
): Observable<void> {

  const dto: ErrorLogDTO = {
    attribute_id: this.generateId(),
    message,
    source,
    status,
    timestamp: new Date().toISOString()
  };

  console.log('[ErrorLogService] Sending error log:', dto);

  return this.http.post<ErrorLogDTO>(this.apiUrl, dto).pipe(
    tap(savedDto => {
      console.log('[ErrorLogService] Server response:', savedDto);

      const savedLog = this.toModel(savedDto);

      this.errorLogsSubject.next([
        savedLog,
        ...this.errorLogsSubject.value
      ]);
    }),

    map(() => undefined as void),

    catchError(error => {
      console.error('[ErrorLogService] POST failed:', error);
      return EMPTY;
    })
  );
}

private nextId = Date.now() * 1000;

private generateId(): number {
  this.nextId = Math.max(
    this.nextId + 1,
    Date.now() * 1000
  );

  return this.nextId;
}

  clearLogs(): Observable<void> {
    const currentLogs = this.errorLogsSubject.value;

    if (currentLogs.length === 0) {
      return of(undefined);
    }

    return forkJoin(
      currentLogs.map((log) =>
        this.http.delete(`${this.apiUrl}/${log.id}`)
      )
    ).pipe(
      tap(() => this.errorLogsSubject.next([])),
      map(() => undefined as void)
    );
  }

  private toModel(dto: ErrorLogDTO): ErrorLog {
    return {
      id: dto.attribute_id,
      message: dto.message,
      source: dto.source,
      status: dto.status,
      timestamp: new Date(dto.timestamp),
    };
  }
}
