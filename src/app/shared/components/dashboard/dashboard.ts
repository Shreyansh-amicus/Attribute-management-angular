import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';

import { combineLatest, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivityLogService } from '../../../core/services/activity-log-service';
import { StoreService } from '../../../core/services/store';
import { AttributeService } from '../../../core/services/attribute-service';

import { IAttributeModel } from '../../models/IAttribute.model';
import { ActivityLogModel } from '../../models/activity-log-model';

import { CardWrapper } from '../card-wrapper/card-wrapper';
import { CollapsibleSectionComponent } from '../collapsible-section/collapsible-section';

interface BusinessUnitChartItem {
  name: string;
  count: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ChartTick {
  value: number;
  y: number;
}

interface DashboardViewModel {
  totalAttributes: number;
  activeAttributes: number;
  inactiveAttributes: number;
  createdThisMonth: number;
  chartItems: BusinessUnitChartItem[];
  chartWidth: number;
  chartHeight: number;
  chartTicks: ChartTick[];
  activities: ActivityLogModel[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    CardWrapper,
    CollapsibleSectionComponent,
  ],
  templateUrl: './dashboard.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {
  private readonly store = inject(StoreService);
  private readonly activityLog = inject(ActivityLogService);
  private readonly attributeService = inject(AttributeService);
  private readonly destroyRef = inject(DestroyRef);

  // Chart dimensions.
  private readonly minimumChartWidth = 700;
  private readonly chartHeight = 330;

  // SVG plotting area.
  private readonly leftPadding = 55;
  private readonly rightPadding = 25;
  private readonly topPadding = 25;
  private readonly bottomPadding = 110;

  readonly dashboard$ = combineLatest({
    attributes: this.store.attributes$,
    activities: this.activityLog.activities$,
  }).pipe(
    map(({ attributes, activities }): DashboardViewModel => {
      const now = new Date();

      // Summary cards.
      const totalAttributes = attributes.length;

      const activeAttributes = attributes.filter(
        (attribute) => attribute.IsActive
      ).length;

      const inactiveAttributes =
        totalAttributes - activeAttributes;

      const createdThisMonth = attributes.filter((attribute) => {
        const createdDate = new Date(attribute.CreatedOn);

        return (
          !Number.isNaN(createdDate.getTime()) &&
          createdDate.getMonth() === now.getMonth() &&
          createdDate.getFullYear() === now.getFullYear()
        );
      }).length;

      // Business unit chart.
      const chartData = this.buildChart(attributes);

      const chartMax = Math.max(
        1,
        ...chartData.items.map((item) => item.count)
      );

      const chartTicks: ChartTick[] = [
        0,
        Math.ceil(chartMax / 2),
        chartMax,
      ]
        .filter(
          (value, index, array) =>
            array.indexOf(value) === index
        )
        .map((value) => ({
          value,
          y:
            chartData.baseline -
            (value / chartMax) * chartData.plotHeight,
        }));

      return {
        totalAttributes,
        activeAttributes,
        inactiveAttributes,
        createdThisMonth,
        chartItems: chartData.items,
        chartWidth: chartData.width,
        chartHeight: this.chartHeight,
        chartTicks,
        activities,
      };
    })
  );

  ngOnInit(): void {
    // Load all attributes into the centralized store.
    this.attributeService
      .getAttributes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (attributes) => {
          this.store.setAttributes(attributes);
        },
        error: (error) => {
          console.error(
            'Unable to load dashboard attributes:',
            error
          );
        },
      });

    // Load the latest 10 activity records.
    this.activityLog
      .loadRecentActivities()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (error) => {
          console.error(
            'Unable to load recent activities:',
            error
          );
        },
      });
  }

  private buildChart(attributes: IAttributeModel[]): {
    items: BusinessUnitChartItem[];
    width: number;
    baseline: number;
    plotHeight: number;
  } {
    const counts = new Map<string, number>();

    // Count attributes per business unit.
    for (const attribute of attributes) {
      const businessUnit =
        attribute.BusinessUnitName?.trim() || 'Unassigned';

      counts.set(
        businessUnit,
        (counts.get(businessUnit) ?? 0) + 1
      );
    }

    // Sort business units alphabetically.
    const entries = Array.from(counts.entries()).sort(
      (a, b) => a[0].localeCompare(b[0])
    );

    /*
     * Give every business unit a minimum horizontal slot.
     * This prevents bars and labels from becoming crowded.
     */
    const slotMinimumWidth = 120;

    const calculatedWidth =
      this.leftPadding +
      this.rightPadding +
      entries.length * slotMinimumWidth;

    const chartWidth = Math.max(
      this.minimumChartWidth,
      calculatedWidth
    );

    const plotWidth =
      chartWidth - this.leftPadding - this.rightPadding;

    const plotHeight =
      this.chartHeight -
      this.topPadding -
      this.bottomPadding;

    const baseline = this.topPadding + plotHeight;

    const maxCount = Math.max(
      1,
      ...entries.map(([, count]) => count)
    );

    const slotWidth =
      entries.length > 0
        ? plotWidth / entries.length
        : plotWidth;

    const barWidth = Math.min(48, slotWidth * 0.55);

    const items = entries.map(([name, count], index) => {
      const height = (count / maxCount) * plotHeight;

      const x =
        this.leftPadding +
        index * slotWidth +
        (slotWidth - barWidth) / 2;

      return {
        name,
        count,
        x,
        y: baseline - height,
        width: barWidth,
        height,
      };
    });

    return {
      items,
      width: chartWidth,
      baseline,
      plotHeight,
    };
  }
}