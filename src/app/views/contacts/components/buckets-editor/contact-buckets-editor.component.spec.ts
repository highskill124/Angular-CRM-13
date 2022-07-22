import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactBucketsEditorComponent } from './contact-buckets-editor.component';

describe('ContactBucketsEditorComponent', () => {
  let component: ContactBucketsEditorComponent;
  let fixture: ComponentFixture<ContactBucketsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactBucketsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactBucketsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
