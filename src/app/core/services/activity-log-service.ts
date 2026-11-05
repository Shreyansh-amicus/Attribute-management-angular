import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, ReplaySubject, Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ActivityLogModel } from '../../shared/models/activity-log-model';

import { ActivityLogDTO, CreateActivityLogDTO } from '../../shared/models/activity-log-dto';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/activityLogs`;

  // Retain the latest 10 activity events in memory.
  private readonly activitySubject = new ReplaySubject<ActivityLogModel>(10);

  readonly activityEvents$ = this.activitySubject.asObservable();

  // Expose the current list of recent activities.
  private readonly recentActivitiesSubject = new BehaviorSubject<ActivityLogModel[]>([]);

  readonly activities$ = this.recentActivitiesSubject.asObservable();

  private hasLoadedInitialHistory = false;

  // Convert API DTO into application model.
  private toModel(dto: ActivityLogDTO): ActivityLogModel {
    return {
      id: dto.attribute_id,
      action: dto.action,
      attributeId: dto.related_attribute_id,
      attributeName: dto.attribute_name,
      performedBy: dto.performed_by,
      timestamp: new Date(dto.timestamp),
    };
  }

  // GET: Fetch the latest 10 activity records.
  loadRecentActivities(): Observable<ActivityLogModel[]> {
    return this.http
      .get<ActivityLogDTO[]>(this.apiUrl, {
        params: {
          _sort: 'timestamp',
          _order: 'desc',
          _limit: '10',
        },
      })
      .pipe(
        map((dtos) => dtos.map((dto) => this.toModel(dto))),

        tap((activities) => {
          this.recentActivitiesSubject.next(activities);

          // Seed the replay stream once, oldest first.
          // This makes its latest 10 events match the loaded history.
          if (!this.hasLoadedInitialHistory) {
            activities
              .slice()
              .reverse()
              .forEach((activity) => {
                this.activitySubject.next(activity);
              });

            this.hasLoadedInitialHistory = true;
          }
        }),
      );
  }

  // POST: Save a new activity record.
  recordActivity(activity: CreateActivityLogDTO): Observable<ActivityLogModel> {
    return this.http.post<ActivityLogDTO>(this.apiUrl, activity).pipe(
      map((response) => this.toModel(response)),

      tap((createdActivity) => {
        // Update the current list immutably.
        const updatedActivities = [createdActivity, ...this.recentActivitiesSubject.value].slice(
          0,
          10,
        );

        this.recentActivitiesSubject.next(updatedActivities);

        // Publish the new event.
        this.activitySubject.next(createdActivity);
      }),
    );
  }
}
