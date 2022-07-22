import { NgModule } from '@angular/core';
import {PlacesSearchComponent} from './search-map/search/places-search.component';
import {AgmCoreModule} from '@agm/core';
import {InfragisticsModule} from '../infragistics/infragistics.module';
import {SharedModule} from '../../shared/shared.module';

const COMPONENTS = [
    // GmapsComponent,
    // LeafletComponent,
    // BubbleMapComponent,
    PlacesSearchComponent,
];

const BASE_MODULES = [
    SharedModule,
    InfragisticsModule,
];

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBsv3T2MprXoYLufMOPK1u_0NCknYM8x-g',
      libraries: ['places'],
    }),
      ...BASE_MODULES,
  ],
  exports: [...COMPONENTS, ...BASE_MODULES],
  declarations: [
    ...COMPONENTS,
  ],
})
export class MapsModule { }
