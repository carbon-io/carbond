var o = require('maker').o;
var oo = require('maker').oo;
var _ = require('maker')._;

/******************************************************************************
 * @class Endpoint
 */
module.exports = oo({

    /**********************************************************************
     * _all_methods
     */        
    _all_methods: ['get', 'post', 'put', 'delete', 'head', 'options'],

    /**********************************************************************
     * _mountPoint
     */
    _mountPoint: "/",

    /**********************************************************************
     * uriPattern
     *
     * URI pattern (e.g.: "/widgets/:id")
     */        
    uriPattern : null, // XXX do we mind this prints relative?
    
    /**********************************************************************
     * endpointPath
     */        
    endpointPath: { 
        "$property" : {
            enumerable: true,
            get: function() {
                if (this.uriPattern) {
                    return this._mountPoint + "/" + this.uriPattern
                } else {
                    return this._mountPoint
                }
            }
        }
    },

    /**********************************************************************
     * _objectserver
     */        
    _objectserver: null,

    /**********************************************************************
     * options
     */       
    options : function(req, res) {
        // XXX have no idea if this is right
        var methods = []
        for (var method in this._all_methods) {
            if (this[method]) {
                methods.push(method)
            }
        }
        res.send({ "options" : methods })
    },

    /**********************************************************************
     * initialize
     *
     * @param {ObjectServer} objectserver
     */        
    initialize : function(objectserver, mountPoint) {
        this._objectserver = objectserver
        this._mountPoint = mountPoint

        var app = objectserver._app;
        for (var m in this._all_methods) {
            this._initializeEndpointMethod(app, this._all_methods[m]);
        }
    },

    /**********************************************************************
     * _initializeEndpointMethod
     */        
    _initializeEndpointMethod : function(app, method) {
        if (this[method]) {
            var me = this;
            var f = function(req, res) {
                me[method](req, res);
            };
            app[method](this.endpointPath, f);
        }
    }

});
/*
var TestEndpoint = o({
    "_type" : Endpoint,
    
    "message" : null,
    
    "get" : function(req, res) {
        res.send({ message : this.message });
    }
});
*/
