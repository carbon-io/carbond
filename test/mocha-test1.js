var o = require('atom').o(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__(module)
var _ = require('lodash')
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../')

/*******************************************************************************
 * endpoint tests
 */
//var objectServer1 = _o('./fixtures/ObjectServer1')

var objectServer1 =  o({
  _type: carbond.ObjectServer,
  
  port: 8888,
  verbosity: 'fatal',
  
  endpoints: {
    e1: o({
      _type: carbond.Endpoint,
      get: function(req, res) {
        return { 
          hello: "world",
          params: req.query
        }
      },
        
      post: function(req, res) {
        return {
          body: req.body
        }
      },

      put: function(req, res) {
        return {
          body: req.body
        }
      },

      patch: function(req, res) {
        return {
          body: req.body
        }
      },

      delete: function(req, res) {
        return { n: 1 }
      }

    })
  }
})

console.log("yo")

/*
describe("Basic Endpoint Tests", function() {
  var service

  before(function(done) {
    objectServer1.start({}, function() {
      __(function() {
        service = _o('http://localhost:8888')
        done()
      })
    })
  })

  it('test1', function(done) {
    __(function() {
      console.log(service.getEndpoint('e1').get().body)
      done()
    })
  })

  it('test2', function(done) {
    service.getEndpoint('e1').get(function(err, res) {
      console.log(res.body)
      done()
    })
  })

  after(function(done) {
    objectServer1.stop(done)
  })

})
*/

            
function assertRequestHelper(req, res, cb) {
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
      cb(err, null)
      return
    }
    _.forEach(res, function(valueSpec, fieldName) {
      var value = response[fieldName]
      if (typeof(valueSpec) === 'Function') {
        assert.equal(valueSpec(value), true, 
                     "Assertion failed for field '" 
                     + fieldName + " with value '" + value)
      } else {
  //      assert.deepStrictEqual(valueSpec, value)      
        assert.deepEqual(valueSpec, value)
      }
    })

    cb(null, response)
  }])
}

objectServer1.start({}, function() {
  __(function() {
    var req = {
      url: "http://localhost:8888/e1",
      method: "GET"
    }

    var res = {
      statusCode: 200,
      body: {
        hello: "world",
        params: {}
      }
    }

    assertRequestHelper(req, res, function(err, result) {
      console.log(err)
      console.log(result.body)

      objectServer1.stop()  
    })

  })
  
})


console.log("yoyo")
