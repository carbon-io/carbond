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
 * insertObject tests
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
    name: 'insertObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigInsertObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insertObject: o({
              _type: pong.MongoDBCollection,
              enabled: {insertObject: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.insertObject.idParameter
          context.global.idHeader = this.service.endpoints.insertObject.idHeader
        },
        teardown: function(context) {
          pong.util.idGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
        ]
      })
    ]
  })
})

