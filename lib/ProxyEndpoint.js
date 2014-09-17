var request = require('request')
var o = require('maker').o(module);
var oo = require('maker').oo(module);
var _o = require('maker')._o(module);

/******************************************************************************
 * @class ProxyEndpoint
 */
module.exports = oo({

    /**********************************************************************
     * _type
     */
    _type: "datanode/Endpoint",

    /**********************************************************************
     * proxyURI
     */
    proxyURI: null,

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
