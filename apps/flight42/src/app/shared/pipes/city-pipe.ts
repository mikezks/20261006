import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'city' })
export class CityPipe implements PipeTransform {
  private readonly names: Record<string, string> = {
    Graz: 'Graz (GRZ)',
    Hamburg: 'Hamburg (HAM)',
    London: 'London (LHR)',
    Paris: 'Paris (CDG)',
  };

  transform(value: string): string {
    return this.names[value] ?? value;
  }
}
