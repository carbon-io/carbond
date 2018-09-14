var assert = require('assert')
var fs = require('fs')
var path = require('path')
var readline = require('readline')

var handlebars = require('handlebars')
var _ = require('lodash');

var o = require('@carbon-io/carbon-core').atom.o(module);
var oo = require('@carbon-io/carbon-core').atom.oo(module);
var _o = require('@carbon-io/carbon-core').bond._o(module);

const carbond_schema = require('carbond-schema')

/*******************************************************************************
 * @class StaticDocumentationGenerator
 */
var StaticDocumentationGenerator = oo({
  _ctorName: 'StaticDocumentationGenerator',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this._service = null
    this._includeUndocumented = false
  },

  /**********************************************************************
   * _init
   */
  _init: function() {
    this._registerHandlebarsHelpers()
    this._registerHandlebarsPartials()
  },

  _showOptions: function() {
    console.log('options:\n')
    if (_.isUndefined(this._options) || _.keys(this._options).length === 0) {
      console.log(
        '<no options>'
      )
    } else {
      for (var opt in this._options) {
        var option = this._options[opt]
        var optionStr = opt
        if (option.type) {
          optionStr += ' {' + option.type + '}'
        }
        optionStr += ' - ' + option.help
        if (option.default) {
          optionStr += ' [default: ' + option.default + ']'
        }
        console.log(optionStr)
      }
    }
    return 0
  },

  /**********************************************************************
   * {
   *   "opt name": {
   *      help: "",
   *      default: <>, // default in the case of "boolean" is false
   *      type: ("boolean"|"number"|"string"), // default is "string"
   *      choices: [...]
   *   }
   * }
   */
  _options: {
    // override in generator subclasses if they have options
  },

  _parseOptions: function(options) {
    var self = this
    var parsedOptions = {}

    // take care of , separated values
    options = _.concat.apply(null, _.map(options, function (value) {
      return _.split(value, ',')
    }))

    options.forEach(function(opt, index) {
      var opt = _.split(opt, ':')
      var default_  = _.get(self._options[opt[0]], 'default', undefined)
      var type  = _.get(self._options[opt[0]], 'type', 'boolean')
      if (opt.length == 1) {
        if (type === 'boolean') {
          opt.push(true)
        } else if (default_) {
          opt.push(default_)
        } else {
          opt.push(undefined)
        }
      }
      switch (type) {
        case 'boolean':
          if (opt[1] === true || opt[1] === 'true') {
            opt[1] = true
          } else if (opt[1] === false || opt[1] === 'false') {
            opt[1] = false
          } else {
            throw new Error(opt[0])
          }
          break
        case 'number':
          opt[1] = Number(opt[1])
          if (_.isNaN(opt[1])) {
            throw new Error(opt[0])
          }
          break
        case 'string':
        default:
          break
      }
      parsedOptions[opt[0]] = opt[1]
    })
    for (var opt in self._options) {
      self._options[opt] = _.get(parsedOptions, opt, _.get(self._options[opt], 'default', undefined))
      if (_.isUndefined(self._options[opt])) {
        throw new Error(opt)
      }
    }
    return parsedOptions
  },

  /**********************************************************************
   * generate api docs
   *
   * @abstract
   * @param {string} docsPath - the path to write docs to
   * @param {list} options - generator specific options (see: _options, _showOptions, and _parseOptions)
   * @returns {int} - 0 on success, >0 on failure
   * @throws Error
   */
  generateDocs: function(docsPath, options) {
    throw new Error('not implemented')
  },

  /**********************************************************************
   * build api descriptor object to be used by static docs plugins
   *
   * @returns {object} the descriptor for the api
   */
  _generateDescriptor: function() {
    var self = this

    return {
      version: '1.0.0', // XXX ?
      title: self._service.serviceName || 'Service',

      description: self._service.description,
      longDescription: null,

      // headers, query, path, body
      parameters: self._generateParameterDescriptors(self._service.parameters),

      // XXX: not implemented
      securityModel: null,

      // XXX: should probably pull these from the service
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],

      // this should be a flattened list of endpoints
      endpoints : self._generateEndpointDescriptors()
    }
  },

  /**********************************************************************
   * flattens and sorts endpoint tree in service (potentially too
   * much nesting otherwise).
   *
   * @returns {array}
   */
  _generateEndpointDescriptors: function() {
    var self = this

    var endpoints = new Array()

    var flatten = function(eps, topLevel, parentPath) {
      for (var _path in eps) {
        if(self._includeUndocumented || !eps[_path].noDocument) {
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
    }

    flatten(self._service.endpoints, true, '/')

    var methods = _o('../Endpoint').prototype.ALL_METHODS

    for (var i = 0; i < endpoints.length; i++) {
      var operations = methods.map(function(m) {
          if (endpoints[i].endpoint[m] &&
            (self._includeUndocumented || !endpoints[i].endpoint[m].noDocument) &&
            (m != "options" || self._service.generateOptionsMethodsInDocs)) {
            return self._generateOperationDescriptor(m, endpoints[i].endpoint[m], endpoints[i].path)
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
        description: endpoints[i].endpoint.description,
        topLevel: endpoints[i].topLevel,
        parameters: self._generateParameterDescriptors(endpoints[i].endpoint.parameters, undefined, endpoints[i].path),
        allowUnauthenticated: endpoints[i].endpoint.allowUnauthenticated,
        operations: operations
      }
    }

    endpoints = _.sortBy(endpoints, ['path'])

    return endpoints
  },

  /**********************************************************************
   *
   *
   * @param {object} operation
   * @returns {array}
   */
  _generateOperationDescriptor: function(method, operation, path_) {
    var self = this

    var allParameters = operation.getAllParameters()
    var inheritedParameters = _.keys(allParameters).reduce(function(obj, e) {
          if (! (e in operation.parameters)) {
            obj[e] = allParameters[e]
          }
          return obj
        }, {})

    const parameterDescriptors = this._generateParameterDescriptors(operation.parameters, inheritedParameters, path_)

    // XXX: description is not currently a property of "Operation"
    return {
      method: method.toUpperCase(),
      description: operation.description,
      parameters: parameterDescriptors,
      requests: self._generateRequestDescriptors(method, operation.parameters, parameterDescriptors),
      responses: self._generateResponseDescriptors(operation.responses)
    }
  },

  _generateRequestDescriptors: function(method, parameters, parameterDescriptors) {
    if (_.includes(['post', 'patch'], method)) {
      const request_schema = _.get(parameters, 'object.schema') || _.get(parameters, 'update.schema')
      const request_schema_flat = carbond_schema.flatten(request_schema)

      if (request_schema_flat.oneOf) {
        return request_schema_flat.oneOf.map(schema => {
          return {
            parameters: parameterDescriptors,
            schema
          }
        })
      }

      return [
        {
          parameters: parameterDescriptors,
          schema: request_schema
        }
      ]
    }

    return [{
      parameters: parameterDescriptors,
      method
    }]
  },

  _generateResponseSchemaDescriptors: function(responses) {
    if (!(responses['200'] || responses['201'])) {
      return ""
    }

    var schema = _.get(responses, '200.schema') || _.get(responses, '201.schema')

     return {
      children: this._recurseSchemaDescriptors(schema)
    }
  },

  _generateRequestSchemaDescriptors: function(method, params) {
    if (!(params) || !_.includes(['post', 'patch'], method)) {
      return ""
    }

    var location = _.get(params, 'object.location') || _.get(params, 'update.location')

    if (location !== 'body') {
      return ""
    }

    var schema = _.get(params, 'object.schema') || _.get(params, 'update.schema')

    return {
      children: this._recurseSchemaDescriptors(schema)
    }
  },

  _recurseSchemaDescriptors: function(schema) {
    var topLevel = schema.items || schema
    var oneOfElements = []

    if (topLevel.oneOf) {
      for (var i = 0; i < topLevel.oneOf.length; i++) {
        if (i === 0) {
          var name = '*(either)*'
        }
        else {
          name = '*(or)*'
        }
        var wrapper = {
          name: name,
          children: this._recurseSchemaDescriptors(topLevel.oneOf[i])
        }
        oneOfElements.push(wrapper)
      }

      return oneOfElements
    }

    var properties = topLevel.properties
    if (!properties){
      return null
    }

    var self = this

    var topLevelKeys = Object.keys(_.omitBy(properties, function(value, key) {
      return value.noDocument
    }))

    var descriptor = function(key){
      var element = {
        name: key,
        type: properties[key]['type']
      }
      if (properties[key]['description']) {
        element['description'] = properties[key]['description']
      }
      if (topLevel['required']) {
        if (topLevel.required.indexOf(key) > -1) {
          element['required'] = true
        }
      }
      element['children'] = self._recurseSchemaDescriptors(properties[key])
      return element
    }

    var result = _.map(topLevelKeys, descriptor)
    return result
  },

  /**********************************************************************
   * _generateParameterDescriptors
   *
   * XXX: get rid of path_ parameter... this should be done somewhere else
   *
   * @param {object} parameters
   * @param {object} inheritedParameters
   * @param {string} path_
   * @returns {object}
   */
  _generateParameterDescriptors: function(parameters, inheritedParameters, path_) {
    var _parameters = {
      'path': [],
      'query': [],
      'body': [],
      'header':[]
    }
    self = this
    var descriptor = function(parameter, inherited) {
      return {
          name: parameter.name,
          description: parameter.description,
          location: parameter.location,
          schema: self._removeNoDocumentProperties(parameter.schema),
          example: parameter.example,
          required: parameter.required,
          default: parameter.default,
          inherited: inherited,
      }
    }
    if (!_.isUndefined(inheritedParameters)) {
      for (var parameter in inheritedParameters) {
        if(this._includeUndocumented || !inheritedParameters[parameter].noDocument) {
          _parameters[inheritedParameters[parameter].location].push(
            descriptor(inheritedParameters[parameter], true))
        }
      }
    }
    for (var parameter in parameters) {
      if(this._includeUndocumented || !parameters[parameter].noDocument) {
        _parameters[parameters[parameter].location].push(descriptor(parameters[parameter], false))
      }
    }
    var existingPathParams = _.map(_parameters.path, function(val) { return val.name })
    _parameters.path = _.concat(_parameters.path, this._getPathParameters(path_, existingPathParams))
    for (var location in _parameters) {
      if (_parameters[location].length == 0) {
        delete _parameters[location]
      }
    }
    return _parameters
  },

  _getPathParameters: function(path_, existingParams) {
    // XXX: refactor this... ripped from static documentation generator
    existingParams = existingParams || []

    var parameters = []

    if (path_) {
      var paramNames = path_.match(/:(\w+)/g, "{$1}")
      if (!_.isNull(paramNames)) {
        paramNames.forEach(function (param) {
          var paramName = param.substring(1) // XXX hack
          if (!_.includes(existingParams, paramName)) { // only if not defined explicitly
            parameters.push({
              name: paramName,
              description: paramName,
              location: 'path',
              // We can't really do type well here since we allow for non-scalar schemas here
              'required': true // XXX Check on :id? vs :id support in swagger. Seems they don't support
            })
          }
        })
      }
    }

    return parameters
  },

  _removeNoDocumentProperties: function(schema){
    if (schema === undefined) {
      return schema
    }

    return JSON.parse(JSON.stringify(schema, function(k,v) {
      if (v.noDocument) {
        return undefined
      }
      return v
    }))
  },

  /**********************************************************************
   * _generateResponseDescriptors
   *
   * @param {object} responses
   * @returns {object}
   */
  _generateResponseDescriptors: function(responses) {
    assert(_.isObject(responses))

    self = this
    const response_filter_2xx  = response => (Math.floor(response.statusCode / 100) === 2)
    const response_filter_n2xx = response => !response_filter_2xx(response)
    
    const descriptor = response => {
      const desc = {
        name: response.statusCode.toString(),
        statusCode: response.statusCode,
        description: response.description,
        schema: self._removeNoDocumentProperties(response.schema),
        example: response.example,
        headers: response.headers.length === 0 ? null : _.join(_.map(response.headers, function(header) {
          return _.trim(header.toString())
        }), '\n')
      }
      return desc
    }

    let descriptors = []

    const responses_2xx  = _.filter(responses, response_filter_2xx)
    const responses_n2xx = _.filter(responses, response_filter_n2xx)

    for (let response of responses_2xx) {
      const response_schema = self._removeNoDocumentProperties(response.schema)
      const response_schema_flat = carbond_schema.flatten(response_schema)

      if (response_schema_flat.oneOf) {
        descriptors = descriptors.concat(response_schema_flat.oneOf.map(schema => {
          return {
            name: response.statusCode.toString(),
            statusCode: response.statusCode,
            description: response.description,
            schema: schema,
            example: response.example,
            headers: response.headers.length === 0 ? null : _.join(_.map(response.headers, function(header) {
              return _.trim(header.toString())
            }), '\n'),
            responseSchemaElements: {
              children: this._recurseSchemaDescriptors(schema)
            }
          }
        }))
      } else {
        const descriptor_2xx = descriptor(response)
        descriptor_2xx.responseSchemaElements = {
          children: this._recurseSchemaDescriptors(response_schema)
        }
        descriptors.push(descriptor_2xx)
      }
    }

    descriptors = descriptors.concat(_.map(responses_n2xx, descriptor))

    return _.sortBy(descriptors, function (r) { return r.name })
  },

  _mkdirs: function(path_) {
    var pathParts = path_.split(path.sep)
    if (path_[0] === path.sep) {
      pathParts[0] = path.sep + pathParts[0]
    }
    var path_ = ''
    for (var i = 0; i < pathParts.length; i++) {
      path_ = path.join(path_, pathParts[i])
      try {
        fs.statSync(path_)
      }
      catch (e) {
        if (e.errno == -2) {
          fs.mkdirSync(path_)
        }
        else {
          throw e
        }
      }
    }
  },

  _rmdirContents: function(dirPath) {
    var contents = fs.readdirSync(dirPath)
    for (var i = 0; i < contents.length; i++) {
      var path_ = path.join(dirPath, contents[i])
      var pathStat = fs.statSync(path_)
      if (pathStat.isDirectory()) {
        this._rmdirContents(path_)
        fs.rmdirSync(path_)
      }
      else {
        fs.unlinkSync(path_)
      }
    }
  },

  _prepOutputDir: function(docsPath) {
    var docsPathStat = null

    try {
      docsPathStat = fs.statSync(docsPath)
    }
    catch (e) {
      if (e.errno != -2) {
        throw e
      }
    }

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    // XXX: clean up
    if (docsPathStat!== null && docsPathStat.isFile()) {
      var answer = function(cb) {
        rl.question(
          docsPath + ' exists and is a file. Remove and continue? [Y/n] ',
          function(a) { cb(null, a) })
      }.sync()
      answer = answer.toLowerCase() || 'y'
      if (answer === 'y') {
        fs.unlinkSync(docsPath)
      }
      else if (answer !== 'n') {
        throw new Error('Answer must be Y/n.')
      }
    }
    else if (docsPathStat !== null && docsPathStat.isDirectory()) {
      var answer = function(cb) {
        rl.question(
          docsPath + ' exists and is a directory. Remove and continue? [Y/n] ',
          function(a) { cb(null, a) })
      }.sync()
      answer = answer.toLowerCase() || 'y'
      if (answer === 'y') {
        this._rmdirContents(docsPath)
      }
      else if (answer !== 'n') {
        throw new Error('Answer must be Y/n.')
      }
    }
    this._mkdirs(docsPath)
  },

  _lpad: function(str) {
    return '  '+str.replace(/\n/g, '\n  ')
  },

  _renderSchema: function(schema) {
    return JSON.stringify(schema, null, 2)
  },

  _renderBody: function(schema) {
    if(!schema) {
      return undefined
    }
    var self = this
    if(schema.enum) {
      return '( '+_.map(schema.enum, function(e) {return '"'+e+'"'}).join(' | ')+' )'
    } else if(schema.oneOf) {
      var schemas = _.map(schema.oneOf, function(t) {return self._renderBody(t)})
      if(_.find(schemas, function(s) { return s.indexOf("\n") >= 0 })) {
        schemas = "\n"+self._lpad(schemas.join(" |\n"))+"\n"
      } else {
        schemas = ' '+schemas.join(' | ')+' '
      }
      return '('+schemas+')'
    } else if(schema.type) {
      if(_.isArray(schema.type)) {
        return '( '+_.map(schema.type, function(t) {return t.toUpperCase()}).join(' | ')+' )'
      } else {
        switch(schema.type) {
          case 'object':
            var numKeys = _.keys(schema.properties).length
            if(numKeys === 0) {
              return '{}'
            } else if(numKeys === 1) {
              var k = _.keys(schema.properties)[0]
              return '{'+k+': '+self._renderBody(schema.properties[k])+'}'
            } else {
              return '{\n'+self._lpad(_.map(schema.properties, function(v, k) {return k+': '+self._renderBody(v)}).join(',\n'))+'\n}'
            }
          case 'array':
            if(!schema.items) {
              return '[]'
            } else {
              var items = self._renderBody(schema.items)
              if(items.indexOf('\n') >= 0) {
                return '[\n'+self._lpad(items+',\n...')+'\n]'
              } else {
                return '['+items+', ...]'
              }
            }
          case 'integer':
            var type = schema.type.toUpperCase()
            if (schema.minimum) {
              type += '[' + schema.minimum + '..'
              if (schema.maximum) {
                type += schema.maximum
              }
              type += ']'
            }
            else if (schema.maximum) {
              type += '[..' + schema.maximum + ']'
            }
            return type
          default:
            var type = schema.type.toUpperCase()
            if (schema.format) {
              type += ' (' + schema.format + ')'
            }
            if (schema.default !== undefined) {
              type += ' (default: ' + schema.default + ')'
            }
            if (schema.pattern) {
              type += ' (pattern: \'' + schema.pattern + '\')'
            }
            return type
        }
      }
    } else {
      return self._renderSchema(schema)
    }
  },

  /**********************************************************************
   * Register handlebars helpers.
   *
   */
  _registerHandlebarsHelpers: function() {
    var self = this
    // -- generic --

    // indent
    handlebars.registerHelper('indent', function(options) {
      var spaces = options.hash.spaces || 4
      var text = options.fn(this).split('\n')
      text = text.map(function(line) {
        return Array(spaces + 1).join(' ') + line
      })
      return text.join('\n') + '\n'
    })

    // if is object
    handlebars.registerHelper('ifisobject', function(_var, options) {
      if (_var !== null && typeof _var === 'object') {
        return options.fn(this)
      }
      return options.inverse(this)
    })

    // if not empty
    handlebars.registerHelper('ifnotempty', function(collection, options) {
      if (((collection instanceof Array) && collection.length > 0 ||
        ((collection instanceof Object) && _.keys(collection).length > 0))) {
        return options.fn(this)
      }
    })

    // slugify
    handlebars.registerHelper('slugify', function(options) {
      var str = options.fn(this).toLowerCase()
      return str.replace(/^\/|\/$/g, '').replace(/\/| |:/g, '-')
    })

    // defined or null
    handlebars.registerHelper('definedornull', function(value, options) {
      if (value == null) {
        return 'null'
      }
      return options.fn(this)
    })

    // ===
    handlebars.registerHelper('if_eq', function(a, b, options) {
      if (a === b) {
        return options.fn(this)
      }
      return options.inverse(this)
    })

    // !=
    handlebars.registerHelper('if_ne', function(a, b, options) {
      if (a != b) {
        return options.fn(this)
      }
      return options.inverse(this)
    })

    // !=
    handlebars.registerHelper('if_nea', function(string, obj, options) {
      var split = string.split(',')
      if (split.length > 1) {
        if (split.indexOf(obj) < 0) {
          return options.fn(this)
        }
      }
      return options.inverse(this)
    })

    // ||
    handlebars.registerHelper('or', function(a, b) {
      return a || b
    })

    // &&
    handlebars.registerHelper('and', function(a, b) {
      return a && b
    })

    var falsey = function(value) {
      return (
        _.isString(value) && value.length == 0 ||
        _.isArray(value) && value.length == 0 ||
        _.isNaN(value) ||
        _.isNull(value) ||
        _.isUndefined(value) ||
        _.isObject(value) && _.keys(value).length == 0
      )
    }

    // truthy
    handlebars.registerHelper('truthy', function(value, options) {
      if (!falsey(value)) {
        return options.fn(this)
      }
      return options.inverse(this)
    })

    // falsey
    handlebars.registerHelper('falsey', function(value, options) {
      if (falsey(value)) {
        return options.fn(this)
      }
      return options.inverse(this)
    })

    // -- markdown --

    // body (formatted schema)
    handlebars.registerHelper('MDRenderBody', function(schema) {
      return new handlebars.SafeString(self._renderBody(schema))
    })

    // schema
    handlebars.registerHelper('MDRenderSchema', function(schema) {
      return new handlebars.SafeString(self._renderSchema(schema))
    })

    // code block
    handlebars.registerHelper('MDCodeBlock', function(options) {
      return '```\n' + options.fn(this) + '\n```\n'
    })

    // headers
    handlebars.registerHelper('MDHeading', function(options) {
      var level = options.hash.level || 1
      return Array(level + 1).join('#') + ' ' + options.fn(this)
    })

    // block quote
    handlebars.registerHelper('MDBlockQuote', function(options) {
      var level = options.hash.level || 1
      var text = options.fn(this).split('\n')
      text = text.map(function(line) {
        return Array(level + 1).join('> ') + line
      })
      return text.join('\n') + '\n'
    })
  },

  /**********************************************************************
   * Register handlebars partials.
   *
   */
  _registerHandlebarsPartials: function() {
    var help = handlebars.Utils.escapeExpression(this._service.getUsage())
    handlebars.registerPartial('ServiceHelp', `
<pre>
${help}
</pre>
`)
    handlebars.registerPartial('schemaElements',
`{{#each children}}
+ **{{name}}**{{#if_nea '*(either)*,*(or)*' name}}{{#falsey required}} *(optional)*{{/falsey}}{{~/if_nea}}:
{{#truthy description}}{{description}}{{/truthy}}
{{#ifnotempty children}}
    {{> schemaElements}}
{{/ifnotempty}}
{{/each}}`
    )
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
 * @param {Service} service
 * @param {boolean} includeUndocumented
 * @returns {StaticDocumentationGenerator}
 */
StaticDocumentationGenerator.createGenerator = function(docType, service, includeUndocumented) {
  if (!docType in StaticDocumentationGenerator._registeredTypes) {
    throw new Error('no handler registered for ' + docType)
  }
  return o({
    _type: StaticDocumentationGenerator._registeredTypes[docType],
    _service: service,
    _includeUndocumented: includeUndocumented
  })
}

module.exports = StaticDocumentationGenerator

// register doc generator "plugins"
// XXX: can we avoid including these
require('./GitHubMarkDown')
require('./APIBluePrint')
require('./Aglio')
