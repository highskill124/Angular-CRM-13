import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAddPhoneNumberComponent } from './action-add-phone-number.component';

describe('ActionAddEmailComponent', () => {
  let component: ActionAddPhoneNumberComponent;
  let fixture: ComponentFixture<ActionAddPhoneNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAddPhoneNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAddPhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
