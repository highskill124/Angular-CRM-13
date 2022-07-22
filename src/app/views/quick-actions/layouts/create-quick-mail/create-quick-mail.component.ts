import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-create-quick-mail',
    templateUrl: './create-quick-mail.component.html',
    styleUrls: ['./create-quick-mail.component.scss'],
})
export class CreateQuickMailComponent implements OnInit {

    @Output() onEdit = new EventEmitter<{ DocId: string }>();

    constructor() {
    }

    ngOnInit() {
    }

    edit($event) {
        this.onEdit.emit($event);
    }
}
