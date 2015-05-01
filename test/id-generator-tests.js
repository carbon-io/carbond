var o = require('atom').o(module)
var assert = require('assert')
var BSON = require('leafnode').BSON

/*******************************************************************************
 * id generator tests
 */

var idg1 = o({ _type: '../lib/ObjectIdGenerator' })
var idg2 = o({ _type: '../lib/ObjectIdGenerator', generateStrings: true })

assert(idg1.generateId() instanceof BSON.ObjectID)
assert(typeof(idg2.generateId()) === 'string')



            
