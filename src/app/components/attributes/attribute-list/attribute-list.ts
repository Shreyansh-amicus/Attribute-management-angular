import { Component, inject } from '@angular/core';
import { AttributeService } from '../../../services/attribute-service';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-attribute-list',
  styleUrl: './attribute-list.css',
  templateUrl: './attribute-list.html',
})
export class AttributeList {
  private attributeService = inject(AttributeService);

  attributes  = this.attributeService.mockAttributes;
}
