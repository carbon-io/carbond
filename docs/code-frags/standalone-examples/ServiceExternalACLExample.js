var carbon = require('carbon-io')
var __ = carbon.fibers.__(module)
var _o  = carbon.bond._o(module)
var o  = carbon.atom.o(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    dbUri: 'mongodb://localhost:27017/mydb',
    authenticator: o({
      _type: carbon.carbond.security.MongoDBApiKeyAuthenticator,
      apiKeyParameterName: 'API_KEY',
      apiKeyLocation: 'header',
      userCollection: 'users',
      apiKeyField: 'apiKey',
    }),
    endpoints: {
      hello: o({
        _type: carbon.carbond.mongodb.MongoDBCollection,
        collectionName: 'hello',
        enabled: {'*': true},
        acl: _o('./MyAcl'),
      }),
    },
  })
})
