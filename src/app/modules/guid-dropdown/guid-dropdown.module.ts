import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomDropDownComponent} from './custom-drop-down/custom-drop-down.component';
import {InfragisticsModule} from '../infragistics/infragistics.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfragisticsModule,
  ],
  declarations: [CustomDropDownComponent],
  exports: [CustomDropDownComponent]
})
export class GuidDropdownModule { }
