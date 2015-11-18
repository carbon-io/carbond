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
        body: fs.readFileSync(path.join(_TEMPLATE_DIR, 'sp_body.hbs'), 
                              {encoding: 'utf8'})
      },
      multiple: {
        tocBody: fs.readFileSync(path.join(_TEMPLATE_DIR, 'mp_toc_body.hbs'), 
                                 {encoding: 'utf8'}),
        epBody: fs.readFileSync(path.join(_TEMPLATE_DIR, 'mp_ep_body.hbs'), 
                                {encoding: 'utf8'}),
      }
    }
  },

  _generate_single_page: function(descriptor, docsPath) {
    var docsPath = docsPath || 'README.md'
    var template = handlebars.compile(this._templates.single.body)
    var output = template(descriptor)
    if (docsPath === 'stdout') {
      console.log(output)
    }
    else {
      fs.writeSync(fs.openSync(docsPath, 'w'), output, 'utf8')
    }
  },
  
  _generate_multiple_pages: function(descriptor, docsPath) {
    var docsPath = docsPath || 'api-docs'
    var tocTemplate = handlebars.compile(this._templates.multiple.tocBody)
    var epTemplate = handlebars.compile(this._templates.multiple.epBody)
    
    var docsPathStat = fs.statSync(docsPath)

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    // XXX: clean up
    if (docsPathStat.isFile()) {
      var answer = function(cb) {
        rl.question(
          docsPath + ' exists and is a file. Remove and continue? [Y/n] ',
          function(a) { cb(null, a) })
      }.sync()
      answer = answer.toLowerCase() || 'y'
      if (answer === 'y') {
        fs.unlinkSync(docsPath)
      }
      else if (answer === 'n') {
        return 0
      }
      return 1
    }
    else if (docsPathStat.isDirectory()) {
      var answer = function(cb) {
        rl.question(
          docsPath + ' exists and is a directory. Remove and ontinue? [Y/n] ',
          function(a) { cb(null, a) })
      }.sync()
      answer = answer.toLowerCase() || 'y'
      if (answer === 'y') {
        var rmdirContents = function(base) {
          var contents = fs.readdirSync(base)
          for (var i = 0; i < contents.length; i++) {
            var path_ = path.join(base, contents[i])
            var pathStat = fs.statSync(path_)
            if (pathStat.isDirectory()) {
              rmdirContents(path_)
              fs.rmdirSync(path_)
            }
            else {
              fs.unlinkSync(path_)
            }
          }
        }
        rmdirContents(docsPath)
      }
      else if (answer === 'n') {
        return 0
      }
      return 1
    }
    

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
      retVal = this._generate_single_page(descriptor, docsPath)
    }
    else {
      retVal = this._generate_multiple_pages(descriptor, docsPath)
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

