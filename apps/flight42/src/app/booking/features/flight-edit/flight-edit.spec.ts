import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FlightEdit } from './flight-edit';

describe('FlightEdit', () => {
  it('creates the component', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    const fixture = TestBed.createComponent(FlightEdit);

    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
