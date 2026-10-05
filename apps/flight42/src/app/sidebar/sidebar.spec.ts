import { TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  it('keeps the Essentials navigation in the reference sidebar structure', async () => {
    const fixture = TestBed.createComponent(Sidebar);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(Array.from(element.querySelectorAll('.nav p'), p => p.textContent?.trim())).toEqual([
      'Home',
      'Flights',
      'Passengers',
    ]);
    expect(element.querySelectorAll('.nav .icon')).toHaveLength(3);
    expect(element.querySelector('img')?.getAttribute('alt')).toBe('Angular Logo');
  });
});
