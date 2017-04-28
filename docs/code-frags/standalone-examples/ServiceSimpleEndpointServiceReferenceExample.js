var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    endpoints: {
      status: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return { 
            running: true,
            msg: "Up and running on port: " + this.service.port 
          }
        }
      }) 
    }
  }) 
}) 
