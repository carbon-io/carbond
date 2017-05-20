var fs = require('fs')
var path = require('path')
var readline = require('readline')

var handlebars = require('handlebars')
var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var StaticDocumentationGenerator = require('./StaticDocumentation')

var _TEMPLATE_DIR = path.join(
  __dirname, 'templates', 'api-blueprint')

/*
 https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md

 #### Header keywords
 - `Group`
 - `Data Structures`
 - [HTTP methods][httpmethods] (e.g. `GET, POST, PUT, DELETE`...)
 - [URI templates][uritemplate] (e.g. `/resource/{id}`)
 - Combinations of an HTTP method and URI Template (e.g. `GET /resource/{id}`)

 #### List keywords
 - `Request`
 - `Response`
 - `Body`
 - `Schema`
 - `Model`
 - `Header` & `Headers`
 - `Parameter` & `Parameters`
 - `Values`
 - `Attribute` & `Attributes`
 - `Relation`

  resources == endpoints

  - resources can have parameters, attributes, a model, and a number of actions
    - parameters are url parameters (query/path)
    - attributes are the properties of a resource that exists at this endpoint in MSON format
      - https://github.com/apiaryio/mson/blob/master/MSON%20Specification.md
        - contexts:
          - resource => resource attributes
          - action => request attributers
          - payload => message body

  actions == operations

  - description
  - parameters
  - attributes
  - request
  - response


 */


/******************************************************************************
 * @class APIBPGenerator
 */
var APIBPGenerator = oo({
  _type: StaticDocumentationGenerator,

  _C: function() {
    this._groupedEndpoints = null
    this._template = null
  },

  _init: function() {
    StaticDocumentationGenerator.prototype._init.call(this)
    this._template = handlebars.compile(
      fs.readFileSync(path.join(_TEMPLATE_DIR, 'body.hbs'),
        {encoding: 'utf8'}))
  },

  _groupEndpoints: function(endpoints) {
    // XXX: add a "group" attribute to endpoints to override this behavior?
    var groupedEndpoints = {'': []}
    for (var i = 0; i < endpoints.length; i++) {
      endpoints[i].grouped = 0
      var groupKey = this._endpointGroup(endpoints[i])
      if(groupKey) {
        endpoints[i].grouped = 1
        if (!(groupKey in groupedEndpoints)) {
          groupedEndpoints[groupKey] = []
        }
      }
      groupedEndpoints[groupKey].push(endpoints[i])
    }
    return groupedEndpoints
  },

  _endpointGroup: function(endpoint) {
    var groupPath = _.join(_.dropRightWhile(_.split(endpoint.path, path.sep), function(p) {return _.startsWith(p, ':')}), path.sep)
    return this._fixPathParameter(groupPath)
  },

  _fixPathParameter: function(path_) {
    var parts = path_.split(path.sep)
    parts = _.map(parts, function(p) {return _.startsWith(p, ":") ? ("{"+p.substring(1)+"}") : p})
    return parts.join(path.sep)
  },

  generateBlueprint: function() {
    var descriptor = this._generateDescriptor()

    descriptor.groupedEndpoints = this._groupEndpoints(descriptor.endpoints)

    return this._template(descriptor)
  },

  /*****************************************************************************
   * generate api docs
   *
   * NOTE: api-blueprint docs will always be generated as a single page
   *
   * @param {string} docsPath - the path to write docs to
   * @param {list} options - list of options as specified by the user (see: this._options)
   * @returns {int} - 0 on success, >0 on failure
   */
  generateDocs: function(docsPath, options) {
    var output = this.generateBlueprint()

    var docsPath = docsPath || 'README.md'

    if (docsPath === 'stdout') {
      console.log(output)
    }
    else {
      fs.writeFileSync(docsPath, output, {encoding: 'utf8'})
    }

    return 0
  },

  _endpointShortName: function(endpoint) {
    var nounParts = []
    var parts = endpoint.path.split(path.sep)
    for(var i in parts) {
      var n = parts.length - 1 - i
      if(_.startsWith(parts[n], ":")) {
        nounParts.unshift("{"+parts[n].slice(1)+"}")
      } else {
        nounParts.unshift(parts[n])
        break
      }
    }
    return nounParts.join(path.sep)
  },

  _registerHandlebarsHelpers: function() {
    var self = this

    StaticDocumentationGenerator.prototype._registerHandlebarsHelpers.call(this)

    handlebars.registerHelper('APIBPURLTemplate', function(endpoint, options) {
      return new handlebars.SafeString(self._fixPathParameter(endpoint.path))
    })

    handlebars.registerHelper('APIBPGroupedNesting', function(endpoint, nesting) {
      return endpoint.grouped + nesting
    })

    handlebars.registerHelper('APIBPURLParameters', function(parameters, options) {
      var urlParams = _.concat(parameters.path, parameters.query).filter(function(e) {
        return !_.isUndefined(e)
      })
      if (urlParams.length > 0) {
        return options.fn(urlParams)
      }
    })

    handlebars.registerHelper('APIBPSanitizeParameterDescription', function(description) {
      // XXX: this is incomplete
      var chars = ['(', ')', '_']
      return new handlebars.SafeString(
        _.reduce(chars, function(str, char) {
          return _.replace(str, char, '&#' + char.charCodeAt() + ';')
        }, description))
    })

    handlebars.registerHelper('APIBPEndpointName', function(endpoint, options) {
      return new handlebars.SafeString(self._endpointShortName(endpoint))
    })

    handlebars.registerHelper('APIBPOperationName', function(endpoint, method, options) {
      return new handlebars.SafeString(method.toUpperCase()+" "+self._endpointShortName(endpoint))
    })

  }
})

StaticDocumentationGenerator.registerType('api-blueprint', APIBPGenerator)
