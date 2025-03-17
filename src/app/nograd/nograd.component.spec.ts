import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NogradComponent } from './nograd.component';

describe('NogradComponent', () => {
  let component: NogradComponent;
  let fixture: ComponentFixture<NogradComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NogradComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NogradComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
