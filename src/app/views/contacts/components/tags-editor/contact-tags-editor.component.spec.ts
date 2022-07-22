import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTagsEditorComponent } from './contact-tags-editor.component';

describe('ContactBucketsEditorComponent', () => {
  let component: ContactTagsEditorComponent;
  let fixture: ComponentFixture<ContactTagsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactTagsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTagsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
