# express-solid-auth-wrapper
This module contains the following functions:

- extractWebId():
middleware function to extract the webId from a request sent to the service (DPOP). Invoked via `app.use(extractWebId)`

- setSattelite(config):
middleware function to use the service as an authenticated satellite for an existing Pod. Invoked via `app.use(setSattelite(config))`, where config is a JSON object retrieved via `solid-node-client` in the following form ```{
    "refreshToken" : "a-refresh-token",
    "clientId"     : "a-client-id",
    "clientSecret" : "a-client-secret",
    "oidcIssuer"   : "https://pod.lbdserver.org/"
  }```