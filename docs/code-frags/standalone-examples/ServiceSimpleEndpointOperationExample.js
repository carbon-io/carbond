var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    dbUri: 'mongodb://localhost:27017/mydb',
    endpoints: {
      hello1: o({
        _type: carbon.carbond.Endpoint,
        get: function(req, res) {
          res.send({msg: 'Hello World!'})
        }
      }),
      hello2: o({
        _type: carbon.carbond.Endpoint,
        get: {
          description: 'My hello world operation',
          parameters: {},
          service: function(req, res) {
            res.send({msg: 'Hello World!'})
          }
        }
      }),
      hello3: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return {msg: 'Hello World!'}
        }
      }),
      hello4: o({
        _type: carbon.carbond.Endpoint,
        get: {
          description: 'My hello world operation',
          parameters: {},
          service: function(req) {
            return {msg: 'Hello World!'}
          }
        }
      }),
      hello5: o({
        _type: carbon.carbond.Endpoint,
        get: {
          description: 'My hello world operation',
          parameters: {
            message: {
              description: 'A message to say to the world',
              location: 'query',
              required: true,  
              schema: {type: 'string'}
            }
          },
          service: function(req) {
            return {msg: 'Hello World! ' + req.parameters.message}
          }
        }
      }),
      zipcodes: o({
        _type: carbon.carbond.collections.Collection,
        post: {
          description: 'Adds a Zipcode object to the zipcodes collection',
          parameters: {
            body: {
              description: 'A Zipcode object',
              location: 'body',
              required: true,
              schema: { 
                type: 'object',
                properties: {
                  _id: {type: 'number'},
                  state: {type: 'string'}
                }
              }
            }
          },
          service: function(req) {
            this.getService().db.getCollection('zipcodes').insert(req.parameters.body)
            return null
          } 
        }
      })
    }
  }) 
})
