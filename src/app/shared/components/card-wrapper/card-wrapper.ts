import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-card-wrapper',
  styleUrl: './card-wrapper.css',
  templateUrl: './card-wrapper.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class CardWrapper {}
