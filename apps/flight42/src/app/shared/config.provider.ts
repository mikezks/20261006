import { computed, EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders, provideAppInitializer, Signal, signal, WritableSignal } from "@angular/core";
import { ConfigState, initialConfigState } from "../model/config.model";
import { HttpClient } from "@angular/common/http";
import { delay, tap } from "rxjs";

export const CONFIG_STATE = new InjectionToken<WritableSignal<ConfigState>>('CONFIG_STATE', {
  providedIn: 'root',
  factory: () => signal(initialConfigState)
});

export function provideConfigState(url: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const configState = inject(CONFIG_STATE);
      const http = inject(HttpClient);

      return http.get<ConfigState>(url).pipe(
        tap(config => configState.set(config)),
        // delay(5_000)
      );
    })
  ]);
}

export function injectUsername(): Signal<string> {
  const configState = inject(CONFIG_STATE);

  return computed(
    () => configState().userInfo.username
  , { debugName: 'username' });
}