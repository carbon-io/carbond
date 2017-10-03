var _ = require('lodash')

var ejson = require('@carbon-io/carbon-core').ejson
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var carbond = require('../../../')
var Collection = carbond.collections.Collection

var util = require('./util')

/***************************************************************************************************
 *
 */
var _Collection = oo({
  _type: Collection,

  _C: function() {
    this.overrides = {}
  },

  _init: function() {
    Collection.prototype._init.call(this)
    util.setNestedProps(this, this.overrides)
  },

  preInsertOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preInsertOperation', arguments, req)
  },

  preInsert: function(objects, options) {
    return util.overrideOrSuper(Collection, this, 'preInsert', arguments, options)
  },

  insert: function(objects, options) {
    return util.overrideOrSuper(Collection, this, 'insert', arguments, options)
  },

  postInsert: function(result, objects, options) {
    return util.overrideOrSuper(Collection, this, 'postInsert', arguments, options)
  },

  postInsertOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postInsertOperation', arguments, req)
  },

  preInsertObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preInsertObjectOperation', arguments, req)
  },

  preInsertObject: function(object, options) {
    return util.overrideOrSuper(Collection, this, 'preInsertObject', arguments, options)
  },

  insertObject: function(object, options) {
    return util.overrideOrSuper(Collection, this, 'insertObject', arguments, options)
  },

  postInsertObject: function(result, object, options) {
    return util.overrideOrSuper(Collection, this, 'postInsertObject', arguments, options)
  },

  postInsertObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postInsertObjectOperation', arguments, req)
  },

  preFindOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preFindOperation', arguments, req)
  },

  preFind: function(options) {
    return util.overrideOrSuper(Collection, this, 'preFind', arguments, options)
  },

  find: function(options) {
    return util.overrideOrSuper(Collection, this, 'find', arguments, options)
  },

  postFind: function(result, options) {
    return util.overrideOrSuper(Collection, this, 'postFind', arguments, options)
  },

  postFindOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postFindOperation', arguments, req)
  },

  preFindObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preFindObjectOperation', arguments, req)
  },

  preFindObject: function(id, options) {
    return util.overrideOrSuper(Collection, this, 'preFindObject', arguments, options)
  },

  findObject: function(id, options) {
    return util.overrideOrSuper(Collection, this, 'findObject', arguments, options)
  },

  postFindObject: function(result, id, options) {
    return util.overrideOrSuper(Collection, this, 'postFindObject', arguments, options)
  },

  postFindObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postFindObjectOperation', arguments, req)
  },

  preSaveOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preSaveOperation', arguments, req)
  },

  preSave: function(objects, options) {
    return util.overrideOrSuper(Collection, this, 'preSave', arguments, options)
  },

  save: function(objects, options) {
    return util.overrideOrSuper(Collection, this, 'save', arguments, options)
  },

  postSave: function(result, objects, options) {
    return util.overrideOrSuper(Collection, this, 'postSave', arguments, options)
  },

  postSaveOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postSaveOperation', arguments, req)
  },

  preSaveObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preSaveObjectOperation', arguments, req)
  },

  preSaveObject: function(object, options) {
    return util.overrideOrSuper(Collection, this, 'preSaveObject', arguments, options)
  },

  saveObject: function(object, options) {
    return util.overrideOrSuper(Collection, this, 'saveObject', arguments, options)
  },

  postSaveObject: function(result, object, options) {
    return util.overrideOrSuper(Collection, this, 'postSaveObject', arguments, options)
  },

  postSaveObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postSaveObjectOperation', arguments, req)
  },

  preUpdateOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preUpdateOperation', arguments, req)
  },

  preUpdate: function(update, options) {
    return util.overrideOrSuper(Collection, this, 'preUpdate', arguments, options)
  },

  update: function(update, options) {
    return util.overrideOrSuper(Collection, this, 'update', arguments, options)
  },

  postUpdate: function(result, update, options) {
    return util.overrideOrSuper(Collection, this, 'postUpdate', arguments, options)
  },

  postUpdateOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postUpdateOperation', arguments, req)
  },

  preUpdateObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preUpdateObjectOperation', arguments, req)
  },

  preUpdateObject: function(id, update, options) {
    return util.overrideOrSuper(Collection, this, 'preUpdateObject', arguments, options)
  },

  updateObject: function(id, update, options) {
    return util.overrideOrSuper(Collection, this, 'updateObject', arguments, options)
  },

  postUpdateObject: function(result, id, update, options) {
    return util.overrideOrSuper(Collection, this, 'postUpdateObject', arguments, options)
  },

  postUpdateObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postUpdateObjectOperation', arguments, req)
  },

  preRemoveOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preRemoveOperation', arguments, req)
  },

  preRemove: function(options) {
    return util.overrideOrSuper(Collection, this, 'preRemove', arguments, options)
  },

  remove: function(options) {
    return util.overrideOrSuper(Collection, this, 'remove', arguments, options)
  },

  postRemove: function(result, options) {
    return util.overrideOrSuper(Collection, this, 'postRemove', arguments, options)
  },

  postRemoveOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postRemoveOperation', arguments, req)
  },

  preRemoveObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preRemoveObjectOperation', arguments, req)
  },

  preRemoveObject: function(id, options) {
    return util.overrideOrSuper(Collection, this, 'preRemoveObject', arguments, options)
  },

  removeObject: function(id, options) {
    return util.overrideOrSuper(Collection, this, 'removeObject', arguments, options)
  },

  postRemoveObject: function(result, id, options) {
    return util.overrideOrSuper(Collection, this, 'postRemoveObject', arguments, options)
  },

  postRemoveObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postRemoveObjectOperation', arguments, req)
  }
})

module.exports = _Collection
