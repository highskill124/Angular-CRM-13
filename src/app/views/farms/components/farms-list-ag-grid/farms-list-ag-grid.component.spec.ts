import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeadListsComponent } from '../../../leads/components/lead-lists/lead-lists.component';



describe('IgGridTestComponent', () => {
  let component: LeadListsComponent;
  let fixture: ComponentFixture<LeadListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
