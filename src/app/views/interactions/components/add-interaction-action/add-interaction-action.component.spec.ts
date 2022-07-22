import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInteractionActionComponent } from './add-interaction-action.component';

describe('ActionAddEmailComponent', () => {
  let component: AddInteractionActionComponent;
  let fixture: ComponentFixture<AddInteractionActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInteractionActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInteractionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
