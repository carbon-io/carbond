var assert = require('assert')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var OperationParameter = require('..').OperationParameter

/**************************************************************************
 * OperationParameterTests
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
    name: 'OperationParameterTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: testtube.Test,
        name: 'ValidationTests',
        tests: [
          o({
            _type: testtube.Test,
            name: 'NameValidationTest',
            doTest: function() {
              // missing
              assert.throws(() => o({
                _type: OperationParameter,
                location: 'body'
              }), TypeError, /OperationParameter\.name (undefined) .+/)
              // invalid type
              assert.throws(() => o({
                _type: OperationParameter,
                name: 666,
                location: 'body'
              }), TypeError, /OperationParameter\.name (666) .+/)
            }
          }),
          o({
            _type: testtube.Test,
            name: 'LocationValidationTest',
            doTest: function() {
              // missing
              assert.throws(() => o({
                _type: OperationParameter,
                name: 'foo'
              }), TypeError, /OperationParameter\.location (undefined) .+/)
              // invalid location
              assert.throws(() => o({
                _type: OperationParameter,
                name: 'foo',
                location: 'bar'
              }), TypeError, /OperationParameter\.location (bar) .+/)
              // invalid type
              assert.throws(() => o({
                _type: OperationParameter,
                name: 'foo',
                location: 666
              }), TypeError, /OperationParameter\.location (666) .+/)
            }
          })
        ]
      }),
    ]
  })
})

