import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ToasterService} from 'angular2-toaster';
import {CountryService} from '../../../../services/country.service';
import {ActivatedRoute, Router} from '@angular/router';
import {take, takeWhile} from 'rxjs/operators';
import {IInteraction} from '../../../../models/contact-interaction';
import {IBaseNote} from '../../../../models/base-note';
import {ActionAddNoteComponent} from '../../../notes/components/action-add-note/action-add-note.component';
import {ITask} from '../../../../models/task';
import {IFollowUp} from '../../../../models/follow-up';
import {IFarmMaster, IFarmOwners} from '../../../../models/farm';
import {IPhoneNumber} from '../../../../models/phone-number';
import {IEmail} from '../../../../models/email';
import {EmailService} from '../../../../services/email.service';
import {PhoneNumberService} from '../../../../services/phone-number.service';
import {AsYouType} from 'libphonenumber-js';
import {formatPropertyAddress} from '../../../../helpers/format-property-address';
import {FarmBulkContact} from '../farm-bulk-contact/farm-bulk-contact.component';
import {FarmService} from '../../../../services/farm/farm.service';
import {MatDialog} from '@angular/material/dialog';
import { SharedFollowUpComponent } from '../../../shared-grids/components/shared-follow-ups/shared-follow-up.component'
import { SharedInteractionsComponent} from '../../../shared-grids/components/shared-interactions/shared-interactions.component'
import { SharedTasksComponent } from '../../../shared-grids/components/shared-tasks/shared-tasks.component'
import { SharedEmailsComponent } from '../../../shared-grids/components/shared-emails/shared-emails.component';
import { SharedNotesComponent } from '../../../shared-grids/components/shared-notes/shared-notes.component';
import { EmailEditComponent} from '../../../emails/components/email-edit/email-edit.component'
import { FormPhoneEditComponent } from '../../../../views/phone-numbers/components/phone-edit/phone-edit.component';

@Component({
    selector: 'app-farm-master',
    templateUrl: './farm-master.component.html',
    styleUrls: ['./farm-master.component.scss'],
})
export class FarmMasterComponent implements OnInit, OnDestroy {

    private _farm = null;

    showFarmEdit = false;
    alive = true;
    apn = '';
    showFollowup = false;
    showInteraction = false;
    showTask = false;
    showEmail = false;
    showNote = false;

    formatPropertyAddress = formatPropertyAddress;


    @ViewChild('actionAddNoteComponent', {read: ActionAddNoteComponent})
    public addNoteAction: ActionAddNoteComponent;

    @ViewChild('interactionsList', {read: SharedInteractionsComponent})
    public interactionsList: SharedInteractionsComponent;

    @ViewChild('notesList', {read: SharedNotesComponent})
    public notesList: SharedNotesComponent;

    @ViewChild('tasksList', {read: SharedTasksComponent})
    public tasksList: SharedTasksComponent;

    @ViewChild('followupsList', {read: SharedFollowUpComponent})
    public followupsList: SharedFollowUpComponent;

    @ViewChild('mailsList', {read: SharedEmailsComponent})
    public mailsList: SharedEmailsComponent;

    @Output() childEvent = new EventEmitter();
    @Input() set farm(farm: IFarmMaster) {
        this._farm = farm;
    }
    get farm() {
        return this._farm;
    }



    constructor(
        private route: ActivatedRoute,
        private emailService: EmailService,
        private phoneNumberService: PhoneNumberService,
        private countryService: CountryService,
        private toasterService: ToasterService,
        private router: Router,
        private dialog: MatDialog,
        private farmService: FarmService,
    ) {
    }

    ngOnInit() {
        this.showInteraction = true;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    onEdit() {
        this.router.navigate(['/Farm/FarmUpdate', this.farm.DocId]);
    }

    bulkEdit() {
        const dialogRef = this.dialog.open(FarmBulkContact,
            {
                data: {DocId: this.farm.DocId, mode: 'edit'},
                disableClose: false, width: '600px', position: {
                    top: '50px'
                },
            })
       
            dialogRef.afterClosed().subscribe(
                ta => {
                    if(ta.reload === true){
    
                        this.emailService.getAllEmailsForParent(this.farm.DocId).subscribe(
                            res => this.farm.Record.emails = res
                        )
    
                    }       
        }
            );
    }

    emailEdit(email: any) {

        const dialogRef = this.dialog.open(EmailEditComponent,
            {
                data: {ParentId: this.farm.DocId, DocId: email.id ,mode: 'edit'},
                disableClose: false, width: '650px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
            })
        dialogRef.afterClosed().subscribe(
            ta => {
                if(ta.reload === true){

                    this.emailService.getAllEmailsForParent(this.farm.DocId).subscribe(
                        res => this.farm.Record.emails = res
                    )

                }       
    }
        );
    }

    addEmail() {
        const dialogRef = this.dialog.open(EmailEditComponent,
            {
                data: {ParentId: this.farm.DocId ,mode: 'new'},
                disableClose: false, width: '650px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
            })
        dialogRef.afterClosed().subscribe(
            ta => {
                if(ta.reload === true){

                    this.emailService.getAllEmailsForParent(this.farm.DocId).subscribe(
                        res => this.farm.Record.emails = res
                    )

                }       
    })}

    editPhone(phone: any){
        console.log(phone)
        const dialogRef = this.dialog.open(FormPhoneEditComponent,
            {
                data: {ParentId: this.farm.DocId, DocId: phone.id ,mode: 'edit'},
                disableClose: false, width: '650px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
            })
        dialogRef.afterClosed().subscribe(
            
            ta => {
                if(ta.reload === true){

                    this.phoneNumberService.getAllAdapted2(this.farm.DocId).subscribe(
                        res => this.farm.Record.phones = res
                    )

                }

            }
        );

    }

    addPhone() {
        const dialogRef = this.dialog.open(FormPhoneEditComponent,
            {
                data: {ParentId: this.farm.DocId,mode: 'new'},
                disableClose: false, width: '650px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
            })
        dialogRef.afterClosed().subscribe(
            ta =>     {  if(ta.reload === true){

                this.phoneNumberService.getAllAdapted2(this.farm.DocId).subscribe(
                    res => this.farm.Record.phones = res
                )

            } 
            }
        );




    }



    addPhoneNumberDismissed($event: boolean | IPhoneNumber) {
        if ((typeof $event !== 'boolean') && ($event.id || $event.parentId)) {
            // Make sure to remove just updated item from phones array before going ahead to add it
            this.farm.Record.phones = this.farm.Record.phones.filter(phone => phone.id !== $event.id);
            this.farm.Record.phones.push($event);
        }
    }

    addEmailDismissed($event: boolean | IEmail) {
        if ((typeof $event !== 'boolean') && ($event.id || $event.parentId)) {
            this.farm.Record.emails = this.farm.Record.emails.filter(email => email.id !== $event.id);
            this.farm.Record.emails.push($event);
        }
    }

    deleteEmail(email: IEmail) {
        console.log(email)
        if (confirm('Delete email?')) {
            this.emailService.delete(email.id, this.farm.DocId).pipe(
                takeWhile(_ => this.alive),
                take(1),
            )
                .subscribe((res: any) => {
                    console.log(res)
                    if (res.Success) {
                        console.log(this.farm.Record.emails)
                        this.farm.Record.emails = this.farm.Record.emails.filter(farmEmail => email.id !== farmEmail.id);
                    }
                });
        }
    }

    clearupdateFlag() {
        console.log('Clicked on Remove flag for ' + this.farm.DocId)
        this.farmService.updateOwnerFlag(this.farm.DocId)
            .subscribe((res: any) => {
                if (res.Success) {
                    this.toasterService.pop('success', 'Success!', res.Message);
                    this.childEvent.emit(this.farm.DocId)
                }

            })
    }

    deletePhoneNumber(phoneNumber: IPhoneNumber) {
        if (confirm('Delete phone number?')) {
            this.phoneNumberService.delete(phoneNumber.id, this.farm.DocId).pipe(
                takeWhile(_ => this.alive),
                take(1),
            )
                .subscribe((res: any) => {
                    if (res.Success) {
                        this.farm.Record.phones = this.farm.Record.phones.filter(phone => phoneNumber.id !== phone.id);
                    }
                });
        }
    }

    formatPhoneNumber(number: string) {
        return new AsYouType('US').input(number);
    }

    formatAPN(apn: string) {
        return apn.slice(0, 3) + '-' + apn.slice(3, 6) + '-' + apn.slice(6, 8)
    }

    farmOwnerUpdated($event: IFarmOwners) {
        this.showFarmEdit = false;
        this.farm.Record.Owners = $event;
    }

    itemSelected(e){
        switch (e.newItem.headerComponent.elementRef.nativeElement.innerText) {
            case 'Followup' :
                if (!this.showFollowup) { this.showFollowup = true; }
                break;
            case 'Interaction' :
                if (!this.showInteraction) { this.showInteraction = true; }
                break;
            case 'Task' :
                if (!this.showTask) { this.showTask = true; }
                break;
            case 'Email' :
                if (!this.showEmail) { this.showEmail = true; }
                break;
            case 'Note' :
                if (!this.showNote) { this.showNote = true; }
                break;
        }
   }
}


