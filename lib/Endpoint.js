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
   * _allMethods
   */        
  _allMethods: ['get', 'post', 'put', 'delete', 'head', 'options'], // XXX public?
  
  /**********************************************************************
   * path
   *
   * Can be URI pattern (e.g.: "widgets/:id")
   */
  path: "",
  
  /**********************************************************************
   * objectserver
   */        
  objectserver: null, // XXX public?
  
  /**********************************************************************
   * options
   */       
  options: function(req, res) {
    // XXX have no idea if this is what options is supposed to return
    var self = this
    var methods = []
    this._allMethods.forEach(function(method) {
      if (self[method]) {
        methods.push(method)
      }
    })
    res.send({ "options" : methods })
  },

  /**********************************************************************
   * endpoints
   */       
  endpoints: {},
  
})

