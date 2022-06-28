import generateFetch from "./auth"

var { createSolidTokenVerifier } = require('@solid/access-token-verifier')
var { SolidNodeClient } = require('solid-node-client')
var solidOidcAccessTokenVerifier = createSolidTokenVerifier()

//function setSatellite(configuration) {
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

interface IConfig {
    email: string,
    password: string,
    idp: string
}

async function setSatellite(config: IConfig) {
    return async function(req, res, next) {
        try {
            
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
       console.log(message)
       req.auth = {}
       req.auth.webId = undefined
       req.auth.clientId = undefined
       next()
    }
}

export {extractWebId, setSatellite}