import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AttributeList } from './attribute-list';
import { AttributeService } from '../../../../core/services/attribute-service';
import { IAttributeModel } from '../../../../shared/models/IAttribute.model';

describe('AttributeList', () => {
  let component: AttributeList;
  let fixture: ComponentFixture<AttributeList>;
  let getAttributesPage: ReturnType<typeof vi.fn>;

  const attribute: IAttributeModel = {
    AttributeId: 1,
    AttributeName: 'Cost Center',
    BusinessUnitName: 'Finance',
    IsActive: true,
    CreatedOn: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    getAttributesPage = vi.fn().mockReturnValue(
      of({ items: [attribute], totalCount: 1 }),
    );

    await TestBed.configureTestingModule({
      imports: [AttributeList],
      providers: [
        provideRouter([]),
        {
          provide: AttributeService,
          useValue: { getAttributesPage },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the current rows visible when a refresh fails', () => {
    getAttributesPage.mockReturnValueOnce(
      throwError(() => new Error('Request failed')),
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    component.refreshAttributes();
    fixture.detectChanges();

    expect(component.tableAttributes).toEqual([attribute]);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-data-table')).toBeTruthy();

    consoleError.mockRestore();
  });
});
