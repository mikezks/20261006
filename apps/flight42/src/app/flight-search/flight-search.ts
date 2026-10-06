import { Component, signal } from '@angular/core';
import { Flight } from '../model/flight';


@Component({
  imports: [],
  selector: 'app-flight-search',
  styleUrl: './flight-search.scss',
  templateUrl: './flight-search.html',
})
export class FlightSearch {
  flights = signal<Flight[]>([]);

  setFlight(flight: Flight): void {
    this.flights.update(
      flights => flights.map(
        currFlight => flight.id === currFlight.id
          ? flight
          : currFlight
      )
    );
  }
}
