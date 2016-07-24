var o  = require('atom').o(module).main
var oo  = require('atom').oo(module)
var _o = require('bond')._o(module)
var __ = require('@carbon-io/fibers').__(module)
var testtube = require('test-tube')
var assert = require('assert')
var ObjectId = require('ejson').types.ObjectId

/**************************************************************************
 * IdGeneratorTests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: testtube.Test,

  /**********************************************************************
   * name
   */
  name: "IdGeneratorTests",

  /**********************************************************************
   * doTest
   */
  doTest: function() {
    var idg1 = o({ _type: '../lib/ObjectIdGenerator' })
    var idg2 = o({ _type: '../lib/ObjectIdGenerator', generateStrings: true })

    assert(idg1.generateId() instanceof ObjectId)
    assert(typeof(idg2.generateId()) === 'string')
  }
})
