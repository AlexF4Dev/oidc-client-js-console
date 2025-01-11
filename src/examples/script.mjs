#!/usr/bin/env zx

// zx -install  .\script.mjs 

import oidcConsole from 'oidc-client-console';


oidcConsole.appSettings.port = 5001;
const user = await oidcConsole.getUser({
    authority: <authority url>
    client_id: <clientid>,
    response_type: 'code',
    scope: 'openid profile email'
});

console.log(JSON.stringify(user, null, 2));
