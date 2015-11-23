var path = require('path')

var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);
var _ = require('underscore');


/*******************************************************************************
 * @class StaticDocumentationGenerator
 */
var StaticDocumentationGenerator = oo({
  /**********************************************************************
   * _C
   */
  _C: function(objectserver) {
    if (objectserver) {
      this._objectserver = objectserver
    }
    else {
      this._objectserver = null
    }
  },

  /**********************************************************************
   * generate api docs
   *
   * @abstract
   * @throws Error
   */
  generateDocs: function(docsPath, singlePage) {
    throw new Error('not implemented')
  },

  /**********************************************************************
   * build api descriptor object to be used by static docs plugins
   *
   * @param {object} options
   * @param {...} options.
   * @returns {object} the descriptor for the api
   */
  _generateDescriptor: function() {
    var self = this

    return {
      version: '1.0.0', // XXX ?
      title: self._objectserver.serviceName || 'ObjectServer',

      description: self._objectserver.description,
      longDescription: null,
      
      // headers, query, path, body
      parameters: self._generateParameterDescriptors(self._objectserver.parameters),

      // XXX: not implemented
      securityModel: null,

      // XXX: should probably pull these from the object server
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],

      // this should be a flattened list of endpoints
      endpoints : self._generateEndpointDescriptors()
    }
  },

  /**********************************************************************
   * flattens and sorts endpoint tree in objectserver (potentially too
   * much nesting otherwise).
   *
   * @returns {array} 
   */
  _generateEndpointDescriptors: function() {
    var self = this

    var endpoints = new Array()

    var flatten = function(eps, topLevel, parentPath) {
      for (var _path in eps) {
        var absPath = path.join(parentPath, _path)
        endpoints.push({
          path: absPath,
          topLevel: topLevel,
          endpoint: eps[_path]
        })
        if (eps[_path].endpoints) {
          flatten(eps[_path].endpoints, false, absPath)
        }
      }
    }
    
    flatten(self._objectserver.endpoints, true, '/')

    var methods = _o('./Endpoint').prototype.ALL_METHODS

    for (var i = 0; i < endpoints.length; i++) {
      var operations = methods.map(function(m) {
          if (endpoints[i].endpoint[m] && 
              (m != "options" || self._objectserver.generateOptionsMethodsInDocs)) {
            return self._generateOperationDescriptor(m, endpoints[i].endpoint[m])
          }
          return undefined
        }).filter(function(e) {
          return e ? true : false;
        })

      if (operations.length == 0) {
        continue
      }

      endpoints[i] = {
        path: endpoints[i].path,
        description: endpoints[i].description,
        topLevel: endpoints[i].topLevel,
        parameters: self._generateParameterDescriptors(endpoints[i].endpoint.parameters),
        allowUnauthenticated: endpoints[i].allowUnauthenticated,
        responseSchema: endpoints[i].responseSchema,
        operations: operations
      }
    }

    endpoints.sort(function(e1, e2) {
      if (e1.path < e2.path) {
        return -1
      } 
      if (e1 > e2) {
        return 1
      }
      return 0
    })

    return endpoints
  },

  /**********************************************************************
   *
   * 
   * @param {object} operation
   * @returns {array}
   */
  _generateOperationDescriptor: function(method, operation) {
    var self = this

    var allParameters = operation.getAllParameters()
    var inheritedParameters = _.keys(allParameters).reduce(function(obj, e) {
          if (! (e in operation.parameters)) {
            obj[e] = allParameters[e]
          }
          return obj
        }, {})

    // XXX: description is not currently a property of "Operation"

    return {
      method: method.toUpperCase(),
      description: operation.description,
      parameters: self._generateParameterDescriptors(operation.parameters, inheritedParameters),
      responseSchema: operation.responseSchema,
      errorResponses: operation.errorResponses

      // XXX: examples request/response
    }
  },

  /**********************************************************************
   * _generateParameterDescriptors
   * 
   * @param {object} parameters 
   * @param {object} inheritedParameters
   * @returns {object}
   */
  _generateParameterDescriptors: function(parameters, inheritedParameters) {
    var _parameters = {
      'path': [],
      'query': [],
      'body': [],
      'header':[] 
    }
    var descriptor = function(parameter, inherited) {
      return {
          name: parameter.name,
          description: parameter.description,
          location: parameter.location,
          schema: parameter.schema,
          required: parameter.required,
          default: parameter.default,
          inherited: inherited,
      }
    }
    if (typeof inheritedParameters != "undefined") {
      for (var parameter in inheritedParameters) {
        _parameters[inheritedParameters[parameter].location].push(
          descriptor(inheritedParameters[parameter], true))
      }
    }
    for (var parameter in parameters) {
      _parameters[parameters[parameter].location].push(descriptor(parameters[parameter], false))
    }
    for (var location in _parameters) {
      if (_parameters[location].length == 0) {
        delete _parameters[location]
      }
    }
    return _parameters
  }

})

/*******************************************************************************
 * Map of doc types to generator classes.
 *
 * @protected
 * @memberof StaticDocumentationGenerator
 * @static
 */
StaticDocumentationGenerator._registeredTypes = {}

/*******************************************************************************
 * Register a generator class for a specific type. 
 *
 * @function registerType
 * @memberof StaticDocumentationGenerator
 * @static
 *
 * @param {string} docType
 * @param {class} cls
 */
StaticDocumentationGenerator.registerType = function(docType, cls) {
  if (typeof docType != 'string') {
    throw new TypeError('docType does not appear to be a string')
  }
  // XXX: how do we check that this is a class (constructor) versus a function?
  if (typeof cls != 'function') {
    throw new TypeError('cls does not appear to be a class')
  }
  StaticDocumentationGenerator._registeredTypes[docType] = cls
}

/*******************************************************************************
 * Create a generator for a particular doc type.
 *
 * @function createGenerator
 * @memberof StaticDocumentationGenerator
 * @static
 *
 * @param {string} docType
 * @returns {StaticDocumentationGenerator}
 */
StaticDocumentationGenerator.createGenerator = function(docType, objectserver) {
  if (!docType in StaticDocumentationGenerator._registeredTypes) {
    throw new Error('no handler registered for ' + docType)
  }
  return new StaticDocumentationGenerator._registeredTypes[docType](objectserver)
}

module.exports = StaticDocumentationGenerator

// register doc generator "plugins"
// XXX: can we avoid including these
require('./GHMDGenerator.js')
