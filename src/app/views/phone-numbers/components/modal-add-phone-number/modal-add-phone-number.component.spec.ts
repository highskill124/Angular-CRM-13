import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPhoneNumberComponent } from './modal-add-phone-number.component';

describe('ModalAddPhoneNumberComponent', () => {
  let component: ModalAddPhoneNumberComponent;
  let fixture: ComponentFixture<ModalAddPhoneNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddPhoneNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
