import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDVisualizationComponent } from './three-d-visualization.component';

describe('ThreeDVisualizationComponent', () => {
  let component: ThreeDVisualizationComponent;
  let fixture: ComponentFixture<ThreeDVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreeDVisualizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreeDVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
