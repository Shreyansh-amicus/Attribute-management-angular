import { Component, inject, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';
import { AttributeCard } from '../../../../shared/components/attribute-card/attribute-card';
import { AppActiveStatus } from '../../../../shared/directives/app-active-status';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time-pipe';
import { FormsModule } from '@angular/forms';
import { FilterBy } from '../../../../shared/directives/filter-by';
import { IAttributeModel } from '../../../../shared/models/IAttribute.model';
import { RouterLink } from '@angular/router';
import { AttributeService } from '../../../../core/services/attribute-service';

@Component({
  imports: [DatePipe, AttributeCard, AppActiveStatus, RelativeTimePipe, FormsModule, FilterBy, RouterLink],
  selector: 'app-attribute-list',
  styleUrl: './attribute-list.css',
  templateUrl: './attribute-list.html',
})
export class AttributeList implements OnInit{
  private attributeService = inject(AttributeService);

  get attributes(): IAttributeModel[] {
    return this.attributeService.mockAttributes;
  }
  searchTerm = '';
  isTableView = true;

  onClick() : void{
    this.isTableView = !this.isTableView;
  }

  ngOnInit(): void {
    console.log(
    'LIST service ID:',
    this.attributeService.debugInstanceId
  );

    console.log('List page sees:', this.attributes);
  }
}
