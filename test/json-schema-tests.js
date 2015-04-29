var o = require('atom').o(module)
var assert = require('assert')

/*******************************************************************************
 * json schema tests
 */
var jsonSchemaValidator = o({ _type: '../lib/JsonSchemaValidator' })

// test bson expansion
var schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'ObjectId' },
    c: { type: 'Date' },
    d: { type: 'Timestamp' },
    e: { type: 'Regex' },
    f: { type: 'Undefined' },
    g: { type: 'MinKey' },
    h: { type: 'MaxKey' },
    i: { type: 'NumberLong' },
    j: { type: 'Ref' },
    k: { type: 'Array', items: { type: 'Date' }}
  }
}

var expandedSchema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { 
      type: 'object',
      required: ['$oid'],
      properties: {
        '$oid' : { type: 'string' }
      }
    },
    c: { 
      type: 'object',
      required: ['$date'],
      properties: {
        '$date' : { type: 'string' }
      }
    },
    d: { 
      type: 'object',
      required: ['$timestamp'],
      properties: {
        '$timestamp' : { type: 'string' }
      }
    },
    e: { 
      type: 'object',
      required: ['$regex'],
      properties: {
        '$regex' : { type: 'string' },
        '$options': { type: 'string' }
      }
    },
    f: { 
      type: 'object',
      required: ['$undefined'],
      properties: {
        '$undefined': { type: 'boolean' }
      }
    },
    g: { 
      type: 'object',
      required: ['$minKey'],
      properties: {
        '$minKey': { type: 'number', minimum: 1, maximum: 1 }
      }
    },
    h: { 
      type: 'object',
      required: ['$maxKey'],
      properties: {
        '$maxKey': { type: 'number', minimum: 1, maximum: 1 }
      }
    },
    i: { 
      type: 'object',
      required: ['$numberLong'],
      properties: {
        '$numberLong': { type: 'string' }
      }
    },
    j: { 
      type: 'object',
      required: ['$ref'],
      properties: {
        '$ref': { type: 'string' },
        '$id': {} 
      }
    },
    k: { 
      type: 'Array', 
      items:  { 
        type: 'object',
        required: ['$date'],
        properties: {
          '$date' : { type: 'string' }
        }
      },
    }
  }
}

//console.log(schema)
//console.log(jsonSchemaValidator._expandEjsonSchema(schema))
//console.log(expandedSchema)

assert.deepEqual(jsonSchemaValidator._expandEjsonSchema(schema), expandedSchema)
