import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IAttributeModel } from '../../models/IAttribute.model';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { AppActiveStatus } from '../../directives/app-active-status';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  imports: [RelativeTimePipe, AppActiveStatus, RouterLink, NgFor],
  selector: 'app-attribute-card',
  styleUrl: './attribute-card.css',
  templateUrl: './attribute-card.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class AttributeCard {
  @Input({required : true}) attribute !: IAttributeModel;
  @Input() canManage = false;

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
