var assert = require('assert')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var o  = require('@carbon-io/carbon-core').atom.o(module)
var tt = require('@carbon-io/carbon-core').testtube
var EJSON = require('@carbon-io/carbon-core').ejson

var ObjectId = EJSON.types.ObjectId
var Timestamp = EJSON.types.Timestamp

/**************************************************************************
 * ParameterParsingTests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: tt.Test, // trying out tt

    /**********************************************************************
     * name
     */
    name: "ParameterParsingTests",

    /**********************************************************************
     * process
     */
    process: function(test) {
      var self = this
      var datum = test.datum
      var definition = o(test.definition, '../lib/OperationParameter')
      var value = undefined
      try {
        (test.error ? assert.throws : function(f) { f() })(
          function() {
            value = self.parser.processParameterValue(datum, definition)
          }
        )
      } catch (e) {
        throw new Error("Error during test " + EJSON.stringify(test) + ". " + e)
      }
      if (test.error) {
        assert.deepEqual(test.result, value, EJSON.stringify(test))
        assert.deepEqual(typeof(test.result), typeof(value), EJSON.stringify(test))
      }
      return value
    },

    /**********************************************************************
     * doTest
     */
    doTest: function() {
      var self = this
      self.parsingTests.forEach(function(test) {
        self.process(test)
      })
    },

    /**********************************************************************
     * parser
     */
    parser: o({
      _type: '../lib/ParameterParser',
    }),

    /**********************************************************************
     * tests
     */
    parsingTests: [
      {
        datum: undefined,
        definition: {
          name: 'x',
          schema: { type: 'Undefined' }
        },
        result: undefined
      },

      {
        datum: '{ "$undefined": true }',
        definition: {
          name: 'x',
          schema: { type: 'Undefined' }
        },
        result: undefined
      },

      {
        datum: undefined,
        definition: {
          name: 'x',
          schema: { type: 'number' },
        default: 2
        },
        result: 2
      },

      {
        datum: '',
        definition: {
          name: 'x',
          schema: { type: 'number' },
        default: 2
        },
        result: 2
      },

      {
        datum: null, // XXX I think this is right but might interact strangely with qs parser so revisit this
        definition: {
          name: 'x',
          schema: { type: 'number' },
        default: 2
        },
        result: 2
      },

      {
        datum: "null",
        definition: {
          name: 'x',
          schema: { type: 'null' },
        },
        result: null
      },

      {
        datum: 3,
        definition: {
          name: 'x',
          schema: { type: 'number' }
        },
        error: true // should error since 3 is not a string
      },

      {
        datum: '3',
        definition: {
          name: 'x',
          schema: { type: 'number' }
        },
        result: 3
      },

      {
        datum: '3',
        definition: {
          name: 'x',
          schema: undefined
        },
        result: '3' // if no schema we do not do any conversions
      },

      {
        datum: '"3"',
        definition: {
          name: 'x',
          schema: { type: 'string' }
        },
        result: "3"
      },

      {
        datum: 'true',
        definition: {
          name: 'x',
          schema: { type: 'boolean' }
        },
        result: true
      },

      {
        datum: 'hello',
        definition: {
          name: 'x',
          schema: { type: 'string'}
        },
        result: "hello"
      },

      {
        datum: '"hello"',
        definition: {
          name: 'x',
          schema: { type: 'string'}
        },
        result: "hello"
      },

      {
        datum: '{"hello": "world"}',
        definition: {
          name: 'x',
          schema: { type: 'string'}
        },
        result: '{"hello": "world"}'
      },

      {
        datum: '      {"hello": "world"} ',
        definition: {
          name: 'x',
          schema: { type: 'string'}
        },
        result: '      {"hello": "world"} '
      },

      {
        datum: '["hello", "world"]',
        definition: {
          name: 'x',
          schema: { type: 'string'}
        },
        result: '["hello", "world"]'
      },

      {
        datum: '["hello", "world"]     ',
        definition: {
          name: 'x',
          schema: { type: 'string'}
        },
        result: '["hello", "world"]     '
      },

      {
        datum: '    "hello" ',
        definition: {
          name: 'x',
          schema: { type: 'string'}
        },
        result: '    "hello" '
      },

      {
        datum: '{ "a": 1 }',
        definition: {
          name: 'x',
          schema: { type: 'object'}
        },
        result: { a:1 }
      },

      {
        datum: '[{ "a": 1 }]',
        definition: {
          name: 'x',
          schema: { type: 'array'}
        },
        result: [{ a:1 }]
      },

      {
        datum: '{ "$date": "1970-01-01T00:00:00.000Z" }',
        definition: {
          name: 'x',
          schema: { type: 'Date'}
        },
        result: new Date(0)
      },

      {
        datum: '{ "$oid": "c2c48257aa5a56df131db1e4" }',
        definition: {
          name: 'x',
          schema: { type: 'ObjectId'}
        },
        result: new ObjectId("c2c48257aa5a56df131db1e4")
      },

      {
        datum: 'c2c48257aa5a56df131db1e4',
        definition: {
          name: 'x',
          schema: { type: 'ObjectId'}
        },
        result: new ObjectId("c2c48257aa5a56df131db1e4")
      },

      {
        datum: { a: '1' },
        definition: {
          name: 'x',
          schema: {
            type: 'object',
            properties: {
              a: { type: 'integer' }
            }
          }
        },
        result: { a: 1 }
      },

      {
        datum: { a: '1' },
        definition: {
          name: 'x',
          location: "body",
          schema: {
            type: 'object',
            properties: {
              a: { type: 'integer' }
            }
          }
        },
        error: true // Will fail validation -- not coerced since in body
      },

      {
        datum: { a: 'true' },
        definition: {
          name: 'x',
          schema: {
            type: 'object',
            properties: {
              a: { type: 'boolean' }
            }
          }
        },
        result: { a: true }
      },

      {
        datum: { a: ['true'] },
        definition: {
          name: 'x',
          schema: {
            type: 'object',
            properties: {
              a: {
                type: 'array',
                items: { type: 'boolean' }
              }
            }
          }
        },
        result: { a: [true] }
      },

      {
        datum: { a: { $timestamp: { t: "0", i: "0" }}},
        definition: {
          name: 'x',
          schema: {
            type: 'object',
            properties: {
              a: { type: 'Timestamp' }
            }
          }
        },
        result: { a: new Timestamp()  }
      },
    ],
  })
})
