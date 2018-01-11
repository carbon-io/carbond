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
      return util.overrideOrSuper(Endpoint, this, 'post', arguments, req, true)
    },
  },

  head: {
    name: 'head',
    description: 'pong head',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'head', arguments, req, true)
    }
  },

  get: {
    name: 'get',
    description: 'pong get',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'get', arguments, req, true)
    }
  },

  put: {
    name: 'put',
    description: 'pong put',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'put', arguments, req, true)
    }
  },

  patch: {
    name: 'patch',
    description: 'pong patch',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'patch', arguments, req, true)
    }
  },

  delete: {
    name: 'delete',
    description: 'pong delete',
    service: function(req, res) {
      return util.overrideOrSuper(Endpoint, this, 'delete', arguments, req, true)
    }
  },
})

module.exports = _Endpoint
