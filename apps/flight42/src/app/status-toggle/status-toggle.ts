import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-status-toggle',
  template: `<button
    type="button"
    class="btn"
    [attr.aria-pressed]="status()"
    (click)="status.update(toggle)"
  >
    {{ label() }}
  </button>`,
})
export class StatusToggle {
  readonly status = model(false);
  readonly label = input('Show details');
  protected readonly toggle = (value: boolean) => !value;
}
