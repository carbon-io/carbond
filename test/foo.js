var o = require('atom').o(module)
var oo = require('atom').o(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__(module, true)
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../')
var _ = require('lodash')
var assertRequests = require('./test-helper').assertRequests

__(function() {
  var t = oo({
    foo: {
      $property: {
        get: _.memoize(function() {
          var self = this
          console.log("foo")
          return { a: 1 }
        }, function() { return this }) // but then type prevents instances from gc
      }
    }
  })


  var a1 = o({_type: t})
  var a2 = o({_type: t})

  a1.foo
  a2.foo
  console.log("yo")
  a1.foo
  a2.foo

})
