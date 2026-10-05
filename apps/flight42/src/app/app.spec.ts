import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('Workshop shell', () => {
  it('provides the workshop heading and a main landmark', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h1')?.textContent).toContain('Hello World!');
    expect(element.querySelector('[role=main]')).not.toBeNull();
  });
});
