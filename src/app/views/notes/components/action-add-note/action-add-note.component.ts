import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {takeWhile} from 'rxjs/internal/operators/takeWhile';
import {switchMap, take, tap} from 'rxjs/operators';
import {ModalAddNoteComponent} from '../modal-add-note/modal-add-note.component';
import {IBaseNote} from '../../../../models/base-note';
import {DialogService} from '../../../../services/dialog.service';
import {AddNoteActionDirective} from '../../directives/add-note-action.directive';

@Component({
    selector: 'app-action-add-note',
    templateUrl: './action-add-note.component.html',
    styleUrls: ['./action-add-note.component.scss']
})
export class ActionAddNoteComponent implements OnInit, OnDestroy {

    @Input() parentid: string;

    @Output() onDismiss: EventEmitter<boolean | IBaseNote> = new EventEmitter<boolean | IBaseNote>();

    modalAddNoteInstance: ModalAddNoteComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(AddNoteActionDirective, {read: TemplateRef}) addNoteActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<ModalAddNoteComponent>({component: ModalAddNoteComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    res.componentInstance.parentid = this.parentid;
                    this.modalAddNoteInstance = res.componentInstance;
                    return this.modalAddNoteInstance.onDismiss.pipe(
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
