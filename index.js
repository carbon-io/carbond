var core = require('@carbon-io/carbon-core')
var o = core.atom.o(module)

/***************************************************************************************************
 * @external express
 * @description The express namespace
 * @see https://expressjs.com/en/4x/api.html
 */

/***************************************************************************************************
 * @namespace carbond
 */

// XXX: fill in any documentation for extensions to the express classes

/***************************************************************************************************
 * @class Request
 * @memberof carbond
 * @description The Request object represents the HTTP request and has properties for the request
 *              query string, parameters, body, HTTP headers, and so on
 * @extends external:express.Request
 */

/***************************************************************************************************
 * @class Response
 * @memberof carbond
 * @description The Response object represents the HTTP response that an Express app sends when it
 *              gets an HTTP request
 * @extends external:express.Response
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
    IdGenerator: require('./lib/collections/IdGenerator'),
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
    UpdateObjectConfig: require('./lib/collections/UpdateObjectConfig'),
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
    MongoDBFindConfig: require('./lib/mongodb/MongoDBFindConfig'),
    MongoDBFindObjectConfig: require('./lib/mongodb/MongoDBFindObjectConfig'),
    MongoDBInsertConfig: require('./lib/mongodb/MongoDBInsertConfig'),
    MongoDBInsertObjectConfig: require('./lib/mongodb/MongoDBInsertObjectConfig'),
    MongoDBRemoveConfig: require('./lib/mongodb/MongoDBRemoveConfig'),
    MongoDBRemoveObjectConfig: require('./lib/mongodb/MongoDBRemoveObjectConfig'),
    MongoDBSaveConfig: require('./lib/mongodb/MongoDBSaveConfig'),
    MongoDBSaveObjectConfig: require('./lib/mongodb/MongoDBSaveObjectConfig'),
    MongoDBUpdateConfig: require('./lib/mongodb/MongoDBUpdateConfig'),
    MongoDBUpdateObjectConfig: require('./lib/mongodb/MongoDBUpdateObjectConfig'),
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
    BcryptHasher: require('./lib/security/BcryptHasher'),
  },
  logger: o({
    _type: core.logging.Logger,
    parent: 'carbon-io',
    config: {
      name: 'carbond',
      level: 'WARN',
    },
  }),
  test: {
    ServiceTest: require('./lib/test/ServiceTest'),
  },
}

Object.defineProperty(module.exports, 'logger', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: module.exports.logger,
})

Object.defineProperty(module.exports, '$Test', {
  enumerable: false,
  configurable: false,
  get: function() {
    return require('./test/index.js')
  },
})

