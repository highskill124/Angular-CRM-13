import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {switchMap, takeWhile, filter, map} from 'rxjs/operators';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {ChipsSelectComponent} from '../../../../shared/components/chips-select/chips-select.component';



@Component({
    selector: 'app-contact-buckets-editor',
    templateUrl: './contact-buckets-editor.component.html',
    styleUrls: ['./contact-buckets-editor.component.scss']
})
export class ContactBucketsEditorComponent implements OnInit, AfterViewInit, OnDestroy {
    _contactId: string;

    _allBuckets: IServerDropdownOption[];

    _selectedBuckets: Array<string>;

    @ViewChild('chipsSelect', {read: ChipsSelectComponent})
    public chipsSelect: ChipsSelectComponent;

    alive = true;
    @Input() set contactId(contactId: string) {
        this._contactId = contactId;
    }
    get contactId() {
        return this._contactId;
    }
    @Input() set allBuckets(allBuckets: IServerDropdownOption[]) {
        this._allBuckets = [...allBuckets];
    }
    get allBuckets() {
        return this._allBuckets;
    }
    @Input() set selectedBuckets(selectedBuckets: Array<string>) {
        this._selectedBuckets = selectedBuckets;
    }
    get selectedBuckets() {
        return this._selectedBuckets;
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
                switchMap(updatedSelection => this.contactsService.updateBuckets(this.contactId, updatedSelection.map(tag => tag.value))),

            )
            .subscribe();

    }
    ngOnDestroy(): void {
        this.alive = false;
    }
}
