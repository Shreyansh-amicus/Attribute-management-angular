
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';

import { combineLatest, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  ActivityLogService,
} from '../../../core/services/activity-log-service';

import { StoreService } from '../../../core/services/store';
import { AttributeService } from '../../../core/services/attribute-service';

import { IAttributeModel } from '../../models/IAttribute.model';
import { ActivityLogModel } from '../../models/activity-log-model';

interface BusinessUnitChartItem {
  name: string;
  count: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DashboardViewModel {
  totalAttributes: number;
  activeAttributes: number;
  inactiveAttributes: number;
  createdThisMonth: number;
  chartItems: BusinessUnitChartItem[];
  chartMax: number;
  chartTicks: {
    value: number;
    y: number;
  }[];
  activities: ActivityLogModel[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly store = inject(StoreService);
  private readonly activityLog = inject(ActivityLogService);
  private readonly attributeService = inject(AttributeService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly chartWidth = 700;
  private readonly chartHeight = 280;

  // Combine attribute state and recent activity state.
  readonly dashboard$ = combineLatest({
    attributes: this.store.attributes$,
    activities: this.activityLog.activities$,
  }).pipe(
    map(({ attributes, activities }) => {
      const now = new Date();

      // --------------------------------
      // Summary Cards
      // --------------------------------

      const totalAttributes = attributes.length;

      const activeAttributes = attributes.filter(
        (attribute) => attribute.IsActive
      ).length;

      const inactiveAttributes =
        totalAttributes - activeAttributes;

      const createdThisMonth = attributes.filter((attribute) => {
        const createdDate = new Date(attribute.CreatedOn);

        return (
          createdDate.getMonth() === now.getMonth() &&
          createdDate.getFullYear() === now.getFullYear()
        );
      }).length;

      // --------------------------------
      // Business Unit Chart
      // --------------------------------

      const chartItems = this.buildChart(attributes);

      const chartMax = Math.max(
        1,
        ...chartItems.map((item) => item.count)
      );

      const chartTicks = [
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
          y: 215 - (value / chartMax) * 195,
        }));

      // --------------------------------
      // Dashboard View Model
      // --------------------------------

      return {
        totalAttributes,
        activeAttributes,
        inactiveAttributes,
        createdThisMonth,
        chartItems,
        chartMax,
        chartTicks,

        // API already returns newest activities first.
        activities,
      } satisfies DashboardViewModel;
    })
  );

  ngOnInit(): void {
    // Fetch attributes and update StoreService.
    this.attributeService
      .getAttributes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (error) => {
          console.error(
            'Unable to load dashboard attributes:',
            error
          );
        },
      });

    // Fetch the latest 10 activity records.
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

  // --------------------------------
  // Build Business Unit Chart Data
  // --------------------------------

  private buildChart(
    attributes: IAttributeModel[]
  ): BusinessUnitChartItem[] {
    const counts = new Map<string, number>();

    // Count attributes belonging to each business unit.
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

    // SVG chart dimensions.
    const leftPadding = 55;
    const rightPadding = 20;
    const topPadding = 20;
    const bottomPadding = 65;

    const plotWidth =
      this.chartWidth - leftPadding - rightPadding;

    const plotHeight =
      this.chartHeight - topPadding - bottomPadding;

    // Determine maximum bar height.
    const maxCount = Math.max(
      1,
      ...entries.map(([, count]) => count)
    );

    // Calculate available width for each business unit.
    const slotWidth =
      entries.length > 0
        ? plotWidth / entries.length
        : plotWidth;

    const barWidth = Math.min(45, slotWidth * 0.6);

    // Calculate SVG coordinates for every bar.
    return entries.map(([name, count], index) => {
      const height = (count / maxCount) * plotHeight;

      return {
        name,
        count,
        x:
          leftPadding +
          index * slotWidth +
          (slotWidth - barWidth) / 2,
        y: topPadding + plotHeight - height,
        width: barWidth,
        height,
      };
    });
  }
}
