import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-add-email',
    templateUrl: './add-email.component.html',
    styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent implements OnInit {

    @Input() email: string;

    @Output() onDismiss: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
    }

    dismiss() {
        this.onDismiss.emit(true);
    }

}
