module.exports = { // XXX should be able to automate this
  ObjectServer: require('./lib/ObjectServer'),
  Endpoint: require('./lib/Endpoint'),
  Operation: require('./lib/Operation'),
  Collection: require('./lib/Collection'),
  MongoDBCollection: require('./lib/MongoDBCollection'),
  UserCollection: require('./lib/UserCollection'),
  IdGenerator: require('./lib/IdGenerator'),
  ObjectIdGenerator: require('./lib/ObjectIdGenerator'),
  HttpErrors: require('./lib/HttpErrors'),
  security: {
    Authenticator: require('./lib/security/Authenticator'),
    HttpBasicAuthenticator: require('./lib/security/HttpBasicAuthenticator'),
    MongoDBHttpBasicAuthenticator: require('./lib/security/MongoDBHttpBasicAuthenticator'),
    ApiKeyAuthenticator: require('./lib/security/ApiKeyAuthenticator'),
    MongoDBApiKeyAuthenticator: require('./lib/security/MongoDBApiKeyAuthenticator'),
    Acl: require('./lib/security/Acl'),
    EndpointAcl: require('./lib/security/EndpointAcl'),
    CollectionAcl: require('./lib/security/CollectionAcl'),
    ObjectAcl: require('./lib/security/ObjectAcl')
  },
}
