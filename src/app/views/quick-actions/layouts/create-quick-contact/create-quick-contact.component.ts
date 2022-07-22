import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-create-quick-contact',
    templateUrl: './create-quick-contact.component.html',
    styleUrls: ['./create-quick-contact.component.scss']
})
export class CreateQuickContactComponent implements OnInit {

    @Output() edit = new EventEmitter<{ DocId: string }>();

    constructor() {
    }

    ngOnInit() {
    }

    onEdit($event) {
        this.edit.emit($event);
    }
}
