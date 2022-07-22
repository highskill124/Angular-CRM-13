import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddEmailNewContactComponent } from './form-add-email-new-contact.component';

describe('FormAddEmailNewContactComponent', () => {
  let component: FormAddEmailNewContactComponent;
  let fixture: ComponentFixture<FormAddEmailNewContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddEmailNewContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddEmailNewContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
