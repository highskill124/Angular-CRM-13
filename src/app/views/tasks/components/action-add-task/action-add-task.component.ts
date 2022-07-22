import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {ModalAddTaskComponent} from '../modal-add-task/modal-add-task.component';
import {DialogService} from '../../../../services/dialog.service';
import {AddTaskActionDirective} from '../../directives/add-task-action.directive';
import {ITask} from '../../../../models/task';

@Component({
    selector: 'app-action-add-task',
    templateUrl: './action-add-task.component.html',
    styleUrls: ['./action-add-task.component.scss']
})
export class ActionAddTaskComponent implements OnInit, OnDestroy {

    @Input() parentId: string;

    @Output() onDismiss: EventEmitter<boolean | ITask> = new EventEmitter<boolean | ITask>();

    modalAddTaskInstance: ModalAddTaskComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(AddTaskActionDirective, {read: TemplateRef}) addTaskActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<ModalAddTaskComponent>({component: ModalAddTaskComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    res.componentInstance.parentId = this.parentId;
                    this.modalAddTaskInstance = res.componentInstance;
                    return this.modalAddTaskInstance.onDismiss.pipe(
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
