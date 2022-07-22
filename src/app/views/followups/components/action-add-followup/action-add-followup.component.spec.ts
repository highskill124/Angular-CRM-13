import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAddFollowupComponent } from './action-add-followup.component';

describe('ActionAddEmailComponent', () => {
  let component: ActionAddFollowupComponent;
  let fixture: ComponentFixture<ActionAddFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAddFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAddFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
