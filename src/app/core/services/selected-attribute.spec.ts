import { TestBed } from '@angular/core/testing';
import { SelectedAttribute } from './selected-attribute';

describe('SelectedAttribute', () => {
  let service: SelectedAttribute;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedAttribute);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
