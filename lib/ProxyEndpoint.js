var request = require('request')
var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);

/******************************************************************************
 * @class ProxyEndpoint // XXX needs work just a rough idea
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: "datanode/Endpoint",

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.proxyURI = null
  }

  /**********************************************************************
   * get
   */        
  get: function(req, res) {
    this._proxy(req, res)
  },

  /**********************************************************************
   * _proxy
   */        
  _proxy: function(req, res) {
    var url = this.proxyURI
    if (url) {
      req.pipe(request(url)).pipe(res) // XXX security?
    }
  }

})
