import { firstValueFrom } from 'rxjs';
import { flightSchema } from '../../../shared/validation/flight-schema';
import { ValidationErrors } from '../../../shared/validation-errors/validation-errors';
import { Component, inject, model, output, signal } from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { Flight, initialFlight } from '../../model/flight';
import { FlightService } from '../../data-access/flight-service';

@Component({
  selector: 'app-flight-edit',
  imports: [FormField, FormRoot, ValidationErrors],
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
