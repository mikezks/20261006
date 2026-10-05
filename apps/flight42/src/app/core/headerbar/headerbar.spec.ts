import { TestBed } from '@angular/core/testing';
import { Headerbar } from './headerbar';

describe('Paper Dashboard headerbar', () => {
  it('toggles the reference body class and exposes its state, then closes with Escape', async () => {
    const fixture = TestBed.createComponent(Headerbar);
    await fixture.whenStable();
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '[aria-controls="app-sidebar"]',
    );
    buttons[0].click();
    await fixture.whenStable();
    expect(document.body.classList.contains('nav-open')).toBe(true);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(document.body.classList.contains('nav-open')).toBe(false);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('removes the global navigation state when destroyed', async () => {
    const fixture = TestBed.createComponent(Headerbar);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    await fixture.whenStable();
    expect(document.body.classList.contains('nav-open')).toBe(true);
    fixture.destroy();
    expect(document.body.classList.contains('nav-open')).toBe(false);
  });
});
