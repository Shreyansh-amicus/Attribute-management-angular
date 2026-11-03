import { Injectable } from '@angular/core';
import { BehaviorSubject, map, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private activeRequests = 0;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly isLoading$ = this.loadingSubject.asObservable().pipe(
    distinctUntilChanged()
  );

  requestStarted(): void {
    this.activeRequests++;
    this.loadingSubject.next(this.activeRequests > 0);

    console.log('Active HTTP requests:', this.activeRequests);
  }

  requestFinished(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.loadingSubject.next(this.activeRequests > 0);

    console.log('Active HTTP requests:', this.activeRequests);
  }
}