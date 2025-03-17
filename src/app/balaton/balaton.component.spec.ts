import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalatonComponent } from './balaton.component';

describe('BalatonComponent', () => {
  let component: BalatonComponent;
  let fixture: ComponentFixture<BalatonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BalatonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalatonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
