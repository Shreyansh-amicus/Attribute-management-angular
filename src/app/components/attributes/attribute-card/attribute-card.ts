import { Component, Input } from '@angular/core';
import { IAttributeModel } from '../../../models/IAttribute.model';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-attribute-card',
  styleUrl: './attribute-card.css',
  templateUrl: './attribute-card.html',
})
export class AttributeCard {
  @Input({required : true}) attribute !: IAttributeModel;
}
