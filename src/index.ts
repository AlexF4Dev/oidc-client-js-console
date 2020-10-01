import { User, UserManager, UserManagerSettings } from 'oidc-client';
import { ConsoleSettings } from './oidc-client-console';

export * from './oidc-client-console';

export const appSettings = {
    appName: 'oidc-client-console',
    port: 5000
};

export async function getUser(settings: Partial<UserManagerSettings>): Promise<User | undefined> {
    ConsoleSettings.init(settings);

    const userManager = new UserManager(settings);

    let user = await userManager.getUser();
    try {
        if (user?.expired) {
            user = await userManager.signinSilent();
        } else if (!(user = await userManager.signinSilent())) {
            user = await userManager.signinPopup();
        }
    } catch (ex) {
        user = await userManager.signinPopup();
    }
    return user;
}
