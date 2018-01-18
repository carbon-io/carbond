// pre-logging-simpleExampleVerbosityHeader
// pre-logging-simpleExampleHeader
var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    // post-logging-simpleExampleHeader
    verbosity: 'info',
    /*
     * endpoint definitions...
     */
    // post-logging-simpleExampleVerbosityHeader
    // pre-logging-simpleExampleBody
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          this.getService().logInfo("GET on /hello called")
          try {
            // Do stuff
            // post-logging-simpleExampleBody
            if (req.query.error) {
              throw new Error()
            }
            // pre-logging-simpleExampleFooter
          } catch (e) {
            this.getService().logError("Error while doing stuff")
          }
          return {msg: "Hello World!"}
        }
      })
    }
  // pre-logging-simpleExampleVerbosityFooter
  })
})
// post-logging-simpleExampleFooter
// post-logging-simpleExampleVerbosityFooter
