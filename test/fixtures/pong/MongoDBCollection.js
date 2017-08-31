var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var carbond = require('../../../')
var MongoDBCollection = carbond.mongodb.MongoDBCollection

var util = require('./util')

/***************************************************************************************************
 *
 */
var _MongoDBCollection = oo({
  _type: MongoDBCollection,

  _C: function() {
    this.overrides = {}
  },

  _init: function() {
    MongoDBCollection.prototype._init.call(this)
    util.setNestedProps(this, this.overrides)
  },

  preInsertOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preInsertOperation', arguments, req)
  },

  preInsert: function(objects, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preInsert', arguments, context)
  },

  insert: function(objects, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'insert', arguments, context)
  },

  postInsert: function(result, objects, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postInsert', arguments, context)
  },

  postInsertOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postInsertOperation', arguments, req)
  },

  preInsertObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preInsertObjectOperation', arguments, req)
  },

  preInsertObject: function(object, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preInsertObject', arguments, context)
  },

  insertObject: function(object, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'insertObject', arguments, context)
  },

  postInsertObject: function(result, object, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postInsertObject', arguments, context)
  },

  postInsertObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postInsertObjectOperation', arguments, req)
  },

  preFindOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preFindOperation', arguments, req)
  },

  preFind: function(context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preFind', arguments, context)
  },

  find: function(context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'find', arguments, context)
  },

  postFind: function(result, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postFind', arguments, context)
  },

  postFindOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postFindOperation', arguments, req)
  },

  preFindObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preFindObjectOperation', arguments, req)
  },

  preFindObject: function(id, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preFindObject', arguments, context)
  },

  findObject: function(id, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'findObject', arguments, context)
  },

  postFindObject: function(result, id, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postFindObject', arguments, context)
  },

  postFindObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postFindObjectOperation', arguments, req)
  },

  preSaveOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preSaveOperation', arguments, req)
  },

  preSave: function(objects, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preSave', arguments, context)
  },

  save: function(objects, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'save', arguments, context)
  },

  postSave: function(result, objects, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postSave', arguments, context)
  },

  postSaveOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postSaveOperation', arguments, req)
  },

  preSaveObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preSaveObjectOperation', arguments, req)
  },

  preSaveObject: function(object, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preSaveObject', arguments, context)
  },

  saveObject: function(object, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'saveObject', arguments, context)
  },

  postSaveObject: function(result, object, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postSaveObject', arguments, context)
  },

  postSaveObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postSaveObjectOperation', arguments, req)
  },

  preUpdateOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preUpdateOperation', arguments, req)
  },

  preUpdate: function(update, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preUpdate', arguments, context)
  },

  update: function(update, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'update', arguments, context)
  },

  postUpdate: function(result, update, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postUpdate', arguments, context)
  },

  postUpdateOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postUpdateOperation', arguments, req)
  },

  preUpdateObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preUpdateObjectOperation', arguments, req)
  },

  preUpdateObject: function(id, update, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preUpdateObject', arguments, context)
  },

  updateObject: function(id, update, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'updateObject', arguments, context)
  },

  postUpdateObject: function(result, id, update, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postUpdateObject', arguments, context)
  },

  postUpdateObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postUpdateObjectOperation', arguments, req)
  },

  preRemoveOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preRemoveOperation', arguments, req)
  },

  preRemove: function(context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preRemove', arguments, context)
  },

  remove: function(context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'remove', arguments, context)
  },

  postRemove: function(result, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postRemove', arguments, context)
  },

  postRemoveOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postRemoveOperation', arguments, req)
  },

  preRemoveObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preRemoveObjectOperation', arguments, req)
  },

  preRemoveObject: function(id, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preRemoveObject', arguments, context)
  },

  removeObject: function(id, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'removeObject', arguments, context)
  },

  postRemoveObject: function(result, id, context, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postRemoveObject', arguments, context)
  },

  postRemoveObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postRemoveObjectOperation', arguments, req)
  }
})

module.exports = _MongoDBCollection
