var o = require('maker').o(module);
var oo = require('maker').oo(module);

/******************************************************************************
 * @class Endpoint
 *
 *
 * Example:
 * {
 *   _type: 'datanode/Endpoint',
 *   
 *   get: function(req, res) { ... },
 *   post: function(req, res) { ... }
 *   put: {
 *      params: { ...
 *      }, 
 *      ...
 *      service: function(req, res) { ... }
 *   } 
 * }
 */
module.exports = oo({

  /**********************************************************************
   * ALL_METHODS
   */        
  ALL_METHODS: ['get', 'post', 'put', 'delete', 'head', 'options'], // XXX create or would that only be for Collections? patch?
  
  /**********************************************************************
   * _C
   */
  _C: function() {
    this.path = '' // Can be URI pattern (e.g.: "widgets/:id")
    this.parent = null
    this.objectserver = null
    this.acl = null // XXX add to docs
    this.endpoints = {}
  },
  
  /**********************************************************************
   * options
   */       
  options: function(req, res) {
    var self = this
    var methods = []
    this.ALL_METHODS.forEach(function(method) {
      if (self[method]) {
        methods.push(method)
      }
    })    
    var methodsString = methods.join(',')

    // set Allow header
    res.header("Allow", methodsString)

    // set CORS headers
    if (this.objectserver.corsEnabled) {
      var allowHeaders = ['Authorization', 'Content-Length', 'X-Requested-With', 'Content-Type'] // XXX review these
      if (this.objectserver.authenticator) {
        var authHeaders = this.objectserver.authenticator.getAuthenticationHeaders()
        if (authHeaders) {
          allowHeaders = allowHeaders.concat(authHeaders)
        }
      }
      var allowHeadersString = allowHeaders.join(',') 

      res.header("Access-Control-Allow-Origin", "*") // XXX for some reason we also need this on every method
      res.header("Access-Control-Allow-Methods", methodsString)
      res.header('Access-Control-Allow-Headers', allowHeadersString)
    }

    // respond
    res.status(200).end()
  }
  
})

