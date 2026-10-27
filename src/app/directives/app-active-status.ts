import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { formatDate } from '@angular/common';

@Directive({
  selector: '[appActiveStatus]',
  standalone: true,
})
export class AppActiveStatus implements OnChanges {
  @Input() isActive!: boolean;
  @Input() createdOn!: Date;
  @Input() updatedOn!: Date | null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    console.log('ngOnChanges fired!', {
      isActive: this.isActive,
      createdOn: this.createdOn,
      updatedOn: this.updatedOn,
    });

    this.applyStatusStyles();
  }

  private applyStatusStyles(): void {
    const hostElement = this.el.nativeElement;

    // Select the appropriate color and date.
    const backgroundColor = this.isActive ? '#dcfce7' : '#fee2e2';
    const textColor = this.isActive ? '#166534' : '#991b1b';
    const statusText = this.isActive ? 'Active' : 'Inactive';
    const statusDate = this.updatedOn ? this.updatedOn : this.createdOn;

    // Apply badge styling.
    this.renderer.setStyle(hostElement, 'background-color', backgroundColor);
    this.renderer.setStyle(hostElement, 'color', textColor);
    this.renderer.setStyle(hostElement, 'display', 'inline-block');
    this.renderer.setStyle(hostElement, 'padding', '0.25rem 0.75rem');
    this.renderer.setStyle(hostElement, 'font-size', '0.75rem');
    this.renderer.setStyle(hostElement, 'font-weight', '600');
    this.renderer.setStyle(hostElement, 'border-radius', '9999px');

    // Format the tooltip date.
    const formattedDate = statusDate
      ? formatDate(statusDate, 'mediumDate', 'en-US')
      : 'date unavailable';

    this.renderer.setAttribute(hostElement, 'title', `${statusText} since ${formattedDate}`);
  }
}
