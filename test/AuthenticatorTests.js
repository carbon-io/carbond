var assert = require('assert')
var crypto = require('crypto')

var bcrypt = require('bcryptjs')
var sinon = require('sinon')

var _o = require('bond')._o(module)
var connect = require('leafnode').connect
var o  = require('atom').o(module)
var oo  = require('atom').oo(module)
var testtube = require('test-tube')

var config = require('./Config')

var USERS_COL = 'authenticator_test_users'

function mockHttpBasicAuthRequest(username, password) {
  return {
    headers: {
      authorization: 'Basic ' + Buffer(username + ':' + password, 'utf8').toString('base64')
    }
  }
}

function mockService(db) {
  return {
    errors: process._HttpErrors,
    logWarning: sinon.spy(),
    logDebug: sinon.spy(),
    db: db
  }
}

var MongoDBAuthenticatorTest = oo({
  _type: testtube.Test,
  _C: function () {
    this.userRecords = []
  },
  db: {
    $property: {
      get: function() {
        return this.parent.db
      }
    }
  },
  setup: function () {
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
  teardown: function () {
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
module.exports = o({

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
  name: "AuthenticatorTests",

  /**********************************************************************
   * name
   */
  description: "Test the various predefined authenticators",

  /**********************************************************************
   * db
   */
  db: {
    $property: {
      get: function() {
        return this._db
      }
    }
  },

  /**********************************************************************
   * setup
   */
  setup: function() {
    try {
      this._db = connect(config.MONGODB_URI)
    } catch (e) {
      console.dir(e)
    }
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
      name: 'TestHttpBasicAuthenticatorUnsupportedHashFunction',
      description: 'Test unsupported hash function',
      authenticator: {
        _type: _o('../lib/security/HttpBasicAuthenticator'),
        usernameField: 'username',
        passwordField: 'password',
        passwordHashFn: 'foo'
      },
      username: 'foo',
      password: 'bar',
      doTest: function() {
        var self = this
        assert.throws(function() {
          var authenticator = o(self.authenticator)
        }, Error)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestHttpBasicAuthenticatorUnspecifiedRequiredFields',
      description: 'Test with unspecified required fields',
      authenticator: {
        _type: _o('../lib/security/HttpBasicAuthenticator'),
        usernameField: 'username'
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
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestHttpBasicAuthenticatorWrongCredentials',
      description: 'Test wrong credentials',
      authenticator: {
        _type: _o('../lib/security/HttpBasicAuthenticator'),
        usernameField: 'username',
        passwordField: 'password'
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
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestHttpBasicAuthenticatorSuccess',
      description: 'Test successful authentication',
      authenticator: {
        _type: _o('../lib/security/HttpBasicAuthenticator'),
        usernameField: 'username',
        passwordField: 'password'
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
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestHttpBasicAuthenticatorPasswordHashFnInitialization',
      description: 'Test password hash function initialization',
      authenticator: {
        _type: _o('../lib/security/HttpBasicAuthenticator'),
        usernameField: 'username',
        passwordField: 'password'
      },
      username: 'foo',
      password: 'bar',
      doTest: function() {
        var self = this
        var BarHasher = oo({
          _type: _o('../lib/security/Hasher'),
          hash: function(data) {
            return 'bar'
          }
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
      }
    }),

    //
    // mongodb http basic
    //

    o({
      _type: MongoDBAuthenticatorTest,
      name: 'TestMongoDBHttpBasicAuthenticatorUnspecifiedRequiredFields',
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
      }
    }),
    o({
      _type: MongoDBAuthenticatorTest,
      name: 'TestMongoDBHttpBasicAuthenticatorUnspecifiedRequiredFields',
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
      }
    }),
    o({
      _type: MongoDBAuthenticatorTest,
      name: 'TestMongoDBHttpAuthenticatorUserDoesNotExist',
      description: 'Test user does not exist',
      authenticator: {
        _type: _o('../lib/security/MongoDBHttpBasicAuthenticator'),
        usernameField: 'username',
        passwordField: 'password',
        userCollection: USERS_COL,
      },
      userRecords: [
        {username: 'bar', password: 'baz'}
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
      }
    }),
    o({
      _type: MongoDBAuthenticatorTest,
      name: 'TestMongoDBHttpAuthenticatorWrongPassword',
      description: 'Test wrong password',
      authenticator: {
        _type: _o('../lib/security/MongoDBHttpBasicAuthenticator'),
        usernameField: 'username',
        passwordField: 'password',
        userCollection: USERS_COL,
      },
      userRecords: [
        {username: 'foo', password: 'baz'}
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
      }
    }),
    o({
      _type: MongoDBAuthenticatorTest,
      name: 'TestMongoDBHttpBasicAuthenticatorSuccess',
      description: 'Test successful authentication',
      authenticator: {
        _type: _o('../lib/security/MongoDBHttpBasicAuthenticator'),
        usernameField: 'username',
        passwordField: 'password',
        userCollection: USERS_COL,
      },
      userRecords: [
        {username: 'foo', password: 'bar'}
      ],
      username: 'foo',
      password: 'bar',
      doTest: function() {
        var authenticator = o(this.authenticator)
        authenticator.initialize(mockService(this.db))
        var req = mockHttpBasicAuthRequest(this.username, this.password)
        var user = authenticator.authenticate(req)
        assert.equal(user.username, this.username)
      }
    }),

    //
    // api key
    //
  ]
})
