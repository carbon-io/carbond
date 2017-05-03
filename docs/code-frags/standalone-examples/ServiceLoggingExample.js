var carbon = require('carbon-io') 
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    verbosity: 'info',
    /*
     * endpoint definitions...
     */
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          this.getService().logInfo("GET on /hello called")
          try {
            // Do stuff
            if (req.query.error) {
              throw new Error()
            }
          } catch (e) {
            this.getService().logError("Error while doing stuff")
          }
          return {msg: "Hello World!"}
        }
      }) 
    }
  }) 
})
