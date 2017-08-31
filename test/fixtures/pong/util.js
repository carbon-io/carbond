var IncomingMessage = require('http').IncomingMessage

var _ = require('lodash')
var express = require('express')

var ejson = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)

var COLOPS =  [
  'insert',
  'insertObject',
  'find',
  'findObject',
  'save',
  'saveObject',
  'update',
  'updateObject',
  'remove',
  'removeObject'
]

var ENDOPS = [
  'post',
  'get',
  'put',
  'patch',
  'delete'
]

function setNestedProps(object, overrides) {
  for (var key in overrides) {
    _.set(object, key, overrides[key])
  }
}

function _getPongRet(type, object, name, args, pong) {
  var ret = pong[name]
  if (_.isObjectLike(ret)) {
    if ('$args' in ret) {
      ret = args[ret.$args]
    }
  }
  return ret
}

function overrideOrSuper(type, object, name, args, reqOrContext, noSuper) {
  args = Array.prototype.slice.call(args)
  noSuper = _.isNil(noSuper) ? false : noSuper
  if (!_.isNil(reqOrContext)) {
    var pong = undefined
    var ret = undefined
    if (reqOrContext instanceof IncomingMessage) {
      pong = ejson.parse(reqOrContext.header('x-pong'))
    } else {
      pong = reqOrContext.__pong
    }
    if (!_.isNil(pong)) {
      if (!_.isNil(name.match(/^pre.+Operation$/))) {
        // collection
        if (!_.isNil(pong[name])) {
          ret = _getPongRet(type, object, name, args, pong)
        } else {
          if (noSuper) {
            throw new Error('noSuper specified in pre*Operation')
          }
          ret = type.prototype[name].apply(object, args)
        }
        ret.context.__pong = pong
      } else if (!_.isNil(name.match(/(pre|post).+/)) ||
                 _.includes(COLOPS, name) ||
                 _.includes(ENDOPS, name)) {
        // collection/endpoint
        ret = _getPongRet(type, object, name, args, pong)
      }
      if (!_.isNil(ret)) {
        return ret
      }
    }
  }
  if (noSuper) {
    throw new Error('Super not allowed')
  }
  return type.prototype[name].apply(object, args)
}

var idGenerator = o({
  id: 0,

  resetId: function() {
    this.id = 0
  },

  generateId: function() {
    return (this.id++).toString()
  }
})

module.exports = {
  setNestedProps: setNestedProps,
  overrideOrSuper: overrideOrSuper,
  idGenerator: idGenerator
}

