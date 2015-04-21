var os = require("os");
var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);

/******************************************************************************
 * @class SwaggerDescriptorGenerator
 */
module.exports = oo({

  /**********************************************************************
   * generateSwaggerDescriptor
   */        
  generateSwaggerDescriptor: function(objectserver) {
    var descriptor = {
      "swagger": 2.0,
      "info": {
        "version": "1.0.0", // XXX ?
        "title": objectserver.serviceName || "ObjectServer",
        "description": objectserver.description
      },
      "host": (objectserver._hostname || os.hostname()) + ":" + objectserver.port, // XXX _hostname? Should we just use default here? 
      "basePath": objectserver.path,
      "schemes": ["http"],
      "consumes": ["application/json"],
      "produces": ["application/json"],
      "paths" : this._generateEndpointPaths(objectserver.endpoints, objectserver.path),
      // XXX experimental
      "securityDefinitions": {
        api_key: {
          type: "apiKey",
          name: "api_key",
            in: "header"
        }
      },
    }

    return descriptor
  },
  
  /**********************************************************************
   * _generateEndpointPaths
   */
  _generateEndpointPaths: function(endpoints, path, result) {
    result = result || {}

    path = path || ""
    if (endpoints) {
      for (var endpointPath in endpoints) {
        this._generateEndpointPath(endpoints[endpointPath], path + "/" + endpointPath, result)
      }
    }

    return result
  },

  /**********************************************************************
   * _generateEndpointPath
   */
  _generateEndpointPath: function(endpoint, path, result) {
    var descriptorPath = this._pathToSwaggerPath(path)
    result[descriptorPath] = this._generatePathDescriptor(endpoint, descriptorPath)    
    this._generateEndpointPaths(endpoint.endpoints, path, result)
  },

  /**********************************************************************
   * _generatePathDescriptor
   */
  _generatePathDescriptor: function(endpoint, descriptorPath) {
    var result = {}
    var self = this
    endpoint.ALL_METHODS.forEach(function(method) {
      if (endpoint[method]) {
        if (method === 'options') {
          if (endpoint.objectserver.generateOptionsMethodsInDocs) {
            result[method] = self._generateMethodDescriptor(endpoint, method)
          }
        } else {
          result[method] = self._generateMethodDescriptor(endpoint, method)
        }
      }
    })

    return result
  },

  /**********************************************************************
   * _generateMethodDescriptor
   */
  _generateMethodDescriptor: function(endpoint, method) {
    var result = {
      produces: ["application/json"],
      parameters: this._generateOpParameters(endpoint, method),
      tags: this._generateEndpointTags(endpoint.path)
    }    

    return result
  },

  /**********************************************************************
   * _generateOpParameters
   */
  _generateOpParameters: function(endpoint, method) {
    var result = []

    // params defined on op
    var route = endpoint[method]
    var routeParams
    if (route) {
      if (typeof(route) === 'function') {
        route = {
          service: route
        }
      }

      routeParams = route.params
      if (!routeParams && method === 'post') {
        // if no params and method is post then assume body param 
        // XXX do we want to assume this?
        routeParams = {
          "body" : { // XXX bug in swagger must call it "body"
            "in": "body",
            description: "JSON object to post",
            required: false, // not required
            schema: {}
          }
        }
      }

      if (routeParams) {
        for (paramName in routeParams) {
          // XXX should consider not just passing document through but hand constructing result
          // plucking known properties from param
          var param = routeParams[paramName]
          param.name = paramName
          result.push(param)
        }
      } 
    }

    // path params
    var pathParameters = this._getPathParameters(endpoint.path)
    if (pathParameters) {
      pathParameters.forEach(function(param) {
        var paramName = param.substring(1) // XXX hack
        if (!(routeParams && routeParams[paramName] && (routeParams[paramName].in === "path"))) {
          result.push({
            name: paramName, 
            description: paramName,
            required: false,
            "in": "path"
          })
        }
      })
    }

    return result
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
  },
  
  /**********************************************************************
   * _pathToSwaggerPath
   */
  _pathToSwaggerPath: function(path) {
    var re = /:(\w+)/g
    return path.replace(re, "{$1}")
  },

  /**********************************************************************
   * _getPathParameters
   */
  _getPathParameters: function(path) {
    var re = /:(\w+)/g
    return path.match(re, "{$1}") 
  }
    
})
