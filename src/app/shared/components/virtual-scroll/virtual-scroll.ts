
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ViewChild,
  inject,
} from '@angular/core';

import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IAttributeModel } from '../../models/IAttribute.model';

@Component({
  selector: 'app-virtual-scroll-demo',
  standalone: true,
  imports: [ScrollingModule],
  templateUrl: './virtual-scroll.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollDemo implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  // Generate 250 mock attributes.
  readonly mockAttributes: IAttributeModel[] =
    this.generateMockAttributes(250);

  // Number of items currently rendered by CDK.
  renderedItemCount = 0;

  // Track records using their unique IDs.
  trackByAttributeId(
    index: number,
    attribute: IAttributeModel
  ): number {
    return attribute.AttributeId;
  }

  ngAfterViewInit(): void {
    this.viewport.renderedRangeStream
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((range) => {
        this.renderedItemCount = range.end - range.start;

        this.cdr.markForCheck();
      });
  }

  // ------------------------------------
  // Generate mock attributes
  // ------------------------------------

  private generateMockAttributes(
    count: number
  ): IAttributeModel[] {
    const businessUnits = [
      'Finance',
      'Human Resources',
      'Operations',
      'Marketing',
      'Supply Chain',
    ];

    const companies = [
      'Acme Corp',
      'Globex Industries',
      'Initech Software',
    ];

    const locations = [
      'Mumbai',
      'New York',
      'London',
      'Berlin',
      'Bengaluru',
      'Sydney',
      'Pune',
      'Singapore',
    ];

    return Array.from({ length: count }, (_, index) => {
      return {
        AttributeId: 1000 + index,

        AttributeName: `Mock Attribute ${index + 1}`,

        BusinessUnitName:
          businessUnits[index % businessUnits.length],

        CustomerLocationName:
          locations[index % locations.length],

        CompanyName:
          companies[index % companies.length],

        IsActive: index % 3 !== 0,

        CreatedOn: new Date(
          Date.now() - index * 24 * 60 * 60 * 1000
        ),

        CreatedBy: 'Virtual Scroll Demo',
      };
    });
  }
}
