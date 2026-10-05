import { firstValueFrom } from 'rxjs';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { FlightCard } from '../flight-card/flight-card';
import { FlightService } from './flight-service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Flight, FlightFilter, initialFlight } from '../model/flight';

@Component({
  selector: 'app-flight-search',
  imports: [FlightCard, FormField, FormRoot],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.scss',
})
export class FlightSearch {
  protected readonly searchModel = signal({ from: 'Hamburg', to: 'Graz' });
  protected readonly searchForm = form(this.searchModel, {
    submission: { action: async () => this.search() },
  });
  protected readonly query = signal<FlightFilter | undefined>(undefined);
  protected readonly basket = signal<Record<number, boolean>>({});
  protected readonly flightRoute = computed(
    () => `From ${this.searchModel().from} to ${this.searchModel().to}.`,
  );
  protected readonly selectedCount = computed(
    () => Object.values(this.basket()).filter(Boolean).length,
  );

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

  private readonly flightService = inject(FlightService);
  protected readonly flightsResource = this.flightService.createSearchResource(this.query);

  protected search(): void {
    const from = this.searchModel().from.trim();
    const to = this.searchModel().to.trim();
    if (!from || !to || this.editForm().submitting()) return;
    this.selectedFlight.set(undefined);
    this.message.set('');
    this.saveError.set('');
    this.query.set({ from, to });
  }

  constructor() {
    // Component effects run during Angular synchronization; use them for side effects.
    effect(() => console.log(this.flightRoute()));
  }

  protected updateBasket(id: number, selected: boolean): void {
    this.basket.update((basket) => ({ ...basket, [id]: selected }));
  }

  protected delay(flight: Flight): void {
    if (!this.flightsResource.hasValue()) return;
    const date = new Date(new Date(flight.date).getTime() + 5 * 60 * 1000).toISOString();
    this.flightsResource.value.update((flights) =>
      flights.map((item) => (item.id === flight.id ? { ...item, date, delayed: true } : item)),
    );
  }

  protected edit(flight: Flight): void {
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
      const saved = await firstValueFrom(this.flightService.save(this.draft()));
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
