var path = require('path')
var fs = require('fs')
var readline = require('readline')

var aglio = require('aglio')
var fibrous = require('fibrous')
var handlebars = require('handlebars')
var _ = require('lodash')

var o = require('atom').o(module)
var oo = require('atom').oo(module)

var StaticDocumentationGenerator = require('./StaticDocumentationGenerator')

var _TEMPLATE_DIR = path.join(
  __dirname, 'templates', 'static-documentation', 'api-blueprint')
var _PATH_PARAM_RE = /\/:([^\/]+)(\/?)/

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
var AglioGenerator = oo({
  _type: StaticDocumentationGenerator,

  _C: function(objectserver) {
    this._objectserver = objectserver
    this._groupedEndpoints = null
    this._template = null
  },

  _init: function() {
    StaticDocumentationGenerator.prototype._init.call(this)
  },

  _options: {
    theme: {
      type: 'string',
      default: 'default',
      help: 'aglio theme to use',
      choices: ['default']
    }
  },

  /*****************************************************************************
   * generate api docs
   *
   * @param {string} docsPath - the path to write docs to
   * @param {list} options - list of options as specified by the user (see: this._options)
   * @returns {int} - 0 on success, >0 on failure
   */
  generateDocs: function(docsPath, options) {
    var generator = StaticDocumentationGenerator.createGenerator('api-blueprint', this._objectserver)
    var blueprint = generator.generateBlueprint()
    var html = aglio.sync.render(blueprint, {})
    if (docsPath === 'stdout') {
      console.log(html)
    }
    else {
      fs.writeFileSync(docsPath, html, {encoding: 'utf8'})
    }

    return 0
  }
})

StaticDocumentationGenerator.registerType('aglio', AglioGenerator)
