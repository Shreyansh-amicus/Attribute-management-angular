import { Component, inject } from '@angular/core';
import { AttributeService } from '../../../services/attribute-service';
import { DatePipe } from '@angular/common';
import { AttributeCard } from '../attribute-card/attribute-card';

@Component({
  imports: [DatePipe, AttributeCard],
  selector: 'app-attribute-list',
  styleUrl: './attribute-list.css',
  templateUrl: './attribute-list.html',
})
export class AttributeList {
  private attributeService = inject(AttributeService);

  attributes  = this.attributeService.mockAttributes;

  isTableView = true;

  onClick() : void{
    this.isTableView = !this.isTableView;
  }
}
