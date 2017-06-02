var fs = require('fs')
var path = require('path')

var handlebars = require('handlebars')
var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var StaticDocumentationGenerator = require('./StaticDocumentation')


var _TEMPLATE_DIR = path.join(
    __dirname, 'templates', 'github-flavored-markdown')


/******************************************************************************
 * @class GHMDGenerator
 */
var GHMDGenerator = oo({
  _type: StaticDocumentationGenerator,

  _init: function() {
    StaticDocumentationGenerator.prototype._init.call(this)
    this._templates = {
      single: {
        body: handlebars.compile(
                fs.readFileSync(path.join(_TEMPLATE_DIR, 'sp_body.hbs'), 
                                {encoding: 'utf8'}))
      },
      multiple: {
        indexBody: handlebars.compile(
                    fs.readFileSync(path.join(_TEMPLATE_DIR, 'mp_index_body.hbs'), 
                                    {encoding: 'utf8'})),
        epBody: handlebars.compile(
                  fs.readFileSync(path.join(_TEMPLATE_DIR, 'mp_ep_body.hbs'), 
                                  {encoding: 'utf8'})),
      }
    }
  },

  _options: {
    'single-page': {
      help: 'output docs as a single page (default is multiple)',
      default: false,
      type: 'boolean'
    }
  },

  _generateSinglePage: function(descriptor, docsPath) {
    var docsPath = docsPath || 'README.md'
    var template = this._templates.single.body
    var output = template(descriptor)
    if (docsPath === 'stdout') {
      console.log(output)
    }
    else {
      fs.writeFileSync(docsPath, output, {encoding: 'utf8'})
    }
  },

  _generateMultiplePages: function(descriptor, docsPath) {
    var docsPath = docsPath || 'api-docs'
    var indexPath = path.join(docsPath, "index.md")
    var indexTemplate = this._templates.multiple.indexBody
    var epTemplate = this._templates.multiple.epBody
    
    // clean up the output dir
    try {
      this._prepOutputDir(docsPath)
    }
    catch (e) {
      this._service.logError(e)
      return 1
    }

    // add docsPath to context
    descriptor.docsPath = docsPath
  
    // render and write the endpoints
    for (var i = 0; i < descriptor.endpoints.length; i++) {
      descriptor.endpoints[i].fsPath = 
        path.join(docsPath, descriptor.endpoints[i].path + '.md')
      descriptor.endpoints[i].indexPath = indexPath
      this._mkdirs(path.dirname(descriptor.endpoints[i].fsPath))
      endpointOutput = this._templates.multiple.epBody(descriptor.endpoints[i])
      fs.writeFileSync(descriptor.endpoints[i].fsPath, 
                       endpointOutput, 
                       {encoding: 'utf8'})
    }
    
    // render and write the index
    var indexOutput = this._templates.multiple.indexBody(descriptor)
    fs.writeFileSync(indexPath, indexOutput, {encoding: 'utf8'})
  },
  
  /**********************************************************************
   * generate api docs
   *
   * @param {string} docsPath - the path to write docs to
   * @param {list} options - list of options as specified by the user (see: this._options)
   * @returns {int} - 0 on success, >0 on failure
   */
  generateDocs: function(docsPath, options) {
    var descriptor = this._generateDescriptor()
    var parsedOptions = _.get(this._service, "defaultDocgenOptions.github-flavored-markdown") || {}
    parsedOptions = _.assign(parsedOptions, this._parseOptions(options) || {})

    if (parsedOptions['single-page']) {
      this._generateSinglePage(descriptor, docsPath)
    }
    else {
      this._generateMultiplePages(descriptor, docsPath)
    }

    return 0
  },

  /**********************************************************************
   * Register handlebars helpers.
   *
   */
  _registerHandlebarsHelpers: function() {
    StaticDocumentationGenerator.prototype._registerHandlebarsHelpers.call(this)

    // parameter table
    handlebars.registerHelper('GHMDGeneratorParameterTable', function(parameter, options) {
      var _default = parameter.default instanceof Object ? JSON.stringify(parameter.default) : parameter.default
      var output = '| Name | Description | Required | Default |\n' +
        '| ---- | ----------- | -------- | ------- |\n' +
        '| ' + parameter.name + ' | ' + parameter.description +
        ' | ' + parameter.required + ' | ' + _default + ' |\n'
      return new handlebars.SafeString(output)
    })

  },

  /**********************************************************************
   * Register handlebars partials.
   *
   */
  _registerHandlebarsPartials: function() {
    StaticDocumentationGenerator.prototype._registerHandlebarsPartials.call(this)

    // XXX: this assumes we are only supporting node versions >= 4
    handlebars.registerPartial('GHMDResponses', `
{{~#ifnotempty responses }}
{{#MDHeading level=3}}Responses{{/MDHeading}}

---

<table>
<tr>
<th> status code </th>
<th> description </th>
<th> headers </th>
<th> schema </th>
</tr>
{{#each responses}}
<tr>
<td>
{{statusCode}}
</td>
<td>
{{description}}
</td>
<td>
<pre>
{{~MDRenderSchema headers}}
</pre>
</td>
<td>
<pre><code>
{{~MDRenderSchema schema}}
</code></pre>
</td>
</tr>
{{/each}}
</table>
{{~/ifnotempty}}
`)
  }
})

StaticDocumentationGenerator.registerType('github-flavored-markdown', GHMDGenerator)

