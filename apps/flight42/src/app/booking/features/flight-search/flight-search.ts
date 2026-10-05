import { FormField, FormRoot, form } from '@angular/forms/signals';
import { MatDialog } from '@angular/material/dialog';
import { FlightEditDialog } from '../../ui/flight-edit-dialog/flight-edit-dialog';
import { StatusFilterPipe } from '../../../shared/pipes/status-filter-pipe';
import { FlightCard } from '../../ui/flight-card/flight-card';
import { FlightService } from '../../data-access/flight-service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Flight, FlightFilter } from '../../model/flight';

@Component({
  selector: 'app-flight-search',
  imports: [FlightCard, StatusFilterPipe, FormField, FormRoot],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.scss',
})
export class FlightSearch {
  protected readonly searchModel = signal({ from: 'Hamburg', to: 'Graz' });
  protected readonly searchForm = form(this.searchModel, {
    submission: { action: async () => this.search() },
  });
  protected readonly query = signal<FlightFilter | undefined>(undefined);
  protected readonly filterModel = signal({ onlyDelayed: false });
  protected readonly filterForm = form(this.filterModel);
  protected readonly basket = signal<Record<number, boolean>>({});
  protected readonly flightRoute = computed(
    () => `From ${this.searchModel().from} to ${this.searchModel().to}.`,
  );
  protected readonly selectedCount = computed(
    () => Object.values(this.basket()).filter(Boolean).length,
  );

  private readonly dialog = inject(MatDialog);
  private readonly flightService = inject(FlightService);
  protected readonly flightsResource = this.flightService.createSearchResource(this.query);

  protected search(): void {
    const from = this.searchModel().from.trim();
    const to = this.searchModel().to.trim();
    if (!from || !to) return;
    this.query.set({ from, to });
  }

  constructor() {
    // Component effects run during Angular synchronization; use them for side effects.
    effect(() => console.log(this.flightRoute()));
  }

  protected edit(flight: Flight): void {
    this.dialog
      .open<FlightEditDialog, Flight, Flight>(FlightEditDialog, {
        data: flight,
        width: '540px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) this.flightsResource.reload();
      });
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
}
