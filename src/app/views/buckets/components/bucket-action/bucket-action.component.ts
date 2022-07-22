import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {DialogService} from '../../../../services/dialog.service';
import {BucketActionDirective} from '../../directives/bucket-action.directive';
import {FormOperation} from '../../../../models/form-operation';
import {IBucket} from '../../../../models/bucket';
import {BucketModalComponent} from '../bucket-modal/bucket-modal.component';

@Component({
    selector: 'app-bucket-action',
    templateUrl: './bucket-action.component.html',
    styleUrls: ['./bucket-action.component.scss']
})
export class BucketActionComponent implements OnInit, OnDestroy {

    // @Input() parentId: string;
    @Input() bucket: IBucket;
    @Input() formOperation: FormOperation;

    @Output() onDismiss: EventEmitter<boolean | IBucket> = new EventEmitter<boolean | IBucket>();

    modalInstance: BucketModalComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(BucketActionDirective, {read: TemplateRef}) addActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<BucketModalComponent>({component: BucketModalComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    // res.componentInstance.parentId = this.parentId;
                    if (this.bucket) {
                        res.componentInstance.bucket = this.bucket;
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
