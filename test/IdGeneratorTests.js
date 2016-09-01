var o  = require('atom').o(module).main
var oo  = require('atom').oo(module)
var _o = require('bond')._o(module)
var __ = require('@carbon-io/fibers').__(module)
var testtube = require('test-tube')
var assert = require('assert')
/* XXX
 * var ObjectId = require('ejson').types.ObjectId
 *
 * > idg1.generateId()
 * { _bsontype: 'ObjectID',
 *   id:
 *    { '0': 87,
 *      '1': 200,
 *      '2': 153,
 *      '3': 216,
 *      '4': 135,
 *      '5': 10,
 *      '6': 237,
 *      '7': 199,
 *      '8': 53,
 *      '9': 251,
 *      '10': 137,
 *      '11': 105 } }
 * > typeof idg1.generateId()
 * 'object'
 * > idg1.generateId() instanceof Object
 * true
 */
var ObjectId = require('leafnode').mongodb.ObjectId

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

    debugger
    assert(idg1.generateId() instanceof ObjectId)
    assert(typeof(idg2.generateId()) === 'string')
  }
})
