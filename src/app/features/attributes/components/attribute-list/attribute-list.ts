import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
  catchError,
  EMPTY,
  finalize,
} from 'rxjs';

import { AttributeCard } from '../../../../shared/components/attribute-card/attribute-card';

import { AttributeService } from '../../../../core/services/attribute-service';
import { StoreService } from '../../../../core/services/store';

import {
  DataTableComponent,
  DataTableColumn,
  SortChange,
} from '../../../../shared/components/data-table/data-table';

import {
  AttributePageRequest,
  AttributePageResult,
} from '../../../../core/services/attribute-service';

import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { IAttributeModel } from '../../../../shared/models/IAttribute.model';
import { VirtualScrollDemo } from '../../../../shared/components/virtual-scroll/virtual-scroll';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    AttributeCard,
    DataTableComponent,
    ConfirmDialogComponent,
    VirtualScrollDemo,
  ],
  styleUrl: './attribute-list.css',
  templateUrl: './attribute-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeList {
  private readonly attributeService = inject(AttributeService);
  private readonly store = inject(StoreService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  // Role information from the centralized store.
  readonly isAdmin$ = this.store.isAdmin$;

  // Refresh state.
  isRefreshing = false;

  // Table columns.
  readonly tableColumns: DataTableColumn[] = [
    {
      key: 'AttributeId',
      label: 'ID',
      sortable: true,
      sortBy: 'attribute_id',
    },
    {
      key: 'AttributeName',
      label: 'Attribute Name',
      sortable: true,
      sortBy: 'attribute_name',
    },
    {
      key: 'BusinessUnitName',
      label: 'Business Unit',
      sortable: true,
      sortBy: 'business_unit_name',
    },
    {
      key: 'CompanyName',
      label: 'Company',
      sortable: true,
      sortBy: 'company_name',
    },
    {
      key: 'CustomerLocationName',
      label: 'Customer Location',
      sortable: true,
      sortBy: 'customer_location_name',
    },
    {
      key: 'IsActive',
      label: 'Status',
      sortable: true,
      sortBy: 'is_active',
    },
    {
      key: 'CreatedOn',
      label: 'Created On',
      sortable: true,
      sortBy: 'created_on',
    },
  ];

  // API results for the current page.
  tableAttributes: IAttributeModel[] = [];

  totalTableItems = 0;
  tableLoading = false;
  errorMessage = '';

  // Current pagination, sorting and search state.
  readonly tableQuerySubject = new BehaviorSubject<AttributePageRequest>({
    page: 1,
    pageSize: 10,
    sortBy: 'attribute_id',
    sortDirection: 'asc',
    searchTerm: '',
  });

  readonly tableQuery$ = this.tableQuerySubject.asObservable();

  // Search control.
  readonly searchControl = new FormControl('', {
    nonNullable: true,
  });

  isTableView = true;
  isSearching = false;

  // Delete confirmation state.
  selectedAttributeForDelete: IAttributeModel | null = null;
  isConfirmDialogOpen = false;

  ngOnInit(): void {
    this.loadAttributePage();
    this.setupSearch();
  }

  // ------------------------------------
  // Refresh attributes
  // ------------------------------------

  refreshAttributes(): void {
    if (this.isRefreshing || this.tableLoading) {
      return;
    }

    this.errorMessage = '';
    this.isRefreshing = true;

    this.cdr.markForCheck();

    // Re-emit the existing query.
    // This preserves the current page, page size,
    // sorting and search term.
    this.tableQuerySubject.next({
      ...this.tableQuerySubject.value,
    });
  }

  // ------------------------------------
  // Load API data based on current query
  // ------------------------------------

  private loadAttributePage(): void {
    this.tableQuerySubject
      .pipe(
        switchMap((query) => {
          this.tableLoading = true;
          this.errorMessage = '';

          this.cdr.markForCheck();

          return this.attributeService.getAttributesPage(query).pipe(
            catchError((error) => {
              console.error('Unable to load attribute page:', error);

              this.errorMessage = 'Unable to load attributes. Please try again later.';

              return EMPTY;
            }),

            finalize(() => {
              this.tableLoading = false;
              this.isSearching = false;
              this.isRefreshing = false;

              this.cdr.markForCheck();
            }),
          );
        }),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        // Update the current page.
        this.tableAttributes = result.items;
        this.totalTableItems = result.totalCount;

        this.cdr.markForCheck();
      });
  }

  // ------------------------------------
  // Reactive search
  // ------------------------------------

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        map((term) => term.trim()),

        distinctUntilChanged(),

        tap(() => {
          this.errorMessage = '';
          this.isSearching = true;
          this.cdr.markForCheck();
        }),

        debounceTime(300),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((searchTerm) => {
        this.tableQuerySubject.next({
          ...this.tableQuerySubject.value,
          page: 1,
          searchTerm,
        });
      });
  }

  // ------------------------------------
  // Switch between table and card views
  // ------------------------------------

  onClick(): void {
    this.isTableView = !this.isTableView;
  }

  // ------------------------------------
  // Table sorting
  // ------------------------------------

  onTableSortChange(event: SortChange): void {
    this.tableQuerySubject.next({
      ...this.tableQuerySubject.value,
      page: 1,
      sortBy: event.sortBy,
      sortDirection: event.sortDirection,
    });
  }

  // ------------------------------------
  // Table pagination
  // ------------------------------------

  onTablePageChange(page: number): void {
    this.tableQuerySubject.next({
      ...this.tableQuerySubject.value,
      page,
    });
  }

  // ------------------------------------
  // Edit attribute
  // ------------------------------------

  onEditAttribute(attribute: IAttributeModel): void {
    if (this.store.snapshot.role !== 'Admin') {
      return;
    }

    void this.router.navigate(['/attributes', attribute.AttributeId, 'edit']);
  }

  // ------------------------------------
  // Delete confirmation
  // ------------------------------------

  requestDelete(attribute: IAttributeModel): void {
    if (this.store.snapshot.role !== 'Admin') {
      return;
    }

    this.selectedAttributeForDelete = attribute;
    this.isConfirmDialogOpen = true;
  }

  cancelDelete(): void {
    this.isConfirmDialogOpen = false;
    this.selectedAttributeForDelete = null;
  }

  confirmDelete(): void {
    const attribute = this.selectedAttributeForDelete;

    if (!attribute || this.store.snapshot.role !== 'Admin') {
      return;
    }

    this.attributeService
      .deleteAttribute(attribute.AttributeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isConfirmDialogOpen = false;
          this.selectedAttributeForDelete = null;

          const currentQuery = this.tableQuerySubject.value;

          // Move to the previous page if the deleted row
          // was the only row on the current page.
          const nextPage =
            this.tableAttributes.length === 1 && currentQuery.page > 1
              ? currentQuery.page - 1
              : currentQuery.page;

          this.tableQuerySubject.next({
            ...currentQuery,
            page: nextPage,
          });
        },

        error: (error) => {
          console.error('Unable to delete attribute:', error);

          this.errorMessage = 'Unable to delete the attribute. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }
}
