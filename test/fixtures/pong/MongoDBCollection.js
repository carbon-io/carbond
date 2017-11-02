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

  preInsert: function(objects, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preInsert', arguments, options)
  },

  insert: function(objects, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'insert', arguments, options)
  },

  postInsert: function(result, objects, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postInsert', arguments, options)
  },

  postInsertOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postInsertOperation', arguments, req)
  },

  preInsertObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preInsertObjectOperation', arguments, req)
  },

  preInsertObject: function(object, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preInsertObject', arguments, options)
  },

  insertObject: function(object, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'insertObject', arguments, options)
  },

  postInsertObject: function(result, object, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postInsertObject', arguments, options)
  },

  postInsertObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postInsertObjectOperation', arguments, req)
  },

  preFindOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preFindOperation', arguments, req)
  },

  preFind: function(options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preFind', arguments, options)
  },

  find: function(options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'find', arguments, options)
  },

  postFind: function(result, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postFind', arguments, options)
  },

  postFindOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postFindOperation', arguments, req)
  },

  preFindObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preFindObjectOperation', arguments, req)
  },

  preFindObject: function(id, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preFindObject', arguments, options)
  },

  findObject: function(id, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'findObject', arguments, options)
  },

  postFindObject: function(result, id, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postFindObject', arguments, options)
  },

  postFindObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postFindObjectOperation', arguments, req)
  },

  preSaveOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preSaveOperation', arguments, req)
  },

  preSave: function(objects, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preSave', arguments, options)
  },

  save: function(objects, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'save', arguments, options)
  },

  postSave: function(result, objects, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postSave', arguments, options)
  },

  postSaveOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postSaveOperation', arguments, req)
  },

  preSaveObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preSaveObjectOperation', arguments, req)
  },

  preSaveObject: function(object, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preSaveObject', arguments, options)
  },

  saveObject: function(object, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'saveObject', arguments, options)
  },

  postSaveObject: function(result, object, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postSaveObject', arguments, options)
  },

  postSaveObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postSaveObjectOperation', arguments, req)
  },

  preUpdateOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preUpdateOperation', arguments, req)
  },

  preUpdate: function(update, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preUpdate', arguments, options)
  },

  update: function(update, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'update', arguments, options)
  },

  postUpdate: function(result, update, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postUpdate', arguments, options)
  },

  postUpdateOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postUpdateOperation', arguments, req)
  },

  preUpdateObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preUpdateObjectOperation', arguments, req)
  },

  preUpdateObject: function(id, update, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preUpdateObject', arguments, options)
  },

  updateObject: function(id, update, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'updateObject', arguments, options)
  },

  postUpdateObject: function(result, id, update, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postUpdateObject', arguments, options)
  },

  postUpdateObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postUpdateObjectOperation', arguments, req)
  },

  preRemoveOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preRemoveOperation', arguments, req)
  },

  preRemove: function(options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preRemove', arguments, options)
  },

  remove: function(options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'remove', arguments, options)
  },

  postRemove: function(result, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postRemove', arguments, options)
  },

  postRemoveOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postRemoveOperation', arguments, req)
  },

  preRemoveObjectOperation: function(config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preRemoveObjectOperation', arguments, req)
  },

  preRemoveObject: function(id, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'preRemoveObject', arguments, options)
  },

  removeObject: function(id, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'removeObject', arguments, options)
  },

  postRemoveObject: function(result, id, options) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postRemoveObject', arguments, options)
  },

  postRemoveObjectOperation: function(result, config, req, res) {
    return util.overrideOrSuper(MongoDBCollection, this, 'postRemoveObjectOperation', arguments, req)
  }
})

module.exports = _MongoDBCollection
