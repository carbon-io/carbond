var path = require('path')

// pre-definingYourServiceHeader
// pre-preamble
// pre-collections-simpleCollection1
var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var o = carbon.atom.o(module)
// post-preamble

// pre-exportsHeader
__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    // post-collections-simpleCollection1
    /*
     * implementation...
     */
    // post-exportsHeader
    // post-definingYourServiceHeader
    // pre-collections-simpleCollection2
    port: 8888,
    dbUri: "mongodb://localhost:27017/mydb",
    // post-collections-simpleCollection2
    // first definition is for presentation, second is for testing
    dbUri: _o('env:CARBONIO_TEST_DB_URI') || "mongodb://localhost:27017/mydb",
    // pre-collections-simpleCollection3
    endpoints: {
      feedback: o({
        _type: carbon.carbond.collections.Collection,
        // post-collections-simpleCollection3
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
        // pre-collections-simpleCollection4
        enabled: {
          // post-collections-simpleCollection4
          insert: false, // insert is disabled even though it is defined below
          // pre-collections-simpleCollection5
          find: true
        },
        // post-collections-simpleCollection5
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
          parameters: {
            $merge: {
              query: {
                name: 'query',
                description: 'A MongoDB query',
                location: 'query',
                schema: {
                  type: 'object'
                },
                default: {}
              }
            }
          }
        },
        // GET /feedback
        // pre-collections-simpleCollection6
        find: function(options) {
          /*
           * implementation...
           */
          // post-collections-simpleCollection6
          var col = this.service.db.getCollection(path.basename(this.path))
          return col.find(options.query).toArray()
          // pre-collections-simpleCollection7
        }
      })
    }
    // pre-exportsFooter
    // pre-definingYourServiceFooter
  })
})
// post-collections-simpleCollection7
// post-exportsFooter
// post-definingYourServiceFooter
