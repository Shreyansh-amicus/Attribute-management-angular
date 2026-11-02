import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  imports: [],
  selector: 'app-toast-container',
  styleUrl: './toast-container.css',
  templateUrl: './toast-container.html',
})
export class ToastContainer {
  protected readonly toastService = inject(ToastService);
}