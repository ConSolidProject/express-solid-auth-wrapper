var { createSolidTokenVerifier } = require('@solid/access-token-verifier')
var { SolidNodeClient } = require('solid-node-client')
var solidOidcAccessTokenVerifier = createSolidTokenVerifier()

function setSatellite(configuration) {
    return async function (req, res, next) {
        try {
            const client = new SolidNodeClient();
            const session = await client.login(configuration);
            req.session = session
            next()
        } catch (error) {
            console.log(`error`, error)
            next(error)
        }
    }
}

async function extractWebId(req, res, next) {
    const authorizationHeader = req.headers.authorization
    const dpopHeader = req.headers.dpop
    const method = req.method
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
 
    try {
       const { client_id: clientId, webid: webId } = await solidOidcAccessTokenVerifier(
          authorizationHeader,
          {
             header: dpopHeader,
             method,
             url
          }
       );
          req.auth = {}
       req.auth.webId = webId
       req.auth.clientId = clientId
       next()
    } catch (error) {
       const message = `Error verifying Access Token via WebID: ${error}}`;
       req.auth = {}
       req.auth.webId = undefined
       req.auth.clientId = undefined
       next()
    }
}

module.exports = {
    setSatellite,
    extractWebId
}