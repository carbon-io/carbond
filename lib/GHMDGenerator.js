var path = require('path');
var fs = require('fs');

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

  _C: function(objectServer) {
    this._objectServer = objectServer

    this._bodyTemplate = null;
  },

  _init: function() {
    this._bodyTemplate = fs.readFileFuture(
      path.join(_TEMPLATE_DIR, 'body.hbs'), {encoding: 'utf8'}).wait()
  },
  
  /**********************************************************************
   * generate api docs
   *
   */        
  generateDocs: function() {
    this._registerHandlebarsHelpers()
    var hbTemplate = handlebars.compile(this._bodyTemplate)
    return hbTemplate(this._getContext())
  },

  /**********************************************************************
   * get the template context
   *
   */
  _getContext: function() {
    var context = {title: "hello there"}
    return context
  },

  /**********************************************************************
   * get the template context
   *
   */        
  _registerHandlebarsHelpers: function() {
    handlebars.registerHelper('GHMDGeneratorHeading', function(options) {
      var level = options.hash.level || 1
      return Array(level + 1).join('#') + ' ' + options.fn(this)
    })
  }
})

StaticDocumentationGenerator.registerType('github-flavored-markdown', GHMDGenerator)

