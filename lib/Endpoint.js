var o = require('atom').o(module);
var oo = require('atom').oo(module);

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
 *      parameters: { ...
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
    this.objectserver = null
    this.acl = null // XXX add to docs
    this.sanitizesOutput = false
    this.sanitizeMode = 'strict' // 'strict' or 'filter' (XXX add to docs)
    this.allowUnauthenticated = null // can be [] of methods
    this.endpoints = {}
  },
  
  /**********************************************************************
   * operations()
   */       
  operations: function() {
    var result = []
    var self = this
    this.ALL_METHODS.forEach(function(method) {
      var m = self[method]
      if (m) {
        result.push(m)
      }
    })    

    return result
  },

  /**********************************************************************
   * supportedMethods
   */       
  supportedMethods: function() {
    var result = []
    var self = this
    this.ALL_METHODS.forEach(function(method) {
      if (self[method]) {
        result.push(method)
      }
    })    

    return result
  },
  
  /**********************************************************************
   * options
   */       
  options: function(req, res) {
    var self = this
    var methods = this.supportedMethods()
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

