module.exports = {
  ObjectServer: require('./ObjectServer'),
  Endpoint: require('./Endpoint'),
  Operation: require('./Operation'),
  Collection: require('./Collection'),
  MongoDBCollection: require('./MongoDBCollection'),
  UserCollection: require('./UserCollection'),
  security: {
    Authenticator: require('./security/Authenticator'),
    HttpBasicAuthenticator: require('./security/HttpBasicAuthenticator'),
    MongoDBHttpBasicAuthenticator: require('./security/MongoDBHttpBasicAuthenticator'),
    ApiKeyAuthenticator: require('./security/ApiKeyAuthenticator'),
    MongoDBApiKeyAuthenticator: require('./security/MongoDBApiKeyAuthenticator'),
    Acl: require('./security/Acl'),
    EndpointAcl: require('./security/EndpointAcl'),
    CollectionAcl: require('./security/CollectionAcl'),
    ObjectAcl: require('./security/ObjectAcl')
  },
}
