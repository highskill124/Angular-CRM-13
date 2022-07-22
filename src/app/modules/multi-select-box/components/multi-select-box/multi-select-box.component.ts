import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ConnectedPositioningStrategy, HorizontalAlignment, IgxToggleDirective, OverlaySettings, VerticalAlignment, } from 'igniteui-angular';

export interface IOptionMultiSelectBox {
    name: string;
    value: any;
    selected: boolean;
}

@Component({
    selector: 'app-multi-select-box',
    templateUrl: './multi-select-box.component.html',
    styleUrls: ['./multi-select-box.component.scss']
})
export class MultiSelectBoxComponent implements OnInit, OnDestroy {

    private _optionsList: IOptionMultiSelectBox[];

    private _disabled = false;

    private _overlaySettings: OverlaySettings = {};

    @Input() title: string;
    @Input() buttonBackground = '#f2f2f2';
    @Input() addText = 'Add';

    // emit values of selected options
    @Output() onSave = new EventEmitter<IOptionMultiSelectBox[]>();

    @ViewChild(IgxToggleDirective)
    private toggleDirective: IgxToggleDirective;
    alive = true;
    @Input() set optionsList(options: IOptionMultiSelectBox[]) {
        this._optionsList = options;
    }
    get optionsList() {
        return this._optionsList;
    }
    @Input() set disabled(isDisabled: boolean) {
        this._disabled = isDisabled;
    }
    get disabled() {
        return this._disabled;
    }
    @Input() set overlaySettings(overlaySettings: OverlaySettings) {
        this._overlaySettings = overlaySettings;
    }
    get overlaySettings() {
        return this._overlaySettings;
    }

    constructor() {
    }

    ngOnInit(): void {
        //
    }

    public get collapsed(): boolean {
        return this.toggleDirective.collapsed;
    }

    public toggleAddArea($event) {
        this.toggleDirective.toggle({
            closeOnOutsideClick: true,
            modal: false,
            // scrollStrategy: new NoOpScrollStrategy(),
            positionStrategy: new ConnectedPositioningStrategy({
                horizontalDirection: HorizontalAlignment.Right,
                horizontalStartPoint: HorizontalAlignment.Right,
                verticalStartPoint: VerticalAlignment.Middle,
                verticalDirection: VerticalAlignment.Top,
                target: $event.target,
            }),
            ...this.overlaySettings,
        });
    }

    save(optionsList: IOptionMultiSelectBox[]) {
        this.onSave.emit(optionsList);
        this.toggleDirective.close();
    }

    cancel() {
        this.toggleDirective.close();
    }

    ngOnDestroy() {
        this.alive = false;
    }

}
