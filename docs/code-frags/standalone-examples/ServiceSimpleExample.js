var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    middleware: [
      function(req, res, next) {
        console.log('This is called on every request')
        next()
      } 
    ],
    endpoints: {
      // Endpoint definitions go here
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return { msg: "Hello World!" }
        }
      }) 
    }
  }) 
})

