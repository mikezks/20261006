import { TestBed } from '@angular/core/testing';
import { FlightCard } from './flight-card';

describe('FlightCard', () => {
  it('creates the component', async () => {
    TestBed.configureTestingModule({ providers: [] });
    const fixture = TestBed.createComponent(FlightCard);
    fixture.componentRef.setInput('item', {
      id: 1,
      from: 'Graz',
      to: 'Hamburg',
      date: '2026-10-05T10:00:00Z',
      delayed: false,
    });
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
