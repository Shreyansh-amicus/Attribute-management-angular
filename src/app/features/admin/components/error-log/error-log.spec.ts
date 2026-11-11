import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorLog } from './error-log';

describe('ErrorLog', () => {
  let component: ErrorLog;
  let fixture: ComponentFixture<ErrorLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorLog],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
