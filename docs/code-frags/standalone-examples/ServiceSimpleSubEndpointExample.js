var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fibers.__(module)

function getUsers() {
  return module.exports.db.getCollection('users').find().toArray()
}

function getUserById(id) {
  return module.exports.db.getCollection('users').findOne({_id: parseInt(id)})
}

function deleteUser(id) {
  module.exports.db.getCollection('users').deleteObject(parseInt(id))
}

// pre-endpoints
__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    name: 'foo',
    dbUri: 'mongodb://localhost:27017/mydb',
    endpoints: {
      'users': o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          // get all users
          return getUsers()
        },
        endpoints: {
          ':id': o({
            _type: carbon.carbond.Endpoint,
            get: function(req) {
              // get the user
              return getUserById(req.params.id)
            },
            delete: function(req) {
              // delete the user
              deleteUser(req.params.id)
              return null
            },
          }),
        },
      }),
    },
  })
})
// post-endpoints
