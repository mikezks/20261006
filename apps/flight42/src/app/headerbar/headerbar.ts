import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.html',
  styleUrl: './headerbar.scss',
  host: { '(document:keydown.escape)': 'closeSidebar()' },
})
export class Headerbar {
  private readonly document = inject(DOCUMENT);
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');
  protected readonly sidebarVisible = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.document.body.classList.remove('nav-open'));
  }

  protected toggleSidebar(): void {
    this.sidebarVisible.update(visible => !visible);
    this.document.body.classList.toggle('nav-open', this.sidebarVisible());
  }

  protected closeSidebar(): void {
    if (!this.sidebarVisible()) return;
    this.sidebarVisible.set(false);
    this.document.body.classList.remove('nav-open');
    this.menuToggle()?.nativeElement.focus();
  }
}
