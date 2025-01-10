import { User, UserManagerSettings } from 'oidc-client-ts';
import { ConsolePopupNavigator } from './console-popup-navigator';
import { ConsoleSettings, UserManagerConsole } from './oidc-client-console';

export * from './oidc-client-console';

export const appSettings = {
    appName: 'oidc-client-console',
    port: 5000
};

export async function getUser(settings: Partial<UserManagerSettings>): Promise<User | null> {
    ConsoleSettings.init(settings);

    const userManager = new UserManagerConsole(settings as UserManagerSettings,  new ConsolePopupNavigator());

    let user = await userManager.getUser();
    try {
        if (user?.expired) {
            user = await userManager.signinSilent();
        } else if (!(user = await userManager.signinSilent())) {
            user = await userManager.signinPopup();
        }
    } catch  {
        user = await userManager.signinPopup();
    }
    return user;
}

