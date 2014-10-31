var o = require('maker').o(module);
var oo = require('maker').oo(module);
var _o = require('maker')._o(module);

/******************************************************************************
 * @class Collection
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: "./Endpoint",
  
  /**********************************************************************
   * get
   */        
  get: {
    $property: {
      get: function() {
        var self = this
        return {
          params: {
            "query" : {
              "in": "query", 
              type: "string", // XXX we cant seem to make this object or json?
              description: "Query spec (JSON)",
              required: false
            },
            "sort" : {
              "in": "query", 
              type: "string", // XXX we cant seem to make this object or json?
              description: "Sort spec (JSON)",
              required: false
            },
            "projection" : {
              "in": "query", 
              type: "string", // XXX we cant seem to make this object or json?
              description: "Projection spec (JSON)",
              required: false              
            },
            "skip" : {
              "in": "query", 
              type: "integer",
              description: "Results to skip",
              required: false,
              schema: {}
              
            },
            "limit" : {
              "in": "query", 
              type: "integer",
              description: "Results to limit",
              required: false
            }
          },          
          service: function(req, res) {
            self.find(JSON.parse(req.query.query), {}, function(err, objs) {
              if (err) {
                self._error(res, err)
              } else {
                res.send(objs)
              }
            })
          }
        }
      }
    }
  },

  /**********************************************************************
   * post
   */        
  post: {
    $property: {
      get: function() {
        var self = this
        return {
          params: {
            "body" : {
              "in": "body", // XXX I dont like "in"
              description: "Object to insert",
              required: true,
              schema: {}
              
            }
          },          
          service: function(req, res) {
            var body = req.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
            if (body) {
              self.insert(body, function(err, result) {
                if (err) {
                  self._error(res, err)
                } else {
                  res.send(200)
                }
              })
            }
          }
        }
      }
    }
  },

  /**********************************************************************
   * endpoints
   */        
  _endpoints: null,
  endpoints: { 
    $property: {
      get: function() {
        var self = this
        if (self._endpoints === null) {
          self._endpoints = {
            ":id": o({
              _type: "./Endpoint",
              get: {
                service: function(req, res) {
                  self.findById(req.params.id, function(err, result) {
                    if (err) {
                      self._error(res, err)
                    } else {
                      res.send(result)
                    }
                  })
                },
              },
              
              put: function(req, res) {
                console.log("put")
                res.send(200)
              },

              delete: function(req, res) {
                self.removeById(req.params.id, function(err, result) {
                  if (err) {
                    self._error(res, err)
                  } else {
                    res.send(200)
                  }
                })
              }
            })
          }
        }
        return self._endpoints
      }
    }
  },
  
  /**********************************************************************
   * findById
   */        
  findById: function(id, cb) {
    this._notImplemented(cb)
  },
  
  /**********************************************************************
   * find
   */        
  find: function(query, options, cb) { // XXX should return a cursor? Probably not at this level of abs. Clients cant use cursors really. 
    //We might just have MDBColl limit results if limits not sent
    this._notImplemented(cb)
  },
  
  /**********************************************************************
   * findOne
   */        
  findOne: function(query, options, cb) {
    this._notImplemented(cb)
  },
  
  /**********************************************************************
   * insert
   */        
  insert: function(obj, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * update
   */        
  update: function(query, obj, options, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * removeById
   */        
  removeById: function(id, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * remove
   */        
  remove: function(query, cb) {
    this._notImplemented(cb)
  },
  
  /**********************************************************************
   * _notImplemented
   */        
  _notImplemented: function(cb) {
    cb(Error("Not implemented"))
  },

  /**********************************************************************
   * _error
   */        
  _error: function(res, error) {
    console.log(error)
    res.send(500)
  }

})
