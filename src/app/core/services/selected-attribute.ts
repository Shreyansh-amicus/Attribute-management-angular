
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedAttributeService {
  private readonly selectedAttributeSubject = new Subject<string>();

  readonly selectedAttribute$ =
    this.selectedAttributeSubject.asObservable();

  setSelectedAttribute(attributeName: string): void {
    this.selectedAttributeSubject.next(attributeName);
  }
}
