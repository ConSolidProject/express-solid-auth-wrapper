var { createSolidTokenVerifier} = require('@solid/access-token-verifier')
const {generateFetch} = require('./auth')
const {verifySolidAccessToken} = require('@solid/access-token-verifier/dist/algorithm/verifySolidAccessToken')
var { SolidNodeClient } = require('solid-node-client')
var solidOidcAccessTokenVerifier = createSolidTokenVerifier()

// function setSatellite(configuration) {
//     return async function (req, res, next) {
//         try {
//             const client = new SolidNodeClient();
//             const session = await client.login(configuration);
//             req.session = session
//             next()
//         } catch (error) {
//             console.log(`error`, error)
//             next(error)
//         }
//     }
// }

function setSatellite(config) {
    return async function(req, res, next) {
        try {
            console.log('config', config)
            const { email, password, idp } = config
            if (email && password) {
                req.fetch = await generateFetch(email, password, idp)
            } else {
                req.fetch = fetch
            }
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
    const auth = {}

    if (dpopHeader) {
        try {
            const method = req.method
            var url = req.protocol + '://' + req.get('host') + req.originalUrl;
            const { client_id: clientId, webid: webId } = await solidOidcAccessTokenVerifier(
               authorizationHeader,
               {
                  header: dpopHeader,
                  method,
                  url
               }
            );
            auth.webId = webId
            auth.clientId = clientId
            req.auth = auth
            next()
         } catch (error) {
            const message = `Error verifying Access Token via WebID: ${error}}`;
            console.log(message)
            auth.webId = undefined
            auth.clientId = undefined
            req.auth = autch
            next()
         }
    } else if (authorizationHeader.startsWith("Bearer")) {
        try {
            const validation = await verifySolidAccessToken({header: authorizationHeader})

            auth.webId = validation.webid
            auth.clientId = validation.client_id
            req.auth = auth
            next()
        } catch (error) {
            console.log('error', error)
           next(error) 
        }
    } else {
        
        auth.webId = undefined
        auth.clientId = undefined
        req.auth = auth
        next()
    }
}

module.exports = {
    setSatellite,
    extractWebId
}