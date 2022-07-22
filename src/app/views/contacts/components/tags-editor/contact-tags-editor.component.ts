import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {switchMap, takeWhile, map} from 'rxjs/operators';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {ChipsSelectComponent} from '../../../../shared/components/chips-select/chips-select.component';


@Component({
    selector: 'app-contact-tags-editor',
    templateUrl: './contact-tags-editor.component.html',
    styleUrls: ['./contact-tags-editor.component.scss']
})
export class ContactTagsEditorComponent implements OnInit, AfterViewInit, OnDestroy {

    _contactId: string;

    _allTags: IServerDropdownOption[];

    _selectedTags: Array<string>;

    @ViewChild('chipsSelect', {read: ChipsSelectComponent})
    public chipsSelect: ChipsSelectComponent;

    alive = true;
    @Input() set contactId(contactId: string) {
        this._contactId = contactId;
    }
    get contactId() {
        return this._contactId;
    }
    @Input() set allTags(allTags: IServerDropdownOption[]) {
        this._allTags = [...allTags];
    }
    get allTags() {
        return this._allTags;
    }
    @Input() set selectedTags(selectedTags: Array<string>) {
        this._selectedTags = selectedTags;
    }
    get selectedTags() {
        return this._selectedTags;
    }

    constructor(private contactsService: ContactsService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.chipsSelect.multiSelectBox.onSave
            .pipe(
                takeWhile(_ => this.alive),
                map( tags => tags.filter( tag => tag.selected === true)),
                switchMap(updatedSelection => this.contactsService.updateTags(this.contactId, updatedSelection.map(tag => tag.value)))
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}
