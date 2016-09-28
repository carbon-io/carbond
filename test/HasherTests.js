var assert = require('assert')
var crypto = require('crypto')

var _ = require('lodash')
var bcrypt = require('bcryptjs')
var sinon = require('sinon')

var _o = require('bond')._o(module)
var o  = require('atom').o(module)
var oo  = require('atom').oo(module)
var testtube = require('test-tube')

var Hasher = require('../lib/security/Hasher')
var NoopHasher = require('../lib/security/NoopHasher')
var Sha256Hasher = require('../lib/security/Sha256Hasher')
var BcryptHasher = require('../lib/security/BcryptHasher')

/**************************************************************************
 * HasherTests
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
  },

  /**********************************************************************
   * name
   */
  name: "HasherTests",

  /**********************************************************************
   * name
   */
  description: "Test the various predefined hashers",

  /**********************************************************************
   * setup
   */
  setup: function() {
  },

  /**********************************************************************
   * teardown
   */
  teardown: function() {
  },

  /**********************************************************************
   * tests
   */
  tests: [

    //
    // Hasher
    //

    o({
      _type: testtube.Test,
      name: 'InstantiateAbstractBaseClass',
      description: 'Test instantiation of abstract base class fails',
      doTest: function() {
        assert.throws(function() {
          var hasher = o({_type: Hasher})
        }, Error)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'GetHasherNames',
      description: 'Test getHasherNames method',
      doTest: function() {
        var hasherNames = Hasher.getHasherNames()
        assert(_.isArray(hasherNames))
        hasherNames.forEach(function(name) {
          assert(_.isString(name))
          assert(name in Hasher._hashers)
        })
      }
    }),
    o({
      _type: testtube.Test,
      name: 'HasherGetHasher',
      description: 'Test getHasher method',
      doTest: function() {
        Hasher.getHasherNames().forEach(function(name) {
          assert(_.isObject(Hasher.getHasher(name)))
        })
        assert.throws(function() {
          Hasher.getHasher('foo')
        }, Error)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'DataProperty',
      description: '',
      setup: function() {
        sinon.stub(Hasher.prototype, '_C')
      },
      teardown: function() {
        Hasher.prototype._C.restore()
      },
      doTest: function() {
        var hasher = o({_type: Hasher})
        // uninitialized `data` property should be undefined
        assert(_.isUndefined(hasher.data))
        hasher._digest = 'bar'
        // assigning to the `data` property should reset the `digest` property
        hasher.data = 'foo'
        assert(_.isUndefined(hasher._digest))
      }
    }),
    o({
      _type: testtube.Test,
      name: 'DigestProperty',
      description: '',
      setup: function() {
        sinon.stub(Hasher.prototype, '_C')
      },
      teardown: function() {
        Hasher.prototype._C.restore()
      },
      doTest: function() {
        var hasher = o({_type: Hasher})
        // if `_data` and `_digest` are uninitialized, `digest` should be undefined
        assert(_.isUndefined(hasher.data))
        hasher.data = 'foo'
        hasher.digest = 'bar'
        // setting `digest` directly should reset `data`
        assert(_.isUndefined(hasher.data))
        hasher.data = 'foo'
        hasher._digest = undefined
        // accessing `digest` should invoke `hash` if `data` has been initialized and
        // `digest` is undefined
        try {
          var mock = sinon.mock(hasher)
          mock.expects('hash').returns('bar').once()
          assert.equal(hasher.digest, 'bar')
          mock.verify()
        } finally {
          mock.restore()
        }
      }
    }),

    o({
      _type: testtube.Test,
      name: 'Eq',
      description: '',
      setup: function() {
        sinon.stub(Hasher.prototype, '_C')
      },
      teardown: function() {
        Hasher.prototype._C.restore()
      },
      doTest: function() {
        var hasher = o({_type: Hasher})
        try {
          var mock = sinon.mock(hasher)
          mock.expects('hash').returns('bar').exactly(4)
          hasher.digest = 'bar'
          // 1 call to hash
          assert(hasher.eq('foo'))
          hasher.data = 'bar'
          // 2 calls to hash
          assert(hasher.eq('foo'))
          hasher.digest = undefined
          // 1 call to hash
          assert(hasher.eq('foo', 'bar'))
          assert(_.isUndefined(hasher.digest))
          assert(_.isUndefined(hasher.data))
          mock.verify()
        } finally {
          mock.restore()
        }
      }
    }),

    //
    // NoopHasher
    //

    o({
      _type: testtube.Test,
      name: 'NoopHashFn',
      description: 'Test the NoopHashser hash function',
      doTest: function() {
        var hasher = o({_type: NoopHasher})
        assert.equal(hasher.hash('foo'), 'foo')
        hasher.data = 'foo'
        assert.equal(hasher.digest, 'foo')
      }
    }),

    //
    // Sha256Hasher
    //

    o({
      _type: testtube.Test,
      name: 'Sha256HashFn',
      description: 'Test the Sha256Hasher hash function',
      doTest: function() {
        var hasher = o({_type: Sha256Hasher})
        var digest = crypto.createHash('sha256').update('foo').digest('hex')
        hasher.eq(hasher.hash('foo'), digest)
        hasher.data = 'foo'
        assert.equal(hasher.digest, digest)
      }
    }),

    //
    // BcryptHasher
    //

    o({
      _type: testtube.Test,
      name: 'BcryptHashFn',
      description: 'Test the BcryptHasher hash function',
      doTest: function() {
        var check = function(hasher, data) {
          digest = hasher.hash(data)
          assert.equal(digest, bcrypt.hashSync(data, bcrypt.getSalt(digest)))
        }

        check(o({_type: BcryptHasher}), 'foo')
        check(o({_type: BcryptHasher, rounds: 12}), 'foo')
      }
    }),
    o({
      _type: testtube.Test,
      name: 'BcryptEqFn',
      description: 'Test the BcryptHasher eq function',
      doTest: function() {
        var hasher = o({_type: BcryptHasher})
        var digest = bcrypt.hashSync('foo')

        try {
          sinon.spy(hasher, 'hash')
          hasher.digest = digest
          // hash not called (bcrypt.compare)
          assert(hasher.eq('foo'))
          hasher.data = 'foo'
          // 1 call to hash
          assert(hasher.eq('foo'))
          hasher.digest = undefined
          // hash not called (bcrypt.compare)
          assert(hasher.eq('foo', digest))
          assert(_.isUndefined(hasher.digest))
          assert(_.isUndefined(hasher.data))
          assert(hasher.hash.calledOnce)
        } finally {
          hasher.hash.restore()
        }
      }
    }),
  ]
})
