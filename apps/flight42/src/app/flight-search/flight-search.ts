import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { Flight, FlightFilter, initialFlight } from '../model/flight';
import { FlightService } from './flight-service';

@Component({
  selector: 'app-flight-search',
  imports: [DatePipe, FormField, FormRoot],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.scss',
})
export class FlightSearch {
  protected readonly searchModel = signal({ from: 'Hamburg', to: 'Graz' });
  protected readonly searchForm = form(this.searchModel, {
    submission: { action: async () => this.search() },
  });
  protected readonly query = signal<FlightFilter | undefined>(undefined);
  protected readonly selectedFlight = signal<Flight | undefined>(undefined);
  protected readonly draft = signal<Flight>({ ...initialFlight });
  protected readonly editForm = form(this.draft, {
    submission: {
      ignoreValidators: 'none',
      action: () => this.save(),
    },
  });
  protected readonly message = signal('');
  protected readonly saveError = signal('');
  private readonly http = inject(HttpClient);
  private readonly flightService = inject(FlightService);

  protected readonly flightsResource = this.flightService.createFlightResource(this.query);

  protected search(): void {
    const from = this.searchModel().from.trim();
    const to = this.searchModel().to.trim();
    if (!from || !to || this.editForm().submitting()) return;
    this.selectedFlight.set(undefined);
    this.message.set('');
    this.saveError.set('');
    this.query.set({ from, to });
  }

  protected select(flight: Flight): void {
    if (this.editForm().submitting()) return;
    const selected = this.selectedFlight()?.id === flight.id ? undefined : flight;
    this.selectedFlight.set(selected);
    // Edit a copy, so typing does not change the flight in the results table.
    this.draft.set({ ...(selected ?? initialFlight) });
    this.editForm().reset();
    this.message.set('');
    this.saveError.set('');
  }

  protected async save(): Promise<void> {
    if (!this.selectedFlight()) return;
    this.message.set('');
    this.saveError.set('');
    try {
      const saved = await firstValueFrom(
        this.http.post<Flight>('https://demo.angulararchitects.io/api/flight', this.draft()),
      );
      this.draft.set({ ...saved });
      this.selectedFlight.set(saved);
      if (this.flightsResource.hasValue()) {
        this.flightsResource.value.update((flights) =>
          flights.map((flight) => (flight.id === saved.id ? saved : flight)),
        );
      }
      this.message.set('Update successful!');
    } catch {
      this.saveError.set('Error updating the flight. Please try again.');
    }
  }
}
