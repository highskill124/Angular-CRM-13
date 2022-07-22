import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AutoPositionStrategy, CloseScrollStrategy, IgxDropDownComponent, IgxToggleDirective, ISelectionEventArgs} from 'igniteui-angular';
import {IServerDropdownOption} from '../../../models/server-dropdown';

@Component({
    selector: 'app-dropdown-select',
    templateUrl: './dropdown-select.component.html',
    styleUrls: ['./dropdown-select.component.scss']
})
export class DropdownSelectComponent implements OnInit {

    @ViewChild(IgxDropDownComponent) public igxDropDown: IgxDropDownComponent;
    myControl = new FormControl();
    @Input() title = '';
    @Input() buttonClass: string;
    @Input() options: IServerDropdownOption[] = [];
    @Input() showSearch: boolean = false;

    @Output() optionSelected = new EventEmitter<IServerDropdownOption>();
    @ViewChild('toggleDropdownMenu') public toggleDropdownMenu: IgxToggleDirective;


    @ViewChild('optionsearch') inputName;

    private _overlaySettings = {
        closeOnOutsideClick: true,
        modal: false,
        positionStrategy: new AutoPositionStrategy(),
        scrollStrategy: new CloseScrollStrategy()
    };

    constructor() {
    }

    public ngOnInit() {
    }

    public toggleDropDown(eventArgs) {
        this._overlaySettings.positionStrategy.settings.target = eventArgs.target;
        this.igxDropDown.toggle(this._overlaySettings);
    }

    onSelect($event: ISelectionEventArgs) {
        this.optionSelected.emit($event.newSelection.value);

        $event.cancel = true;
        this.toggleDropdownMenu.close();
    }

    clearSearch() {
        this.inputName.nativeElement.value = '';

    }
}
