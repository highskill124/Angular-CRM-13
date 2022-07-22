import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormOperation} from '../../../../models/form-operation';
import {FormCreateFarmOwnerComponent} from '../form-create-farm-owner/form-create-farm-owner.component';
import {IFarmOwners} from '../../../../models/farm';

@Component({
    selector: 'app-modal-add-farm-owner',
    templateUrl: './modal-add-farm-owner.component.html',
    styleUrls: ['./modal-add-farm-owner.component.scss']
})
export class ModalAddFarmOwnerComponent implements OnInit {

    @Input() parentId: string;

    private _farmOwners: IFarmOwners;

    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | IFarmOwners> = new EventEmitter<boolean | IFarmOwners>();

    @ViewChild('formCreate', {read: FormCreateFarmOwnerComponent})
    public formCreate: FormCreateFarmOwnerComponent;

    @Input() set farmOwners(farmOwners: IFarmOwners) {
        this._farmOwners = farmOwners;
    }

    get farmOwners() {
        return this._farmOwners;
    }

    constructor() {
    }

    ngOnInit() {
    }

    dismiss($event) {
        this.onDismiss.emit($event);
    }

    get leftButtonText() {
        return this.formOperation && this.formOperation === 'view' ? 'Close' : 'Cancel';
    }

}
