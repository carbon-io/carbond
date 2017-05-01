var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var o = carbon.atom.o(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    dbUris: {
      main: 'mongodb://localhost:27017/mydb',
      reporting: 'mongodb://localhost:27017/reporting'
    },
    endpoints: {
      messages: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return this.service.dbs['main']
                             .getCollection('messages')
                             .find()
                             .toArray()
        }
      }),
      dashboards: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return this.service.dbs['reporting']
                             .getCollection('dashboards')
                             .find()
                             .toArray()
        }
      })
    }
  })
})

