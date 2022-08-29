import { XMLHttpRequest } from 'xmlhttprequest-ssl';
import * as oidc from 'oidc-client-ts';
import nodeWindowPolyfill from 'node-window-polyfill';
import { fetch_polyfill } from './fetch-polyfill';
import { UserStore } from './user-store';
import { appSettings } from '.';
import { Log } from 'oidc-client-ts';

nodeWindowPolyfill.register();
(globalThis as any).window = {
    ...(globalThis as any).window ?? {},
    ...{
      location: {
        origin: 'http://localhost:5000'
      }
    }
}

fetch_polyfill();

Log.setLogger(console);

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export class ConsoleSettings {
    public static init(settings: Writeable<oidc.UserManagerSettings>): void {
        settings.userStore = new UserStore() as any;
        settings.filterProtocolClaims ??= true;
        settings.loadUserInfo ??= true;
        settings.automaticSilentRenew ??= false;
        settings.redirect_uri ??= `http://localHost:${appSettings.port}`;
    }
}

export class UserManagerConsole extends oidc.UserManager {
    public constructor(settings: oidc.UserManagerSettings, popupNavigator: any) {
        super(settings);
        Object.assign(this, { _popupNavigator : popupNavigator});
    }
}
