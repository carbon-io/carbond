var core = require('@carbon-io/carbon-core')
var o = core.atom.o(module)

/**
 * @namespace carbond
 */

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
    CollectionOperationResult: require('./lib/collections/CollectionOperationResult'),
    CollectionOperationConfig: require('./lib/collections/CollectionOperationConfig'),
    InsertConfig: require('./lib/collections/CollectionOperationConfig'),
    FindConfig: require('./lib/collections/FindConfig'),
    FindObjectConfig: require('./lib/collections/FindObjectConfig'),
    InsertConfig: require('./lib/collections/InsertConfig'),
    InsertObjectConfig: require('./lib/collections/InsertObjectConfig'),
    RemoveConfig: require('./lib/collections/RemoveConfig'),
    RemoveObjectConfig: require('./lib/collections/RemoveObjectConfig'),
    SaveConfig: require('./lib/collections/SaveConfig'),
    SaveObjectConfig: require('./lib/collections/SaveObjectConfig'),
    UpdateConfig: require('./lib/collections/UpdateConfig'),
    UpdateObjectConfig: require('./lib/collections/UpdateObjectConfig')
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
    MongoDBCollectionOperationConfig: require('./lib/collections/MongoDBCollectionOperationConfig'),
    MongoDBFindConfig: require('./lib/collections/MongoDBFindConfig'),
    MongoDBFindObjectConfig: require('./lib/collections/MongoDBFindObjectConfig'),
    MongoDBInsertConfig: require('./lib/collections/MongoDBInsertConfig'),
    MongoDBInsertObjectConfig: require('./lib/collections/MongoDBInsertObjectConfig'),
    MongoDBRemoveConfig: require('./lib/collections/MongoDBRemoveConfig'),
    MongoDBRemoveObjectConfig: require('./lib/collections/MongoDBRemoveObjectConfig'),
    MongoDBSaveConfig: require('./lib/collections/MongoDBSaveConfig'),
    MongoDBSaveObjectConfig: require('./lib/collections/MongoDBSaveObjectConfig'),
    MongoDBUpdateConfig: require('./lib/collections/MongoDBUpdateConfig'),
    MongoDBUpdateObjectConfig: require('./lib/collections/MongoDBUpdateObjectConfig')
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

