import { Component, signal } from '@angular/core';
import { Flight, initialFlight } from '../model/flight';

function getPerson(): { firstname: string } {
  return { firstname: 'Mary' };
}

const getPassenger = () => { firstname: 'Mary' };


@Component({
  imports: [],
  selector: 'app-flight-search',
  styleUrl: './flight-search.scss',
  templateUrl: './flight-search.html',
})
export class FlightSearch {
  fluege: Flight[];
  flights = signal<Flight[]>([]);
  ages = signal<number[]>([]);

  constructor() {
    this.fluege = [];
    this.flights = signal<Flight[]>([]);
    this.flights.set([initialFlight]);
    setTimeout(
      () => this.flights = signal([])
    , 1_000);
  }

  setFlight(flight: Flight): void {

    const flights = this.flights();
    // Immutable State Update
    const newFlightsArr = flights.map(
      currFlight => {
        if (flight.id === currFlight.id) {
          return flight;
        }
        return currFlight;
      }
    );

    this.flights.set(newFlightsArr);

    /* this.flights.set(
      this.flights().map(
        currFlight => flight.id === currFlight.id
          ? flight
          : currFlight
      )
    ); */
  }
}
