var assert = require('assert')
var crypto = require('crypto')

var _ = require('lodash')
var bcrypt = require('bcryptjs')
var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var connect  = require('@carbon-io/carbon-core').leafnode.connect
var o  = require('@carbon-io/carbon-core').atom.o(module)
var oo  = require('@carbon-io/carbon-core').atom.oo(module)
var testtube = require('@carbon-io/carbon-core').testtube

var config = require('./Config')

var USERS_COL = 'authenticator_test_users'

function mockHttpBasicAuthRequest(username, password) {
  return {
    headers: {
      authorization: 'Basic ' + Buffer(username + ':' + password, 'utf8').toString('base64'),
    },
  }
}

function mockService(db) {
  return {
    errors: process._HttpErrors,
    logWarning: sinon.spy(),
    logDebug: sinon.spy(),
    db: db,
  }
}

var MongoDBAuthenticatorTest = oo({
  _type: testtube.Test,
  _C: function() {
    this.userRecords = []
  },
  db: {
    $property: {
      get: function() {
        return this.parent.parent.db
      },
    },
  },
  setup: function() {
    var c = this.db.getCollection(USERS_COL)
    try {
      c.drop()
    } catch (e) {
      // noop
    }
    c = this.db.getCollection(USERS_COL)
    this.userRecords.forEach(function(record) {
      c.insert(record)
    })
  },
  teardown: function() {
    var c = this.db.getCollection(USERS_COL)
    try {
      c.drop()
    } catch (e) {
      // noop
    }
  },
})

/**************************************************************************
 * AuthenticatorTests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * _C
     */
    _C: function() {
      this._db = undefined
    },

    /**********************************************************************
     * name
     */
    name: 'AuthenticatorTests',

    /**********************************************************************
     * description
     */
    description: 'Test the various predefined authenticators',

    /**********************************************************************
     * db
     */
    db: {
      $property: {
        get: function() {
          return this._db
        },
      },
    },

    /**********************************************************************
     * setup
     */
    setup: function() {
      this._db = connect(config.MONGODB_URI + '/authenticator-tests')
    },

    /**********************************************************************
     * teardown
     */
    teardown: function() {
      this._db.close()
    },

    /**********************************************************************
     * tests
     */
    tests: [

      //
      // http basic
      //
      o({
        _type: testtube.Test,
        name: 'HttpBasicAuthenticatorTests',
        description: 'HttpBasicAuthenticator tests',
        tests: [
          o({
            _type: testtube.Test,
            name: 'UnsupportedHashFunction',
            description: 'Test unsupported hash function',
            authenticator: {
              _type: _o('../lib/security/HttpBasicAuthenticator'),
              usernameField: 'username',
              passwordField: 'password',
              passwordHashFn: 'foo',
            },
            username: 'foo',
            password: 'bar',
            doTest: function() {
              var self = this
              assert.throws(function() {
                var authenticator = o(self.authenticator)
              }, Error)
            },
          }),
          o({
            _type: testtube.Test,
            name: 'UnspecifiedRequiredFields',
            description: 'Test with unspecified required fields',
            authenticator: {
              _type: _o('../lib/security/HttpBasicAuthenticator'),
              usernameField: 'username',
              // missing passwordField
            },
            username: 'foo',
            password: 'bar',
            doTest: function() {
              var authenticator = o(this.authenticator)
              var req = mockHttpBasicAuthRequest(this.username, this.password)
              assert.throws(function() {
                authenticator.authenticate(req)
              }, Error)
            },
          }),
          o({
            _type: testtube.Test,
            name: 'WrongCredentials',
            description: 'Test wrong credentials',
            authenticator: {
              _type: _o('../lib/security/HttpBasicAuthenticator'),
              usernameField: 'username',
              passwordField: 'password',
            },
            username: 'foo',
            password: 'bar',
            doTest: function() {
              var authenticator = o(this.authenticator)
              authenticator.initialize(mockService())
              var findUserStub = sinon.stub(authenticator, 'findUser')
              findUserStub.returns({'username': 'foo', 'password': 'baz'})
              var req = mockHttpBasicAuthRequest(this.username, this.password)
              assert.throws(function() {
                authenticator.authenticate(req)
              }, process._HttpErrors.Unauthorized)
            },
          }),
          o({
            _type: testtube.Test,
            name: 'Success',
            description: 'Test successful authentication',
            authenticator: {
              _type: _o('../lib/security/HttpBasicAuthenticator'),
              usernameField: 'username',
              passwordField: 'password',
            },
            username: 'foo',
            password: 'bar',
            doTest: function() {
              var authenticator = o(this.authenticator)
              authenticator.initialize(mockService())
              var findUserStub = sinon.stub(authenticator, 'findUser')
              findUserStub.returns({'username': 'foo', 'password': 'bar'})
              var req = mockHttpBasicAuthRequest(this.username, this.password)
              var result = authenticator.authenticate(req)
              assert.equal(result.username, this.username)
            },
          }),
          o({
            _type: testtube.Test,
            name: 'PasswordHashFnInitialization',
            description: 'Test password hash function initialization',
            authenticator: {
              _type: _o('../lib/security/HttpBasicAuthenticator'),
              usernameField: 'username',
              passwordField: 'password',
            },
            username: 'foo',
            password: 'bar',
            doTest: function() {
              var self = this
              var BarHasher = oo({
                _type: _o('../lib/security/Hasher'),
                hash: function(data) {
                  return 'bar'
                },
              })
              var check = function() {
                var authenticator = o(self.authenticator)
                authenticator.initialize(mockService())
                var findUserStub = sinon.stub(authenticator, 'findUser')
                findUserStub.returns({'username': 'foo', 'password': 'bar'})
                var req = mockHttpBasicAuthRequest(self.username, self.password)
                var result = authenticator.authenticate(req)
                assert.equal(result.username, self.username)
              }
              this.authenticator.passwordHashFn = BarHasher
              check()
              this.authenticator.passwordHashFn = o({_type: BarHasher})
              check()
              this.authenticator.passwordHashFn = {}
              assert.throws(function() {
                var authenticator = o(self.authenticator)
              }, TypeError)
            },
          }),
        ],
      }),


      //
      // mongodb http basic
      //

      o({
        _type: testtube.Test,
        name: 'MongoDBHttpBasicAuthenticatorTests',
        description: 'MongoDBHttpBasicAuthenticator tests',
        tests: [
          o({
            _type: MongoDBAuthenticatorTest,
            name: 'UnspecifiedRequiredFields',
            description: 'Test with unspecified required fields (superclass)',
            authenticator: {
              _type: _o('../lib/security/MongoDBHttpBasicAuthenticator'),
              usernameField: 'username',
            },
            doTest: function() {
              var authenticator = o(this.authenticator)
              authenticator.initialize(mockService(this.db))
              var req = mockHttpBasicAuthRequest(this.username, this.password)
              assert.throws(function() {
                // missing passwordField
                authenticator.authenticate(req)
              }, Error)
            },
          }),
          o({
            _type: MongoDBAuthenticatorTest,
            name: 'UnspecifiedRequiredFields',
            description: 'Test with unspecified required fields',
            authenticator: {
              _type: _o('../lib/security/MongoDBHttpBasicAuthenticator'),
              usernameField: 'username',
              passwordField: 'password',
            },
            doTest: function() {
              var authenticator = o(this.authenticator)
              authenticator.initialize(mockService(this.db))
              var req = mockHttpBasicAuthRequest(this.username, this.password)
              assert.throws(function() {
                // missing userCollection
                authenticator.authenticate(req)
              }, Error)
            },
          }),
          o({
            _type: MongoDBAuthenticatorTest,
            name: 'UserDoesNotExist',
            description: 'Test user does not exist',
            authenticator: {
              _type: _o('../lib/security/MongoDBHttpBasicAuthenticator'),
              usernameField: 'username',
              passwordField: 'password',
              userCollection: USERS_COL,
            },
            userRecords: [
              {username: 'bar', password: 'baz'},
            ],
            username: 'foo',
            password: 'bar',
            doTest: function() {
              var authenticator = o(this.authenticator)
              authenticator.initialize(mockService(this.db))
              var req = mockHttpBasicAuthRequest(this.username, this.password)
              assert.throws(function() {
                authenticator.authenticate(req)
              }, process._HttpErrors.Unauthenticated)
            },
          }),
          o({
            _type: MongoDBAuthenticatorTest,
            name: 'WrongPassword',
            description: 'Test wrong password',
            authenticator: {
              _type: _o('../lib/security/MongoDBHttpBasicAuthenticator'),
              usernameField: 'username',
              passwordField: 'password',
              userCollection: USERS_COL,
            },
            userRecords: [
              {username: 'foo', password: 'baz'},
            ],
            username: 'foo',
            password: 'bar',
            doTest: function() {
              var authenticator = o(this.authenticator)
              authenticator.initialize(mockService(this.db))
              var req = mockHttpBasicAuthRequest(this.username, this.password)
              assert.throws(function() {
                authenticator.authenticate(req)
              }, process._HttpErrors.Unauthenticated)
            },
          }),
          o({
            _type: MongoDBAuthenticatorTest,
            name: 'Success',
            description: 'Test successful authentication',
            authenticator: {
              _type: _o('../lib/security/MongoDBHttpBasicAuthenticator'),
              usernameField: 'username',
              passwordField: 'password',
              userCollection: USERS_COL,
            },
            userRecords: [
              {username: 'foo', password: 'bar'},
            ],
            username: 'foo',
            password: 'bar',
            doTest: function() {
              var authenticator = o(this.authenticator)
              authenticator.initialize(mockService(this.db))
              var req = mockHttpBasicAuthRequest(this.username, this.password)
              var user = authenticator.authenticate(req)
              assert.equal(user.username, this.username)
            },
          }),
        ],
      }),

      //
      // api key
      //

      o({
        _type: testtube.Test,
        name: 'ApiKeyAuthenticatorTests',
        description: 'ApiKeyAuthenticator tests',
        tests: [
          o({
            _type: testtube.Test,
            name: 'GenerateKeyTest',
            description: 'Key generation test',
            authenticator: {
              _type: _o('../lib/security/ApiKeyAuthenticator'),
            },
            doTest: function() {
              var key = o(this.authenticator).generateApiKey()
              assert(_.isString(key))
              assert(
                key.match(
                  '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'
                )
              )
            },
          }),
          o({
            _type: testtube.Test,
            name: 'MaskUserObjectTest',
            description: 'Key generation test',
            authenticator: {
              _type: _o('../lib/security/ApiKeyAuthenticator'),
              maskUserObjectKeys: [
                'credentials.password',
                'credentials.apiKey',
              ],
              findUser: function(apiKey) {
                return {
                  name: 'Foo',
                  title: 'Bar',
                  credentials: {
                    password: '12345',
                    apiKey: '123456',
                  },
                }
              },
            },
            doTest: function() {
              var self = this
              var authenticator = o(this.authenticator)
              authenticator.initialize(o({
                _type: _o('../lib/Service'),
                logDebug: sinon.spy(),
                logInfo: sinon.spy(),
                logError: sinon.spy(),
              }))
              var user = authenticator.authenticate({
                header: function() {
                  return '123456'
                },
              })
              assert.equal(user.credentials.apiKey, '123456')
              assert.equal(user.credentials.password, '12345')
              var check = function(call) {
                assert(_.isNull(call.args[0].match(/12345/)))
              }
              var loggerNames = ['logDebug', 'logInfo', 'logError']
              loggerNames.forEach(function(loggerName) {
                var logger = authenticator.service[loggerName]
                for (var i = 0; i < logger.callCount; i++) {
                  check(logger.getCall(i))
                }
              })
            },
          }),
        ],
      }),
      o({
        _type: testtube.Test,
        name: 'MongoDBApiKeyAuthenticatorTests',
        description: 'MongoDBApiKeyAuthenticator tests',
        tests: [
          o({
            _type: testtube.Test,
            name: 'MaskUserObjectTest',
            description: 'Key generation test',
            authenticator: {
              _type: _o('../lib/security/MongoDBApiKeyAuthenticator'),
              apiKeyField: 'credentials.apiKey',
              findUser: function(apiKey) {
                return {
                  name: 'Foo',
                  title: 'Bar',
                  credentials: {
                    password: '12345',
                    apiKey: '123456',
                  },
                }
              },
            },
            doTest: function() {
              var self = this
              var authenticator = o(this.authenticator)
              authenticator.initialize(o({
                _type: _o('../lib/Service'),
                logDebug: sinon.spy(),
                logInfo: sinon.spy(),
                logError: sinon.spy(),
              }))
              var user = authenticator.authenticate({
                header: function() {
                  return '123456'
                },
              })
              assert.equal(user.credentials.apiKey, '123456')
              assert.equal(user.credentials.password, '12345')
              var check = function(call) {
                assert(_.isNull(call.args[0].match(/123456/)))
              }
              var loggerNames = ['logDebug', 'logInfo', 'logError']
              loggerNames.forEach(function(loggerName) {
                var logger = authenticator.service[loggerName]
                for (var i = 0; i < logger.callCount; i++) {
                  check(logger.getCall(i))
                }
              })
            },
          }),
        ],
      }),
    ],
  })
})
