import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toasts = signal<ToastMessage[]>([]);

  readonly toasts = this._toasts.asReadonly();

  private nextId = 0;

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  private show(message: string, type: ToastType): void {
    const id = ++this.nextId;

    this._toasts.update((currentToasts) => [
      ...currentToasts,
      { id, message, type },
    ]);

    // Automatically remove the toast after 4 seconds.
    setTimeout(() => {
      this.dismiss(id);
    }, 4000);
  }

  dismiss(id: number): void {
    this._toasts.update((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }
}