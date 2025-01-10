/* eslint-disable @typescript-eslint/no-explicit-any */
import * as oidc from 'oidc-client-ts';
import nodeWindowPolyfill from 'node-window-polyfill';
import { UserStore } from './user-store';
import { appSettings } from '.';
import { Log } from 'oidc-client-ts';
import { ConsolePopupNavigator } from './console-popup-navigator';

nodeWindowPolyfill.register();
const global: any = globalThis;
globalThis.window = {
    ...global.window ?? {},
    ...{
      location: {
        origin: 'http://localhost:5000'
      }
    }
}


Log.setLogger(console);

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export class ConsoleSettings {
    public static init(settings: Writeable<Partial<oidc.UserManagerSettings>>): void {
        settings.userStore = new UserStore() as any;
        settings.filterProtocolClaims ??= true;
        settings.loadUserInfo ??= true;
        settings.automaticSilentRenew ??= false;
        settings.redirect_uri ??= `http://localHost:${appSettings.port}`;
    }
}

export class UserManagerConsole extends oidc.UserManager {
    public constructor(settings: oidc.UserManagerSettings, popupNavigator: ConsolePopupNavigator) {
        super(settings);
        Object.assign(this, { _popupNavigator : popupNavigator});
    }
}
