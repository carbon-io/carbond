// pre-services-structureHeader
// pre-services-endpointHeader
// pre-services-middlewareHeader
// pre-services-oMainHeader
var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    // post-services-oMainHeader
    // post-services-endpointHeader
    // post-services-structureHeader
    middleware: [
      function(req, res, next) {
        console.log('This is called on every request')
        next()
      }
    ],
    // pre-services-structureBody
    // pre-services-endpointBody
    // pre-services-oMainBody
    endpoints: {
      // post-services-endpointBody
      // Endpoint definitions go here
      // post-services-middlewareHeader
      // post-services-oMainBody
      // post-services-structureBody
      // pre-services-endpointFooter
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return { msg: "Hello World!" }
        }
      })
      // pre-services-structureFooter
      // pre-services-middlewareFooter
      // pre-services-oMainFooter
    }
  })
})
// post-services-structureFooter
// post-services-endpointFooter
// post-services-middlewareFooter
// post-services-oMainFooter
