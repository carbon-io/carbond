var path = require('path')
var fs = require('fs')
var readline = require('readline')

try {
  var aglio = require('aglio')
} catch (err) {
  var aglio = 'Aglio is not installed. Please run `npm install aglio` manually to enable Aglio doc generation'
}
var fibrous = require('fibrous')
var handlebars = require('handlebars')
var _ = require('lodash')

var o = require('atom').o(module)
var oo = require('atom').oo(module)

var StaticDocumentationGenerator = require('./StaticDocumentation')

var _TEMPLATE_DIR = path.join(
  __dirname, 'templates', 'api-blueprint')
var _PATH_PARAM_RE = /\/:([^\/]+)(\/?)/


/******************************************************************************
 * @class APIBPGenerator
 */
var AglioGenerator = oo({
  _type: StaticDocumentationGenerator,

  _C: function() {
    this._groupedEndpoints = null
    this._template = null
  },

  _init: function() {
    StaticDocumentationGenerator.prototype._init.call(this)
    if (_.isString(aglio)) {
      this._service.logError(aglio)
      return
    }
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
    if (_.isString(aglio)) {
      return
    }
    var generator = StaticDocumentationGenerator.createGenerator('api-blueprint', this._service)
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
