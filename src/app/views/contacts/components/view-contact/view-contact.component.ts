import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToasterService} from 'angular2-toaster';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {IMainContact} from '../../../../models/contact';
import {CountryService} from '../../../../services/country.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {shareReplay} from 'rxjs/operators';
import {AutoAddProtocol} from '../../../../helpers/auto-add-protocol';
import {NotesListComponent} from '../../../notes/components/notes-list/notes-list.component';
import {AddInteractionActionComponent} from '../../../interactions/components/add-interaction-action/add-interaction-action.component';
import {IInteraction} from '../../../../models/contact-interaction';
import {IBaseNote} from '../../../../models/base-note';
import {ActionAddNoteComponent} from '../../../notes/components/action-add-note/action-add-note.component';
import {ITask} from '../../../../models/task';
import {TasksListComponent} from '../../../tasks/components/tasks-list/tasks-list.component';
import {IFollowUp} from '../../../../models/follow-up';
import {TagService} from '../../../../services/tag.service'
import {BucketService} from '../../../../services/bucket.service'
import {SharedFollowUpComponent } from '../../../shared-grids/components/shared-follow-ups/shared-follow-up.component'
import {SharedInteractionsComponent} from '../../../shared-grids/components/shared-interactions/shared-interactions.component'

@Component({
    selector: 'app-view-contact',
    templateUrl: './view-contact.component.html',
    styleUrls: ['./view-contact.component.scss'],
})
export class ViewContactComponent implements OnInit, OnDestroy {

    guids = DropdownGuids;
    autoAddProtocol = AutoAddProtocol;
    buckets = null;
    tags = null;
    tagOptions$: Observable<Array<IServerDropdownOption>>;
    countryOptions$: Observable<Array<IServerDropdownOption>>;
    followUpOptions$: Observable<Array<IServerDropdownOption>>;
    programOptions$: Observable<Array<IServerDropdownOption>>;
    bucketOptions$: Observable<Array<IServerDropdownOption>>;
    socialLabels$: Observable<IServerDropdownOption[]>;
    phoneLabels$: Observable<IServerDropdownOption[]>;
    emailLabels$: Observable<IServerDropdownOption[]>;
    websiteLabels$: Observable<IServerDropdownOption[]>;
    addressLabels$: Observable<IServerDropdownOption[]>;
    recurringEventLabels$: Observable<IServerDropdownOption[]>;

    showFollowup = false;
    showInteraction = false;
    showNote = false;
    showTask = false;
    showEmail = false;

    private _contact = null;

    alive = true;

    @ViewChild('addInteractionActionComponent', {read: AddInteractionActionComponent})
    public addInteractionAction: AddInteractionActionComponent;

    @ViewChild('actionAddNoteComponent', {read: ActionAddNoteComponent})
    public addNoteAction: ActionAddNoteComponent;

    @ViewChild('interactionsList', {read: SharedInteractionsComponent})
    public interactionsList: SharedInteractionsComponent;

    @ViewChild('notesList', {read: NotesListComponent})
    public notesList: NotesListComponent;

    @ViewChild('tasksList', {read: TasksListComponent})
    public tasksList: TasksListComponent;

    @ViewChild('followupsList', {read: SharedFollowUpComponent})
    public followupsList: SharedFollowUpComponent;

    @Input() set contact(contact: IMainContact) {
        this._contact = contact;
    }
    get contact() {
        return this._contact;
    }

    constructor(
        private route: ActivatedRoute,
        private contactsService: ContactsService,
        private countryService: CountryService,
        private toasterService: ToasterService,
        private router: Router,
        private bucketService: BucketService,
        private tagService: TagService
    ) {
    }

    ngOnInit() {
        this.tagOptions$ = this.tagService.tagList('Contact').pipe(shareReplay());
        this.countryOptions$ = this.countryService.fetchAll().pipe(shareReplay());
        this.programOptions$ = this.contactsService.programsList(this.guids.PROGRAMS_CONTACT).pipe(shareReplay());
        this.followUpOptions$ = this.contactsService.followUpOptions(this.guids.FOLLOW_UP_METHODS).pipe(shareReplay());
        this.bucketOptions$ = this.bucketService.bucketList('Contact').pipe(shareReplay());
        this.socialLabels$ = this.contactsService.labelsList(this.guids.SOCIAL_LABELS).pipe(shareReplay());
        this.phoneLabels$ = this.contactsService.labelsList(this.guids.PHONE_LABELS).pipe(shareReplay());
        this.emailLabels$ = this.contactsService.labelsList(this.guids.EMAIL_LABELS).pipe(shareReplay());
        this.websiteLabels$ = this.contactsService.labelsList(this.guids.WEBSITE_LABELS).pipe(shareReplay());
        this.addressLabels$ = this.contactsService.labelsList(this.guids.ADDRESS_LABELS).pipe(shareReplay());
        this.recurringEventLabels$ = this.contactsService.labelsList(this.guids.RECURRING_EVENT_LABELS).pipe(shareReplay());

        this.showInteraction = true;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    onEdit() {
        this.router.navigate(['/Contacts/ContactUpdate', this.contact.DocId]);
    }

    followUp(contact: IMainContact) {
        //
    }

    addInteractionDismissed($event: boolean | Partial<IInteraction>) {
        // console.log($event);
        // distinguish between the dismiss modal event and a successful form submission event
        if ((typeof $event !== 'boolean') && $event.parent_id) {
            // Reload interactions list when new interaction is submitted
            this.interactionsList.reloadData();
        }
    }

    addNoteDismissed($event: boolean | IBaseNote) {
        // distinguish between the dismiss modal event and a successful form submission event
        if ((typeof $event !== 'boolean') && $event.parentid) {
            // Reload interactions list when new interaction is submitted
            this.notesList.reloadData();
        }
    }

    addTaskDismissed($event: boolean | ITask) {
        // distinguish between the dismiss modal event and a successful form submission event
        if ((typeof $event !== 'boolean') && $event.parentId) {
            // Reload interactions list when new interaction is submitted
            this.tasksList.agGridBase.reloadData();
        }
    }

    addFollowupDismissed($event: boolean | IFollowUp) {
        console.log('We hit Reload')
        // distinguish between the dismiss modal event and a successful form submission event
        if ((typeof $event !== 'boolean') && $event.parent_id) {
            // Reload interactions list when new interaction is submitted
            //this.followupsList.agGridBase.reloadData();
        }
    }
    itemSelected(e){
        let tabLabel = e.newItem.headerComponent.elementRef.nativeElement.innerText
        switch (tabLabel) {
            case 'Followup' :
                if(!this.showFollowup) { this.showFollowup = true }
                break;
            case 'Interaction' :
                if(!this.showInteraction) {this.showInteraction = true }
                break;
            case 'Task' :
                if(!this.showTask) { this.showTask = true }
                break;
            case 'Email' :
                if(!this.showEmail) { this.showEmail = true }
                break;
            case 'Note' :
                if(!this.showNote) { this.showNote = true } 
                break;
        }
        console.log(tabLabel)
   }

   changeState() {
       if (this.showFollowup === false) {
           this.showFollowup = true
       } else {
        this.showFollowup = false
       }
       if (this.showInteraction === false) {
        this.showInteraction = true
    } else {
     this.showInteraction = false
    }
   }
}
