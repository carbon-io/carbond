module.exports = { 
  Endpoint: require('./lib/Endpoint'),
  IdGenerator: require('./lib/IdGenerator'),
  ObjectIdGenerator: require('./lib/ObjectIdGenerator'),
  Operation: require('./lib/Operation'),
  Service: require('./lib/Service'),
  collections: {
    Collection: require('./lib/collections/Collection'),
    CollectionOperationConfig: require('./lib/collections/CollectionOperationConfig'), // XXX do we want to export this?
  },
  mongodb: {
    MongoDBCollection: require('./lib/mongodb/MongoDBCollection'),
  },
  security: {
    Acl: require('./lib/security/Acl'),
    ApiKeyAuthenticator: require('./lib/security/ApiKeyAuthenticator'),
    Authenticator: require('./lib/security/Authenticator'),
    CollectionAcl: require('./lib/security/CollectionAcl'),
    EndpointAcl: require('./lib/security/EndpointAcl'),
    HttpBasicAuthenticator: require('./lib/security/HttpBasicAuthenticator'),
    MongoDBApiKeyAuthenticator: require('./lib/security/MongoDBApiKeyAuthenticator'),
    MongoDBHttpBasicAuthenticator: require('./lib/security/MongoDBHttpBasicAuthenticator'),
    ObjectAcl: require('./lib/security/ObjectAcl'),
    limiter: {
      ChainLimiter: require('./lib/security/Limiter').ChainLimiter,
      FunctionLimiter: require('./lib/security/Limiter').FunctionLimiter,
      Limiter: require('./lib/security/Limiter').Limiter,
      PolicyLimiter: require('./lib/security/Limiter').PolicyLimiter,
      TooBusyLimiter: require('./lib/security/Limiter').TooBusyLimiter,
      policy: {
        LimiterPolicy: require('./lib/security/LimiterPolicy').LimiterPolicy,
        LimiterPolicyState: require('./lib/security/LimiterPolicy').LimiterPolicyState,
        WindowLimiterPolicy: require('./lib/security/LimiterPolicy').WindowLimiterPolicy
      },
      selector: {
        LimiterSelector: require('./lib/security/LimiterSelector').LimiterSelector,
        StaticKeyLimiterSelector: require('./lib/security/LimiterSelector').StaticKeyLimiterSelector,
        ReqPropertyLimiterSelector: require('./lib/security/LimiterSelector').ReqPropertyLimiterSelector,
      }
    },
  },
  test: {
    ServiceTest: require('./lib/test/ServiceTest')
  }
}
