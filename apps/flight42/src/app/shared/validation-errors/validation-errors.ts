import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-validation-errors',
  template: `@for (error of errors(); track $index) {
    <p class="field-error">{{ error.message }}</p>
  }`,
})
export class ValidationErrors {
  readonly errors = input<readonly ValidationError[]>([]);
}
