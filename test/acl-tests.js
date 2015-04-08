var o = require('maker').o(module)
var assert = require('assert')

/*******************************************************************************
 * acl tests
 */
var acl = o({
  _type: '../lib/security/Acl',
  
  permissionDefinitions: {
    read: true,
    write: false,
    exec: false
  },

  groupDefinitions: {
    role: 'role.name',
    title: function(user) { return user.title }
    // user is not in groupDefinitions although it can be. This is to check _id is properly used as default
  },

  entries: {
    '*': {
      read: true,
      write: true,
      exec: false
    },

    'user:3': { 
      read: true,
      write: true
    },

    'user:5': {
      "*": function(user) { return user.isAwesome }
    },
    
    'user:"6"': {
      read: false
    },

    'role:"Admin"': {
      "*": true
    },

    'title:"CEO"': {
      read: true,
      write: true,
      exec: false
    },

    'title:"COO"': {
      read: true,
      write: false
    }
  }
})

var u1 = {
  _id: 1,
  title: "CEO"
}

var u2 = {
  _id: 2,
  role: { name: "Admin" },
  title: "COO"
}

var u3 = {
  _id: 3
}

var u4 = {
}

var u5 = {
  _id: 5,
  isAwesome: false
}

var u6 = {
  _id: '6'
}

// u1
assert(acl.hasPermission(u1, 'read'))
assert(acl.hasPermission(u1, 'write'))
assert(!acl.hasPermission(u1, 'exec'))

// u2
assert(acl.hasPermission(u2, 'read'))
assert(!acl.hasPermission(u2, 'write')) // checks that all matching groups grant
assert(!acl.hasPermission(u2, 'exec'))

// u3
assert(acl.hasPermission(u3, 'read'))
assert(acl.hasPermission(u3, 'write'))
assert(!acl.hasPermission(u3, 'exec'))

// u4
// these should come from '*' user spec
assert(acl.hasPermission(u4, 'read'))
assert(acl.hasPermission(u4, 'write'))
assert(!acl.hasPermission(u4, 'exec'))

// u5
assert(!acl.hasPermission(u5, 'read'))
assert(!acl.hasPermission(u5, 'write'))
assert(!acl.hasPermission(u5, 'exec'))

// u6
assert(!acl.hasPermission(u6, 'read'))
assert(!acl.hasPermission(u6, 'write'))
assert(!acl.hasPermission(u6, 'exec'))

// null user
assert(!acl.hasPermission(null, 'read'))
assert(!acl.hasPermission(null, 'write'))
assert(!acl.hasPermission(null, 'exec'))

// unsupported permission
var exceptionThrown = false
try {
  acl.hasPermission(u1, 'foo')
} catch (e) {
  exceptionThrown = true
}
assert(exceptionThrown)

// invalid user spec
var acl2 = o({
  _type: '../lib/security/Acl',
  
  permissionDefinitions: {},
  groupDefinitions: {},
  entries: {
    "foop:3": {}
  }
})

var exceptionThrown = false
try {
  acl2.hasPermission(u1, 'read')
} catch (e) {
  exceptionThrown = true
}
assert(exceptionThrown)

// and test

var acl3 = o({
  _type: '../lib/security/Acl',
  
  permissionDefinitions: {
    read: true,
    write: false
  },

  entries: {
    'user:3': { 
      read: true,
      write: true
    }
  }
})

var acl4 = o({
  _type: '../lib/security/Acl',
  
  permissionDefinitions: {
    read: true,
    write: false
  },

  entries: {
    'user:3': { 
      read: true,
      write: false
    }
  }
})

var andAcl = acl3.and(acl4)
assert(andAcl.hasPermission(u3, 'read'))
assert(!andAcl.hasPermission(u3, 'write'))

