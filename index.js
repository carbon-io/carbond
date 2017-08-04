var core = require('@carbon-io/carbon-core')
var o = core.atom.o(module)

module.exports = { 
  Endpoint: require('./lib/Endpoint'),
  IdGenerator: require('./lib/IdGenerator'),
  ObjectIdGenerator: require('./lib/ObjectIdGenerator'),
  UUIDGenerator: require('./lib/UUIDGenerator'),
  Operation: require('./lib/Operation'),
  OperationParameter: require('./lib/OperationParameter'),
  Service: require('./lib/Service'),
  collections: {
    Collection: require('./lib/collections/Collection'),
    CollectionOperationConfig: require('./lib/collections/CollectionOperationConfig'), // XXX do we want to export this?
    CollectionOperationResult: require('./lib/collections/CollectionOperationResult')
  },
  limiter: {
    ChainLimiter: require('./lib/limiter/ChainLimiter'),
    FunctionLimiter: require('./lib/limiter/FunctionLimiter'),
    Limiter: require('./lib/limiter/Limiter'),
    PolicyLimiter: require('./lib/limiter/PolicyLimiter'),
    TooBusyLimiter: require('./lib/limiter/TooBusyLimiter'),
    LimiterPolicy: require('./lib/limiter/LimiterPolicy'),
    LimiterPolicyState: require('./lib/limiter/LimiterPolicyState'),
    WindowLimiterPolicy: require('./lib/limiter/WindowLimiterPolicy'),
    LimiterSelector: require('./lib/limiter/LimiterSelector'),
    StaticKeyLimiterSelector: require('./lib/limiter/StaticKeyLimiterSelector'),
    ReqPropertyLimiterSelector: require('./lib/limiter/ReqPropertyLimiterSelector'),
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
    Hasher: require('./lib/security/Hasher'),
    NoopHasher: require('./lib/security/NoopHasher'),
    Sha256Hasher: require('./lib/security/Sha256Hasher'),
    BcryptHasher: require('./lib/security/BcryptHasher')
  },
  logger: o({
    _type: core.logging.Logger,
    parent: 'carbon-io',
    config: {
      name: 'carbond',
      level: 'WARN'
    }
  }),
  test: {
    ServiceTest: require('./lib/test/ServiceTest'),
  }
}

Object.defineProperty(module.exports, 'logger', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: module.exports.logger
})

Object.defineProperty(module.exports, '$Test', {
  enumerable: false,
  configurable: false,
  get: function() {
    return require('./test/index.js')
  }
})

