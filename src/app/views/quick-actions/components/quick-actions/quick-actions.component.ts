import {Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../../models/user';
import {
    ConnectedPositioningStrategy,
    GlobalPositionStrategy,
    HorizontalAlignment,
    IgxOverlayService,
    IgxToggleDirective,
    ISelectionEventArgs,
    NoOpScrollStrategy,
    OverlayEventArgs,
    OverlaySettings,
    VerticalAlignment
} from 'igniteui-angular';
import {ActiveQuickActionOverlayService} from '../../../../services/active-quick-action-overlay.service';
import {CreateQuickContactComponent} from '../../layouts/create-quick-contact/create-quick-contact.component';
import {Router} from '@angular/router';
import {filter, takeWhile} from 'rxjs/operators';
import {CreateQuickMailComponent} from '../../layouts/create-quick-mail/create-quick-mail.component';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { QuickMailFormComponent } from '../../../../views/mail/components/quick-mail-form/quick-mail-form.component';

@Component({
    selector: 'app-quick-actions',
    templateUrl: './quick-actions.component.html',
    styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent implements OnInit, OnDestroy {

    @Input() user: User;

    public items: any[] = [];
    alive = true;

    overlaySettings: OverlaySettings;
    positionSettings = {
        horizontalDirection: HorizontalAlignment.Left,
        horizontalStartPoint: HorizontalAlignment.Right,
        verticalStartPoint: VerticalAlignment.Bottom
    };

    @ViewChild('toggleDirective') public toggleDirective: IgxToggleDirective;

    private quickActionPositionStrategy: GlobalPositionStrategy;

    constructor(
        @Inject(IgxOverlayService) private overlayService: IgxOverlayService,
        private activeQuickActionOverlay: ActiveQuickActionOverlayService,
        private router: Router,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateQuickMailComponent>,
    ) {
        const horizontalDirection = 0;
        const verticalDirection = -1;
        this.quickActionPositionStrategy = new GlobalPositionStrategy({
            // target: this.directionDemo.nativeElement,
            horizontalDirection, verticalDirection
        });
    }

    ngOnInit() {
        this.items = [
            {icon: 'person_add', text: 'Add New Contact', action: 'new-contact'},
            {icon: 'mail', text: 'Quick Mail', action: 'new-mail'},
        ];

        this.overlaySettings = {
            closeOnOutsideClick: true,
            modal: false,
            positionStrategy: new ConnectedPositioningStrategy(this.positionSettings),
            scrollStrategy: new NoOpScrollStrategy()
        };
    }

    public onSelection(eventArgs: ISelectionEventArgs) {
        eventArgs.cancel = true;
        this.toggleDirective.close();

        // console.log('event args gotten', eventArgs.newSelection.value.action);
        switch (eventArgs.newSelection.value.action) {
            case 'new-contact':
                this.handleNewContact();
                break;
            case 'new-mail':
                this.handleNewMail();
                break;
            default:
                console.log(eventArgs.newSelection.value.action, eventArgs.newSelection.value);
                break;
        }
        // this.router.navigate([{ outlets: {'quick_action': ['NewContact']}}]);
    }

    ngOnDestroy() {
        this.alive = false;
    }

    private handleNewContact() {

        const dialogRef = this.dialog.open(CreateQuickContactComponent,
            {
                disableClose: true, position: {
                    top: '0px',
                    right: '0px'
                },
                panelClass: 'inner-no-pad-dialog',
                autoFocus: false
            })
 
        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will Exit without Saving');
                this.dialogRef.close()
            } else {
            }
        });


        // const overlayId = this.overlayService.show(CreateQuickContactComponent, {
        //     positionStrategy: this.quickActionPositionStrategy,
        //     closeOnOutsideClick: false,
        // });
        // // this is stored in a global service so it can be used to close later
        // this.activeQuickActionOverlay.setActiveId(overlayId);

        // this.overlayService.onOpened.pipe(
        //     takeWhile(_ => this.alive),
        //     filter((event: any) => event.componentRef && event.componentRef.instance && event.componentRef.instance.edit),
        // )
        //     .subscribe(($event: OverlayEventArgs) => {
        //         // @ts-ignore
        //         $event.componentRef.instance.edit.pipe(
        //             takeWhile(_ => this.alive),
        //         )
        //             .subscribe($editEvent => {
        //                 const clone = Object.assign({}, $editEvent);
        //                 // console.log('cloned event ', clone);
        //                 this.overlayService.hide(overlayId);
        //                 this.router.navigate(['contacts', clone.DocId]);
        //             })
        //     });
    }

    private handleNewMail() {
        // Old Overlay Version
        // const overlayId = this.overlayService.show(CreateQuickMailComponent, {
        //     positionStrategy: this.quickActionPositionStrategy,
        //     closeOnOutsideClick: false,
        // });
        // // this is stored in a global service so it can be used to close later
        // this.activeQuickActionOverlay.setActiveId(overlayId);

        // this.overlayService.onOpened.pipe(
        //     takeWhile(_ => this.alive),
        //     filter(event => !!(event.componentRef && event.componentRef.instance)),
        // )
        //     .subscribe(($event: OverlayEventArgs) => {
        //     });

        // MAT Dialog Version
        const dialogRef = this.dialog.open(CreateQuickMailComponent,
            {
                disableClose: true, position: {
                    top: '0px',
                    right: '0px'
                },
                panelClass: 'inner-no-pad-dialog',
                autoFocus: false
            })
 
        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will Exit without Saving');
                this.dialogRef.close()
            } else {
            }
        });
    }
}
