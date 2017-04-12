var assert = require('assert')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

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

var ObjectId = require('@carbon-io/carbon-core').leafnode.mongodb.ObjectId

/**************************************************************************
 * IdGeneratorTests
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
})
