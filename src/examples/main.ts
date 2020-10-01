import * as dotenv from 'dotenv';
import { UserManagerSettings } from 'oidc-client';
import { getUser, appSettings } from '..';

dotenv.config();

appSettings.appName = 'oidc-console-app';
appSettings.port = 5000;

(async () => {
    const config: Partial<UserManagerSettings> = {
        authority: process.env.AUTHORITY,
        client_id: process.env.CLIENT_ID,
        response_type: 'code',
        scope: 'openid profile email'
    };

    const user = await getUser(config);
    console.log(JSON.stringify(user));
    console.log(`accessToken: ${user?.access_token}`);

    process.exit();
})();
