import { Component } from '@angular/core';
import { Flight } from '../model/flight';

@Component({
  imports: [],
  selector: 'app-flight-search',
  styleUrl: './flight-search.scss',
  templateUrl: './flight-search.html',
})
export class FlightSearch {
  flights: Flight[] = [];

  setFlight(flight: Flight): void {
    this.flights = this.flights.map(
      currFlight => flight.id === currFlight.id
        ? flight
        : currFlight
    );
  }
}
