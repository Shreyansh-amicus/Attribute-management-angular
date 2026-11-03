import { Component, inject } from '@angular/core';
import { SelectedAttributeService } from '../../../../core/services/selected-attribute';

@Component({
  selector: 'app-subject-demo',
  standalone: true,
  template: `<p>Open the console to see the Subject demonstration.</p>`,
})
export class SubjectDemo {
  private readonly selectedAttributeService =
    inject(SelectedAttributeService);

  constructor() {
    // Emit before subscribing.
    this.selectedAttributeService.setSelectedAttribute(
      'Cost Center Code'
    );

    // Subscribe afterward.
    this.selectedAttributeService.selectedAttribute$.subscribe(value => {
      console.log('Selected attribute:', value);
    });
  }
}