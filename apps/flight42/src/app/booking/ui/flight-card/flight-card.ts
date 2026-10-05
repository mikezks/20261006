import { DatePipe } from '@angular/common';
import { CityPipe } from '../../../shared/pipes/city-pipe';
import { StatusColorPipe } from '../../../shared/pipes/status-color-pipe';
import { Component, input, model, output, signal } from '@angular/core';
import { Flight } from '../../model/flight';
import { StatusToggle } from '../status-toggle/status-toggle';

@Component({
  selector: 'app-flight-card',
  imports: [StatusToggle, DatePipe, CityPipe, StatusColorPipe],
  templateUrl: './flight-card.html',
  styleUrl: './flight-card.scss',
})
export class FlightCard {
  readonly item = input.required<Flight>();
  readonly selected = model(false);
  readonly editTrigger = output<Flight>();
  readonly delayTrigger = output<Flight>();
  protected readonly showDetails = signal(true);

  protected toggleSelection(): void {
    this.selected.update((selected) => !selected);
  }
}
