var ZSchema = require('z-schema')
var _ = require('underscore')

var o = require('atom').o(module);
var oo = require('atom').oo(module);

/******************************************************************************
 * @class JsonSchemaValidator
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.validateEjson = true
  },
  
  /**********************************************************************
   * ejsonTypeMap
   */       
  ejsonTypeReplacements: {
    ObjectId: { 
      type: 'object',
      required: ['$oid'],
      properties: {
        '$oid' : { type: 'string' }
      }
    },
    Date: { 
      type: 'object',
      required: ['$date'],
      properties: {
        '$date' : { type: 'string' }
      }
    },
    Timestamp: { 
      type: 'object',
      required: ['$timestamp'],
      properties: {
        '$timestamp' : { type: 'string' }
      }
    },
    Regex: { 
      type: 'object',
      required: ['$regex'],
      properties: {
        '$regex' : { type: 'string' },
        '$options': { type: 'string' }
      }
    },
    Undefined: { 
      type: 'object',
      required: ['$undefined'],
      properties: {
        '$undefined': { type: 'boolean' }
      }
    },
    MinKey: { 
      type: 'object',
      required: ['$minKey'],
      properties: {
        '$minKey': { type: 'number', minimum: 1, maximum: 1 }
      }
    },
    MaxKey: { 
      type: 'object',
      required: ['$maxKey'],
      properties: {
        '$maxKey': { type: 'number', minimum: 1, maximum: 1 }
      }
    },
    NumberLong: { 
      type: 'object',
      required: ['$numberLong'],
      properties: {
        '$numberLong': { type: 'string' }
      }
    },
    Ref: { 
      type: 'object',
      required: ['$ref'],
      properties: {
        '$ref': { type: 'string' },
        '$id': {} // XXX not sure about this -- want any type
      }
    }
    
  },

  /**********************************************************************
   * validate
   */       
  validate: function(json, schema) {
    var options = {}
    var validator = new ZSchema(options)

    if (this.validateEjson) {
      schema = this._expandEjsonSchema(schema)
    }
    
    var result = {}
    try {
      result.valid = validator.validate(json, schema)
    } catch (e) {
      throw new Error("Exception in compiling schema or validating json schema: " + schema + " -- Reason: " + e.message)
    }
    if (!result.valid) {
      result.error = validator.getLastErrors()[0].message
    }

    return result
  },

  /**********************************************************************
   * _expandEjsonSchema
   */       
  _expandEjsonSchema: function(schema) {
    var self = this

    if (_.isArray(schema)) {
      return _.map(schema, function(elem) {
        return self._expandEjsonSchema(elem)
      })
    }

    if (_.isObject(schema)) {
      if (schema.type) {
        var typeReplacement = self.ejsonTypeReplacements[schema.type]
        if (typeReplacement) {
          return typeReplacement
        }
      }
      return _.mapObject(schema, function(v, k) {
        return self._expandEjsonSchema(v)
      })
    }

    return schema
  },

  
})

