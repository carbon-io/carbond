// pre-testingHeader
var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

// pre-endpoints
__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    endpoints: {
      // post-testingHeader
      // Endpoint definitions go here
      // pre-testingFooter
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return {msg: 'Hello World!'}
        },
        post: function(req) {
          return {msg: req.body.msg}
        },
      }),
    },
  })
})
// post-endpoints
// post-testingFooter
