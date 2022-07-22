import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuickContactComponent } from './create-quick-contact.component';

describe('CreateQuickMailComponent', () => {
  let component: CreateQuickContactComponent;
  let fixture: ComponentFixture<CreateQuickContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuickContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuickContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
