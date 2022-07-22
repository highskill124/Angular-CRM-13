import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {IOptionMultiSelectBox} from '../multi-select-box/multi-select-box.component';

@Component({
    selector: 'app-multi-select-box-card',
    templateUrl: './multi-select-box-card.component.html',
    styleUrls: ['./multi-select-box-card.component.scss']
})
export class MultiSelectBoxCardComponent {

    private _optionsList: IOptionMultiSelectBox[];
    bar = '';
    // emit values of selected options
    @Output() optionSelectionChanged = new EventEmitter<IOptionMultiSelectBox>();
    @Output() onSave = new EventEmitter<IOptionMultiSelectBox[]>();
    @Output() onCancel = new EventEmitter<boolean>();

    @ViewChild('optionsearch') inputName;

    @Input() set optionsList(options: IOptionMultiSelectBox[]) {
        this._optionsList = options;
    }
    get optionsList() {
        return this._optionsList;
    }


    save() {
        this.clearSearch()
        this.onSave.emit(this.optionsList);
    }

    cancel() {
        this.clearSearch()
        this.onCancel.emit(true);
    }

    clearSearch(){
        this.inputName.nativeElement.value = '';

    }

    emitOptionChanged(option: IOptionMultiSelectBox) {
        this.optionSelectionChanged.emit(option);
    }


}
