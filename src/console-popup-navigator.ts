import { ConsolePopupWindow } from './console-popup-window';
import { UserManagerSettings } from 'oidc-client-ts';
export class ConsolePopupNavigator {
    private popup?: ConsolePopupWindow;

    prepare(params: UserManagerSettings & { redirectUrl: string }): Promise<ConsolePopupWindow> {
        this.popup = new ConsolePopupWindow(params);
        return Promise.resolve(this.popup);
    }

    public callback(url: string): void {
        this.popup?.onCompleteCallback({ url });
    }
}
