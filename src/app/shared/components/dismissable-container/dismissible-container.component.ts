import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-dismissible-container',
    templateUrl: './dismissible-container.component.html',
    styleUrls: ['./dismissible-container.component.scss']
})
export class DismissibleContainerComponent implements OnInit {

    private _disabled = false;

    @Input() title = '';
    @Input() rightButtonText;
    @Input() leftButtonText;

    @Output() onRightButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onDismiss: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() set disabled(isDisabled: boolean) {
        this._disabled = isDisabled;
    }
    get disabled() {
        return this._disabled;
    }

    constructor() {
    }

    ngOnInit() {
    }

    rightButtonSelected() {
        this.onRightButtonSelect.emit(true);
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    dismiss() {
        this.onDismiss.emit(true);
    }
}
