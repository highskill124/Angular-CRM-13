import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {takeWhile} from 'rxjs/internal/operators/takeWhile';
import {AddInteractionComponent} from '../add-interaction/add-interaction.component';
import {switchMap, take, tap} from 'rxjs/operators';
import {IInteraction} from '../../../../models/contact-interaction';
import {AddInteractionActionDirective} from '../../directives/add-interaction-action.directive';
import {DialogService} from '../../../../services/dialog.service';

@Component({
    selector: 'app-add-interaction-action',
    templateUrl: './add-interaction-action.component.html',
    styleUrls: ['./add-interaction-action.component.scss']
})
export class AddInteractionActionComponent implements OnInit, OnDestroy {

    @Input() parent_id: string;
    // @Input() buttonTemplate: TemplateRef<HTMLButtonElement>;

    @Output() onDismiss: EventEmitter<boolean | Partial<IInteraction>>
        = new EventEmitter<boolean | Partial<IInteraction>>();

    addInteractionComponentInstance: AddInteractionComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(AddInteractionActionDirective, {read: TemplateRef}) addInteractionActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<AddInteractionComponent>({component: AddInteractionComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    res.componentInstance.parent_id = this.parent_id;
                    this.addInteractionComponentInstance = res.componentInstance;
                    return this.addInteractionComponentInstance.onDismiss.pipe(
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
