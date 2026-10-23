import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AttributeList } from './components/attributes/attribute-list/attribute-list';

@Component({
  imports: [RouterOutlet, AttributeList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('attribute-management-angular');
}
