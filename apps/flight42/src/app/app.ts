import { Component } from '@angular/core';
import { FlightSearch } from './booking/features/flight-search/flight-search';
import { Headerbar } from './core/headerbar/headerbar';
import { Sidebar } from './core/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Headerbar, Sidebar, FlightSearch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
