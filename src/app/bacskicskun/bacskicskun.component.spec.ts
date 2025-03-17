import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacskicskunComponent } from './bacskicskun.component';

describe('BacskicskunComponent', () => {
  let component: BacskicskunComponent;
  let fixture: ComponentFixture<BacskicskunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BacskicskunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacskicskunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
