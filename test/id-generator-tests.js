var o = require('atom').o(module)
var assert = require('assert')
var ObjectId = require('leafnode').mongodb.ObjectId

/*******************************************************************************
 * id generator tests
 */

var idg1 = o({ _type: '../lib/ObjectIdGenerator' })
var idg2 = o({ _type: '../lib/ObjectIdGenerator', generateStrings: true })

assert(idg1.generateId() instanceof ObjectId)
assert(typeof(idg2.generateId()) === 'string')

            
