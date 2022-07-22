import {forwardRef, NgModule} from '@angular/core';
import {HeaderGroupComponent} from './components/header-group-component/header-group.component';
import {HeaderComponent} from './components/header-component/header.component';
import {RichGridComponent} from './components/rich-grid/rich-grid.component';
import {SharedModule} from '../../shared/shared.module';
import {DateComponent} from './components/date-component/date.component';
import {HtmlRendererComponent} from './components/html-renderer/html-renderer.component';
import {ActionsRendererComponent} from './components/actions-renderer/actions-renderer.component';
import {RouterModule} from '@angular/router';
import {MultiKeyValueItemRendererComponent} from './components/multi-key-value-item-renderer/multi-key-value-item-renderer.component';
import {MultiSelectItemEditorComponent} from './components/editors/multi-select-item-editor/multi-select-item-editor.component';
import {CustomTooltipComponent} from './components/custom-tooltip/custom-tooltip.component';
import {AgGridModule} from 'ag-grid-angular';
import {InteractionMethodIconRendererComponent} from './components/icon-renderer/interaction-method-icon-renderer.component';
import {CheckboxCellComponent} from './components/checkbox-cell/checkbox-cell.component';
import {TooltipedValueRendererComponent} from './components/tooltip-container/tooltiped-value-renderer.component';
import {AgGridPageSizeComponent} from './components/ag-grid-page-size/ag-grid-page-size.component';
import {AgGridBaseComponent} from './components/ag-grid-base/ag-grid-base.component';
import {AgGridSearchFilterComponent} from './components/ag-grid-search-filter/ag-grid-search-filter.component';
import {CurrencyPipe} from '@angular/common';
import {TemplateRendererComponent} from './components/template-renderer/template-renderer.component';
import {FormsModule} from '@angular/forms';

const ENTRY_COMPONENTS = [
    HtmlRendererComponent,
    InteractionMethodIconRendererComponent,
    ActionsRendererComponent,
    MultiKeyValueItemRendererComponent,
    MultiSelectItemEditorComponent,
    CheckboxCellComponent,
    TooltipedValueRendererComponent,
];

const COMPONENTS = [
    AgGridBaseComponent,
    RichGridComponent,
    DateComponent,
    HeaderComponent,
    HeaderGroupComponent,
    CustomTooltipComponent,
    AgGridPageSizeComponent,
    AgGridSearchFilterComponent,
    TemplateRendererComponent,
    ...ENTRY_COMPONENTS,
];

const BASE_MODULES = [
    SharedModule,
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        RouterModule,
        ...BASE_MODULES,
        AgGridModule.withComponents([
            DateComponent,
            HeaderComponent,
            FormsModule,
            HeaderGroupComponent,
            CustomTooltipComponent,
            TemplateRendererComponent,
        ]),
    ],
    exports: [...COMPONENTS, ...BASE_MODULES, AgGridModule],
    providers: [CurrencyPipe]
})
export class CustomAgGridModule {
}
