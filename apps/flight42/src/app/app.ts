import { Component } from '@angular/core';
import { Headerbar } from './headerbar/headerbar';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Headerbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
