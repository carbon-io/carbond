var o = require('maker').o(module);
var oo = require('maker').oo(module);

/******************************************************************************
 * @class Endpoint
 *
 *
 * Example:
 * {
 *   type: 'datanode/Endpoint',
 *   
 *   get: function(req, res) { ... },
 *   post: function(req, res) { ... }
 * }
 */
module.exports = oo({

    /**********************************************************************
     * _all_methods
     */        
    _allMethods: ['get', 'post', 'put', 'delete', 'head', 'options'],

    /**********************************************************************
     * _mountPoint
     */
    _mountPoint: "/",

    /**********************************************************************
     * uriPattern
     *
     * URI pattern (e.g.: "/widgets/:id")
     */        
    uriPattern: null, // XXX do we mind this prints relative?
    
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
    options: function(req, res) {
        // XXX have no idea if this is right
        var methods = []
        for (var method in this._allMethods) {
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
    initialize: function(objectserver, mountPoint) {
        this._objectserver = objectserver
        this._mountPoint = mountPoint

        var app = objectserver._app
        for (var m in this._allMethods) {
            this._initializeEndpointMethod(app, this._allMethods[m])
        }
    },

    /**********************************************************************
     * _initializeEndpointMethod
     */        
    _initializeEndpointMethod: function(app, method) {
        if (this[method]) {
            var self = this
            var f = function(req, res) {
                self[method](req, res)
            };
            app[method](this.endpointPath, f)
        }
    }

})

