
import { Component, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
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
import { IAttributeModel } from '../../../../shared/models/IAttribute.model';
import { AttributeService } from '../../../../core/services/attribute-service';

@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  attributes: IAttributeModel[] = [];

  searchControl = new FormControl('', {
    nonNullable: true,
  });

  isTableView = true;
  isLoading = true;
  isSearching = false;
  errorMessage = '';

  private hasLoaded = false;

  ngOnInit(): void {
    interval(2000).subscribe((count) => {
      console.log(
        `AttributeList instance is still running: ${count}`
      );
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

        // Show the indicator immediately, before the debounce period.
        tap(() => {
          this.errorMessage = '';

          if (this.hasLoaded) {
            this.isSearching = true;
          } else {
            this.isLoading = true;
          }

          this.cdr.markForCheck();
        }),

        // Wait until the user stops typing for 300 milliseconds.
        debounceTime(300),

        // Switch to the latest search request.
        switchMap((searchTerm) => {
          const request$ = searchTerm
            ? this.attributeService.searchAttributes(searchTerm)
            : this.attributeService.getAttributes();

          return request$.pipe(
            tap((attributes) => {
              this.attributes = attributes;
              this.hasLoaded = true;
              this.isLoading = false;
              this.isSearching = false;

              console.log('Attributes received from API:', attributes);

              this.cdr.markForCheck();
            }),

            // Handle errors without terminating valueChanges.
            catchError((error) => {
              console.error('Failed to fetch attributes:', error);

              this.errorMessage =
                'Unable to load attributes. Please try again later.';

              this.attributes = [];
              this.hasLoaded = true;
              this.isLoading = false;
              this.isSearching = false;

              this.cdr.markForCheck();

              return of([]);
            })
          );
        }),

        // Automatically unsubscribe when this component is destroyed.
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onClick(): void {
    this.isTableView = !this.isTableView;
  }
}
