module.exports = { 
  Service: require('./lib/Service'),
  Endpoint: require('./lib/Endpoint'),
  Operation: require('./lib/Operation'),
  IdGenerator: require('./lib/IdGenerator'),
  ObjectIdGenerator: require('./lib/ObjectIdGenerator'),
  collections: {
    Collection: require('./lib/collections/Collection'),
    CollectionOperationConfig: require('./lib/collections/CollectionOperationConfig'), // XXX do we want to export this?
  },
  mongodb: {
    MongoDBCollection: require('./lib/mongodb/MongoDBCollection'),
  },
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
  test: {
    ServiceTest: require('./lib/test/ServiceTest')
  }
}
