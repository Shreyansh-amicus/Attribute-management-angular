
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: Date | string | number | null | undefined): string {
    // Handle missing dates.
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    // Convert the input into a Date object.
    const date = value instanceof Date ? value : new Date(value);

    // Handle invalid dates.
    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    const now = new Date();

    // CreatedOn and UpdatedOn should not be in the future.
    if (date.getTime() > now.getTime()) {
      return '—';
    }

    const seconds = Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    // Less than one minute.
    if (seconds < 60) {
      return 'just now';
    }

    // Less than one hour.
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    // Less than one day.
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    // Calculate calendar years, months, and remaining days.
    let years = now.getFullYear() - date.getFullYear();
    let months = now.getMonth() - date.getMonth();
    let days = now.getDate() - date.getDate();

    if (days < 0) {
      months--;

      const daysInPreviousMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      ).getDate();

      days += daysInPreviousMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const parts: string[] = [];

    if (years > 0) {
      parts.push(`${years} year${years === 1 ? '' : 's'}`);
    }

    if (months > 0) {
      parts.push(`${months} month${months === 1 ? '' : 's'}`);
    }

    if (days > 0 || parts.length === 0) {
      parts.push(`${days} day${days === 1 ? '' : 's'}`);
    }

    return `${parts.join(' ')} ago`;
  }
}
