[![npm package](https://badge.fury.io/js/oidc-client-console.svg)](https://www.npmjs.com/package/oidc-client-console)

# oidc-client-console

The library provides OpenID Connect (OIDC) and OAuth2 protocol support for the console applications. 
The library is an extension for [oidc-client](https://www.npmjs.com/package/oidc-client) to support console applications.

The logged in user is stored encrypted in the user profile directory with the encryption key stored by keytar [keytar](https://www.npmjs.com/package/keytar).


## Install

##### Node.js

Node.js v4.4 or later required.

##### NPM

`npm install oidc-client-console --save`

##### Using LIbrary
The library can be used with any OIDC provider Auth0, Azure AD, Okta, Keyclock etc.


```
const oidcConsole = require('oidc-client-console');

(async function() {
    const user = await oidcConsole.getUser({
        authority: 'https://login.microsoftonline.com/<tenant>/v2.0',
        client_id: '<clientId>',
        response_type: 'code',
        scope: 'openid profile email'
    });
    console.log(JSON.stringify(user));

})();
```

## Global Settings
```
appSettings.appName = 'oidc-console-app'; //default
appSettings.port = 5000; //default
```

## Building the Source

```
git clone https://github.com/AlexF4Dev/oidc-client-console.git
cd oidc-client-console
npm install
npm run build
```

## Running the Sample

create .env file in root folder (Azure example): 

Create application in Azure with http://localhost:5000 callback url
```
AUTHORITY=https://login.microsoftonline.com/<tenant>/v2.0
CLIENT_ID=<clientId>
```

`npm start`

