var path = require('path');
var fs = require('fs');

var _ = require('underscore');
var handlebars = require('handlebars');
var Future = require('fibers/future');

fs = Future.wrap(fs)

var o = require('atom').o(module);
var oo = require('atom').oo(module);

var StaticDocumentationGenerator = require('./StaticDocumentationGenerator');


var _TEMPLATE_DIR = path.join(
    __dirname, 'templates', 'static-documentation', 'github-flavored-markdown')


/******************************************************************************
 * @class GHMDGenerator
 */
var GHMDGenerator = oo({
  _type: StaticDocumentationGenerator,

  _C: function(objectserver) {
    this._objectserver = objectserver
    this._bodyTemplate = null;
  },

  _init: function() {
    this._bodyTemplate = fs.readFileFuture(
      path.join(_TEMPLATE_DIR, 'body.hbs'), {encoding: 'utf8'}).wait()
  },
  
  /**********************************************************************
   * generate api docs
   *
   * @param {object} options
   * @returns {string}
   */        
  generateDocs: function(options) {
    this._registerHandlebarsHelpers()
    var hbTemplate = handlebars.compile(this._bodyTemplate)
    var descriptor = this._generateDescriptor(options)
    return hbTemplate(descriptor)
  },

  /**********************************************************************
   * get the template context
   *
   */        
  _registerHandlebarsHelpers: function() {
    // headers
    handlebars.registerHelper('GHMDGeneratorHeading', function(options) {
      var level = options.hash.level || 1
      return Array(level + 1).join('#') + ' ' + options.fn(this)
    })
    
    // block quote
    handlebars.registerHelper('GHMDGeneratorBlockQuote', function(options) {
      var level = options.hash.level || 1
      var text = options.fn(this).split('\n')
      text = text.map(function(line) {
        return Array(level + 1).join('> ') + line
      })
      return text.join('\n') + '\n'
    })
    
    // block quote
    handlebars.registerHelper('GHMDGeneratorCodeBlock', function(options) {
      return '```\n' + options.fn(this) + '\n```\n'
    })

    // parameter table 
    handlebars.registerHelper('GHMDGeneratorParameterTable', function(parameter, options) {
      var _default = parameter.default instanceof Object ? JSON.stringify(parameter.default) : parameter.default
      var output = '| Name | Description | Required | Default |\n' +
                   '| ---- | ----------- | -------- | ------- |\n' +
                   '| ' + parameter.name + ' | ' + parameter.description + 
                   ' | ' + parameter.required + ' | ' + _default + ' |\n'
      return new handlebars.SafeString(output)
    })

    // schema
    handlebars.registerHelper('GHMDGeneratorRenderSchema', function(schema, options) {
      return new handlebars.SafeString(JSON.stringify(schema, null, 2))
    })

    // if not empty
    handlebars.registerHelper('ifnotempty', function(collection, options) {
      if (((collection instanceof Array) && collection.length > 0 ||
          ((collection instanceof Object) && _.keys(collection).length > 0))) {
        return options.fn(this)
      }
    })
  }
})

StaticDocumentationGenerator.registerType('github-flavored-markdown', GHMDGenerator)

