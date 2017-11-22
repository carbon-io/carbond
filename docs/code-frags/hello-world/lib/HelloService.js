var path = require('path')

var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var o = carbon.atom.o(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    /*
     * implementation...
     */
    port: 8888,
    // first definition is for presentation, second is for testing
    dbUri: "mongodb://localhost:27017/mydb",
    dbUri: _o('env:CARBONIO_TEST_DB_URI') || "mongodb://localhost:27017/mydb",
    endpoints: {
      feedback: o({
        _type: carbon.carbond.collections.Collection,
        schema: {
          type: 'object',
          properties: {
            _id: {
              type: 'ObjectId'
            }
          },
          required: ['_id'],
          additionalProperties: true
        },
        enabled: {
          insert: false, // insert is disabled even though it is defined below
          find: true
        },
        // POST /feedback
        insertObject: function(object, options) {
          /*
           * implementation...
           */
          var col = this.service.db.getCollection(path.basename(this.path))
          return col.insertObject(obj)
        },
        // find operation config (will be instantiated as o(this.findConfig, this.FindConfigClass))
        findConfig: {
          additionalParameters: {
            name: 'query',
            description: 'A MongoDB query',
            location: 'query',
            schema: {
              type: 'object'
            },
            default: {}
          }
        },
        // GET /feedback
        find: function(options) {
          /*
           * implementation...
           */
          var col = this.service.db.getCollection(path.basename(this.path))
          return col.find(options.query).toArray()
        }
      })
    }
  })
})
