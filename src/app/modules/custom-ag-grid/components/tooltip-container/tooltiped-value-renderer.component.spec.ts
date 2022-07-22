import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipedValueRendererComponent } from './tooltiped-value-renderer.component';

describe('MultiSelectItemRendererComponent', () => {
  let component: TooltipedValueRendererComponent;
  let fixture: ComponentFixture<TooltipedValueRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipedValueRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipedValueRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
