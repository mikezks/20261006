import { firstValueFrom } from 'rxjs';
import { Component, inject, model, output, signal } from '@angular/core';
import { FormField, FormRoot, form, minLength, required, schema } from '@angular/forms/signals';
import { Flight, initialFlight } from '../model/flight';
import { FlightService } from '../flight-search/flight-service';

export const flightSchema = schema<Flight>((path) => {
  required(path.from, { message: 'Enter a departure city.' });
  minLength(path.from, 3, { message: 'Use at least three characters.' });
  required(path.to, { message: 'Enter a destination.' });
  required(path.date, { message: 'Enter an ISO date and time.' });
});

@Component({
  selector: 'app-flight-edit',
  imports: [FormField, FormRoot],
  templateUrl: './flight-edit.html',
  styleUrl: './flight-edit.scss',
})
export class FlightEdit {
  private readonly flightService = inject(FlightService);
  readonly flight = model<Flight>({ ...initialFlight });
  readonly saved = output<Flight>();
  readonly cancelled = output<void>();
  protected readonly editForm = form(this.flight, flightSchema, {
    submission: {
      ignoreValidators: 'none',
      action: () => this.save(),
    },
  });
  protected readonly saveError = signal('');

  protected async save(): Promise<void> {
    this.saveError.set('');
    try {
      const saved = await firstValueFrom(this.flightService.save(this.flight()));
      this.saved.emit(saved);
    } catch {
      this.saveError.set('The flight could not be saved. Please try again.');
    }
  }
}
