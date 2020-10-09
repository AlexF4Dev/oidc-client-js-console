import { XMLHttpRequest } from 'xmlhttprequest-ssl';
import * as oidc from 'oidc-client';
declare module 'oidc-client' {
    export const Global: { setXMLHttpRequest: (req: XMLHttpRequest) => void };
}
import nodeWindowPolyfill from 'node-window-polyfill';
import { ConsolePopupNavigator } from './console-popup-navigator';
import { UserStore } from './user-store';

nodeWindowPolyfill.register();
oidc.Global.setXMLHttpRequest(XMLHttpRequest);

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export class ConsoleSettings {
    public static init(settings: Writeable<oidc.UserManagerSettings>): void {
        settings.popupNavigator = new ConsolePopupNavigator();
        settings.userStore = new UserStore();

        settings.filterProtocolClaims ??= true;
        settings.loadUserInfo ??= true;
        settings.automaticSilentRenew ??= false;
        settings.redirect_uri ??= 'http://localHost:5000';
    }
}
