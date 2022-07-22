import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddConnectionComponent } from './modal-add-connection.component';

describe('ModalAddPhoneNumberComponent', () => {
  let component: ModalAddConnectionComponent;
  let fixture: ComponentFixture<ModalAddConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
