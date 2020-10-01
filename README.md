[![npm package](https://badge.fury.io/js/oidc-client-js-console.svg)](https://www.npmjs.com/package/oidc-client-js-console)

# oidc-client-js-console

The library to provide OpenID Connect (OIDC) and OAuth2 protocol support for the console applications. 
The library is an extension for [npm package](https://badge.fury.io/js/oidc-client.svg)](https://www.npmjs.com/package/oidc-client)

The logged in user is stored encrypted in the 


## Install

##### Node.js

Node.js v4.4 or later required.

##### NPM

`npm install oidc-client-js-console --save`

##### Using LIbrary
```
import { UserManagerSettings } from 'oidc-client';
import { getUser, appSettings } from 'oidc-client-js-console';

// Used to name folder into profile directory
appSettings.appName = 'oidc-console-app';
// Port used by service to receive AUTH code
appSettings.port = 5000;

(async () => {
    const config: Partial<UserManagerSettings> = {
        authority: <authority url>,
        client_id: <clientId>,
        response_type: 'code',
        scope: 'openid profile email'
    };

    const user = await getUser(config);
    process.exit();
})();
```

## Building the Source

```
git clone https://github.com/AlexF4Dev/oidc-client-js-console.git
cd oidc-client-js-console
npm install
npm run build
```

## Running the Sample

create .env file in root folder (Azure example): 

Create application in Azure with http://localhost:5000 callback url

AUTHORITY=https://login.microsoftonline.com/<tenant>/
CLIENT_ID=5b62f8ed-2940-4c88-b1c8-85b13e3cd7d6

`npm start`

