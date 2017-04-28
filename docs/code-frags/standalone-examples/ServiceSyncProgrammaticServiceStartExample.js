var carbon = require('carbon-io')
var __ = carbon.fibers.__(module)
var o = carbon.atom.o(module)

var myService = o({ // IMPORTANT: do not use "o.main" here
  _type: carbon.carbond.Service,
  port: 8888,
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

function startService() {
  try {
    myService.start()
    myService.logInfo('Service started') 
    //
    // Do stuff...
    //
    myService.stop()
    myService.logInfo('Service stopped') 
  } catch (e) {
    myService.logError("Error starting service " + err) 
    return 1
  }
  return 0
}

if (module === require.main) {
  __(function() {
    process.exit(startService())
  })
}

module.exports = {
  myService: myService,
  startService: startService
}
