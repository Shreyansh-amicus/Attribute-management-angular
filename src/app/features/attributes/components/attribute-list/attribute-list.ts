import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AttributeCard } from '../../../../shared/components/attribute-card/attribute-card';
import { AppActiveStatus } from '../../../../shared/directives/app-active-status';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time-pipe';
import { FilterBy } from '../../../../shared/directives/filter-by';
import { IAttributeModel } from '../../../../shared/models/IAttribute.model';
import { AttributeService } from '../../../../core/services/attribute-service';

@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    AttributeCard,
    AppActiveStatus,
    RelativeTimePipe,
    FilterBy,
  ],
  styleUrl: './attribute-list.css',
  templateUrl: './attribute-list.html',
})
export class AttributeList implements OnInit {
  private readonly attributeService = inject(AttributeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  attributes: IAttributeModel[] = [];

  searchTerm = '';
  isTableView = true;

  isLoading = false;
  errorMessage = '';

  onClick(): void {
    this.isTableView = !this.isTableView;
  }

  ngOnInit(): void {
    this.loadAttributes();
  }

  private loadAttributes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.attributeService
      .getAttributes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (attributes) => {
          this.attributes = attributes;
          this.isLoading = false;

          console.log('Attributes received from API:', this.attributes);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to fetch attributes:', error);

          this.errorMessage =
            'Unable to load attributes. Please try again later.';

          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }
}