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
    endpoint.supportedMethods().forEach(function(method) {
      if (method === 'options') {
        if (endpoint.objectserver.generateOptionsMethodsInDocs) {
          result[method] = self._generateMethodDescriptor(endpoint, method)
        }
      } else {
        result[method] = self._generateMethodDescriptor(endpoint, method)
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
      parameters: this._generateOperationParameters(endpoint, method),
      tags: this._generateEndpointTags(endpoint.path)
    }    

    return result
  },

  /**********************************************************************
   * _generateOperationParameters
   */
  _generateOperationParameters: function(endpoint, method) {
    var result = []

    // params defined on operation
    var operation = endpoint[method]
    var operationParameters = {}
    if (operation) {
      operationParameters = operation.getAllParameters() || {}
      for (parameterName in operationParameters) {
        var parameter = operationParameters[parameterName]
        var swaggerParameterObject = this._makeSwaggerParamaterObject(parameter)
        result.push(swaggerParameterObject)
      }
    }

    // path params can be auto-generated even if not explicitly defined
    var pathParameters = this._getPathParameters(endpoint.path)
    if (pathParameters) {
      pathParameters.forEach(function(param) {
        var paramName = param.substring(1) // XXX hack
        if (!operationParameters[paramName]) { // only if not defined explicitly
          result.push({
            'name': paramName, 
            'description': paramName,
            'in': "path",
            'required': true, // XXX Check on :id? vs :id support in swagger. Seems they don't support
          })
        }
      })
    }

    return result
  },

  /**********************************************************************
   * _makeSwaggerParamaterObject
   */
  _makeSwaggerParamaterObject: function(parameterDefinition) {
    var result = {}
    
    result.name = parameterDefinition.name
    result.description = parameterDefinition.description
    result.in = parameterDefinition.location
    if (parameterDefinition.schema) {
      if (parameterDefinition.location === "body") {
        result.schema = parameterDefinition.schema
      } else { // XXX This might not work for swagger unless schema type is non-object
        var supportedFields = [
          'type',
          'items',
          'format',
          'description',
          'maximum',
          'exclusiveMaximum',
          'minimum',
          'exclusiveMinimum',
          'maxLength',
          'minLength',
          'pattern',
          'maxItems',
          'minItems',
          'uniqueItems',
          'enum'
        ]
        
        supportedFields.forEach(function(field) {
          result[field] = parameterDefinition.schema[field]
        })
      }
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
