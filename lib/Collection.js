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
   * _defaultLimit
   */
  _defaultLimit: 100,
  
  /**********************************************************************
   * get
   */        
  /*
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
            "fields" : {
              "in": "query", 
              type: "string", // XXX we cant seem to make this object or json?
              description: "Fields spec (JSON)",
              required: false              
            },
            "skip" : {
              "in": "query", 
              type: "integer",
              description: "Results to skip",
              required: false
            },
            "limit" : {
              "in": "query", 
              type: "integer",
              description: "Results to limit",
              required: false
            }
          },          
          service: function(req, res) {
            console.log("@@@@", this.objectserver)
            var options = {}
            var query = {}
            if (req.query.query) {
              query = JSON.parse(req.query.query) // XXX framework should do this
            }
            if (req.query.sort) {
              options.sort = JSON.parse(req.query.sort)
            }
            if (req.query.fields) {
              options.fields = JSON.parse(req.query.fields)
            }
            if (req.query.skip) {
              options.skip = JSON.parse(req.query.skip)
            }
            if (req.query.limit) {
              options.limit = JSON.parse(req.query.limit)
            }
            self.find(query, options, function(err, objs) {
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
  */
  
  get: {
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
      "fields" : {
        "in": "query", 
        type: "string", // XXX we cant seem to make this object or json?
        description: "Fields spec (JSON)",
        required: false              
      },
      "skip" : {
        "in": "query", 
        type: "integer",
        description: "Results to skip",
        required: false
      },
      "limit" : {
        "in": "query", 
        type: "integer",
        description: "Results to limit",
        required: false
      }
    },      
    
    service: function(req, res) {
      console.log("@@@@", this.endpoint)
      var options = {}
      var query = {}
      if (req.query.query) {
        query = JSON.parse(req.query.query) // XXX framework should do this
      }
      if (req.query.sort) {
        options.sort = JSON.parse(req.query.sort)
      }
      if (req.query.fields) {
        options.fields = JSON.parse(req.query.fields)
      }
      if (req.query.skip) {
        options.skip = JSON.parse(req.query.skip)
      }
      if (req.query.limit) {
        options.limit = JSON.parse(req.query.limit)
      }
      this.endpoint.find(query, options, function(err, objs) {
        if (err) {
          this.endpoint._error(res, err)
        } else {
          res.send(objs)
        }
      })
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
   * endpoints  // XXX maybe do this at init? Easier to read?
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
                  console.log("#####", this.endpoint.endpoint.findById)
                  self.findById(req.params.id, function(err, result) {
                    if (err) {
                      self._error(res, err)
                    } else {
                      res.send(result)
                    }
                  })
                },
              },
              
              put: {
                params: {
                  "body": { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
                    "in": "body", 
                    description: "Update spec (JSON). Can be full object or update operator (e.g {'$inc': {'n': 1}})",
                    required: true
                  }
                },
                service: function(req, res, endpoint) {
                  var id = req.params.id
                  var body = req.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
                  if (body) {
                    self.update({_id: id}, body, {}, function(err, result) { // XXX what happens if doc does not exist? Should look at our current API
                      if (err) {
                        self._error(res, err)
                      } else {
                        res.send(200)
                      }
                    })
                  }
                }
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
   * _init
   */        
  _init: function() {
    console.log("Collection._init()")
    // setup endpoints and operations based on config 
  },

  /**********************************************************************
   * find
   */        
  find: function(query, options, cb) { 
    this._notImplemented(cb)
  },

  /**********************************************************************
   * findOne
   */        
  findOne: function(query, options, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * findById
   */        
  findById: function(id, cb) {
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
   * save
   */        
  save: function(obj, cb) {
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
