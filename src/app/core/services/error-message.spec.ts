import { TestBed } from '@angular/core/testing';
import { ErrorMessage } from './error-message';

describe('ErrorMessage', () => {
  let service: ErrorMessage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMessage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
