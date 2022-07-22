import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeadComponent } from './edit-lead.component';

describe('EditMailComponent', () => {
  let component: EditLeadComponent;
  let fixture: ComponentFixture<EditLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
