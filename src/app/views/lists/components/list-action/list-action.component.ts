import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {DialogService} from '../../../../services/dialog.service';
import {ListActionDirective} from '../../directives/list-action.directive';
import {FormOperation} from '../../../../models/form-operation';
import {IList} from '../../../../models/list';
import {ListModalComponent} from '../list-modal/list-modal.component';

@Component({
    selector: 'app-list-action',
    templateUrl: './list-action.component.html',
    styleUrls: ['./list-action.component.scss']
})
export class ListActionComponent implements OnInit, OnDestroy {

    @Input() list: IList;
    @Input() formOperation: FormOperation;

    @Output() onDismiss: EventEmitter<boolean | IList> = new EventEmitter<boolean | IList>();

    modalInstance: ListModalComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(ListActionDirective, {read: TemplateRef}) addActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<ListModalComponent>({component: ListModalComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(dialogResult => {
                    if (this.list) {
                        dialogResult.componentInstance.list = this.list;
                    }
                    if (this.formOperation) {
                        dialogResult.componentInstance.formOperation = this.formOperation;
                    }
                    this.modalInstance = dialogResult.componentInstance;
                    return this.modalInstance.onDismiss.pipe(
                        tap(_ => {
                            dialogResult.dialogService.overlayService.hide(dialogResult.overlayId);
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
