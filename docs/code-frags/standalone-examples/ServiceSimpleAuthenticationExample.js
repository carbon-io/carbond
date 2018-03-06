var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var HttpErrors = carbon.HttpErrors
var o  = carbon.atom.o(module)

__(function() {

  // pre-authentication-customAuthHeader
  __(function() {
    // post-authentication-customAuthHeader
    function figureOutWhoUserIs(req) {
      // just stubbing this out here
      var username = req.query.username
      if (username === 'skroob') {
        return {
          username: username,
          email: 'pres@skroob.com',
        }
      }
      throw new HttpErrors.Unauthorized()
    }
    // pre-authentication-customAuthFooter
    module.exports = o.main({
      _type: carbon.carbond.Service,
      port: 8888,
      // pre-authentication-customAuthenticator
      authenticator: o({
        _type: carbon.carbond.security.Authenticator,
        authenticate: function(req) {
          var user = figureOutWhoUserIs(req)
          return user
        },
      }),
      // post-authentication-customAuthenticator
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            return {msg: 'Hello ' + req.user.email + '!'}
          },
        }),
      },
    })
  })
  // post-authentication-customAuthFooter

  // just playing this game for presentation's sake in the docs
  var Service1 = module.exports

  // pre-authentication-HTTPBasicAuth
  __(function() {
    module.exports = o.main({
      _type: carbon.carbond.Service,
      port: 8888,
      dbUri: 'mongodb://localhost:27017/mydb',
      authenticator: o({
        _type: carbon.carbond.security.MongoDBHttpBasicAuthenticator,
        userCollection: 'users',
        usernameField: 'username',
        passwordField: 'password',
      }),
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            return {msg: 'Hello ' + req.user.email + '!'}
          },
        }),
      },
    })
  })
  // post-authentication-HTTPBasicAuth

  var Service2 = module.exports
  // pre-authentication-APIKeyAuth
  __(function() {
    module.exports = o.main({
      _type: carbon.carbond.Service,
      port: 8888,
      dbUri: 'mongodb://localhost:27017/mydb',
      authenticator: o({
        _type: carbon.carbond.security.MongoDBApiKeyAuthenticator,
        apiKeyParameterName: 'API_KEY',
        apiKeyLocation: 'header', // can be "header" or "query"
        userCollection: 'users',
        apiKeyField: 'apiKey',
      }),
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            return {msg: 'Hello ' + req.user.email + '!'}
          },
        }),
      },
    })
  })
  // post-authentication-APIKeyAuth

  var Service3 = module.exports

  module.exports = {
    Service1: Service1,
    Service2: Service2,
    Service3: Service3,
  }
})
