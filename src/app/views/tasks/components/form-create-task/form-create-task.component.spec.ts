import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFarmCampaignComponent } from './create-lead.component';

describe('DocUploadComponent', () => {
  let component: CreateFarmCampaignComponent;
  let fixture: ComponentFixture<CreateFarmCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFarmCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFarmCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
