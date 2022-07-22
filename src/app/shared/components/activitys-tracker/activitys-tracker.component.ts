import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../../models/user';
import {ActivityService} from '../../../services/activitys.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-activitys-tracker',
  templateUrl: './activitys-tracker.component.html',
  styleUrls: ['./activitys-tracker.component.scss']
})


export class ActivitysTrackerComponent implements OnInit {

data$: Observable<any>;
@Input() gridtitle: string
@Input() interval: string = 'W' // either d,w,m
@Input() date: string = formatDate(new Date(), 'yyyy-MM-dd', 'en-US') // should be by default current date
@Input() userid: string  = this.authService.getStoredUser().guid // should be by default loged in userid
  constructor(  public activityService: ActivityService,
                private authService: AuthService,
    ) {
    
  }

  ngOnInit() {

    this.data$ =  this.activityService.getActivitys(this.interval, this.userid, this.date)
    
    

  }

  reloadData(){
    this.data$ =  this.activityService.getActivitys(this.interval, this.userid, this.date)
  }


}