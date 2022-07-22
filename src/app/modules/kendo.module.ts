import { NgModule} from '@angular/core';
import { TreeViewModule } from '@progress/kendo-angular-treeview';



const MODULES = [
    TreeViewModule
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES,
  ],
  providers: [
  ]
})

export class KendoModule {  }
