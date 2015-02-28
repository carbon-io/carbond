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
    // XXX have no idea if this is what options is supposed to return
    var self = this
    var methods = []
    this.ALL_METHODS.forEach(function(method) {
      if (self[method]) {
        methods.push(method)
      }
    })
    res.send({ "options" : methods })
  }
  
})

