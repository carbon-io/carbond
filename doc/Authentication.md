Authentication
----------

Datanode comes with a pluggable authentication system along with several out-of-the-box ```Authenticator```s:

* An ```HttpBasicAuthenticator```
* An ```ApiKeyAuthenticator``` 
* An ```OauthAuthenticator``` _(not yet implemented)_

Custom Authenticators
----------

You can define your own custom ```Authenticator```s by creating an instance of ```Authenicator``` (or a subclass) with a custom ```authenticate``` method.  

```node
o({
  _type: 'datanode/Authenticator',
  
  authenticate: function(req) {
    var user = figureOutWhoUserIs();
    return user;
  }
})
```

Examples
----------

```node
var o = require('maker').o(module, true)

module.exports = o({
  _type: 'datanode/ObjectServer',
  port: 8888,
  authenticator: o({
    _type: 'datanode/security/MongoDBHttpBasicAuthenticator',
    userCollection: "users",
    usernameField: "username",
    passwordField: "password"
  }),
  endpoints: {
    hello: o({
      _type: 'datanode/Endpoint',
      get: function(req) {
        return { msg: "Hello World!" }
      }
    })
  }
})
```

```node
var o = require('maker').o(module, true)

module.exports = o({
  _type: 'datanode/ObjectServer',
  port: 8888,
  authenticator: o({
    _type: 'datanode/security/MongoDBApiKeyAuthenticator',
    apiKeyParameterName: "API_KEY",
    apiKeyIn: "header", // can be "header" or "query"
    userCollection: "users",
    apiKeyUserField: "apiKey"
  }),
  endpoints: {
    hello: o({
      _type: 'datanode/Endpoint',
      get: function(req) {
        return { msg: "Hello World!" }
      }
    })
  }
})
```

```node
var o = require('maker').o(module, true)

module.exports = o({
  _type: 'datanode/ObjectServer',
  port: 8888,
  authenticator: o({
    _type: 'Authenticator',
    authenticate: function(req) {
      var user = figureOutWhoUserIs();
      return user;
    }
  }),
  endpoints: {
    hello: o({
      _type: 'datanode/Endpoint',
      get: function(req) {
        return { msg: "Hello World!" }
      }
    })
  }
})
```
