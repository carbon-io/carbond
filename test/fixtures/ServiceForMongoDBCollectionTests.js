var o = require('@carbon-io/carbon-core').atom.o(module).main

var carbond = require('../../')

var config = require('../Config')

/***************************************************************************************************
 * ServiceForMongoDBCollectionTests
 */
module.exports = o({
  _type: carbond.Service,

  port: 8888,
  verbosity: 'warn',

  dbUri: config.MONGODB_URI + '/mongodb-collection-tests',

  endpoints: {
    // Simple endpoint with Collection operations defined as functions
    zipcodes: o({
      _type: carbond.mongodb.MongoDBCollection,
      collection: 'zipcodes',
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
      // updateSchema: {
      //   type: 'object',
      //   properties: {
      //     state: { type: 'string' }
      //   },
      //   required: ['state'],
      //   additionalProperties: false
      // }
      findConfig: {
        pageSize: 5,
        maxPageSize: 10
      },
    }),
    'bag-of-props': o({
      _type: carbond.mongodb.MongoDBCollection,
      collection: 'bag-of-props',

      enabled: {
        '*': true
      },

      schema: {
        type: 'object',
        properties: {
          _id: { type: 'ObjectId' },
        },
        additionalProperties: true,
        required: ['_id']
      },
    })
  }
})
