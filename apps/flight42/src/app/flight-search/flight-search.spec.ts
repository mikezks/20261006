import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { FlightSearch } from './flight-search';

describe('Flight search', () => {
  let http: HttpTestingController;
  const flight = {
    id: 22,
    from: 'Hamburg',
    to: 'Graz',
    date: '2026-10-05T10:00:00Z',
    delayed: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function search() {
    const fixture = TestBed.createComponent(FlightSearch);
    (fixture.nativeElement as HTMLElement).setAttribute('data-testid', 'intro-search');
    await fixture.whenStable();
    const screen = page.getByTestId('intro-search');
    await screen.getByRole('button', { name: 'Search', exact: true }).click();
    const request = await vi.waitFor(() => http.expectOne(req => req.method === 'GET'));
    request.flush([{ ...flight }]);
    await fixture.whenStable();
    return { fixture, screen };
  }

  it('submits edited search fields with Enter without a page reload', async () => {
    const fixture = TestBed.createComponent(FlightSearch);
    (fixture.nativeElement as HTMLElement).setAttribute('data-testid', 'intro-search');
    await fixture.whenStable();
    const screen = page.getByTestId('intro-search');
    await screen.getByLabelText('From:', { exact: true }).fill('Vienna');
    await screen.getByLabelText('To:', { exact: true }).fill('Paris');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('table')).toBeNull();
    http.expectNone(() => true);
    const searchForm = (fixture.nativeElement as HTMLElement).querySelector<HTMLFormElement>(
      'form[aria-label="Flight Search"]',
    )!;
    let prevented = false;
    searchForm.addEventListener('submit', event => {
      prevented = event.defaultPrevented;
    });
    await userEvent.keyboard('{Enter}');
    const request = await vi.waitFor(() => http.expectOne(req => req.method === 'GET'));
    expect(request.request.params.get('from')).toBe('Vienna');
    expect(request.request.params.get('to')).toBe('Paris');
    expect(prevented).toBe(true);
    expect(searchForm.noValidate).toBe(true);
    request.flush([]);
    await fixture.whenStable();
  });

  it('edits a copy and discards unsaved changes when deselected', async () => {
    const { fixture, screen } = await search();
    await screen.getByRole('button', { name: 'select', exact: true }).click();
    const editor = screen.getByRole('form', { name: 'Flight Edit' });
    await editor.getByLabelText('From:', { exact: true }).fill('Vienna');
    await editor.getByLabelText('Delayed', { exact: true }).click();
    await fixture.whenStable();
    await expect.element(screen.getByRole('cell', { name: 'Hamburg', exact: true })).toBeVisible();
    http.expectNone(() => true);
    await screen.getByRole('button', { name: 'remove', exact: true }).click();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        'form[aria-labelledby="flight-edit-title"]',
      ),
    ).toBeNull();
    await screen.getByRole('button', { name: 'select', exact: true }).click();
    await expect.element(editor.getByLabelText('From:', { exact: true })).toHaveValue('Hamburg');
    await expect.element(editor.getByLabelText('Delayed', { exact: true })).not.toBeChecked();
  });

  it('posts the draft once and updates the table only after the server response', async () => {
    const { fixture, screen } = await search();
    await screen.getByRole('button', { name: 'select', exact: true }).click();
    const editor = screen.getByRole('form', { name: 'Flight Edit' });
    await editor.getByLabelText('From:', { exact: true }).fill('Vienna');
    await editor.getByRole('button', { name: 'Save', exact: true }).click();
    const request = await vi.waitFor(() => http.expectOne(req => req.method === 'POST'));
    expect(request.request.url).toBe('https://demo.angulararchitects.io/api/flight');
    expect(request.request.body).toEqual({ ...flight, from: 'Vienna' });
    const repeatedSubmit = new Event('submit', { bubbles: true, cancelable: true });
    (fixture.nativeElement as HTMLElement)
      .querySelector('form[aria-labelledby="flight-edit-title"]')!
      .dispatchEvent(repeatedSubmit);
    expect(repeatedSubmit.defaultPrevented).toBe(true);
    http.expectNone(req => req.method === 'POST');
    await expect.element(editor.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    await expect
      .element(screen.getByRole('button', { name: 'Search', exact: true }))
      .toBeDisabled();
    await expect
      .element(screen.getByRole('button', { name: 'remove', exact: true }))
      .toBeDisabled();
    await expect.element(screen.getByRole('cell', { name: 'Hamburg', exact: true })).toBeVisible();
    const saved = { ...flight, from: 'Vienna', date: '2026-10-06T12:00:00Z' };
    request.flush(saved);
    await fixture.whenStable();
    await expect.element(screen.getByRole('cell', { name: 'Vienna', exact: true })).toBeVisible();
    await expect.element(editor.getByLabelText('Date:', { exact: true })).toHaveValue(saved.date);
    await expect.element(screen.getByRole('status')).toHaveTextContent('Update successful!');
    await expect.element(editor.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
  });

  it('preserves the draft and original table after a failed save, then permits retry', async () => {
    const { fixture, screen } = await search();
    await screen.getByRole('button', { name: 'select', exact: true }).click();
    const editor = screen.getByRole('form', { name: 'Flight Edit' });
    await editor.getByLabelText('To:', { exact: true }).fill('Paris');
    await editor.getByRole('button', { name: 'Save', exact: true }).click();
    (await vi.waitFor(() => http.expectOne(req => req.method === 'POST'))).flush('Unavailable', {
      status: 503,
      statusText: 'Unavailable',
    });
    await fixture.whenStable();
    await expect
      .element(screen.getByRole('alert'))
      .toHaveTextContent('Error updating the flight. Please try again.');
    await expect.element(editor.getByLabelText('To:', { exact: true })).toHaveValue('Paris');
    await expect.element(screen.getByRole('cell', { name: 'Graz', exact: true })).toBeVisible();
    await editor.getByRole('button', { name: 'Save', exact: true }).click();
    const retry = await vi.waitFor(() => http.expectOne(req => req.method === 'POST'));
    expect(retry.request.body).toEqual({ ...flight, to: 'Paris' });
    retry.flush({ ...flight, to: 'Paris' });
    await fixture.whenStable();
    await expect.element(screen.getByRole('cell', { name: 'Paris', exact: true })).toBeVisible();
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')).toBeNull();
  });
});
