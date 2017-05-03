var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

__(function() {
  __(function() {
    module.exports = o.main({
      _type: carbon.carbond.Service,
      port: 8888,
      dbUri: 'mongodb://localhost:27017/mydb',
      authenticator: o({
        _type: carbon.carbond.security.MongoDBApiKeyAuthenticator,
        apiKeyParameterName: 'API_KEY',
        apiKeyLocation: 'header',
        userCollection: 'users',
        apiKeyField: 'apiKey'
      }),
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          acl: o({
            _type: carbon.carbond.security.EndpointAcl,
            groupDefinitions: { // This ACL defined two groups, 'role' and 'title'.
              role: 'role', // We define a group called 'role' based on the user 
                            // property named 'role'.
              title: function(user) { return user.title } 
            },
            entries: [
              {
                user: { role: 'Admin' },
                permissions: {
                  '*': true // '*' grants all permissions 
                }
              },
              {
                user: { title: 'CFO' },
                permissions: { // We could have used '*' here but are being 
                               // explicit. 
                  get: true,
                  post: true
                }
              },
              {
                user: '10002', // User with _id '10002'
                permissions: { 
                  get: false,
                  post: true
                }
              },
              {
                user: '*', // All other users
                permissions: { 
                  get: true,
                  post: false
                }
              }
            ]
          }),

          get: function(req) {
            return { msg: 'Hello World!' }
          },

          post: function(req) {
            return { msg: 'Hello World! ' + JSON.stringify(req.body) }
          }

        })
      }
    })
  })
  
  // just playing this game for presentation's sake in the docs
  var Service1 = module.exports

  __(function() {
    module.exports = o.main({
      _type: carbon.carbond.Service,
      port: 8888,
      dbUri: 'mongodb://localhost:27017/mydb',
      authenticator: o({
        _type: carbon.carbond.security.MongoDBApiKeyAuthenticator,
        apiKeyParameterName: 'API_KEY',
        apiKeyLocation: 'header',
        userCollection: 'users',
        apiKeyField: 'apiKey'
      }),
      endpoints: {
        hello: o({
          _type: carbon.carbond.mongodb.MongoDBCollection,
          collection: 'hello',
          acl: o({
            _type: carbon.carbond.security.CollectionAcl,
            groupDefinitions: { // This ACL defined two groups, 'role' and 
                                // 'title'.
              role: 'role', // We define a group called 'role' based on the 
                            // user property named 'role'.
              title: function(user) { return user.title } 
            },
            entries: [
              {
                user: { role: 'Admin' },
                permissions: {
                  '*': true // '*' grants all permissions 
                }
              },
              {
                user: { title: 'CFO' },
                permissions: { 
                  find: true,
                  findObject: true,
                  '*': false // This is implied since the default value for 
                             // all permissions is `false`.
                }
              },
              {
                user: '10002', // User with _id '10002'
                permissions: { 
                  insert: true,
                  findObject: true
                }
              },
              {
                user: '*', // All other users
                permissions: { 
                  findObject: true
                }
              }
            ]
          })
        }) 
      }
    }) 
  })

  var Service2 = module.exports

  module.exports = {
    Service1: Service1,
    Service2: Service2,
  }
})

