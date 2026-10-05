import { minLength, required, schema, SchemaPath, validate } from '@angular/forms/signals';
import { Flight } from '../../booking/model/flight';

export function validateCity(path: SchemaPath<string>, cities: readonly string[]): void {
  validate(path, ({ value }) =>
    !value() || cities.includes(value().trim())
      ? undefined
      : { kind: 'city', message: `Use one of: ${cities.join(', ')}.` },
  );
}

export const flightSchema = schema<Flight>((path) => {
  required(path.from, { message: 'Enter a departure city.' });
  minLength(path.from, 3, { message: 'Use at least three characters.' });
  required(path.to, { message: 'Enter a destination.' });
  required(path.date, { message: 'Enter an ISO date and time.' });
  const cities = ['Graz', 'Hamburg', 'Vienna', 'Berlin', 'London', 'Paris'];
  validateCity(path.from, cities);
  validateCity(path.to, cities);
  validate(path.to, ({ value, valueOf }) =>
    value().trim() && value().trim() === valueOf(path.from).trim()
      ? { kind: 'roundTrip', message: 'Departure and destination must differ.' }
      : undefined,
  );
  validate(path.date, ({ value }) =>
    value() && !Number.isFinite(Date.parse(value()))
      ? { kind: 'date', message: 'Enter a valid ISO date, for example 2026-10-05T10:00:00Z.' }
      : undefined,
  );
});
