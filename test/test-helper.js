var _o = require('bond')._o(module)
var __ = require('fiber').__
var fibrous = require('fibrous')
var _ = require('lodash')
var assert = require('assert')
var BSON = require('leafnode').BSON
var EJSON = require('mongodb-extended-json')
var carbond = require('../')

/*******************************************************************************
 * helpers (EXPERIMENTAL)
 */


/*******************************************************************************
 * assertRequest
 */
function assertRequestHelper(req, res, message, cb) {
  if (!req.url) {
    throw new Error("Request spec must provide a url")
  }

  if (!req.method) {
    throw new Error("Request spec must provide a method")
  }

  var endpoint = _o(req.url)
  // XXX want better method to invoke here
  endpoint._performOperation(req.method.toLowerCase(), [req.body, { 
    params: req.parameters,
    headers: req.headers,
    json: req.json,
    strictSSL: req.strictSSL
  }, function(err, response) {
    if (err) {
      if (res.statusCode >= 400) { // we expect an error
        return cb(null, response)
      }
      cb(err, null)
      return
    }
    _.forEach(res, function(valueSpec, fieldName) {
      var value = response[fieldName]
      if (typeof(valueSpec) === 'function') {
        assert.equal(valueSpec(value), true, 
                     "Assertion failed for field '" 
                     + fieldName + "' with value: " + 
                     EJSON.stringify(value), message)
      } else {
        assert.deepStrictEqual(valueSpec, value, message + " Value: " + 
                               EJSON.stringify(value))
      }
    })

    cb(null, response)
  }])
}

var assertRequest = assertRequestHelper.sync

/*******************************************************************************
 * assertRequests
 */
function assertRequests(tests) {
  if (tests) {
    tests.forEach(function(test) {
      assertRequest(test.req, test.res, EJSON.stringify(test))
    })
  }
}

module.exports = {
  assertRequest: assertRequest,
  assertRequests: assertRequests
}
