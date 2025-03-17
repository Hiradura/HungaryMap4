import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelCityComponent } from './side-panel-city.component';

describe('SidePanelCityComponent', () => {
  let component: SidePanelCityComponent;
  let fixture: ComponentFixture<SidePanelCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidePanelCityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePanelCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
