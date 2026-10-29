import { Component, Input } from '@angular/core';
import { IAttributeModel } from '../../../models/IAttribute.model';
import { DatePipe } from '@angular/common';
import { RelativeTimePipe } from '../../../pipes/relative-time-pipe';
import { AppActiveStatus } from '../../../directives/app-active-status';
import { RouterLink } from '@angular/router';

@Component({
  imports: [DatePipe, RelativeTimePipe, AppActiveStatus, RouterLink],
  selector: 'app-attribute-card',
  styleUrl: './attribute-card.css',
  templateUrl: './attribute-card.html',
})
export class AttributeCard {
  @Input({required : true}) attribute !: IAttributeModel;

  ngOnInit(): void {
    console.log("ngOnInit() hook fired for ",this.attribute.AttributeId);
  }

  ngOnChanges() : void{
    console.log("ngOnChanges() hook fired for ", this.attribute.AttributeId);
  }

  ngOnDestroy() : void{
    console.log("ngOnDestroy() hook fired for ",this.attribute.AttributeId);
  }
}
