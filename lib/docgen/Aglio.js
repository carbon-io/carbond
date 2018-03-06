var fs = require('fs')

try {
  var aglio = require('aglio')
} catch (err) {
  var aglio = 'Aglio is not installed. Please run `npm install aglio` manually to enable Aglio doc generation'
}
var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var StaticDocumentationGenerator = require('./StaticDocumentation')


/******************************************************************************
 * @class APIBPGenerator
 */
var AglioGenerator = oo({
  _type: StaticDocumentationGenerator,
  _ctorName: 'AglioGenerator',

  _C: function() {
    this._groupedEndpoints = null
    this._template = null
  },

  _init: function() {
    StaticDocumentationGenerator.prototype._init.call(this)
    if (_.isString(aglio)) {
      this._service.logError(aglio)

    }
  },

  _options: {
    theme: {
      type: 'string',
      default: 'default',
      help: 'Aglio theme to use',
      choices: ['default'],
    },
    themeFullWidth: {
      type: 'boolean',
      default: false,
      help: 'Use the full page width',
      choices: [false, true],
    },
    themeCondenseNav: {
      type: 'boolean',
      default: true,
      help: 'Condense single-action navigation links',
      choices: [false, true],
    },
    themeTemplate: {
      type: 'string',
      default: null,
      help: 'Layout name or path to custom layout file',
    },
    themeStyle: {
      type: 'string',
      default: 'default',
      help: 'Built-in style name or path to LESS or CSS',
    },
    themeVariables: {
      type: 'string',
      default: 'default',
      help: 'Built-in color scheme or path to LESS or CSS',
    },
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
    var generator = StaticDocumentationGenerator.createGenerator('api-blueprint', this._service, this._includeUndocumented)
    var blueprint = generator.generateBlueprint()
    var parsedOptions = _.get(this._service, 'defaultDocgenOptions.aglio') || {}
    parsedOptions = _.assign(parsedOptions, this._parseOptions(options) || {})
    var html = aglio.sync.render(blueprint, parsedOptions)
    docsPath = docsPath || 'api.html'
    if (docsPath === 'stdout') {
      console.log(html)
    } else {
      try {
        var stat = fs.lstatSync(docsPath)
        if (stat && !stat.isFile()) {
          this._service.logError('Output must be a file')
          return 1
        }
      } catch (e) {
        // ignore
      }
      this._service.logInfo('Writing API documentation to ' + docsPath)
      fs.writeFileSync(docsPath, html, {encoding: 'utf8'})
    }

    return 0
  },
})

StaticDocumentationGenerator.registerType('aglio', AglioGenerator)
