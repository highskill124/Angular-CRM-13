import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTrackingFiltersSidebarComponent } from './message-tracking-filters-sidebar.component';

describe('DivorceLeadFiltersSidebarComponent', () => {
  let component: MessageTrackingFiltersSidebarComponent;
  let fixture: ComponentFixture<MessageTrackingFiltersSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTrackingFiltersSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTrackingFiltersSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
