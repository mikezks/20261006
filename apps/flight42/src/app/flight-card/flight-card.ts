import { Component, input, model, output } from '@angular/core';
import { Flight, initialFlight } from '../model/flight';
import { DatePipe } from '@angular/common';

@Component({
  imports: [
    DatePipe
  ],
  selector: 'app-flight-card',
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">
          {{ item().from + ' - ' + item().to }}
        </h2>
      </div>

      <div class="card-body">
        <p>ID: {{ item().id }}</p>
        <p>Date: {{ item().date | date:'dd.MM.yyyy HH:mm' }}</p>
        <p>Delayed: {{ item().delayed }}</p>
        <button class="btn btn-default">{{ selected() ? 'Remove' : 'Select' }}</button>
        <button (click)="delay()" class="btn btn-default">Delay</button>
      </div>
    </div>
  `
})
export class FlightCard {
  // readonly item = input.required<Flight>();
  // readonly itemChange = output<Flight>();
  readonly item = model.required<Flight>();
  readonly selected = input(false);

  protected delay() {
    const currFlight = this.item();
    const currDate = new Date(currFlight.date);
    // 5 min delay
    const newTimestamp = currDate.getTime() + 1000 * 60 * 5
    const newDate = new Date(newTimestamp);
    const newFlight = {
      ...currFlight,
      date: newDate.toISOString()
    };

    // this.itemChange.emit(newFlight);
    this.item.set(newFlight);
  }
}
