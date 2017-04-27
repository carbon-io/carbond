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
          find: true,
          '*': false,
        },
        insert: function(obj) {
          /*
           * implementation...
           */
          var col = this.service.db.getCollection(path.basename(this.path))
          return col.insertObject(obj)
        },
        find: function(query) {
          /*
           * implementation...
           */
          var col = this.service.db.getCollection(path.basename(this.path))
          return col.find(query).toArray()
        }
      })
    }
  })
})
