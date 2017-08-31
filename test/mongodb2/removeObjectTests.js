var assert = require('assert')
var url = require('url')

var _ = require('lodash')
var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var ejson = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../..')
var pong = require('../fixtures/pong')

/**************************************************************************
 * removeObject tests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: 'removeObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigRemoveObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            removeObject: o({
              _type: pong.MongoDBCollection,
              enabled: {removeObject: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
        },
        teardown: function(context) {
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
        ]
      })
    ]
  })
})

