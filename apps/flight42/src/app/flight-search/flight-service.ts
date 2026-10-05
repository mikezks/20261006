import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight, FlightFilter } from '../model/flight';
import { ConfigService } from '../shared/config-service';

@Service()
export class FlightService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // Call this factory in a component's field initializer (an injection context).
  createSearchResource(query: Signal<FlightFilter | undefined>) {
    return httpResource<Flight[]>(
      () => {
        const filter = query();
        return filter ? { url: `${this.config.baseUrl}/flight`, params: { ...filter } } : undefined;
      },
      { defaultValue: [] },
    );
  }

  save(flight: Flight): Observable<Flight> {
    // The workshop API uses POST for both new and existing flights.
    return this.http.post<Flight>(`${this.config.baseUrl}/flight`, flight);
  }
}
