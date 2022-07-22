import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddEmailExistingContactComponent } from './form-add-email-existing-contact.component';

describe('FormAddEmailExistingContactComponent', () => {
  let component: FormAddEmailExistingContactComponent;
  let fixture: ComponentFixture<FormAddEmailExistingContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddEmailExistingContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddEmailExistingContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
