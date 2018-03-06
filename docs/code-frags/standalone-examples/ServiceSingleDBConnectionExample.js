var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    dbUri: 'mongodb://localhost:27017/mydb',
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return this.getService().db
            .getCollection('messages')
            .find()
            .toArray()
        },
      }),
    },
  })
})
