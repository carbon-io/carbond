var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var carbond = require('../../../')

var setNestedProps = require('./util').setNestedProps

/***************************************************************************************************
 *
 */
var Service = oo({
  _type: carbond.Service,

  port: 8888,
  verbosity: 'warn',

  parameters: {
    'x-return-body': {
      name: 'x-pong',
      description: 'EJSON serialized response',
      location: 'header'
    }
  },

  _C: function() {
    this.overrides = {}
  },

  _init: function() {
    carbond.Service.prototype._init.call(this)
    setNestedProps(this, this.overrides)
  }
})

module.exports = Service
