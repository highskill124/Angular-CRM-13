import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFarmOwnerComponent } from './modal-add-farm-owner.component';

describe('ModalAddPhoneNumberComponent', () => {
  let component: ModalAddFarmOwnerComponent;
  let fixture: ComponentFixture<ModalAddFarmOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddFarmOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddFarmOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
