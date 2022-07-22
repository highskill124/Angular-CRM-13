import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFollowupComponent } from './modal-add-followup.component';

describe('ModalAddPhoneNumberComponent', () => {
  let component: ModalAddFollowupComponent;
  let fixture: ComponentFixture<ModalAddFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
