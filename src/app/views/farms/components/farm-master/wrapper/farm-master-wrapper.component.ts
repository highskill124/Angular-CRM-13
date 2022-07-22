import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized, NavigationEnd, UrlTree, Params} from '@angular/router';
import {map, takeWhile, mergeMap, take, tap} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {Location} from '@angular/common';
import {Base64Service} from '../../../../../services/base64.service';
import {FarmService} from '../../../../../services/farm/farm.service';
import {IFarmMaster} from '../../../../../models/farm';
import {Observable} from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import {PreviousRouteService} from '../../../../../services/url.service';

@Component({
    selector: 'app-farm-master-wrapper',
    templateUrl: './farm-master-wrapper.component.html',
    styleUrls: ['./farm-master-wrapper.component.scss'],
})
export class FarmMasterWrapperComponent implements OnInit, OnDestroy {

    farm: IFarmMaster;
    private state$: Observable<object>;
    alive = true;
    DocId : string





    constructor(
        protected route: ActivatedRoute,
        private farmService: FarmService,
        private toasterService: ToasterService,
        private base64Service: Base64Service,
        private location: Location,
        private router: Router,
        private previousRouteService: PreviousRouteService

    ) {
    }

    ngOnInit() {
        this.route.params
            .pipe(
                takeWhile(_ => this.alive),
                mergeMap((params: Params) => {
                    console.log(params);
                    return this.farmService.farmMaster(params.DocId);
                }),
            ).subscribe((res: any) => {
                console.log(res);
                this.DocId =  res._id;
                this.farm = res;
                this.farm.DocId = res.DocId
                // console.log(this.farm.Record);
            })
        this.state$ = this.route.paramMap.pipe(
            map(() => window.history.state)
        );

        console.log('Page was called from : ' + this.previousRouteService.getPreviousUrl())



    //     this.router.events
    //         .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    //         .subscribe((events: RoutesRecognized[]) => {

    //             // this.previousUrl = events[0].urlAfterRedirects;
    //             console.log('previous url', this.previousUrl);
    // })

    // this.urlService.previousUrl$.subscribe((previousUrl: string) => {
    //     console.log('previous url: ', previousUrl);
    //   });

}

    loadFarmData(DocId: string) {
        console.log('Reload Farm :' + DocId)
        this.farmService.farmMaster(DocId).subscribe((response) => {
            this.farm.Record = response.Record;
            this.farm.DocId = response.DocId
        })

    }

    goBack() {
        console.log('Will Route back to : ' + this.previousRouteService.getPreviousUrl())

        // this.location.back()

        this.state$
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe(state => {

                console.log(state)
                this.router.navigateByUrl(this.previousRouteService.getPreviousUrl(), {state});

            });
    }

    refreshFarm(DocId) {
        this.farmService.farmMaster(DocId).subscribe((response) => {
            this.farm = response;
            console.log(response);
        })
    }

    deleteFarm(DocId) {
        if (confirm('Delete farm?')) {
            this.farmService.delete(DocId)
                .pipe(
                    takeWhile(_ => this.alive),
                )
                .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.goBack();
                    }
                });
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    editFarm(DocId: string) {
        this.router.navigate(['/Farm/FarmUpdate', DocId]);
    }

    printFarm(DocId: string) {
        // this.farmService.print(DocId)
        //     .pipe(
        //         takeWhile(_ => this.alive),
        //         take(1),
        //         tap((res: any) => {
        //             this.base64Service.convertToBlobAndDownload({
        //                 base64Data: res.Data,
        //                 contentType: res.ContentType,
        //                 filename: 'test'
        //                 // filename: `${this.farm.first_name ? this.farm.first_name + ' ' : ''}${this.farm.middle_name ? this.farm.middle_name + ' ' : ''}${this.farm.last_name ? this.farm.last_name + ' ' : ''}`
        //             })
        //         }),
        //     )
        //     .subscribe( (res: any) => {
        //         if (res.Success === true) {
        //             console.log(res);
        //         }
        //     });
    }

    test(e) {
        console.log(e)
    }
}
