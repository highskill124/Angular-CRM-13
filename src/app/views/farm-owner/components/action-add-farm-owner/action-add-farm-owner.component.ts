import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {DialogService} from '../../../../services/dialog.service';
import {AddFarmOwnerActionDirective} from '../../directives/add-farm-owner-action.directive';
import {FormOperation} from '../../../../models/form-operation';
import {IFarmOwners} from '../../../../models/farm';
import {ModalAddFarmOwnerComponent} from '../modal-add-farm-owner/modal-add-farm-owner.component';

@Component({
    selector: 'app-action-add-farm-owner',
    templateUrl: './action-add-farm-owner.component.html',
    styleUrls: ['./action-add-farm-owner.component.scss']
})
export class ActionAddFarmOwnerComponent implements OnInit, OnDestroy {

    @Input() parentId: string;
    @Input() farmOwners: IFarmOwners;
    @Input() formOperation: FormOperation;

    @Output() onDismiss: EventEmitter<boolean | IFarmOwners> = new EventEmitter<boolean | IFarmOwners>();

    modalInstance: ModalAddFarmOwnerComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(AddFarmOwnerActionDirective, {read: TemplateRef}) addActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<ModalAddFarmOwnerComponent>({component: ModalAddFarmOwnerComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    res.componentInstance.parentId = this.parentId;
                    if (this.farmOwners) {
                        res.componentInstance.farmOwners = this.farmOwners;
                    }
                    if (this.formOperation) {
                        res.componentInstance.formOperation = this.formOperation;
                    }
                    this.modalInstance = res.componentInstance;
                    return this.modalInstance.onDismiss.pipe(
                        tap(_ => {
                            res.dialogService.overlayService.hide(res.overlayId);
                        })
                    );
                })
            )
            .subscribe($dismissEvent => {
                this.onDismiss.emit($dismissEvent);

            });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

}
