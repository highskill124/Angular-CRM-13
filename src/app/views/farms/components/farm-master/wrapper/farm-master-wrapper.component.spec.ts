import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFarmCampaignComponent } from './edit-lead.component';

describe('EditMailComponent', () => {
  let component: EditFarmCampaignComponent;
  let fixture: ComponentFixture<EditFarmCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFarmCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFarmCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
