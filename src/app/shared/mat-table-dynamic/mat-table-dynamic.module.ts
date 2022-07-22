import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDynamicComponent } from './mat-table-dynamic.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';



@NgModule({
  declarations: [
    MatTableDynamicComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MatTableDynamicComponent
  ]
})
export class MatTableDynamicModule { }
