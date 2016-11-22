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
  limiter: {
    ChainLimiter: require('./lib/limiter/Limiter').ChainLimiter,
    FunctionLimiter: require('./lib/limiter/Limiter').FunctionLimiter,
    Limiter: require('./lib/limiter/Limiter').Limiter,
    PolicyLimiter: require('./lib/limiter/Limiter').PolicyLimiter,
    TooBusyLimiter: require('./lib/limiter/Limiter').TooBusyLimiter,
    policy: {
      LimiterPolicy: require('./lib/limiter/LimiterPolicy').LimiterPolicy,
      LimiterPolicyState: require('./lib/limiter/LimiterPolicy').LimiterPolicyState,
      WindowLimiterPolicy: require('./lib/limiter/LimiterPolicy').WindowLimiterPolicy
    },
    selector: {
      LimiterSelector: require('./lib/limiter/LimiterSelector').LimiterSelector,
      StaticKeyLimiterSelector: require('./lib/limiter/LimiterSelector').StaticKeyLimiterSelector,
      ReqPropertyLimiterSelector: require('./lib/limiter/LimiterSelector').ReqPropertyLimiterSelector,
    }
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
  },
  test: {
    ServiceTest: require('./lib/test/ServiceTest')
  }
}
