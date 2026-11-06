import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IAttributeModel } from '../../models/IAttribute.model';

export interface DataTableColumn {
  key: keyof IAttributeModel;
  label: string;
  sortable?: boolean;

  // Actual field name understood by the API.
  sortBy?: string;
}

export interface SortChange {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.html',
})
export class DataTableComponent {

  @Input() rows: IAttributeModel[] = [];
  @Input() columns: DataTableColumn[] = [];

  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;

  @Input() sortBy = 'attribute_id';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Input() canManage = false;

  @Output() sortChange = new EventEmitter<SortChange>();
  @Output() pageChange = new EventEmitter<number>();

  @Output() edit = new EventEmitter<IAttributeModel>();
  @Output() delete = new EventEmitter<IAttributeModel>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get startItem(): number {
    return this.totalItems === 0
      ? 0
      : (this.page - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.page * this.pageSize, this.totalItems);
  }

  onSort(column: DataTableColumn): void {
    if (!column.sortable || !column.sortBy) {
      return;
    }

    const direction: 'asc' | 'desc' =
      this.sortBy === column.sortBy && this.sortDirection === 'asc'
        ? 'desc'
        : 'asc';

    this.sortChange.emit({
      sortBy: column.sortBy,
      sortDirection: direction,
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.pageChange.emit(this.page + 1);
    }
  }

  getCellValue(
    row: IAttributeModel,
    key: keyof IAttributeModel
  ): string {
    const value = row[key];

    if (value === null || value === undefined || value === '') {
      return '—';
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (typeof value === 'boolean') {
      return value ? 'Active' : 'Inactive';
    }

    return String(value);
  }
}