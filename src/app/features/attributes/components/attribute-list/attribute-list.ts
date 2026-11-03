import { Component, DestroyRef, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  map,
  tap,
  switchMap,
  catchError,
  of,
  interval,
} from 'rxjs';

import { AttributeCard } from '../../../../shared/components/attribute-card/attribute-card';
import { AppActiveStatus } from '../../../../shared/directives/app-active-status';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time-pipe';
import { AttributeService } from '../../../../core/services/attribute-service';
import { StoreService } from '../../../../core/services/store';

@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    AttributeCard,
    AppActiveStatus,
    RelativeTimePipe,
  ],
  styleUrl: './attribute-list.css',
  templateUrl: './attribute-list.html',
})
export class AttributeList {
  private readonly attributeService = inject(AttributeService);
  private readonly store = inject(StoreService);
  private readonly destroyRef = inject(DestroyRef);

  // Read application state from the centralized store.
  readonly attributes$ = this.store.attributes$;
  readonly isLoading$ = this.store.isLoading$;

  searchControl = new FormControl('', {
    nonNullable: true,
  });

  isTableView = true;
  isSearching = false;
  errorMessage = '';

  ngOnInit(): void {
    // Temporary Task 12 demonstration.
    // Keep this only while testing subscription cleanup.
    interval(2000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((count) => {
        console.log(`AttributeList instance is still running: ${count}`);
      });
  }

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        // Load all attributes when the component is first created.
        startWith(this.searchControl.value),

        // Remove unnecessary whitespace.
        map((searchTerm) => searchTerm.trim()),

        // Ignore consecutive duplicate search terms.
        distinctUntilChanged(),

        // Show the searching indicator immediately.
        tap(() => {
          this.errorMessage = '';
          this.isSearching = true;
        }),

        // Wait until the user stops typing for 300 milliseconds.
        debounceTime(300),

        // Switch to the latest search request.
        switchMap((searchTerm) => {
          const request$ = searchTerm
            ? this.attributeService.searchAttributes(searchTerm)
            : this.attributeService.getAttributes();

          return request$.pipe(
            catchError((error) => {
              console.error('Failed to fetch attributes:', error);

              this.errorMessage =
                'Unable to load attributes. Please try again later.';

              return of([]);
            }),
          );
        }),

        // Automatically unsubscribe when this component is destroyed.
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (attributes) => {
          this.isSearching = false;
          console.log('Attributes received from store-backed service:', attributes);
        },
        error: (error) => {
          console.error('Unexpected search pipeline error:', error);
          this.isSearching = false;
        },
      });
  }

  onClick(): void {
    this.isTableView = !this.isTableView;
  }
}