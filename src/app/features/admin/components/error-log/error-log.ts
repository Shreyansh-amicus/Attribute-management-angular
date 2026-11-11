
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';

import { ErrorLogService } from '../../../../core/services/error-log-service';

@Component({
  selector: 'app-error-log',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './error-log.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorLogComponent implements OnInit {
  private readonly errorLogService = inject(ErrorLogService);

  readonly errorLogs$ = this.errorLogService.errorLogs$;

  ngOnInit(): void {
    this.errorLogService.loadErrorLogs().subscribe();
  }

  clearLogs(): void {
    this.errorLogService.clearLogs().subscribe({
      error: (error) => {
        console.error('Unable to clear error logs:', error);
      },
    });
  }
}
