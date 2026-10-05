import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('Workshop shell', () => {
  it('renders the introductory flight search inside the original shell', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h2')?.textContent).toContain('Flight Search');
    expect(element.querySelector('[role=main]')).not.toBeNull();
  });
});
