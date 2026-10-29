import { Component } from '@angular/core';
import { AttributeList } from '../../components/attributes/attribute-list/attribute-list';

@Component({
  imports: [AttributeList],
  selector: 'app-attribute-list-page',
  styleUrl: './attribute-list.css',
  templateUrl: './attribute-list.html',
})
export class AttributeListPage {}
