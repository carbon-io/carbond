var carbon = require('carbon-io')
var o  = carbon.atom.o(module)

var myService = o({ // IMPORTANT: do not use "o.main" here
  _type: carbon.carbond.Service,
  port: 8888,
  endpoints: {
    // Endpoint definitions go here
    hello: o({
      _type: carbon.carbond.Endpoint,
      get: function(req) {
        return { msg: 'Hello World!' }
      }
    }) 
  }
}) 

function startService(done) {
  myService.start({}, function(err) {
    if (err) {
      myService.logError('Error starting service ' + err) 
      done(err)
    } else {
      myService.logInfo('Service started') 
      //
      // Do stuff...
      //
      myService.stop(function(err) {
        myService.logInfo('Service stopped') 
        done(err)
      }) 
    }
  })
}

if (module === require.main) {
  startService(function(err) {
    process.exit(err ? 1 : 0)
  })
}

module.exports = {
  myService: myService,
  startService: startService
}

