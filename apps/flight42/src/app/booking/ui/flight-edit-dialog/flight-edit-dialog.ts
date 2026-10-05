import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { Flight } from '../../model/flight';
import { FlightEdit } from '../../features/flight-edit/flight-edit';

@Component({
  selector: 'app-flight-edit-dialog',
  imports: [MatDialogTitle, MatDialogContent, FlightEdit],
  template: `
    <h2 mat-dialog-title>Edit flight</h2>
    <mat-dialog-content>
      <app-flight-edit
        [(flight)]="draft"
        (saved)="dialogRef.close($event)"
        (cancelled)="dialogRef.close()"
      />
    </mat-dialog-content>
  `,
})
export class FlightEditDialog {
  protected readonly dialogRef = inject(MatDialogRef<FlightEditDialog, Flight>);
  private readonly data = inject<Flight>(MAT_DIALOG_DATA);
  protected readonly draft = signal({ ...this.data });
}
