import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusColor' })
export class StatusColorPipe implements PipeTransform {
  transform(delayed: boolean): string {
    return delayed ? '#9e1b14' : '#176133';
  }
}
