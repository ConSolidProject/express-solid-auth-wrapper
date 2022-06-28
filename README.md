# express-solid-auth-wrapper
Middleware functions to authenticate to a remote solid service. Merely a wrapper around '@solid/access-token-verifier' and 'solid-node-client'. Use `npx @inrupt/generate-oidc-token` to provide your app with Solid credentials. This module around contains the following functions:

- extractWebId():
middleware function to extract the webId from a request sent to the service (DPOP). Invoked via `app.use(extractWebId)`

- setSatellite(config):
middleware function adding an authenticated "fetch" to the request object (req.fetch). The required configuration file is a JSON object with fields "email", "password" and "idp". Better store them in your environment variables... Invoked via `app.use(setSatellite(config))`.
