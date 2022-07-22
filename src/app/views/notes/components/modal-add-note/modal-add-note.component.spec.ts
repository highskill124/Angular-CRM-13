import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddNoteComponent } from './modal-add-note.component';

describe('ModalAddPhoneNumberComponent', () => {
  let component: ModalAddNoteComponent;
  let fixture: ComponentFixture<ModalAddNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
