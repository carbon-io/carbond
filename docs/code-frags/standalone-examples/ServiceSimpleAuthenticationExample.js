var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var HttpErrors = carbon.HttpErrors
var o  = carbon.atom.o(module)

__(function() {

  __(function() {
    function figureOutWhoUserIs(req) {
      // just stubbing this out here
      var username = req.query.username
      if (username === 'skroob') {
        return {
          username: username,
          email: 'pres@skroob.com'
        }
      } 
      throw new HttpErrors.Unauthorized()
    }
    module.exports = o.main({
      _type: carbon.carbond.Service,
      port: 8888,
      authenticator: o({
        _type: carbon.carbond.security.Authenticator,
        authenticate: function(req) {
          var user = figureOutWhoUserIs(req)
          return user
        }
      }),
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            return {msg: 'Hello ' + req.user.email + '!'}
          }
        })
      }
    })
  })

  // just playing this game for presentation's sake in the docs
  var Service1 = module.exports

  __(function() {
    module.exports = o.main({
      _type: carbon.carbond.Service,
      port: 8888,
      dbUri: 'mongodb://localhost:27017/mydb',
      authenticator: o({
        _type: carbon.carbond.security.MongoDBHttpBasicAuthenticator,
        userCollection: "users",
        usernameField: "username",
        passwordField: "password"
      }),      
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            return {msg: 'Hello ' + req.user.email + '!'}
          }
        })
      }
    })
  })

  var Service2 = module.exports

  __(function() {
    module.exports = o.main({
      _type: carbon.carbond.Service,
      port: 8888,
      dbUri: 'mongodb://localhost:27017/mydb',
      authenticator: o({
        _type: carbon.carbond.security.MongoDBApiKeyAuthenticator,
        apiKeyParameterName: "API_KEY",
        apiKeyLocation: "header", // can be "header" or "query"
        userCollection: "users",
        apiKeyField: "apiKey"
      }),      
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            return {msg: 'Hello ' + req.user.email + '!'}
          }
        })
      }
    })
  })

  var Service3 = module.exports

  module.exports = {
    Service1: Service1,
    Service2: Service2,
    Service3: Service3
  }
})
