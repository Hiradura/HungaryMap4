import { TestBed } from '@angular/core/testing';
import { LoggedInGuard, LoggedUserGuard } from './logged-user.guard'; 

describe('LoggedInGuard', () => {
  let guard: LoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

describe('LoggedUserGuard', () => {
  let guard: LoggedUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
