import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

interface FilterableAttribute {
  AttributeName ?: string | null;
  BusinessUnitName ?: string | null;
}

@Directive({
  selector: '[appFilterBy]',
})
export class FilterBy implements OnChanges {
  @Input() appFilterBy !: FilterableAttribute;
  @Input() appFilterBySearchTerm = '';

  private hasView = false;

  constructor(
    private templateRef : TemplateRef<unknown>,
    private viewContainer : ViewContainerRef
  ){}

  ngOnChanges():void{
    this.updateView();
  }

  private updateView():void{
    const searchTerm = this.appFilterBySearchTerm.trim().toLowerCase();

    const attributeName = this.appFilterBy.AttributeName?.toLowerCase() ?? '';
    const businessUnitName = this.appFilterBy.BusinessUnitName?.toLowerCase() ?? '';

    const matches =
      searchTerm === '' ||
      attributeName.includes(searchTerm) ||
      businessUnitName.includes(searchTerm);

    if (matches && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!matches && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}