var request = require('request')
var o = require('maker').o;
var oo = require('maker').oo;
var _o = require('maker')._o;

/******************************************************************************
 * @class ProxyEndpoint
 */
module.exports = oo({

    /**********************************************************************
     * _type
     */
    _type: "datanode/lib/Endpoint", // XXX

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
