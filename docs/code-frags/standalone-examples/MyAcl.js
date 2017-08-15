var carbon = require('carbon-io')
var o  = carbon.atom.o(module)

module.exports = o({
  _type: carbon.carbond.security.CollectionAcl,
  /*
   * Your ACL definition
   */
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
        insertObject: true,
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

