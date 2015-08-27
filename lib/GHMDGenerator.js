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
    this._endpointTemplate = null;
    this._operationTemplate = null;
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
    var hbTemplate = handlebars.compile(this._bodyTemplate)
    return hbTemplate()
  },

  /**********************************************************************
   * get the template context
   *
   */        
  _getContext: function() {
    var context = {}

  }
})

StaticDocumentationGenerator.registerType('github-flavored-markdown', GHMDGenerator)

