// pre-services-syncExampleHeader
var carbon = require('carbon-io')
var __ = carbon.fibers.__(module)
var o = carbon.atom.o(module)

var myService = o({ // IMPORTANT: do not use "o.main" here
  _type: carbon.carbond.Service,
  port: 8888,
  endpoints: {
    // post-services-syncExampleHeader
    // Endpoint definitions go here
    // pre-services-syncExampleFooter
    hello: o({
      _type: carbon.carbond.Endpoint,
      get: function(req) {
        return {msg: 'Hello World!'}
      },
    }),
  },
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
    myService.logError('Error starting service ' + e)
    return 1
  }
  return 0
}

if (module === require.main) {
  __(function() {
    process.exit(startService())
  })
}
// post-services-syncExampleFooter

module.exports = {
  myService: myService,
  startService: startService,
}
