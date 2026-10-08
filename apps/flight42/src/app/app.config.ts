import { ApplicationConfig, provideBrowserGlobalErrorListeners, signal } from '@angular/core';
import { CONFIG_STATE, provideConfigState } from './shared/config.provider';
import { initialConfigState } from './model/config.model';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    /* {
      provide: CONFIG_STATE,
      useValue: signal({
        ...initialConfigState,
        userInfo: {
          ...initialConfigState.userInfo,
          username: 'dummy'
        }
      })
    }, */
    provideConfigState('./config.state.json'),
  ],
};
