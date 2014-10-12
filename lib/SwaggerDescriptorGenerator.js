var os = require("os");

var o = require('maker').o(module);
var oo = require('maker').oo(module);

/******************************************************************************
 * @class SwaggerDescriptorGenerator
 */
module.exports = oo({

    /**********************************************************************
     * generateSwaggerDescriptor
     */        
    generateSwaggerDescriptor: function(objectserver) {
        var me = this
        var descriptor = {
            "swagger": 2.0,
            "info": {
                "version": "1.0.0",
                "title": objectserver.apiName || "ObjectServer",
            },
            "host": (objectserver._hostname || os.hostname()) + ":" + objectserver.port, // XXX _hostname
            "basePath": "",
            "schemes": ["http"],
            "consumes": ["application/json"],
            "produces": ["application/json"],
            "paths" : {}
        }

        // add endpoints
        var endpoints = objectserver.endpoints
        var endpoint
        for (var path in endpoints) {
            var pathDescriptor = descriptor.paths['/' + path] = {}
            endpoint = endpoints[path]
            endpoint._allMethods.forEach(function(method) {
                if (endpoint[method]) {
                    pathDescriptor[method] = {
                        "produces": ["application/json"],
                        "tags": me._generateEndpointTags(path)
                    }
                }
            })
        }

        return descriptor
    },

    /**********************************************************************
     * _generateEndpointTags
     */
    _generateEndpointTags: function(path) {
        var result = []
        var pathArr = path.split('/')
        var tag
        for (var i = 0; i <= pathArr.length; i++) {
            if (i === pathArr.length || pathArr[i][0] === ':') {
                if (pathArr[0] === '') {
                    tag = pathArr.slice(0, i).join('/')
                } else {
                    tag = [''].concat(pathArr.slice(0, i)).join('/')
                }
                result.push(tag)
                break
            }
        }

        return result
    }
    
})
