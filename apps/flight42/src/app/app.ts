import { Component } from '@angular/core';
import { Headerbar } from './headerbar/headerbar';
import { Sidebar } from './sidebar/sidebar';
import { FlightSearch } from './flight-search/flight-search';

@Component({
  selector: 'app-root',
  imports: [
    Headerbar, Sidebar,
    FlightSearch
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
