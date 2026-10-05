import { Pipe, PipeTransform } from '@angular/core';
import { Flight } from '../../model/flight';

@Pipe({ name: 'statusFilter' })
export class StatusFilterPipe implements PipeTransform {
  transform(flights: Flight[], onlyDelayed: boolean): Flight[] {
    return onlyDelayed ? flights.filter((flight) => flight.delayed) : flights;
  }
}
