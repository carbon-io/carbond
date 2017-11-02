var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var carbond = require('../../../')
var Endpoint = carbond.Endpoint

var util = require('./util')

/***************************************************************************************************
 *
 */
var _Endpoint = oo({
  _type: Endpoint,

  _C: function() {
    this.overrides = {}
    this.disabled = []
  },

  _init: function() {
    var self = this
    _.forEach(this.disabled, function(op) {
      delete self[op]
    })
    Endpoint.prototype._init.call(this)
    util.setNestedProps(this, this.overrides)
  },

  post: {
    name: 'post',
    description: 'pong post',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'post', req, arguments, true)
    },
  },

  head: {
    name: 'head',
    description: 'pong head',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'head', req, arguments, true)
    }
  },

  get: {
    name: 'get',
    description: 'pong get',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'get', req, arguments, true)
    }
  },

  put: {
    name: 'put',
    description: 'pong put',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'put', req, arguments, true)
    }
  },

  patch: {
    name: 'patch',
    description: 'pong patch',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'patch', req, arguments, true)
    }
  },

  delete: {
    name: 'delete',
    description: 'pong delete',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'delete', req, arguments, true)
    }
  },
})

module.exports = _Endpoint
