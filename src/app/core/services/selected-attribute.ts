
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedAttributeService { 
  private readonly selectedAttributeSubject =
    new BehaviorSubject<string | null>(null);

  readonly selectedAttribute$ =
    this.selectedAttributeSubject.asObservable();

  setSelectedAttribute(attributeName: string): void {
    this.selectedAttributeSubject.next(attributeName);
  }
}
