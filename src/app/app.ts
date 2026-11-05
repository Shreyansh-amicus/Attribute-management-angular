import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { Loader } from './shared/components/loader/loader';
import { Header } from './shared/components/header/header';

@Component({
  imports: [RouterOutlet, ToastContainer, Loader, Header],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('attribute-management-angular');
}
