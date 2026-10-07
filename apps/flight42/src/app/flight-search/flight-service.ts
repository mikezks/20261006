import { ResourceRef, Service, Signal } from '@angular/core';
import { Flight, FlightFilter } from '../model/flight';
import { httpResource } from '@angular/common/http';

@Service()
export class FlightService {
  createFlightResource(
    query: Signal<FlightFilter | undefined>
  ): ResourceRef<Flight[]> {
    return httpResource<Flight[]>(() => query()
      ? { url: 'https://demo.angulararchitects.io/api/flight', params: { ...query() } }
      : undefined
    , { defaultValue: [] });
  }
}
