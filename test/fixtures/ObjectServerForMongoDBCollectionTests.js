var o = require('atom').o(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__(module, true)
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../../')

/*******************************************************************************
 * ObjectServerForMongoDBCollectionTests
 */
__(function() {
  module.exports = o({
    _type: carbond.ObjectServer,
    
    port: 8888,
    verbosity: 'info',

    dbUri: "mongodb://localhost:27017/mongodb-collection-tests",
    
    endpoints: {
      // Simple endpoint with Collection operations defined as functions
      zipcodes: o({
        _type: carbond.mongodb.MongoDBCollection,
        collection: 'zipcodes',

        idRequiredOnInsert: true,

        schema: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            state: { type: 'string' }
          },
          additionalProperties: false,
          required: ['_id', 'state']
        },

        querySchema: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            state: { type: 'string' }
          },
          additionalProperties: false
        },

        updateSchema: {
          type: 'object',
          properties: {
            state: { type: 'string' }
          },
          required: ['state'],
          additionalProperties: false
        }
      })
    }
  })

})
