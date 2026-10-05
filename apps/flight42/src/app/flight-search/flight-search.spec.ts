import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FlightSearch } from './flight-search';

describe('FlightSearch', () => {
  it('creates the component', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    const fixture = TestBed.createComponent(FlightSearch);

    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
