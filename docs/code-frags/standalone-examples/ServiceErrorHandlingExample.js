var carbon = require('carbon-io')
var __ = carbon.fibers.__(module)
var o  = carbon.atom.o(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        post: function(req) {
          if (Object.keys(req.body).length === 0) {
            throw new carbon.HttpErrors.BadRequest('Must supply a body')
          }
          return {msg: 'Hello World! ' + carbon.ejson.stringify(req.body)}
        },
      }),
      goodbye: o({
        _type: carbon.carbond.Endpoint,
        post: function(req) {
          if (Object.keys(req.body).length === 0) {
            throw new (this.getService().errors.BadRequest)('Must supply a body')
          }
          return {msg: 'Goodbye World! ' + carbon.ejson.stringify(req.body)}
        },
      }),
    },
  })
})

