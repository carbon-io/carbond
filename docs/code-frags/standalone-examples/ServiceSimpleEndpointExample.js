var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    endpoints: {
      // Endpoint definitions go here
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return {msg: "Hello World!"}
        },
        post: function(req) {
          return {msg: req.body.msg}
        }
      }) 
    }
  }) 
})
