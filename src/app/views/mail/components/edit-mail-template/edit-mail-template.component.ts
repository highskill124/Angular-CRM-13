import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {IMailTemplate} from '../../../../models/mail-template';
import {MailTemplateService} from '../../../../services/mail-template.service';
import {Observable} from 'rxjs';
import {takeWhile, tap} from 'rxjs/operators';

@Component({
    selector: 'app-edit-mail-template',
    templateUrl: './edit-mail-template.component.html',
    styleUrls: ['./edit-mail-template.component.scss'],
})

export class EditMailTemplateComponent implements OnInit, OnDestroy {

    formData$: Observable<IMailTemplate>;
    operation = 'update';
    submitText = 'Update';
    heading: string;

    alive = true;

    constructor(
        private mailTemplateService: MailTemplateService,
        protected activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params.pipe(
            takeWhile(_ => this.alive),
        ).subscribe((params: Params) => {
            this.formData$ = this.mailTemplateService.fetch(params['DocId']).pipe(
                tap(template => {
                    this.heading = 'Update Template - ' + template.DocId;
                }),
            );
        });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

}
