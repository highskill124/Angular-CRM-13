import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectItemEditorComponent } from './multi-select-item-editor.component';

describe('MultiSelectItemEditorComponent', () => {
  let component: MultiSelectItemEditorComponent;
  let fixture: ComponentFixture<MultiSelectItemEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectItemEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
