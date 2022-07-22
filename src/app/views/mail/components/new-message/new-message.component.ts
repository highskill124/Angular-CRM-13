import {Component, OnInit, ViewChild} from '@angular/core';
import {QuickMailFormComponent} from '../quick-mail-form/quick-mail-form.component';

@Component({
    selector: 'app-new-message',
    templateUrl: './new-message.component.html',
    styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {

    @ViewChild('mailForm', {read: QuickMailFormComponent})
    public mailForm: QuickMailFormComponent;

    constructor() {
    }

    ngOnInit() {
    }

}
