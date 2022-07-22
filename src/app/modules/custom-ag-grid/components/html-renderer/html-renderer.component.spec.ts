import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlRendererComponent } from './html-renderer.component';

describe('InteractionMethodIconRendererComponent', () => {
  let component: HtmlRendererComponent;
  let fixture: ComponentFixture<HtmlRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
