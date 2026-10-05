import { SchemaPath, validateHttp } from '@angular/forms/signals';
import { Flight } from '../../booking/model/flight';

// Bonus: call inside flightSchema for the departure field.
export function validateServedCity(path: SchemaPath<string>, baseUrl: string): void {
  validateHttp<string, Flight[]>(path, {
    request: ({ value }) =>
      value().trim() ? { url: `${baseUrl}/flight`, params: { from: value().trim() } } : undefined,
    debounce: 300,
    onSuccess: (flights) =>
      flights.length
        ? undefined
        : { kind: 'notServed', message: 'No flights depart from this city.' },
    onError: () => ({
      kind: 'cityLookup',
      message: 'City validation is unavailable. Try again later.',
    }),
  });
}
