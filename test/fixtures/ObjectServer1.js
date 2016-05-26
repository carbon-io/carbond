var o = require('atom').o(module).main
var _o = require('bond')._o(module)
var __ = require('fiber').__
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../../')

/*******************************************************************************
 * ObjectServer1
 * 
 * This is a very simple ObjectServer. This is meant for testing sync 
 * operations defined as simple functions. 
 */
module.exports = o({
  _type: carbond.ObjectServer,
  
  port: 8888,
  verbosity: 'info',
  
  endpoints: {
    // Simple endpoint with operations defined as functions
    e1: o({
      _type: carbond.Endpoint,
      get: function(req, res) {
        return { 
          methodCalled: "get",
          reqParams: req.query
        }
      },
      
      post: function(req, res) {
        return {
          methodCalled: "post",
          reqParams: req.query,
          reqBody: req.body
        }
      },
      
      put: function(req, res) {
        return {
          methodCalled: "put",
          reqParams: req.query,
          reqBody: req.body
        }
      },

      patch: function(req, res) {
        return {
          methodCalled: "patch",
          reqParams: req.query,
          reqBody: req.body
        }
      },

      delete: function(req, res) {
        return {
          methodCalled: "delete",
          reqParams: {
            n: JSON.parse(req.query.n),
            m: req.query.m
          }
        }
      }
      
    })
  }
})
