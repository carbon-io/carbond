var IncomingMessage = require('http').IncomingMessage
var assert = require('assert')

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

function getObjectId(n) {
  return new ejson.types.ObjectId(_.padStart(n.toString(16), 24, '0'))
}

function setNestedProps(object, overrides) {
  for (var key in overrides) {
    _.set(object, key, overrides[key])
  }
}

function _replaceArgs(ret, args) {
  if (_.isObject(ret)) {
    if (_.keys(ret).length === 1 &&
        '$args' in ret &&
        _.isNumber(ret.$args)) {
      return args[ret.$args]
    } else {
      for (var k in ret) {
        ret[k] = _replaceArgs(ret[k], args)
      }
    }
  }
  return ret
}

function _getPongRet(type, object, name, args, pong) {
  var ret = _.clone(pong[name])
  if (_.isObjectLike(ret)) {
    ret = _replaceArgs(ret, args)
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
      if (!_.isNil(reqOrContext.header('x-pong'))) {
        pong = ejson.parse(reqOrContext.header('x-pong'))
      }
    } else {
      pong = reqOrContext.__pong
    }
    if (!_.isNil(pong)) {
      var doReturn = true
      if (!_.isNil(name.match(/^pre.+Operation$/))) {
        // collection
        if (_.includes(_.keys(pong), name)) {
          ret = _getPongRet(type, object, name, args, pong)
        } else {
          if (noSuper) {
            throw new Error('noSuper specified in pre*Operation')
          }
          ret = type.prototype[name].apply(object, args)
        }
        ret.__pong = pong
      } else if ((!_.isNil(name.match(/(pre|post).+/)) ||
                  _.includes(COLOPS, name) ||
                  _.includes(ENDOPS, name)) &&
                 _.includes(_.keys(pong), name)) {
        // collection/endpoint
        ret = _getPongRet(type, object, name, args, pong)
      } else {
        doReturn = false
      }
      if (doReturn) {
        return ret
      }
    }
  }
  if (noSuper) {
    throw new Error('Super not allowed')
  }
  return type.prototype[name].apply(object, args)
}

var collectionIdGenerator = o({
  id: 0,

  resetId: function() {
    this.id = 0
  },

  generateId: function() {
    return (this.id++).toString()
  }
})

var mongoDbCollectionIdGenerator = o({
  id: 0,

  resetId: function() {
    this.id = 0
  },

  generateId: function() {
    return getObjectId(this.id++)
  }
})

module.exports = {
  collectionIdGenerator: collectionIdGenerator,
  getObjectId: getObjectId,
  mongoDbCollectionIdGenerator: mongoDbCollectionIdGenerator,
  overrideOrSuper: overrideOrSuper,
  setNestedProps: setNestedProps
}

