// pre-collections-concreteInstantiationHeader
var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var o = carbon.atom.o(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    dbUri: 'mongodb://localhost:27017/mydb',
    // post-collections-concreteInstantiationHeader
    // first definition is for presentation, second is for testsing
    dbUri: _o('env:CARBONIO_TEST_DB_URI') || 'mongodb://localhost:27017/mydb',
    // pre-collections-concreteInstantiationFooter
    endpoints: {
      feedback: o({
        _type: carbon.carbond.mongodb.MongoDBCollection,
        enabled: {
          find: true,
        },
      }),
    },
  })
})
// post-collections-concreteInstantiationFooter
