import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeCard } from './attribute-card';

describe('AttributeCard', () => {
  let component: AttributeCard;
  let fixture: ComponentFixture<AttributeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
