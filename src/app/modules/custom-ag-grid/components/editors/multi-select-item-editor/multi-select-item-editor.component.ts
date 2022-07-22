import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {IServerDropdownOption} from '../../../../../models/server-dropdown';
import {IOptionMultiSelectBox} from '../../../../multi-select-box/components/multi-select-box/multi-select-box.component';
import {ICellEditorAngularComp} from 'ag-grid-angular';
import {isObservable} from 'rxjs';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-multi-select-item-editor',
  templateUrl: './multi-select-item-editor.component.html',
  styleUrls: ['./multi-select-item-editor.component.scss']
})
export class MultiSelectItemEditorComponent implements ICellEditorAngularComp, AfterViewInit, OnDestroy {

    private params: any;
    field: string;
    selectedOptions: IServerDropdownOption[];
    public options: IServerDropdownOption[];
    alive = true;

    @ViewChild('container', {read: ViewContainerRef}) public container;

    ngAfterViewInit() {
        window.setTimeout(() => {
            this.container.element.nativeElement.focus();
        });
    }

    agInit(params: any): void {
        setTimeout(() => {
            // console.log('params sent to editor ', params);
            this.params = params;
            // extract name of field being edited from params passed in
            this.field = params.column.colId;
            this.setSelectedOptions(params.value);

            const optionsData = params.data && params.data.options;
            if (isObservable(optionsData)) {
                optionsData
                    .pipe(
                        takeWhile(_ => this.alive)
                    )
                    .subscribe(options => {
                        this.setOptions(options);
                    })
            } else if (Array.isArray(optionsData)) {
                this.setOptions(optionsData);
            } else {
                console.warn('Options value passed to multi select item editor is neither array nor observable ', params.data);
            }
        }, 0);
    }

    isPopup(): boolean {
        return true;
    }

    getValue(): any {
        return this.options;
    }

    /**
     * For each option passed in, mark as selected if found among the selected options
     * @param options
     */
    setOptions(options): void {
        this.options = options.map(option => {
            if (this.selectedOptions.find(selectedOption => selectedOption.value === option.value)) {
                option.selected = true;
            } else {
                option.selected = false;
            }
            return option;
        });
        // console.log('selected options ', this.selectedOptions);
        // console.log('options ', this.options);
    }

    setSelectedOptions(options: IServerDropdownOption[]) {
        this.selectedOptions = options;
    }

    cancel($event: boolean) {
        this.stopEditing();
    }

    save(result: IOptionMultiSelectBox[]) {
        const optionsSelected = result.filter(option => option.selected);
        // this.setSelectedOptions(optionsSelected);
        // this.setOptions(unfilteredUpdatedOptions);
        this.params.context.componentParent.onMultiSelectItemEdit(
            this.field,
            this.params.node,
            optionsSelected
        );
        this.stopEditing();
    }

    stopEditing() {
        this.params.api.stopEditing();
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}
