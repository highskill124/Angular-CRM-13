import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeadComponent } from './create-lead.component';

describe('DocUploadComponent', () => {
  let component: CreateLeadComponent;
  let fixture: ComponentFixture<CreateLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
