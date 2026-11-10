import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible-section',
  standalone: true,
  templateUrl: './collapsible-section.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class CollapsibleSectionComponent {
  @Input() expanded = true;

  toggle(): void {
    this.expanded = !this.expanded;
  }
}