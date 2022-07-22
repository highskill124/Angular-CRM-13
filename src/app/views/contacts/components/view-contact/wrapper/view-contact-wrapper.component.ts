import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {map, takeWhile,mergeMap,take, tap} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {IMainContact} from '../../../../../models/contact';
import {ContactsService} from '../../../../../services/contacts/contacts.service';
import {Base64Service} from '../../../../../services/base64.service';
import {PreviousRouteService} from '../../../../../services/url.service';
import {Observable} from 'rxjs';
import { AppPdfViewerComponent } from '../../../../../modules/pdf-viewer/pdf-viewer.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'app-view-contact-wrapper',
    templateUrl: './view-contact-wrapper.component.html',
    styleUrls: ['./view-contact-wrapper.component.scss'],
})
export class ViewContactWrapperComponent implements OnInit, OnDestroy {

    contact: IMainContact;
    private state$: Observable<object>;
    alive = true;

    constructor(
        protected route: ActivatedRoute,
        private dialog: MatDialog,
        private contactsService: ContactsService,
        private location: Location,
        private toasterService: ToasterService,
        private base64Service: Base64Service,
        private router: Router,
        private previousRouteService : PreviousRouteService
    ) {
    }

    ngOnInit() {
        this.contact = this.route.snapshot.data.contactResponse && this.route.snapshot.data.contactResponse.Data;

        this.state$ = this.route.paramMap.pipe(
            map(() => window.history.state)
        );

        console.log("Page was called from : " + this.previousRouteService.getPreviousUrl())

    }

    goBack() {
      console.log('Will Route back to : ' + this.previousRouteService.getPreviousUrl())
        
        this.state$
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe(state => {
                this.router.navigateByUrl(this.previousRouteService.getPreviousUrl(), {state});
            });
    }

    deleteContact(DocId) {
        if (confirm('Delete contact?')) {
            this.contactsService.delete(DocId)
                .pipe(
                    takeWhile(_ => this.alive),
                )
                .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.router.navigateByUrl('/Contacts/ContactList');
                    }
                });
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    editContact(DocId: string) {
        this.router.navigate(['/Contacts/ContactUpdate', DocId]);
    }

    printContact(DocId: string) {
        this.contactsService.print(DocId)
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                tap((res: any) => {
                    console.log(res),
                    this.displayPdfViewer(res.Data)
                    this.base64Service.convertToBlobAndDownload({
                        base64Data: res.Data,
                        contentType: res.ContentType,
                        filename: `${this.contact.first_name ? this.contact.first_name + ' ' : ''}${this.contact.middle_name ? this.contact.middle_name + ' ' : ''}${this.contact.last_name ? this.contact.last_name + ' ' : ''}`
                    })
                }),
            )
            .subscribe((res: any) => {
               
                    console.log(res);
                
            });
    }

    displayPdfViewer(data: any) {

        console.log('Show PDF Report')
  
        const dialogRef = this.dialog.open(AppPdfViewerComponent,
            {
                data: data,
                disableClose: false, width: '80%', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
            });

        dialogRef.afterClosed().subscribe(() => {
            console.log('We got an unsubscribe')
        });
    }
}
