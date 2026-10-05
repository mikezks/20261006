import { Component } from '@angular/core';
import { FlightSearch } from './flight-search/flight-search';
import { Headerbar } from './headerbar/headerbar';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Headerbar, Sidebar, FlightSearch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
