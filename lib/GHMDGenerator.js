var path = require('path')
var fs = require('fs')
var readline = require('readline')

var fibrous = require('fibrous')
var handlebars = require('handlebars')
var _ = require('lodash')

var o = require('atom').o(module)
var oo = require('atom').oo(module)

var StaticDocumentationGenerator = require('./StaticDocumentationGenerator')


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
          docsPath + ' exists and is a directory. Remove and ontinue? [Y/n] ',
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
      this._objectserver.logError(e)
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
   * @param {object} options
   * @returns {string}
   */        
  generateDocs: function(docsPath, singlePage) {
    this._registerHandlebarsHelpers()
    var descriptor = this._generateDescriptor()
    var retVal = 0

    if (singlePage) {
      retVal = this._generateSinglePage(descriptor, docsPath)
    }
    else {
      retVal = this._generateMultiplePages(descriptor, docsPath)
    }

    return retVal
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
    
    // indent
    handlebars.registerHelper('indent', function(options) {
      var spaces = options.hash.spaces || 4
      var text = options.fn(this).split('\n')
      text = text.map(function(line) {
        return Array(spaces + 1).join(' ') + line
      })
      return text.join('\n') + '\n'
    })

    // ifisobject
    handlebars.registerHelper('ifisobject', function(_var, options) {
      if (_var !== null && typeof _var === 'object') {
        return options.fn(this)
      }
      return options.inverse(this)
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
    
    // Slugify
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
  }
})

StaticDocumentationGenerator.registerType('github-flavored-markdown', GHMDGenerator)

