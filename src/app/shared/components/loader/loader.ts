import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading-service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader {
  private readonly loadingService = inject(LoadingService);

  readonly isLoading$ = this.loadingService.isLoading$;
}