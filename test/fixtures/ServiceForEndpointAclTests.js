var o = require('@carbon-io/carbon-core').atom.o(module).main
var carbond = require('../../')
var _ = require('lodash')

/*******************************************************************************
 * ServiceForEndpointAclTests
 *
 * Primarily for testing the different modes of selfAndBelow and how parent/child
 * endpoint ACLs are composed.
 */
var USERS = [
  { _id: 1, username: "admin", password: "admin", role: "Admin" },
  { _id: 2, username: "bob", password: "bob", role: "User" }
]

var okFn = function() { return {ok: 1} }

module.exports = o({
  _type: carbond.Service,

  port: 8889,
  apiRoot: '/api',

  authenticator: o({
    _type: carbond.security.HttpBasicAuthenticator,
    usernameField: 'username',
    passwordField: 'password',
    findUser: function(username) {
      var u = _.find(USERS, {username: username})
      return u
    }
  }),

  endpoints: {
    // selfAndBelow: false
    e1: o({
      _type: carbond.Endpoint,
      acl: o({
        _type: carbond.security.EndpointAcl,
        selfAndBelow: false,
        groupDefinitions: {role: 'role'},
        entries: [
          {
            user: {role: "Admin"},
            permissions: {
              get: true
            }
          },
          {
            user: "*", // All other users
            permissions: {
              get: false
            }
          }
        ]
      }),
      get: okFn,
      post: okFn,
      endpoints: {
        f1: o({
          _type: carbond.Endpoint,
          get: okFn,
          post: okFn,
          acl: o({
            _type: carbond.security.EndpointAcl,
            groupDefinitions: {role: 'role'},
            entries: [
              {
                user: {role: "Admin"},
                permissions: {
                  get: true,
                  post: true
                }
              },
              {
                user: "*", // All other users
                permissions: {
                  get: true
                }
              }
            ]
          })
        })
      }
    }),

    // selfAndBelow: true
    e2: o({
      _type: carbond.Endpoint,
      acl: o({
        _type: carbond.security.EndpointAcl,
        selfAndBelow: true,
        groupDefinitions: {role: 'role'},
        entries: [
          {
            user: {role: "Admin"},
            permissions: {
              post: false,
              get: true
            }
          },
          {
            user: "*", // All other users
            permissions: {
              get: false
            }
          }
        ]
      }),
      get: okFn,
      post: okFn,
      endpoints: {
        f2: o({
          _type: carbond.Endpoint,
          get: okFn,
          post: okFn,
          acl: o({
            _type: carbond.security.EndpointAcl,
            groupDefinitions: {role: 'role'},
            entries: [
              {
                user: {role: "Admin"},
                permissions: {
                  post: true,
                  get: true
                }
              },
              {
                user: "*", // All other users
                permissions: {
                  get: true
                }
              }
            ]
          })
        })
      }
    }),

    // selfAndBelow: "get"
    e3: o({
      _type: carbond.Endpoint,
      acl: o({
        _type: carbond.security.EndpointAcl,
        selfAndBelow: "get",
        groupDefinitions: {role: 'role'},
        entries: [
          {
            user: {role: "Admin"},
            permissions: {
              post: false,
              get: true
            }
          },
          {
            user: "*", // All other users
            permissions: {
              get: false
            }
          }
        ]
      }),
      get: okFn,
      post: okFn,
      endpoints: {
        f3: o({
          _type: carbond.Endpoint,
          get: okFn,
          post: okFn,
          acl: o({
            _type: carbond.security.EndpointAcl,
            groupDefinitions: {role: 'role'},
            entries: [
              {
                user: {role: "Admin"},
                permissions: {
                  post: true,
                  get: true
                }
              },
              {
                user: "*", // All other users
                permissions: {
                  get: true
                }
              }
            ]
          })
        })
      }
    }),

    // selfAndBelow: fn
    e4: o({
      _type: carbond.Endpoint,
      acl: o({
        _type: carbond.security.EndpointAcl,
        selfAndBelow: function(user, permission, env) {
          if(user) {
            if(user.role === "Admin") {
              return permission === "get"
            } else {
              return permission === "post"
            }
          }
          return false
        },
        groupDefinitions: {role: 'role'},
        entries: [
          {
            user: {role: "Admin"},
            permissions: {
              post: true,
              get: false
            }
          },
          {
            user: "*", // All other users
            permissions: {
              get: false
            }
          }
        ]
      }),
      get: okFn,
      post: okFn,
      endpoints: {
        f4: o({
          _type: carbond.Endpoint,
          get: okFn,
          post: okFn,
          acl: o({
            _type: carbond.security.EndpointAcl,
            groupDefinitions: {role: 'role'},
            entries: [
              {
                user: {role: "Admin"},
                permissions: {
                  post: true,
                  get: true
                }
              },
              {
                user: "*", // All other users
                permissions: {
                  post: true,
                  get: true
                }
              }
            ]
          })
        })
      }
    })
  }
})
