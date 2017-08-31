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

  idGenerator: util.idGenerator,

  preInsertOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preInsertOperation', arguments, req)
  },

  preInsert: function(objects, context, options) {
    return util.overrideOrSuper(Collection, this, 'preInsert', arguments, context)
  },

  insert: function(objects, context, options) {
    return util.overrideOrSuper(Collection, this, 'insert', arguments, context)
  },

  postInsert: function(result, objects, context, options) {
    return util.overrideOrSuper(Collection, this, 'postInsert', arguments, context)
  },

  postInsertOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postInsertOperation', arguments, req)
  },

  preInsertObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preInsertObjectOperation', arguments, req)
  },

  preInsertObject: function(object, context, options) {
    return util.overrideOrSuper(Collection, this, 'preInsertObject', arguments, context)
  },

  insertObject: function(object, context, options) {
    return util.overrideOrSuper(Collection, this, 'insertObject', arguments, context)
  },

  postInsertObject: function(result, object, context, options) {
    return util.overrideOrSuper(Collection, this, 'postInsertObject', arguments, context)
  },

  postInsertObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postInsertObjectOperation', arguments, req)
  },

  preFindOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preFindOperation', arguments, req)
  },

  preFind: function(context, options) {
    return util.overrideOrSuper(Collection, this, 'preFind', arguments, context)
  },

  find: function(context, options) {
    return util.overrideOrSuper(Collection, this, 'find', arguments, context)
  },

  postFind: function(result, context, options) {
    return util.overrideOrSuper(Collection, this, 'postFind', arguments, context)
  },

  postFindOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postFindOperation', arguments, req)
  },

  preFindObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preFindObjectOperation', arguments, req)
  },

  preFindObject: function(id, context, options) {
    return util.overrideOrSuper(Collection, this, 'preFindObject', arguments, context)
  },

  findObject: function(id, context, options) {
    return util.overrideOrSuper(Collection, this, 'findObject', arguments, context)
  },

  postFindObject: function(result, id, context, options) {
    return util.overrideOrSuper(Collection, this, 'postFindObject', arguments, context)
  },

  postFindObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postFindObjectOperation', arguments, req)
  },

  preSaveOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preSaveOperation', arguments, req)
  },

  preSave: function(objects, context, options) {
    return util.overrideOrSuper(Collection, this, 'preSave', arguments, context)
  },

  save: function(objects, context, options) {
    return util.overrideOrSuper(Collection, this, 'save', arguments, context)
  },

  postSave: function(result, objects, context, options) {
    return util.overrideOrSuper(Collection, this, 'postSave', arguments, context)
  },

  postSaveOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postSaveOperation', arguments, req)
  },

  preSaveObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preSaveObjectOperation', arguments, req)
  },

  preSaveObject: function(object, context, options) {
    return util.overrideOrSuper(Collection, this, 'preSaveObject', arguments, context)
  },

  saveObject: function(object, context, options) {
    return util.overrideOrSuper(Collection, this, 'saveObject', arguments, context)
  },

  postSaveObject: function(result, object, context, options) {
    return util.overrideOrSuper(Collection, this, 'postSaveObject', arguments, context)
  },

  postSaveObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postSaveObjectOperation', arguments, req)
  },

  preUpdateOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preUpdateOperation', arguments, req)
  },

  preUpdate: function(update, context, options) {
    return util.overrideOrSuper(Collection, this, 'preUpdate', arguments, context)
  },

  update: function(update, context, options) {
    return util.overrideOrSuper(Collection, this, 'update', arguments, context)
  },

  postUpdate: function(result, update, context, options) {
    return util.overrideOrSuper(Collection, this, 'postUpdate', arguments, context)
  },

  postUpdateOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postUpdateOperation', arguments, req)
  },

  preUpdateObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preUpdateObjectOperation', arguments, req)
  },

  preUpdateObject: function(id, update, context, options) {
    return util.overrideOrSuper(Collection, this, 'preUpdateObject', arguments, context)
  },

  updateObject: function(id, update, context, options) {
    return util.overrideOrSuper(Collection, this, 'updateObject', arguments, context)
  },

  postUpdateObject: function(result, id, update, context, options) {
    return util.overrideOrSuper(Collection, this, 'postUpdateObject', arguments, context)
  },

  postUpdateObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postUpdateObjectOperation', arguments, req)
  },

  preRemoveOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preRemoveOperation', arguments, req)
  },

  preRemove: function(context, options) {
    return util.overrideOrSuper(Collection, this, 'preRemove', arguments, context)
  },

  remove: function(context, options) {
    return util.overrideOrSuper(Collection, this, 'remove', arguments, context)
  },

  postRemove: function(result, context, options) {
    return util.overrideOrSuper(Collection, this, 'postRemove', arguments, context)
  },

  postRemoveOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postRemoveOperation', arguments, req)
  },

  preRemoveObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(Collection, this, 'preRemoveObjectOperation', arguments, req)
  },

  preRemoveObject: function(id, context, options) {
    return util.overrideOrSuper(Collection, this, 'preRemoveObject', arguments, context)
  },

  removeObject: function(id, context, options) {
    return util.overrideOrSuper(Collection, this, 'removeObject', arguments, context)
  },

  postRemoveObject: function(result, id, context, options) {
    return util.overrideOrSuper(Collection, this, 'postRemoveObject', arguments, context)
  },

  postRemoveObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(Collection, this, 'postRemoveObjectOperation', arguments, req)
  }
})

module.exports = _Collection
