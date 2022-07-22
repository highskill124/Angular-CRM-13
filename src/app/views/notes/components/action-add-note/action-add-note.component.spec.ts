import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAddNoteComponent } from './action-add-note.component';

describe('ActionAddEmailComponent', () => {
  let component: ActionAddNoteComponent;
  let fixture: ComponentFixture<ActionAddNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAddNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAddNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
