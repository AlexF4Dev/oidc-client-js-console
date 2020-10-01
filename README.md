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
const oidcConsole = require('oidc-client-js-console');

(async function() {
    const user = await oidcConsole.getUser({
        authority: 'https://login.microsoftonline.com/<tenant>/',
        client_id: '<clientId>',
        response_type: 'code',
        scope: 'openid profile email'
    });
    console.log(JSON.stringify(user));

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
CLIENT_ID=<clientId>

`npm start`

