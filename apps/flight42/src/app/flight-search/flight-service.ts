import { inject, ResourceRef, Service, Signal } from '@angular/core';
import { Flight, FlightFilter } from '../model/flight';
import { HttpClient, httpResource } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Service()
export class FlightService {
  private readonly http = inject(HttpClient);
  private baseUrl = 'https://demo.angulararchitects.io/api';

  createFlightResource(
    query: Signal<FlightFilter | undefined>
  ): ResourceRef<Flight[]> {
    return httpResource<Flight[]>(() => query()
      ? { url: this.baseUrl + '/flight', params: { ...query() } }
      : undefined
    , { defaultValue: [] });
  }

  saveFlight(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(`${ this.baseUrl }/flight`, flight);
  }

  saveFlightAsPromise(flight: Flight): Promise<Flight> {
    return firstValueFrom(this.saveFlight(flight));
  }
}
