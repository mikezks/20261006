import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { Flight, FlightFilter, initialFlightFilter } from '../model/flight';
import { httpResource } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-flight-search',
  imports: [
    FormField, FormRoot,
    DatePipe,
  ],
  styleUrl: './flight-search.scss',
  templateUrl: './flight-search.html',
})
export class FlightSearch {
  private readonly searchModel = signal({
    from: 'Hamburg',
    to: 'Graz'
  });
  protected readonly searchForm = form(this.searchModel, {
    submission: {
      action: async () => this.save()
    }
  });
  protected readonly query = signal<FlightFilter | undefined>(undefined);
  protected readonly flightResource = httpResource<Flight[]>(() => {
    const query = this.query();

    return query
      ? {
        url: 'https://demo.angulararchitects.io/api/flight',
        params: {
          ...this.query()
          // from: this.query()?.from,
          // to: this.query()?.to,
        }
      }
      : undefined;
  }, { defaultValue: [] });

  save(): void {
    this.query.set(this.searchModel());
    console.log(this.searchModel());
  }
}
